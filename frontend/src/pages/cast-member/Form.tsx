import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {Box, Button, FormControl, TextField, makeStyles, Theme, FormLabel, RadioGroup, FormControlLabel, Radio} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import * as yup from '../../utils/vendor/yup';
import castMemberHttp from '../../utils/http/cast-member-http';
import { useParams, useHistory } from 'react-router-dom';
import { CastMember } from '../../utils/models';
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
    const validationSchema = useMemo(
      () =>
        yup.object({
          name: yup.string().required(),
        }),
      []
    );
    const resolver = useYupValidationResolver(validationSchema);
    const { register, handleSubmit, getValues, setValue, errors, reset, trigger } = useForm({
      resolver
    });
    const { id } = useParams();
    const snackbar = useSnackbar();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(false);
    const [castMember, setCastMember] = useState<CastMember | null>(null);

    useEffect(() => {
      if(!id){
        return;
      }

      async function getCastMember(){
        setLoading(true);

        try{
          castMemberHttp.get(id).then(response => {
            setCastMember(response.data.data)
            reset(response.data.data)
          });
        }catch(error){
          console.log(error);
        }finally {
          setLoading(false)
        }
      }

      getCastMember();
    }, []);

    useEffect(() => {
      register({name: "type"})
    }, [register]);

    function onSubmit(formData, event){
      setLoading(true);
      const http = !castMember
        ? castMemberHttp.create(formData)
        : castMemberHttp.update(castMember.id, formData);

        http.then(res => {
          snackbar.enqueueSnackbar(
            'Membro de elenco salvo com sucesso',
            {variant: 'success'}
          )
         setTimeout(() => {
          event ? (
            id
              ? history.replace(`/cast-members/${res.data.data.id}/edit`)
              : history.push(`/cast-members/${res.data.data.id}/edit`)
          ) 
            : history.push('/cast-members')
         })
         }).catch((error) => {
          console.log(error);
          snackbar.enqueueSnackbar(
           'Erro ao salvar membro de elenco',
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
          />
          <FormControl margin="normal"> 
              <FormLabel component="legend">Tipo</FormLabel>
              <RadioGroup
                name="type"
                onChange={(e) => {
                  setValue('type', parseInt(e.target.value));
                }}
              >
                <FormControlLabel value="1" control={<Radio />} label="Diretor"/>
                <FormControlLabel value="2" control={<Radio />} label="Ator"/>
              </RadioGroup>
          </FormControl>
          <SubmitActions disableButtons={loading} handleSave={() => 
            trigger().then(isValid => {
              isValid && onSubmit(getValues(), null)
            }) 
          }/>
      </DefaultForm>
  );
}

export default Form;