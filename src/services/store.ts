import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { burgerConstructorReducer } from './slices/burgerConstructorSlice';
import { orderReducer } from './slices/orderSlice';
import { userReducer } from './slices/userSlice';
import { feedReducer } from './slices/feedSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

// Импортируем actions
import {
  wsConnect as feedWsConnect,
  wsDisconnect as feedWsDisconnect,
  wsConnecting as feedWsConnecting,
  wsOpen as feedWsOpen,
  wsClose as feedWsClose,
  wsError as feedWsError,
  wsMessage as feedWsMessage
} from './slices/feedSlice';

import {
  wsConnect as userWsConnect,
  wsDisconnect as userWsDisconnect,
  wsConnecting as userWsConnecting,
  wsOpen as userWsOpen,
  wsClose as userWsClose,
  wsError as userWsError,
  wsMessage as userWsMessage
} from './slices/userOrdersSlice';

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
      .concat(
        socketMiddleware({
          wsConnect: feedWsConnect.type,
          wsDisconnect: feedWsDisconnect.type,
          wsConnecting: feedWsConnecting.type,
          wsOpen: feedWsOpen.type,
          wsClose: feedWsClose.type,
          wsError: feedWsError.type,
          wsMessage: feedWsMessage.type
        })
      )
      .concat(
        socketMiddleware({
          wsConnect: userWsConnect.type,
          wsDisconnect: userWsDisconnect.type,
          wsConnecting: userWsConnecting.type,
          wsOpen: userWsOpen.type,
          wsClose: userWsClose.type,
          wsError: userWsError.type,
          wsMessage: userWsMessage.type
        })
      )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
