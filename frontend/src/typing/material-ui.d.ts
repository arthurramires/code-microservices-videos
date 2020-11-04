import { ComponentNameToClassKey } from '@material-ui/core/styles/overrides';

declare module '@material-ui/core/styles/overrides'{
    interface ComponentNameToClassKey {
        MUIDataTable: any;
        MUIDataTableToolbar: any;
        MUIDataTableHeadCell: any;
        MUIDataTableSortLabel: any;
        MUIDataTableBodyCell: any;
        MUIDataTableSelectCell: any;
        MUIDataTableToolbarSelect: any;
        MUIDataTablePagination: any;
        MUIDataTableBodyRow: any;
    }
}