import {RouteProps} from 'react-router-dom';
import List from '../pages/category/List';
import Dashboard from '../pages/Dashboard';

export interface MyRouteProps extends RouteProps {
    name: string;
    label: string;
}

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        name: 'categories.list',
        label: 'Listar Categorias',
        path: '/categories',
        component: List,
        exact: true
    },
    {
        name: 'categories.create',
        label: 'Criar Categorias',
        path: '/categories/create',
        component: List,
        exact: true
    },
    {
        name: 'categories.edit',
        label: 'Editar Categorias',
        path: '/categories/:id/edit',
        component: List,
        exact: true
    },
];

export default routes;