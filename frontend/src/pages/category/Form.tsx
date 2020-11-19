import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {Box, Button, Checkbox, TextField, makeStyles, Theme, FormControlLabel, Grid} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../utils/http/category-http';
import * as yup from '../../utils/vendor/yup';
import { useParams, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Category } from '../../utils/models';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';

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
    const snackbar = useSnackbar();
    const history = useHistory();
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
        setValue,
        trigger
      } = useForm({ resolver });

    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      if(!id){
        return;
      }

      async function getCategory(){
        setLoading(true);

        try{
          categoryHttp.get(id).then(response => {
            setCategory(response.data.data)
            reset(response.data.data)
          });
        }catch(error){
          console.log(error);
        }finally {
          setLoading(false)
        }
      }

      getCategory();
    }, []);

    useEffect(() => {
      register({name: "is_active"})
    }, [register]);

    function onSubmit(formData, event){
      setLoading(true);
      const http = !category
        ? categoryHttp.create(formData)
        : categoryHttp.update(category.id, formData);

        http.then(res => {
          snackbar.enqueueSnackbar(
            'Categoria salva com sucesso',
            {variant: 'success'}
          )
         setTimeout(() => {
          event ? (
            id
              ? history.replace(`/categories/${res.data.data.id}/edit`)
              : history.push(`/categories/${res.data.data.id}/edit`)
          ) 
            : history.push('/categories')
         })
         }).catch((error) => {
          console.log(error);
          snackbar.enqueueSnackbar(
           'Erro ao salvar a categoria',
           {variant: 'error'}
         );
        }).finally(() => setLoading(false));
    }
  return (
      <DefaultForm GridItemProps={{ xs: 12, md: 6 }} onSubmit={handleSubmit(onSubmit)}>
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
        <SubmitActions disableButtons={loading} handleSave={() => 
          trigger().then(isValid => {
            isValid && onSubmit(getValues(), null)
          }) 
        }/>
      </DefaultForm>
  );
}

export default Form;