import React, {useEffect, useState, useRef, useReducer} from 'react';
import format from 'date-fns/format';
import { useSnackbar } from 'notistack';
import {useMediaQuery, MuiThemeProvider, useTheme, IconButton} from '@material-ui/core';
import {Edit} from '@material-ui/icons';
import parseISO from 'date-fns/parseISO';
import {Link} from 'react-router-dom';
import categoryHttp from '../../utils/http/category-http';
import {BadgeYes, BadgeNo} from '../../components/Badge';
import DefaultTable, {TableColumn, makeActionsStyle} from '../../components/Table';
import FilterResetButton from '../../components/Table/FilterResetButton';
import { Category, ListResponse } from '../../utils/models';
import reducer, {INITIAL_STATE, Creators, Types} from '../../store/filter';
interface Pagination{
    page: number;
    total: number;
    per_page: number;
}

interface Order {
    sort: string | null;
    dir: string | null;
}
interface SearchState {
    search: string;
    pagination: Pagination;
    order: Order;
}



const columnDefinitions: TableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        width: '30%',
        options: {
            sort: false
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "43%"
    },
    {
        name: "is_active",
        label: "Ativo?",
        options: {
            customBodyRender(value, tableMeta, updateValue){
                return value ? <BadgeYes /> : <BadgeNo />;
            }
        },
        width: "4%"
    },
    {
        name: "created_at",
        label: "Criado em:",
        width: "10%",
        options: {
            customBodyRender(value, tableMeta, updateValue){
            return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
            }
        }
    },
    {
        name: 'actions',
        label: 'Ações',
        width: '13%',
        options: {
            sort: false,
            customBodyRender: (value, tableMeta) => {
                return (
                    <span>
                        <IconButton
                            color={'secondary'}
                            component={Link}
                            to={`/categories/${tableMeta.rowData[0]}/edit`}
                        >
                            <Edit fontSize={"inherit"} />
                        </IconButton>
                    </span>
                );
            }
        }
    }
];

const Table: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const subscribed = useRef(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [filterState, dispatch] = useReducer(reducer, INITIAL_STATE);
    const snackbar = useSnackbar();

    const columns = columnDefinitions.map(column => {
        return column.name === filterState.order.sort 
            ? {
                ...column,
                options: {
                    ...column.options,
                    sortDirection: filterState.order.dir as any
                }
            } : column;
    });
  
    useEffect(() => {
        subscribed.current = true;

        getData();
        return () => {
            subscribed.current = false;
        }
    }, [filterState.search, filterState.pagination.page, filterState.pagination.per_page, filterState.order]);

    async function getData(){
        setLoading(true);
        try {
            const { data } = await categoryHttp.list<ListResponse<Category>>({ 
                queryParams: {
                    search: cleanSearchText(filterState.search),
                    page: filterState.pagination.page,
                    per_page: filterState.pagination.per_page,
                    sort: filterState.order.sort,
                    dir: filterState.order.dir
                }
             });
            if(subscribed.current){
                setCategories(data.data);
                setTotalRecords(data.meta.total)
                // setfilterState((prevState) => ({
                //     ...prevState,
                //     pagination: {
                //         total: data.meta.total
                //     }
                // }));
            }
        }catch (error){
            console.log(error);
            if(categoryHttp.isCancelRequest(error)){
                return;
            }
            snackbar.enqueueSnackbar(
             'Erro ao salvar o gênero',
             {variant: 'error'}
           );
        }finally {
            setLoading(false);
        }
    }
    function cleanSearchText(text){
        let newText = text;
        if(text && text.value !== undefined){
            newText = text.value
        }

        return newText;
    }
    return (
      <MuiThemeProvider theme={makeActionsStyle(columnDefinitions.length-1)}>
        <DefaultTable
            title="Listagem de categorias" 
            columns={columns}
            data={categories}
            isLoading={loading}
            debouncedSearchTime={500}
            options={{
                serverSide: true,
                responsive: "standard",
                searchText: filterState.search as any,
                page: filterState.pagination.page - 1,
                count: totalRecords,
                rowsPerPage: filterState.pagination.per_page,
                customToolbar: () => (
                    <FilterResetButton handleClick={() => {
                        dispatch(Creators.setReset())
                    }}/>
                ),
                onSearchChange: (value) => dispatch(Creators.setSearch({ search: value })),
                onChangePage: (page) => dispatch(Creators.setPage({ page: page + 1 })),
                onChangeRowsPerPage: (perPage) => dispatch(Creators.setPerPage({ per_page: perPage })),
                onColumnSortChange: (changeColumn: string, direction: string) => dispatch(Creators.setOrder({ sort: changeColumn, dir: direction.includes('desc') ? 'desc' : 'asc' })),
            }}
        />
    </MuiThemeProvider>
  );
}

export default Table;