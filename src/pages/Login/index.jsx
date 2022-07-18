import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from 'react-redux';
import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import {fetchUserData, selectIsAuth} from '../../redux/slices/auth'
import { Navigate } from "react-router-dom";

export const Login = () => {
const {register, handleSubmit, setError, formState: { errors, isValid}} = useForm({
  defaultValues: {
    email: '',
    password: '',
  },
  mode: 'onChange'
})
const isAuth = useSelector(selectIsAuth)
const dispatch = useDispatch()
//Функция сработает, если валидация норм
const onSubmit = async (values)=>{
  //Отправим на бэк
  const data = await dispatch(fetchUserData(values))
  if (!data.payload) {
    return alert('Не удалось авторизоваться')
  }
  if ('token' in data.payload) {
    window.localStorage.setItem('token', data.payload.token)
  }
}
if (isAuth) {
  return <Navigate to='/' />
}

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className={styles.field}
        label="E-Mail"
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {...register('email', {required: 'Укажите почту'})}
        fullWidth
      />
      <TextField className={styles.field} label="Пароль" helperText={errors.password?.message} fullWidth
      {...register('password', {required: 'Укажите пароль'})} error={Boolean(errors.password?.message)}/>
      <Button type='submit' size="large" variant="contained" fullWidth>
        Войти
      </Button>
      </form>
    </Paper>
  );
};
