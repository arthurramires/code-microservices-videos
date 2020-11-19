import React, {useEffect, useState} from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import genreHttp from '../../utils/http/genre-http';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { Genre, ListResponse } from '../../utils/models';

const columnDefinitions: MUIDataTableColumn[] =[
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "categories",
        label: "Categorias",
        // options: {
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //         return value.map(v => v.name).join(', ');
        //     }
        // }
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
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        let isCancelled = false;

        (async () => {
            const { data } = await genreHttp.list<ListResponse<Genre>>();
            if(!isCancelled){
                setGenres(data.data)
            }
        })();

        return () => {
            isCancelled = true;
        }
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