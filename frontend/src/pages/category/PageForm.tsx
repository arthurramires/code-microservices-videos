import React from 'react';
import Form from './Form';
import {Page} from '../../components/Page';

const PageForm: React.FC = () => {
  return (
      <Page title="Criar categoria">
          <Form />
      </Page>
  );
}

export default PageForm;