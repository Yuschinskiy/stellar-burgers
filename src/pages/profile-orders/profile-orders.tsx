import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { getCookie } from '../../utils/cookie';
import {
  wsConnect as wsConnectUser,
  wsDisconnect as wsDisconnectUser
} from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, wsConnected, wsError } = useAppSelector(
    (s) => s.userOrders
  );
  const { user } = useAppSelector((s) => s.user);

  console.log('🔵 ProfileOrders state:', {
    user: !!user,
    ordersCount: orders.length,
    isLoading,
    wsConnected,
    wsError
  });

  useEffect(() => {
    if (user) {
      const accessToken = getCookie('accessToken');
      console.log('🔵 ProfileOrders - accessToken exists:', !!accessToken);

      if (accessToken) {
        // Убираем 'Bearer ' если он есть
        const token = accessToken.replace('Bearer ', '');
        const wsUrl = `wss://norma.nomoreparties.space/orders?token=${token}`;

        console.log('🔵 ProfileOrders: Connecting to WebSocket:', wsUrl);
        dispatch(wsConnectUser(wsUrl));

        return () => {
          console.log('🔵 ProfileOrders: Disconnecting WebSocket');
          dispatch(wsDisconnectUser());
        };
      } else {
        console.error('🔴 ProfileOrders: No access token found');
      }
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Для просмотра истории заказов необходимо авторизоваться</h2>
      </div>
    );
  }

  if (wsError) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Ошибка подключения к истории заказов</h2>
        <p>{wsError}</p>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
