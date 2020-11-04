import React, {useEffect, useState} from 'react';
import {Box, Button, TextField, makeStyles, Theme, MenuItem} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import castMemberHttp from '../../utils/http/cast-member-http';
import categoryHttp from '../../utils/http/category-http';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1),
        }
    }
});

const Form: React.FC = () => {
    const classes = useStyles();
    const [categories, setCategories] = useState<any[]>([]);
    const { register, handleSubmit, getValues, watch, setValue } = useForm({
      defaultValues: {
        categories_id: []
      }
    });
    const category = getValues()['categories_id'];

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: "outlined",
        size: "medium",
        color: 'primary'
    }

    function onSubmit(formData, event){
      castMemberHttp.create(formData).then((response) => console.log(response));
    }

    useEffect(() => {
      register({ name: "categories_id" })
    }, [register]);

    useEffect(() => {
      categoryHttp.list().then(response => setCategories(response.data.data))
    }, []);

    const handleChange = (e) => {
      setValue('categories_id', e.target.value);
    }

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            inputRef={register}
            name="name"
            label="Nome"
            fullWidth
            variant="outlined"
          />
          <TextField
            select
            name="categories_id"
            value={watch('categories_id')}
            label="Categorias"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            SelectProps={{
              multiple: true
            }}
          >
            <MenuItem value="" disabled>
              <em>Selecionar categorias</em>
            </MenuItem>

            {categories.map((category, key) => (
              <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
            ))}
          </TextField>

          <Box dir="rtl">
            <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)} >Salvar</Button>
            <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
          </Box>
      </form>
  );
}

export default Form;