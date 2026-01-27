import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { loginUser, clearError } from '../../services/slices/userSlice';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, hasError, isLoading } = useAppSelector((s) => s.user);

  const from = (location.state as any)?.from || { pathname: '/' };

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  useEffect(
    () => () => {
      dispatch(clearError());
    },
    [dispatch]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Диспатчим логин через Redux
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={hasError ? 'Неверный email или пароль' : ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
