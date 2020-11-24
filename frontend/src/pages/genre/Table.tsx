import React, {useEffect, useState} from 'react';
import { MUIDataTableColumn } from 'mui-datatables';
import genreHttp from '../../utils/http/genre-http';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { Genre, ListResponse } from '../../utils/models';
import DefaultTable, {TableColumn, makeActionsStyle} from '../../components/Table';
import {useMediaQuery, MuiThemeProvider, useTheme, IconButton} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {Edit} from '@material-ui/icons';

const columnDefinitions: TableColumn[] =[
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
                            to={`/genres/${tableMeta.rowData[0]}/edit`}
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
    <MuiThemeProvider theme={makeActionsStyle(columnDefinitions.length-1)}>
      <DefaultTable
        title="Listagem de gêneros" 
        columns={columnDefinitions}
        data={genres}
    />
    </MuiThemeProvider>
  );
}

export default Table;