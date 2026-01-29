import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../../utils/types';

interface IUserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  hasError: boolean;
  wsConnected: boolean;
  wsError: string | null;
}

const initialState: IUserOrdersState = {
  orders: [],
  isLoading: false,
  hasError: false,
  wsConnected: false,
  wsError: null
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    setUserOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    setUserOrdersLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserOrdersError: (state, action: PayloadAction<boolean>) => {
      state.hasError = action.payload;
    },

    // WebSocket actions
    wsConnect: (state, action: PayloadAction<string>) => {
      // URL будет использоваться в middleware
    },

    wsDisconnect: (state) => {
      state.wsConnected = false;
    },

    wsConnecting: (state) => {
      state.wsConnected = false;
    },

    wsOpen: (state) => {
      state.wsConnected = true;
      state.wsError = null;
    },

    wsClose: (state) => {
      state.wsConnected = false;
    },

    wsError: (state, action: PayloadAction<string>) => {
      state.wsError = action.payload;
    },

    wsMessage: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.isLoading = false;
    }
  }
});

export const {
  setUserOrders,
  setUserOrdersLoading,
  setUserOrdersError,
  wsConnect,
  wsDisconnect,
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage
} = userOrdersSlice.actions;
export const userOrdersReducer = userOrdersSlice.reducer;
