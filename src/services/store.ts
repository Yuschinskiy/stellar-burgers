import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { burgerConstructorReducer } from './slices/burgerConstructorSlice';
import { orderReducer } from './slices/orderSlice';
import { userReducer } from './slices/userSlice';
import { feedReducer } from './slices/feedSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

// Определяем типы actions для WebSocket как строки
const feedWsActions = {
  wsConnect: 'feed/wsConnect',
  wsDisconnect: 'feed/wsDisconnect',
  wsConnecting: 'feed/wsConnecting',
  wsOpen: 'feed/wsOpen',
  wsClose: 'feed/wsClose',
  wsError: 'feed/wsError',
  wsMessage: 'feed/wsMessage'
};

const userWsActions = {
  wsConnect: 'userOrders/wsConnect',
  wsDisconnect: 'userOrders/wsDisconnect',
  wsConnecting: 'userOrders/wsConnecting',
  wsOpen: 'userOrders/wsOpen',
  wsClose: 'userOrders/wsClose',
  wsError: 'userOrders/wsError',
  wsMessage: 'userOrders/wsMessage'
};

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    constructorBurger: burgerConstructorReducer,
    order: orderReducer,
    user: userReducer,
    feed: feedReducer,
    userOrders: userOrdersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(socketMiddleware(feedWsActions))
      .concat(socketMiddleware(userWsActions))
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
