import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { userReducer } from './slices/userSlice';
import { burgerConstructorReducer } from './slices/burgerConstructorSlice';
import { orderReducer } from './slices/orderSlice';
import { feedReducer } from './slices/feedSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    user: userReducer,
    burgerConstructor: burgerConstructorReducer,
    order: orderReducer,
    feed: feedReducer,
    userOrders: userOrdersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
