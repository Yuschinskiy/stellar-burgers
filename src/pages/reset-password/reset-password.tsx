import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { resetPassword, clearError } from '../../services/slices/userSlice';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, hasError } = useAppSelector((s) => s.user);

  useEffect(() => {
    // Проверяем, что пользователь пришел с forgot-password
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }

    // Если пользователь авторизован, перенаправляем
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

  useEffect(
    () => () => {
      dispatch(clearError());
    },
    [dispatch]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Диспатчим сброс пароля через Redux
    dispatch(resetPassword({ password, token })).then(() => {
      localStorage.removeItem('resetPassword');
      navigate('/login');
    });
  };

  return (
    <ResetPasswordUI
      errorText={hasError ? 'Ошибка сброса пароля' : ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
