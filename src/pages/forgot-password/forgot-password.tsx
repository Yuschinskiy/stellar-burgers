import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  forgotPassword,
  clearError,
  clearForgotPassword
} from '../../services/slices/userSlice';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { forgotPasswordSuccess, hasError, forgotPasswordRequest } =
    useAppSelector((s) => s.user);

  useEffect(() => {
    // Если восстановление успешно, переходим к сбросу пароля
    if (forgotPasswordSuccess) {
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    }
  }, [forgotPasswordSuccess, navigate]);

  useEffect(
    () => () => {
      dispatch(clearError());
    },
    [dispatch]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Диспатчим запрос на восстановление пароля через Redux
    dispatch(forgotPassword(email));
  };

  return (
    <ForgotPasswordUI
      errorText={hasError ? 'Ошибка отправки email' : ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
