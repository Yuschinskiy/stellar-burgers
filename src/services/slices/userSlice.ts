import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

interface IUserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  hasError: boolean;
  forgotPasswordRequest: boolean;
  forgotPasswordSuccess: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  hasError: false,
  forgotPasswordRequest: false,
  forgotPasswordSuccess: false
};

// Проверка авторизации
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

// Логин
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    return response.user;
  }
);

// Регистрация
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    return response.user;
  }
);

// Выход
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
});

// Обновление данных пользователя
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

// Восстановление пароля
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: string) => {
    await forgotPasswordApi({ email });
  }
);

// Сброс пароля
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearError: (state) => {
      state.hasError = false;
    },
    clearForgotPassword: (state) => {
      state.forgotPasswordSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Проверка авторизации
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      // Логин
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      // Выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      // Обновление профиля
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Восстановление пароля
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordRequest = true;
        state.hasError = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordRequest = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.forgotPasswordRequest = false;
        state.hasError = true;
      })
      // Сброс пароля
      .addCase(resetPassword.fulfilled, (state) => {
        state.forgotPasswordSuccess = false;
      });
  }
});

export const { setAuthChecked, clearError, clearForgotPassword } =
  userSlice.actions;
export const userReducer = userSlice.reducer;
