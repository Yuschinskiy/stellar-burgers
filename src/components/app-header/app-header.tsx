import { FC } from 'react';
import { useAppSelector } from '../../services/hooks';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const { user } = useAppSelector((s) => s.user);

  return <AppHeaderUI userName={user?.name || ''} />;
};
