import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { updateUserProfile } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, hasError } = useAppSelector((s) => s.user);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const [originalValues, setOriginalValues] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      const newValues = {
        name: user.name,
        email: user.email
      };
      setFormValue({
        ...newValues,
        password: ''
      });
      setOriginalValues(newValues);
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== originalValues.name ||
    formValue.email !== originalValues.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged && user) {
      dispatch(
        updateUserProfile({
          name: formValue.name,
          email: formValue.email,
          password: formValue.password || undefined
        })
      ).then(() => {
        // После успешного сохранения обновляем оригинальные значения
        setOriginalValues({
          name: formValue.name,
          email: formValue.email
        });
        // Очищаем пароль
        setFormValue((prev) => ({ ...prev, password: '' }));
      });
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: originalValues.name,
      email: originalValues.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={hasError ? 'Ошибка при обновлении профиля' : undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
