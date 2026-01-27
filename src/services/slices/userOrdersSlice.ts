import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

interface IUserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  hasError: boolean;
}

const initialState: IUserOrdersState = {
  orders: [],
  isLoading: false,
  hasError: false
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
    }
  }
});

export const { setUserOrders, setUserOrdersLoading, setUserOrdersError } =
  userOrdersSlice.actions;
export const userOrdersReducer = userOrdersSlice.reducer;
