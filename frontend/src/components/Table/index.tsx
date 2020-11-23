import React from 'react';
import MUIDataTable, {MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps} from 'mui-datatables';
import {createMuiTheme, MuiThemeProvider, useTheme, Theme} from '@material-ui/core';
import {merge, omit, cloneDeep} from 'lodash';

export interface TableColumn extends MUIDataTableColumn{
    width?: string;
}

const defaultOptions: MUIDataTableOptions = {
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
        }
    }
};

interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
    isLoading?: boolean;
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

    function applyLoading(){
        const textLabels = (newProps.options as any).textLabels;
        textLabels.body.noMatch = 
            newProps.isLoading === true ? 'Carregando...' : textLabels.body.noMatch
    }

    function getOriginalMuiDataTableProps(){
        return omit(newProps, 'isLoading');
    }

    const theme = cloneDeep<Theme>(useTheme());

    const newProps = merge({options: cloneDeep(defaultOptions)}, props, {
        columns: extractMuiDatableColumns(props.columns),
    });

    applyLoading();

    const originalProps = getOriginalMuiDataTableProps();

  return (
      <MuiThemeProvider theme={theme}>
            <MUIDataTable {...originalProps}/>
      </MuiThemeProvider>
  );
}

export default Table;
