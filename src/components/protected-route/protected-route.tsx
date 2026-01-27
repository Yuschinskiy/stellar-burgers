import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useAppSelector } from '../../services/hooks';

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: {
  children: JSX.Element;
  onlyUnAuth?: boolean;
}) => {
  const location = useLocation();
  const { user, isAuthChecked } = useAppSelector((s) => s.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
