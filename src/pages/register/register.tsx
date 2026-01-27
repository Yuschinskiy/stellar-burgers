import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { registerUser, clearError } from '../../services/slices/userSlice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, hasError, isLoading } = useAppSelector((s) => s.user);

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(
    () => () => {
      dispatch(clearError());
    },
    [dispatch]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Диспатчим регистрацию через Redux
    dispatch(
      registerUser({
        email,
        name: userName,
        password
      })
    );
  };

  return (
    <RegisterUI
      errorText={hasError ? 'Ошибка регистрации' : ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
