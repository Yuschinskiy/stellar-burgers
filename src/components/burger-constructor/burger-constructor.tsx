import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Берем данные из store
  const { bun, ingredients } = useAppSelector((s) => s.burgerConstructor);
  const { orderNumber, isLoading: orderRequest } = useAppSelector(
    (s) => s.order
  );
  const { user } = useAppSelector((s) => s.user); // Добавляем проверку пользователя

  // Адаптируем данные для UI компонента
  const constructorItems = {
    bun: bun as TIngredient | null,
    ingredients: ingredients.map((item) => ({
      ...item,
      id: item.uuid
    })) as TConstructorIngredient[]
  };

  // Создаем правильный объект TOrder для orderModalData
  const orderModalData: TOrder | null = orderNumber
    ? {
        _id: `mock-order-${orderNumber}`,
        status: 'done',
        name: 'Заказ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: orderNumber,
        ingredients: []
      }
    : null;

  const onOrderClick = async () => {
    // Проверяем авторизацию
    if (!user) {
      navigate('/login');
      return;
    }

    // Проверяем наличие ингредиентов
    if (
      !constructorItems.bun ||
      orderRequest ||
      constructorItems.ingredients.length === 0
    ) {
      return;
    }

    // Собираем массив ID ингредиентов
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    // Диспатчим создание заказа
    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
