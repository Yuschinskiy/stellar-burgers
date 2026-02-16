import { store } from '../../store';
import type { RootState } from '../../store';
import { ingredientsReducer } from '../ingredientsSlice';
import { burgerConstructorReducer } from '../burgerConstructorSlice';
import { orderReducer } from '../orderSlice';
import { userReducer } from '../userSlice';
import { feedReducer } from '../feedSlice';
import { userOrdersReducer } from '../userOrdersSlice';

describe('rootReducer', () => {
  it('should initialize all reducers correctly', () => {
    // Получаем состояние store
    const state = store.getState() as RootState;

    // Проверяем, что все редьюсеры инициализированы
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('constructorBurger');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('userOrders');

    // Проверяем начальные состояния
    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      hasError: false
    });

    expect(state.constructorBurger).toEqual({
      bun: null,
      ingredients: []
    });

    expect(state.order).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.feed).toBeDefined();
    expect(state.userOrders).toBeDefined();
  });

  it('should combine reducers correctly', () => {
    // Проверяем, что редьюсеры действительно объединены
    const reducers = {
      ingredients: ingredientsReducer,
      constructorBurger: burgerConstructorReducer,
      order: orderReducer,
      user: userReducer,
      feed: feedReducer,
      userOrders: userOrdersReducer
    };

    // Создаем тестовый action
    const action = { type: 'unknown' };

    // Получаем состояние от каждого редьюсера отдельно
    const combinedState = {
      ingredients: ingredientsReducer(undefined, action),
      constructorBurger: burgerConstructorReducer(undefined, action),
      order: orderReducer(undefined, action),
      user: userReducer(undefined, action),
      feed: feedReducer(undefined, action),
      userOrders: userOrdersReducer(undefined, action)
    };

    // Сравниваем с состоянием из store
    expect(store.getState()).toMatchObject(combinedState);
  });
});
