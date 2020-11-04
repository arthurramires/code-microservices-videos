import React, {useEffect, useState} from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import categoryHttp from '../../utils/http/category-http';
import {BadgeYes, BadgeNo} from '../../components/Badge';

const columnDefinitions: MUIDataTableColumn[] =[
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "is_active",
        label: "Ativo?",
        options: {
            customBodyRender(value, tableMeta, updateValue){
                return value ? <BadgeYes /> : <BadgeNo />;
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em:",
        options: {
            customBodyRender(value, tableMeta, updateValue){
            return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
            }
        }
    },
];

interface CategoryProps{
    id: string;
    name: string;
}

const Table: React.FC = () => {
    const [categories, setCategories] = useState<CategoryProps[]>([]);

    useEffect(() => {
        categoryHttp.list<{ data: CategoryProps[] }>().then(({ data }) => setCategories(data.data));
    }, []);
  return (
      <MUIDataTable
        title="Listagem de categorias" 
        columns={columnDefinitions}
        data={categories}
    />
  );
}

export default Table;