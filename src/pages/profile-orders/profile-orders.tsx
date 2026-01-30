import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { Preloader } from '@ui';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, hasError } = useAppSelector((s) => s.userOrders);
  const { user } = useAppSelector((s) => s.user);

  console.log(
    '🔵 ProfileOrders - User:',
    !!user,
    'Orders:',
    orders.length,
    'Loading:',
    isLoading,
    'Error:',
    hasError
  );

  // Загружаем заказы при монтировании и при изменении пользователя
  useEffect(() => {
    if (user) {
      console.log('🔵 Fetching user orders via HTTP...');
      dispatch(fetchUserOrders());

      // Можно добавить автоматическое обновление каждые 30 секунд
      const interval = setInterval(() => {
        console.log('🔵 Auto-refreshing user orders...');
        dispatch(fetchUserOrders());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 className='text text_type_main-medium'>
          Для просмотра истории заказов необходимо авторизоваться
        </h2>
        <p className='text text_type_main-default text_color_inactive mt-4'>
          Пожалуйста, войдите в свой аккаунт
        </p>
      </div>
    );
  }

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  if (hasError) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 className='text text_type_main-medium mb-4'>
          Ошибка загрузки истории заказов
        </h2>
        <button
          className='text text_type_main-default'
          onClick={() => dispatch(fetchUserOrders())}
          style={{
            background: '#4C4CFF',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 className='text text_type_main-medium mb-4'>
          История заказов пуста
        </h2>
        <p className='text text_type_main-default text_color_inactive'>
          Вы еще не сделали ни одного заказа. Создайте первый заказ в
          конструкторе!
        </p>
      </div>
    );
  }

  console.log('🔵 Rendering ProfileOrders with', orders.length, 'orders');

  // Проверим, есть ли наш заказ #99904
  const myOrder = orders.find((o) => o.number === 99904);
  console.log('🔵 Наш заказ #99904 в истории:', myOrder ? 'ЕСТЬ!' : 'НЕТ');

  return <ProfileOrdersUI orders={orders} />;
};
