import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order, onClick }) => {
  const location = useLocation();

  const { ingredients, isLoading: ingredientsLoading } = useAppSelector(
    (s) => s.ingredients
  );

  const orderInfo = useMemo(() => {
    if (ingredientsLoading || ingredients.length === 0) {
      return null;
    }

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          return [...acc, ingredient];
        }
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Важное исправление: остается только если есть скрытые ингредиенты
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains, // будет 0 если ингредиентов <= maxIngredients
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients, ingredientsLoading]);

  if (ingredientsLoading) {
    return (
      <div className='p-6 mb-4 bg-gray-900 rounded-xl border border-gray-800'>
        <div className='flex justify-between'>
          <span className='text text_type_digits-default'>#{order.number}</span>
          <span className='text text_type_main-default text_color_inactive'>
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className='pt-4 text text_type_main-medium text_color_inactive'>
          Загрузка...
        </div>
      </div>
    );
  }

  if (!orderInfo) {
    return null;
  }

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
      onClick={onClick}
    />
  );
});
