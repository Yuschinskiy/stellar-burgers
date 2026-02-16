import { store } from '../../store';
import type { RootState } from '../../store';
import { ingredientsReducer } from '../ingredientsSlice';
import { burgerConstructorReducer } from '../burgerConstructorSlice';
import { orderReducer } from '../orderSlice';
import { userReducer } from '../userSlice';
import { feedReducer } from '../feedSlice';
import { userOrdersReducer } from '../userOrdersSlice';

describe('rootReducer', () => {
  // ТЕСТ 1: проверка начального состояния
  it('должен возвращать корректное начальное состояние', () => {
    const initAction = { type: '@@INIT' };
    const state = store.getState();

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      constructorBurger: burgerConstructorReducer(undefined, initAction),
      order: orderReducer(undefined, initAction),
      user: userReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction),
      userOrders: userOrdersReducer(undefined, initAction)
    });
  });

  // ТЕСТ 2: проверка что состояние не мутируется при неизвестном экшене
  it('должен возвращать то же состояние при неизвестном экшене', () => {
    const prevState = store.getState();
    
    // Диспатчим неизвестный экшен
    store.dispatch({ type: 'UNKNOWN_ACTION' });
    const newState = store.getState();
    
    // Состояние должно быть тем же (не изменилось)
    expect(newState).toEqual(prevState);
  });

  // ТЕСТ 3: проверка инициализации всех редьюсеров
  it('should initialize all reducers correctly', () => {
    const state = store.getState() as RootState;

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('constructorBurger');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('userOrders');

    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      hasError: false
    });

    expect(state.constructorBurger).toEqual({
      bun: null,
      ingredients: []
    });
  });

  // ТЕСТ 4: проверка комбинирования редьюсеров
  it('should combine reducers correctly', () => {
    const action = { type: 'unknown' };
    
    const combinedState = {
      ingredients: ingredientsReducer(undefined, action),
      constructorBurger: burgerConstructorReducer(undefined, action),
      order: orderReducer(undefined, action),
      user: userReducer(undefined, action),
      feed: feedReducer(undefined, action),
      userOrders: userOrdersReducer(undefined, action)
    };

    expect(store.getState()).toMatchObject(combinedState);
  });
});
