import React, {useEffect} from 'react';
import {Box, Button, FormControl, TextField, makeStyles, Theme, FormLabel, RadioGroup, FormControlLabel, Radio} from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import genreHttp from '../../utils/http/genre-http';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1),
        }
    }
});

const Form: React.FC = () => {
    const classes = useStyles();
    const { register, handleSubmit, getValues, setValue } = useForm();
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