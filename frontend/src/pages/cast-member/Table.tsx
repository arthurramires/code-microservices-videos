import React, {useEffect, useState} from 'react';
import { MUIDataTableColumn } from 'mui-datatables';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import castMemberHttp from '../../utils/http/cast-member-http';
import { CastMember, ListResponse } from '../../utils/models';
import DefaultTable, {TableColumn, makeActionsStyle} from '../../components/Table';
import {useMediaQuery, MuiThemeProvider, useTheme, IconButton} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {Edit} from '@material-ui/icons';

const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator'
};

const columnDefinitions: TableColumn[] =[
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "type",
        label: "Tipo",
        options: {
            customBodyRender(value, tableMeta, updateValue){
                return CastMemberTypeMap[value];
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
                            to={`/cast-members/${tableMeta.rowData[0]}/edit`}
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
    const [castMembers, setCastMembers] = useState<CastMember[]>([]);

    useEffect(() => {
        let isCancelled = false;

        (async function getCategories(){
            const { data } = await  castMemberHttp.list<ListResponse<CastMember>>();
            if(!isCancelled){
                setCastMembers(data.data);
            }
        })();
        
        return () => {
            isCancelled = true;
        }
    }, []);
  return (
    <MuiThemeProvider theme={makeActionsStyle(columnDefinitions.length-1)}>
      <DefaultTable
        title="Listagem de membros de elencos" 
        columns={columnDefinitions}
        data={castMembers}
    />
    </MuiThemeProvider>
  );
}

export default Table;