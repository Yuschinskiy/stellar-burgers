import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { getOrdersApi } from '../../utils/burger-api';
import {
  setUserOrders,
  setUserOrdersLoading,
  setUserOrdersError
} from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((s) => s.userOrders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(setUserOrdersLoading(true));
        const userOrders = await getOrdersApi();
        dispatch(setUserOrders(userOrders));
        dispatch(setUserOrdersLoading(false));
      } catch (error) {
        console.error('Error fetching user orders:', error);
        dispatch(setUserOrdersError(true));
        dispatch(setUserOrdersLoading(false));
      }
    };

    fetchOrders();
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
