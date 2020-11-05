import React from 'react';
import Form from './Form';
import {Page} from '../../components/Page';
import { useParams } from 'react-router-dom';

const PageForm: React.FC = () => {
  const { id } = useParams();
  return (
      <Page title={!id ? 'Criar categoria' : 'Editar categoria'}>
          <Form />
      </Page>
  );
}

export default PageForm;