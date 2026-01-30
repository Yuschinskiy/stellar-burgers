import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../../utils/types';
import { getOrdersApi } from '../../utils/burger-api'; // Импортируем функцию из burger-api

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

// HTTP action для получения заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

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

    // WebSocket actions (оставляем для совместимости, но не используем)
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        console.log('🟢 User orders fetched:', action.payload.length, 'orders');
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
        console.error('🔴 Failed to fetch user orders');
      });
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
