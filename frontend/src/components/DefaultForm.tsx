import React from 'react';
import {Grid} from '@material-ui/core';
import {GridProps} from '@material-ui/core/Grid';

interface DefaultFormProps extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
    GridContainerProps?: GridProps;
    GridItemProps?: GridProps;
}

const DefaultForm: React.FC<DefaultFormProps> = (props) => {
    const { GridContainerProps, GridItemProps, ...other } = props;
  return (
    <form {...other}>
        <Grid container {...GridContainerProps}>
            <Grid {...GridItemProps}>
                {props.children}
            </Grid>
        </Grid>
    </form>
  );
}

export default DefaultForm;