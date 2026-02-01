import { FC, useMemo, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useAppSelector } from '../../services/hooks';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const background = location.state?.background;
  const isProfilePage = location.pathname.includes('/profile/orders');

  const { ingredients } = useAppSelector((s) => s.ingredients);

  // Для фонового режима (модалки) используем данные из Redux
  const { orders: feedOrders } = useAppSelector((s) => s.feed);
  const { orders: userOrders } = useAppSelector((s) => s.userOrders);

  // Для прямого перехода - загружаем отдельно
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(!background); // Загружаем только при прямом переходе
  const [error, setError] = useState<string | null>(null);

  // Загружаем заказ по номеру при прямом переходе
  useEffect(() => {
    // Если есть background - заказ должен быть в списках, не загружаем отдельно
    if (background) return;

    // Если нет номера - ошибка
    if (!number) {
      setError('Номер заказа не указан');
      setIsLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        const response = await getOrderByNumberApi(Number(number));

        console.log('📦 OrderInfo: API response:', {
          success: response.success,
          ordersCount: response.orders?.length || 0
        });

        if (response.success && response.orders.length > 0) {
          setOrderData(response.orders[0]);
          console.log('✅ OrderInfo: Order found:', response.orders[0].number);
        } else {
          setError('Заказ не найден');
          console.log('❌ OrderInfo: Order not found in response');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка загрузки заказа';
        setError(errorMessage);
        console.error('❌ OrderInfo: Error loading order:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [number, background]);

  // Если есть background, ищем заказ в загруженных списках
  const backgroundOrderData = useMemo(() => {
    if (!background || !number) return null;
    const orders = isProfilePage ? userOrders : feedOrders;
    const foundOrder = orders.find((order) => order.number === Number(number));

    console.log('🔍 OrderInfo: Searching in background:', {
      background,
      number,
      isProfilePage,
      ordersLength: orders.length,
      found: !!foundOrder
    });

    return foundOrder;
  }, [background, number, isProfilePage, userOrders, feedOrders]);

  // Используем данные из background или из отдельного запроса
  const finalOrderData = background ? backgroundOrderData : orderData;

  // useMemo вызывается ВСЕГДА
  const orderInfo = useMemo(() => {
    console.log('🔄 OrderInfo: useMemo recalculation', {
      hasOrderData: !!finalOrderData,
      hasIngredients: ingredients.length > 0
    });

    if (!finalOrderData || !ingredients.length) {
      return null;
    }

    const date = new Date(finalOrderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = finalOrderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...finalOrderData,
      ingredientsInfo,
      date,
      total
    };
  }, [finalOrderData, ingredients]);

  // Если есть background и нет данных - ничего не показываем (модалка закроется)
  if (background && (!finalOrderData || !ingredients.length)) {
    console.log('🎭 OrderInfo: Background mode, no data, returning null');
    return null;
  }

  // Показываем ошибку
  if (error) {
    console.log('❌ OrderInfo: Showing error:', error);
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>{error}</h2>
        <p>Номер заказа: {number}</p>
        <button
          onClick={() =>
            (window.location.href = isProfilePage ? '/profile/orders' : '/feed')
          }
        >
          Вернуться к списку заказов
        </button>
      </div>
    );
  }

  // Показываем прелоадер при загрузке
  if (isLoading || !orderInfo) {
    console.log('⏳ OrderInfo: Loading, showing preloader', {
      isLoading,
      hasOrderInfo: !!orderInfo,
      hasFinalOrderData: !!finalOrderData,
      ingredientsLength: ingredients.length
    });
    return <Preloader />;
  }

  console.log(
    '✅ OrderInfo: Rendering OrderInfoUI with order:',
    orderInfo.number
  );
  return <OrderInfoUI orderInfo={orderInfo} />;
};
