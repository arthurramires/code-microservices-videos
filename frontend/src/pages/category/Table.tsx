import React, {useEffect, useState} from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import {httpVideo} from '../../utils/http';
const columnDefinitions: MUIDataTableColumn[] =[
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "is_active",
        label: "Ativo?"
    },
    {
        name: "created_at",
        label: "Criado em:"
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