import React from 'react';
import {Box, Button, Checkbox, TextField, makeStyles, Theme} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../utils/http/category-http';
import * as yup from 'yup';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1),
        }
    }
})

const validationSchema = yup.object().shape({
  name: yup.string().required(),
});

const Form: React.FC = () => {
    const classes = useStyles();
    const { register, handleSubmit, getValues, errors } = useForm({
        validationSchema,
        defaultValues: {
            is_active: true
        }
    });
    const buttonProps: ButtonProps = {
        className: classes.submit,
        size: "medium",
        variant: "contained",
        color: 'secondary'
    }

    function onSubmit(formData, event){
        categoryHttp.create(formData).then((response) => console.log(response));
    }
  return (
      <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            inputRef={register({ 
              required: "O campo nome é requerido", 
              maxLength: {
                value: 2,
                message: 'O máximo de caracteres é 2'
              } 
            })}
            name="name"
            label="Nome"
            fullWidth
            variant="outlined"
            error={errors.name !== undefined}
            helperText={errors.name && errors.name.message}
          />
          <TextField
            inputRef={register}
            name="description"
            label="Descrição"
            multiline
            rows="4"
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <Checkbox
            inputRef={register} 
            name="is_active"
            defaultChecked
          />
          Ativo?
          <Box dir="rtl">
            <Button   
              {...buttonProps} 
              onClick={() => onSubmit(getValues(), null)} 
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
      </form>
  );
}

export default Form;