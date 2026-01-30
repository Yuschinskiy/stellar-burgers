import { FC } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; // ← Добавьте useLocation
import { useAppDispatch } from '../../services/hooks';
import { logoutUser } from '../../services/slices/userSlice';
import { ProfileMenuUI } from '../ui/profile-menu';

export const ProfileMenu: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // ← Добавьте это

  const handleLogout = () => {
    console.log('🔵 ProfileMenu: Logout clicked');
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        console.log('🔵 ProfileMenu: Logout successful');
        navigate('/login');
      })
      .catch((error) => {
        console.error('🔴 ProfileMenu: Logout error:', error);
      });
  };

  return (
    <ProfileMenuUI handleLogout={handleLogout} pathname={location.pathname} />
  ); // ← Добавьте pathname
};
