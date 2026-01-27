import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

interface IOrderState {
  orderNumber: number | null;
  isLoading: boolean;
  hasError: boolean;
}

const initialState: IOrderState = {
  orderNumber: null,
  isLoading: false,
  hasError: false
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order.number;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderNumber: (state, action: PayloadAction<number>) => {
      state.orderNumber = action.payload;
    },
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderError: (state, action: PayloadAction<boolean>) => {
      state.hasError = action.payload;
    },
    clearOrder: (state) => {
      state.orderNumber = null;
      state.isLoading = false;
      state.hasError = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export const { setOrderNumber, setOrderLoading, setOrderError, clearOrder } =
  orderSlice.actions;
export const orderReducer = orderSlice.reducer;
