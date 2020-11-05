import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {Box, Button, Checkbox, TextField, makeStyles, Theme, FormControlLabel} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../utils/http/category-http';
import * as yup from '../../utils/vendor/yup';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1),
        }
    }
})

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
    const validationSchema = useMemo(
      () =>
        yup.object({
          name: yup.string().required(),
        }),
      []
    );
    const resolver = useYupValidationResolver(validationSchema);
    const { 
        register, 
        handleSubmit, 
        getValues, 
        errors, 
        reset, 
        watch, 
        setValue 
      } = useForm({ resolver });

    const { id } = useParams();
    const [category, setCategory] = useState<{id: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      if(!id){
        return;
      }
      setLoading(true);
      categoryHttp.get(id).then(response => {
        setCategory(response.data.data)
        reset(response.data.data)
      }).finally(() => setLoading(false));

    }, []);

    useEffect(() => {
      register({name: "is_active"})
    }, [register]);

    const buttonProps: ButtonProps = {
        className: classes.submit,
        size: "medium",
        variant: "contained",
        color: 'secondary',
        disabled: loading
    }

    function onSubmit(formData, event){
      setLoading(true);
      const http = !category
        ? categoryHttp.create(formData)
        : categoryHttp.update(category.id, formData);

        http.then(res => console.log(res)).finally(() => setLoading(false));
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
            InputLabelProps={{ shrink: true }}
            disabled={loading}
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
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />

          <FormControlLabel
            disabled={loading} 
            control={
              <Checkbox
                name="is_active"
                color="primary"
                onChange={() => setValue('is_active', getValues()['is_active'])}
                checked={watch('is_active')}
              />
            }
            label="Ativo?"
            labelPlacement="end"
          />          
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