import { FC } from 'react';
import { useAppSelector } from '../../services/hooks';
import { OrderDetailsUI } from '../ui/order-details';

export const OrderDetails: FC = () => {
  const { orderNumber } = useAppSelector((state) => state.order);

  if (!orderNumber) return null;

  return <OrderDetailsUI orderNumber={orderNumber} />;
};
