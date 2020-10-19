import React, {useEffect, useState} from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import {httpVideo} from '../../utils/http';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import {Chip} from '@material-ui/core';

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
                return value ? <Chip label="Sim" color="primary"/> : <Chip label="Não" color="secondary"/>;
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em:",
        options: {
            customBodyRender(value, tableMeta, updateValue){
            return <span>{formar(parseISO(value), 'dd/MM/yyyy')}</span>;
            }
        }
    },
];

const Table: React.FC = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        httpVideo.get('categories').then(
            response => setCategories(response.data.data)
        )
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