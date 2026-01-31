import { FC, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useAppSelector } from '../../services/hooks';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const background = location.state?.background;
  const isProfilePage = location.pathname.includes('/profile/orders');

  const { orders: feedOrders } = useAppSelector((s) => s.feed);
  const { orders: userOrders } = useAppSelector((s) => s.userOrders);
  const { ingredients } = useAppSelector((s) => s.ingredients);

  const orders = isProfilePage ? userOrders : feedOrders;
  const orderData = orders.find((order) => order.number === Number(number));

  // useMemo вызывается ВСЕГДА, независимо от наличия данных
  const orderInfo = useMemo(() => {
    // Если данных нет, возвращаем null
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
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
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Проверка после всех хуков
  if (background && (!orderData || !ingredients.length)) {
    return null;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
