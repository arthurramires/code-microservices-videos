import React from 'react';
import MUIDataTable, {MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps} from 'mui-datatables';
import {useMediaQuery, MuiThemeProvider, useTheme, Theme} from '@material-ui/core';
import {merge, omit, cloneDeep} from 'lodash';
import DebouncedTableSearch from './DebouncedTableSearch';
export interface TableColumn extends MUIDataTableColumn{
    width?: string;
}

const makeDefaultOptions = (debouncedSearchTime?): MUIDataTableOptions => ({
    print: false,
    download: false,
    textLabels: {
        body: {
            noMatch: "Nenhum registro encontrado",
            toolTip: "Classificar",
        },
        pagination: {
            next: "Próxima página",
            previous: "Página anterior",
            rowsPerPage: "Por página",
            displayRows: "de",
        },
        toolbar: {
            search: "Busca",
            downloadCsv: "Download CSV",
            print: "Imprimir",
            viewColumns: "Ver colunas",
            filterTable: "Filtrar tabela",
        },
        filter: {
            all: "Todos",
            title: "FILTROS",
            reset: "LIMPAR",
        },
        viewColumns: {
            title: "Ver colunas",
            titleAria: "Ver/Esconder Colunas da Tabela",
        },
        selectedRows: {
            text: "registro(s) selecionados",
            delete: "Excluir",
            deleteAria: "Excluir registros selecionados"
        },
    },
    customSearchRender: (searchText: string, handleSearch: any, hideSearch: any, options: any) => {
        return <DebouncedTableSearch 
            searchText={searchText}
            onSearch={handleSearch}
            onHide={hideSearch}
            options={options}
            debounceTime={debouncedSearchTime}
        />
    }
});

interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
    isLoading?: boolean;
    debouncedSearchTime?: number; 
}

const Table: React.FC<TableProps> = (props) => {
    function extractMuiDatableColumns(columns: TableColumn[]): MUIDataTableColumn[]{
        setColumnsWidth(columns);
        return columns.map(column => omit(column, 'width'));
    }

    function setColumnsWidth(columns: TableColumn[]){
        columns.forEach((column, key: number) => {
            if(column.width){
                const overrides = theme.overrides as any;
                overrides.MUIDatableHeadCell.fixedHeader[`&:nth-child(${key + 2})`] = {
                    width: column.width
                }
            }
        });
    }

    function applyResponsive(){
        newProps.options.responsive = isSmOrDown ? 'scrollMaxHeight' : 'stacked';
    }

    function applyLoading(){
        const textLabels = (newProps.options as any).textLabels;
        textLabels.body.noMatch = 
            newProps.isLoading === true ? 'Carregando...' : textLabels.body.noMatch
    }

    function getOriginalMuiDataTableProps(){
        return omit(newProps, 'isLoading');
    }

    const theme = cloneDeep<Theme>(useTheme());
    const isSmOrDown = useMediaQuery(theme.breakpoints.doen('sm'));

    const defaultOptions = makeDefaultOptions(props.debouncedSearchTime);

    const newProps = merge({options: cloneDeep(defaultOptions)}, props, {
        columns: extractMuiDatableColumns(props.columns),
    });

    applyLoading();
    applyResponsive();

    const originalProps = getOriginalMuiDataTableProps();

  return (
      <MuiThemeProvider theme={theme}>
            <MUIDataTable {...originalProps}/>
      </MuiThemeProvider>
  );
}

export default Table;


export function makeActionsStyle(column){

    return theme => {
        const copyTheme = cloneDeep(theme);
        const selector = `&[data-testid^="MuiDataTableBodyCell-${column}"]`;

        (copyTheme.overrides as any).MUIDataTableBodyCell.root[selector] = {
            paddingTop: '0px',
            paddignBottom: '0px',
        }
        return copyTheme
    }
    
}