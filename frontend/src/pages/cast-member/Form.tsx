import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {Box, Button, FormControl, TextField, makeStyles, Theme, FormLabel, RadioGroup, FormControlLabel, Radio} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import genreHttp from '../../utils/http/genre-http';
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
    const validationSchema = useMemo(
      () =>
        yup.object({
          name: yup.string().required(),
        }),
      []
    );
    const classes = useStyles();
    const resolver = useYupValidationResolver(validationSchema);
    const { register, handleSubmit, getValues, setValue, errors } = useForm({
      resolver
    });
    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: "contained",
        size: "medium",
        color: 'secondary'
    }

    useEffect(() => {
      register({name: "type"})
    }, [register]);

    function onSubmit(formData, event){
      genreHttp.create(formData).then((response) => console.log(response));
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
          <Box dir="rtl">
            <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)} >Salvar</Button>
            <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
          </Box>
      </form>
  );
}

export default Form;