import { FC, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();

  // Берем данные из store
  const { bun, ingredients } = useAppSelector((s) => s.burgerConstructor);
  const { orderNumber, isLoading: orderRequest } = useAppSelector(
    (s) => s.order
  );

  // Адаптируем данные для UI компонента
  const constructorItems = {
    bun: bun as TIngredient | null,
    ingredients: ingredients.map((item) => ({
      ...item,
      id: item.uuid // преобразуем uuid в id для TConstructorIngredient
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
    if (!constructorItems.bun || orderRequest) return;

    // Собираем массив ID ингредиентов
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id // булка повторяется дважды
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
