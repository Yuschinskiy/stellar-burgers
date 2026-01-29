import { FC } from 'react';
import { useAppSelector } from '../../services/hooks';
import { AppHeaderUI } from '@ui'; // Импорт UI компонента

export const AppHeader: FC = () => {
  // Получаем данные из Redux store
  const { user } = useAppSelector((s) => s.user);

  // Передаем данные в UI компонент
  return <AppHeaderUI userName={user?.name || ''} />;
};
