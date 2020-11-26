const { createActions } = require('reduxsauce');

const createdActions = createActions({
    addParam: ['payload'],
    removeParam: ['id']
});
