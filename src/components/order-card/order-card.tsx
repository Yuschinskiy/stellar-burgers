import { FC, memo, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { getIngredients } from '../../services/slices/ingredientsSlice'; // Добавить
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order, onClick }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { ingredients, isLoading: ingredientsLoading } = useAppSelector(
    (s) => s.ingredients
  );

  console.log('🟠 OrderCard - Order:', order.number);
  console.log('🟠 OrderCard - Ingredients in store:', ingredients.length);

  // Если ингредиенты не загружены, попробуем загрузить
  useEffect(() => {
    if (ingredients.length === 0 && !ingredientsLoading) {
      console.log('🟠 OrderCard: No ingredients, loading...');
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.length, ingredientsLoading]);

  // Fallback если ингредиенты не загружены
  if (ingredients.length === 0) {
    console.log('🟠 OrderCard: Using fallback (no ingredients)');
    return (
      <div
        className='p-6 mb-4 bg-gray-900 rounded-xl border border-gray-800 cursor-pointer'
        onClick={onClick}
      >
        <div className='flex justify-between'>
          <span className='text text_type_digits-default'>#{order.number}</span>
          <span className='text text_type_main-default text_color_inactive'>
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h4 className='pt-4 text text_type_main-medium'>{order.name}</h4>
        {location.pathname.includes('/profile/orders') && order.status && (
          <div className='pt-2'>
            <span
              className={`text text_type_main-default ${
                order.status === 'done'
                  ? 'text_color_success'
                  : order.status === 'pending'
                    ? 'text_color_accent'
                    : 'text_color_inactive'
              }`}
            >
              {order.status === 'done'
                ? 'Выполнен'
                : order.status === 'pending'
                  ? 'Готовится'
                  : order.status}
            </span>
          </div>
        )}
        <div className='pt-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <span className='text text_type_main-default text_color_inactive mr-2'>
              {order.ingredients.length} ингредиентов
            </span>
          </div>
          <div className='flex items-center'>
            <span className='text text_type_digits-default mr-2'>
              {/* Примерная цена */}
              {order.ingredients.length * 100}
            </span>
            <div className='text text_type_digits-default text_color_inactive'>
              {/* Иконка валюты */}₽
            </div>
          </div>
        </div>
      </div>
    );
  }

  const orderInfo = useMemo(() => {
    console.log('🟠 OrderCard: Calculating order info');

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          return [...acc, ingredient];
        }
        console.log('🟠 OrderCard: Ingredient not found:', item);
        return acc;
      },
      []
    );

    console.log(
      '🟠 OrderCard: Found ingredients:',
      ingredientsInfo.length,
      'out of',
      order.ingredients.length
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    console.log('🟠 OrderCard: No orderInfo');
    return null;
  }

  console.log('🟠 OrderCard: Rendering OrderCardUI');

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
      onClick={onClick}
    />
  );
});
