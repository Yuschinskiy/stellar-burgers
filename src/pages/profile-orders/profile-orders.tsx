import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { getCookie } from '../../utils/cookie';
import {
  wsConnect as wsConnectUser,
  wsDisconnect as wsDisconnectUser,
  setUserOrders
} from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((s) => s.userOrders);
  const { user } = useAppSelector((s) => s.user);

  useEffect(() => {
    if (user) {
      // URL для WebSocket подключения (личные заказы)
      const accessToken = getCookie('accessToken')?.replace('Bearer ', '');
      const wsUrl = `wss://norma.nomoreparties.space/orders?token=${accessToken}`;

      console.log('ProfileOrders: Connecting to user orders WebSocket');
      dispatch(wsConnectUser(wsUrl));

      return () => {
        console.log('ProfileOrders: Disconnecting WebSocket');
        dispatch(wsDisconnectUser());
      };
    }
  }, [dispatch, user]);

  return <ProfileOrdersUI orders={orders} />;
};
