import React, {useEffect, useState, useRef} from 'react';
import format from 'date-fns/format';
import { useSnackbar } from 'notistack';
import {useMediaQuery, MuiThemeProvider, useTheme, IconButton} from '@material-ui/core';
import {Edit} from '@material-ui/icons';
import parseISO from 'date-fns/parseISO';
import {Link} from 'react-router-dom';
import categoryHttp from '../../utils/http/category-http';
import {BadgeYes, BadgeNo} from '../../components/Badge';
import DefaultTable, {TableColumn, makeActionsStyle} from '../../components/Table';
import { Category, ListResponse } from '../../utils/models';
import {merge, omit, cloneDeep} from 'lodash';

interface Pagination{
    page: number;
    total: number;
    per_page: number;
}
interface SearchState {
    search: string;
    pagination: Pagination;
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
    const [searchState, setSearchState] = useState<SearchState>({ 
        search: '', 
        pagination: {
            page: 1,
            total: 0,
            per_page: 10,
        } 
    });
    const snackbar = useSnackbar();
  
    useEffect(() => {
        subscribed.current = true;

        getData();
        return () => {
            subscribed.current = false;
        }
    }, [searchState.search, searchState.pagination.page, searchState.pagination.per_page]);

    async function getData(){
        setLoading(true);
        try {
            const { data } = await categoryHttp.list<ListResponse<Category>>({ 
                queryParams: {
                    search: searchState.search,
                    page: searchState.pagination.page,
                    per_page: searchState.pagination.per_page
                }
             });
            if(subscribed.current){
                setCategories(data.data);
                setSearchState((prevState) => ({
                    ...prevState,
                    pagination: {
                        total: data.meta.total
                    }
                }));
            }
        }catch (error){
            console.log(error);
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
            columns={columnDefinitions}
            data={categories}
            isLoading={loading}
            options={{
                serverSide: true,
                responsive: "standard",
                searchText: searchState.search,
                page: searchState.pagination.page - 1,
                count: searchState.pagination.total,
                rowsPerPage: searchState.pagination.per_page,
                onSearchChange: (value) => setSearchState((prevState => ({
                    ...prevState,
                    search: value
                }))),
                onChangePage: (page) => setSearchState((prevState => ({
                    ...prevState,
                    pagination: {
                        ...prevState.pagination,
                        page: page + 1,
                    }
                }))),
                onChangeRowsPerPage: (per_page) => setSearchState((prevState => ({
                    ...prevState,
                    pagination: {
                        ...prevState.pagination,
                        per_page,
                    }
                }))),
            }}
        />
    </MuiThemeProvider>
  );
}

export default Table;