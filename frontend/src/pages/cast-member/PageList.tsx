import React from 'react';
import {Page} from '../../components/Page';
import {Box, Fab} from '@material-ui/core';
import {Link} from 'react-router-dom';
import Table from './Table';
import AddIcon from '@material-ui/icons/Add';

const PageList: React.FC = () => {
  return (
      <Page title="Listagem de membros de elenco">
        <Box dir={'rtl'} paddingBottom={2}>
          <Fab
            title="Adicionar membro de elenco"
            size="small"
            color="secondary"
            component={Link}
            to="/cast-members/create"
          >
            <AddIcon />
          </Fab>
        </Box>
        <Box>
          <Table />
        </Box>
      </Page>
  );
}

export default PageList;
