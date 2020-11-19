import React from 'react';
import {Box, Button, Checkbox, TextField, makeStyles, Theme, FormControlLabel} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';


const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1),
        }
    }
})

interface SubmitActionProps {
    disableButtons?: boolean;
    handleSave: () => void;
}

const SubmitActions: React.FC<SubmitActionProps> = (props) => {
    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        size: "medium",
        variant: "contained",
        color: 'secondary',
        disabled: props.disableButtons === undefined ? false : props.disableButtons,
    }

  return (
    <Box dir="rtl">
    <Button   
      {...buttonProps} 
      onClick={props.handleSave} 
    >
      Salvar
    </Button>
    <Button 
      {...buttonProps} 
      type="submit"
    >
      Salvar e continuar editando
    </Button>
  </Box>
  );
}

export default SubmitActions;