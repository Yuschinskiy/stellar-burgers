import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '../../utils/types';

interface IFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  hasError: boolean;
  wsConnected: boolean;
  wsError: string | null;
}

const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  hasError: false,
  wsConnected: false,
  wsError: null
};

export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', async () => {
  console.log('Fetching feeds from API...');
  const data = await getFeedsApi();
  console.log('Feeds fetched:', {
    orders: data.orders.length,
    total: data.total,
    totalToday: data.totalToday
  });
  return data;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeedOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    setFeedTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setFeedTotalToday: (state, action: PayloadAction<number>) => {
      state.totalToday = action.payload;
    },
    setFeedLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFeedError: (state, action: PayloadAction<boolean>) => {
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
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export const {
  setFeedOrders,
  setFeedTotal,
  setFeedTotalToday,
  setFeedLoading,
  setFeedError,
  wsConnect,
  wsDisconnect,
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage
} = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
