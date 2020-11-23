import React, {useEffect, useState} from 'react';
import format from 'date-fns/format';
import { useSnackbar } from 'notistack';
import parseISO from 'date-fns/parseISO';
import categoryHttp from '../../utils/http/category-http';
import {BadgeYes, BadgeNo} from '../../components/Badge';
import DefaultTable, {TableColumn} from '../../components/Table';
import { Category, ListResponse } from '../../utils/models';

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
        width: '13%'
    }
];

const Table: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const snackbar = useSnackbar();

    useEffect(() => {
        let isCancelled = false;
        (async () => {
            setLoading(true);
            try {
                const { data } = await categoryHttp.list<ListResponse<Category>>();
                if(!isCancelled){
                    setCategories(data.data)
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
        })();

        return () => {
            isCancelled = true;
        }
    }, []);
  return (
      <DefaultTable
        title="Listagem de categorias" 
        columns={columnDefinitions}
        data={categories}
        isLoading={loading}
    />
  );
}

export default Table;