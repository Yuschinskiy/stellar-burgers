import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Добавить useLocation
import { TOrder } from '@utils-types';
import { OrderCard } from '../order-card';

interface OrdersListProps {
  orders: TOrder[];
}

export const OrdersList: FC<OrdersListProps> = ({ orders }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Использовать useLocation hook

  console.log('🔵 OrdersList - Total orders:', orders.length);

  if (orders.length === 0) {
    return (
      <div className='text-center p-10'>
        <p className='text text_type_main-large mb-4'>Лента заказов пуста</p>
        <p className='text text_type_main-default text_color_inactive'>
          Заказов пока нет. Будьте первым!
        </p>
      </div>
    );
  }

  const handleOrderClick = (
    orderNumber: number,
    isProfileOrder: boolean = false
  ) => {
    console.log(
      '🔵 Order clicked:',
      orderNumber,
      'isProfileOrder:',
      isProfileOrder
    );

    const path = isProfileOrder
      ? `/profile/orders/${orderNumber}`
      : `/feed/${orderNumber}`;

    // Передаем только необходимые данные, а не весь объект location
    navigate(path, {
      state: {
        background: {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash
        },
        isProfileOrder
      }
    });
  };

  return (
    <div className='space-y-4'>
      {orders.map((order) => {
        // Определяем, находимся ли мы на странице профиля
        const isOnProfilePage = location.pathname.includes('/profile/orders');

        return (
          <div key={order._id}>
            <OrderCard
              order={order}
              onClick={() => handleOrderClick(order.number, isOnProfilePage)}
            />
          </div>
        );
      })}
    </div>
  );
};
