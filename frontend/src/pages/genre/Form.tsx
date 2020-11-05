import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {Box, Button, TextField, makeStyles, Theme, MenuItem} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import castMemberHttp from '../../utils/http/cast-member-http';
import categoryHttp from '../../utils/http/category-http';
import * as yup from '../../utils/vendor/yup';


const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1),
        }
    }
});

const useYupValidationResolver = validationSchema =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false
        });

        return {
          values,
          errors: {}
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message
              }
            }),
            {}
          )
        };
      }
    },
    [validationSchema]
  );

const Form: React.FC = () => {
    const classes = useStyles();
    const [categories, setCategories] = useState<any[]>([]);
    const validationSchema = useMemo(
      () =>
        yup.object({
          name: yup.string().required(),
        }),
      []
    );
    const resolver = useYupValidationResolver(validationSchema);
    const { register, handleSubmit, getValues, watch, setValue, errors } = useForm({
      resolver,
      defaultValues: {
        categories_id: []
      }
    });
    const category = getValues()['categories_id'];

    const buttonProps: ButtonProps = {
        className: classes.submit,
        size: "medium",
        variant: "contained",
        color: 'secondary'
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
            error={errors.name !== undefined}
            helperText={errors.name && errors.name.message}
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