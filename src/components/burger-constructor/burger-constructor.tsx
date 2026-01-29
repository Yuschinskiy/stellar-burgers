import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { BurgerConstructorUI } from '../ui/burger-constructor';
import { createOrder, clearOrder } from '../../services/slices/orderSlice'; // добавлен clearOrder
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { bun, ingredients } = useAppSelector(
    (state) => state.constructorBurger
  );

  const { user } = useAppSelector((state) => state.user);
  const { orderNumber, isLoading } = useAppSelector((state) => state.order);

  // Конвертируем TIngredient[] в TConstructorIngredient[]
  const constructorIngredients: TConstructorIngredient[] = useMemo(
    () =>
      ingredients.map((ingredient: TIngredient, index: number) => ({
        ...ingredient,
        id: ingredient._id + index // создаем уникальный id
      })),
    [ingredients]
  );

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bun || ingredients.length === 0) {
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item: TIngredient) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        console.log('Order created successfully');
      })
      .catch((error) => {
        console.error('Error creating order:', error);
      });
  };

  const closeOrderModal = () => {
    console.log('Closing order modal, clearing order number and constructor');
    // Очищаем номер заказа И конструктор
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      constructorItems={{
        bun,
        ingredients: constructorIngredients // используем конвертированный массив
      }}
      orderRequest={isLoading}
      orderModalData={orderNumber ? { number: orderNumber } : null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
