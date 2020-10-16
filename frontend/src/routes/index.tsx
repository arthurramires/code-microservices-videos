import {RouteProps} from 'react-router-dom';
import List from '../pages/category/List';
import Dashboard from '../pages/Dashboard';

interface MyRouteProps extends RouteProps {
    label: string;
}

const routes: MyRouteProps[] = [
    {
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        label: 'Listar Categorias',
        path: '/categories',
        component: List,
        exact: true
    },
];

export default routes;