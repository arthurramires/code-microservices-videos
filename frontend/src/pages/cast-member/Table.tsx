import React, {useEffect, useState} from 'react';
import { MUIDataTableColumn } from 'mui-datatables';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import castMemberHttp from '../../utils/http/cast-member-http';
import { CastMember, ListResponse } from '../../utils/models';
import DefaultTable from '../../components/Table';

const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator'
};

const columnDefinitions: MUIDataTableColumn[] =[
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
      <DefaultTable
        title="Listagem de membros de elencos" 
        columns={columnDefinitions}
        data={castMembers}
    />
  );
}

export default Table;