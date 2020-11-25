import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {Box, Button, TextField, makeStyles, Theme, MenuItem} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import categoryHttp from '../../utils/http/category-http';
import * as yup from '../../utils/vendor/yup';
import genreHttp from '../../utils/http/genre-http';
import { Genre } from '../../utils/models';
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
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [genre, setGenre] = useState<Genre | null>(null);
    const { id } = useParams();
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
    const { register, handleSubmit, getValues, watch, setValue, errors, reset, trigger } = useForm({
      resolver,
      defaultValues: {
        categories_id: []
      }
    });
    const category = getValues()['categories_id'];

    function onSubmit(formData, event){
      setLoading(true);
      const http = !genre
        ? genreHttp.create(formData)
        : genreHttp.update(genre.id, formData);

        http.then(res => {
          snackbar.enqueueSnackbar(
            'Gênero salvo com sucesso',
            {variant: 'success'}
          )
         setTimeout(() => {
          event ? (
            id
              ? history.replace(`/genres/${res.data.data.id}/edit`)
              : history.push(`/genres/${res.data.data.id}/edit`)
          ) 
            : history.push('/genres')
         })
         }).catch((error) => {
          console.log(error);
          snackbar.enqueueSnackbar(
           'Erro ao salvar o gênero',
           {variant: 'error'}
         );
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
      register({ name: "categories_id" })
    }, [register]);

    useEffect(() => {
      async function loadData(){
        setLoading(true);
        const promises = [categoryHttp.list({queryParams: { all: '' }})];

        if(!id){
          promises.push(genreHttp.get(id));
        }
        try{
          const [categoriesResponse, genreResponse] = await Promise.all(promises);
          setCategories(categoriesResponse.data.data);
          if(id){
            setGenre(genreResponse.data.data);
            reset({
              ...genreResponse.data.data,
              categories_id: genreResponse.data.data.categories.map(category => category.id)
            });
          }
        }catch(error){
          console.log(error);
        }finally {
          setLoading(false)
        }
      }

      loadData();
    }, []);

    const handleChange = (e) => {
      setValue('categories_id', e.target.value);
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

          <SubmitActions disableButtons={loading} handleSave={() => 
            trigger().then(isValid => {
              isValid && onSubmit(getValues(), null)
            }) 
          }/>
      </DefaultForm>
  );
}

export default Form;