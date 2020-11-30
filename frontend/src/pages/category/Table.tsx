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
import useFilter from '../../hooks/useFilter';
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

const debounceTime = 300;
const debouncedSearchTime = 300;

const Table: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const subscribed = useRef(true);
    const [loading, setLoading] = useState<boolean>(false);
    const {
        columns,
        filterManager,
        totalRecords,
        setTotalRecords,
        filterState,
        dispatch,
        debouncedFilterState
    } = useFilter({
        columns: columnDefinitions,
        debounceTime: debounceTime,
        rowsPerPage: 10,
        rowsPerPageOptions: [10, 20, 50],
    });
    const snackbar = useSnackbar();
  
    useEffect(() => {
        subscribed.current = true;
        filterManager.pushHistory();
        getData();
        return () => {
            subscribed.current = false;
        }
    }, [    
        filterManager.cleanSearchText(debouncedFilterState.search), 
        debouncedFilterState.pagination.page, 
        debouncedFilterState.pagination.per_page, 
        debouncedFilterState.order,

    ]);

    async function getData(){
        setLoading(true);
        try {
            const { data } = await categoryHttp.list<ListResponse<Category>>({ 
                queryParams: {
                    search: filterManager.cleanSearchText(filterState.search),
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
    
    return (
      <MuiThemeProvider theme={makeActionsStyle(columnDefinitions.length-1)}>
        <DefaultTable
            title="Listagem de categorias" 
            columns={columns}
            data={categories}
            isLoading={loading}
            debouncedSearchTime={debouncedSearchTime}
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
                onSearchChange: (value) => filterManager.changeSearch(value),
                onChangePage: (page) => filterManager.changePage(page + 1),
                onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
                onColumnSortChange: (changeColumn: string, direction: string) => 
                    filterManager.changeColumnSort(changeColumn, direction),
            }}
        />
    </MuiThemeProvider>
  );
}

export default Table;