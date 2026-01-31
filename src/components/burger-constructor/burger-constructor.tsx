import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { createOrder } from '../../services/slices/orderSlice';
import {
  clearConstructor,
  removeIngredient
} from '../../services/slices/burgerConstructorSlice'; // Добавили импорт
import { clearOrder } from '../../services/slices/orderSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { bun, ingredients } = useAppSelector(
    (state) => state.constructorBurger
  );
  const { user } = useAppSelector((state) => state.user);
  const { orderNumber, isLoading } = useAppSelector((state) => state.order);

  const constructorIngredients: TConstructorIngredient[] = useMemo(
    () =>
      ingredients.map((ingredient: TIngredient, index: number) => ({
        ...ingredient,
        id: ingredient._id + index
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

  // Обработчик удаления ингредиента по индексу
  const handleRemoveIngredient = (index: number) => {
    console.log('🟢 Removing ingredient at index:', index);
    dispatch(removeIngredient(index));
  };

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!bun || ingredients.length === 0) {
      alert('Добавьте булку и ингредиенты!');
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item: TIngredient) => item._id),
      bun._id
    ];

    console.log('🟢 Creating order with ingredients:', ingredientIds);
    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then((newOrderNumber) => {
        console.log('🟢 Order created successfully:', newOrderNumber);
        dispatch(clearConstructor());
        dispatch(fetchFeeds());
        dispatch(fetchUserOrders());
        console.log('🟢 Constructor cleared and feeds refreshed');
      })
      .catch((error) => {
        console.error('🔴 Error creating order:', error);
        alert('Ошибка при создании заказа: ' + error.message);
      });
  };

  const closeOrderModal = () => {
    console.log('🟢 closeOrderModal called - clearing order modal data');
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      constructorItems={{
        bun,
        ingredients: constructorIngredients
      }}
      orderRequest={isLoading}
      orderModalData={orderNumber ? { number: orderNumber } : null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      handleRemoveIngredient={handleRemoveIngredient} // Передаем обработчик
    />
  );
};
