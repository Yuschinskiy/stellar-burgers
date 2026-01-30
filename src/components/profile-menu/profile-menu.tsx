import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/hooks';
import { logoutUser } from '../../services/slices/userSlice';
import { ProfileMenuUI } from '../ui/profile-menu';
import { wsDisconnect as wsDisconnectUser } from '../../services/slices/userOrdersSlice'; // Добавить

export const ProfileMenu: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    console.log('🔵 ProfileMenu: Logout clicked');

    // Отключаем WebSocket перед выходом
    dispatch(wsDisconnectUser());

    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        console.log('🔵 ProfileMenu: Logout successful');
        navigate('/login');
      })
      .catch((error) => {
        console.error('🔴 ProfileMenu: Logout error:', error);
        // Все равно перенаправляем на логин
        navigate('/login');
      });
  };

  return (
    <ProfileMenuUI handleLogout={handleLogout} pathname={location.pathname} />
  );
};
