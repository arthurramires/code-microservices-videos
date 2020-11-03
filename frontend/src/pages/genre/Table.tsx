import React, {useEffect, useState} from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import {httpVideo} from '../../utils/http';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const columnDefinitions: MUIDataTableColumn[] =[
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "categories",
        label: "Categorias",
        options: {
            customBodyRender(value, tableMeta, updateValue){
                return value.map(value => value.name).join(', ');
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

const Table: React.FC = () => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        
        httpVideo.get('genres').then(
            response => setGenres(response.data.data)
        )
    }, []);
  return (
      <MUIDataTable
        title="Listagem de gêneros" 
        columns={columnDefinitions}
        data={genres}
    />
  );
}

export default Table;