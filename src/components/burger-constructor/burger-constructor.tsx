import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { BurgerConstructorUI } from '../ui/burger-constructor';
import { createOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';
import { clearOrder } from '../../services/slices/orderSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { bun, ingredients } = useAppSelector(
    (state) => state.constructorBurger
  );

  const { user } = useAppSelector((state) => state.user);
  const { orderNumber, isLoading } = useAppSelector((state) => state.order);

  console.log(
    '🟢 BurgerConstructor - orderNumber:',
    orderNumber,
    'isLoading:',
    isLoading
  );

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

    console.log('🟢 Creating order with ingredients:', ingredientIds);

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then((newOrderNumber) => {
        console.log('🟢 Order created successfully:', newOrderNumber);
        // УБРАЛИ fetchFeeds - данные теперь через WebSocket
      })
      .catch((error) => {
        console.error('🔴 Error creating order:', error);
        alert('Ошибка при создании заказа');
      });
  };

  const closeOrderModal = () => {
    console.log('🟢 closeOrderModal called - clearing order');
    dispatch(clearConstructor());
    dispatch(clearOrder());
    console.log('🟢 Order should be cleared now');
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
    />
  );
};
