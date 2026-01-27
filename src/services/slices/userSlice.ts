import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

interface IUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  hasError: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  hasError: false
};

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
        state.isAuthChecked = true;
        state.user = null;
      });
  }
});

export const { setAuthChecked } = userSlice.actions;
export const userReducer = userSlice.reducer;
