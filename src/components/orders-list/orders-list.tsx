import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOrder } from '@utils-types';
import { OrderCard } from '../order-card';

interface OrdersListProps {
  orders: TOrder[];
}

export const OrdersList: FC<OrdersListProps> = ({ orders }) => {
  const navigate = useNavigate();

  const handleOrderClick = (
    orderNumber: number,
    isProfileOrder: boolean = false
  ) => {
    const path = isProfileOrder
      ? `/profile/orders/${orderNumber}`
      : `/feed/${orderNumber}`;

    // Определяем, находимся ли мы на странице профиля
    const isOnProfilePage =
      window.location.pathname.includes('/profile/orders');
    const finalIsProfileOrder = isOnProfilePage || isProfileOrder;

    navigate(path, {
      state: {
        background: window.location,
        isProfileOrder: finalIsProfileOrder
      }
    });
  };

  return (
    <>
      {orders.map((order) => {
        // Определяем, находимся ли мы на странице профиля
        const isOnProfilePage =
          window.location.pathname.includes('/profile/orders');

        return (
          <OrderCard
            key={order._id}
            order={order}
            onClick={() => handleOrderClick(order.number, isOnProfilePage)}
          />
        );
      })}
    </>
  );
};
