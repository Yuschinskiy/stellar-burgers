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
import { deleteCookie, getCookie } from '../../utils/cookie';

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      // При ошибке 401 просто возвращаем null (пользователь не авторизован)
      return rejectWithValue('Not authenticated');
    }
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
  try {
    // Пробуем отправить запрос на выход
    await logoutApi();
  } catch (error) {
    console.log('Logout API error, but continuing with cleanup', error);
    // Продолжаем даже если API ошибка
  } finally {
    // ВСЕГДА очищаем токены локально
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Удаляем cookies
    deleteCookie('accessToken');
    deleteCookie('refreshToken');

    // Также чистим все возможные варианты хранения
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
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
    },
    // Добавляем редьюсер для принудительного выхода
    forceLogout: (state) => {
      state.user = null;
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Проверка авторизации
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.hasError = false;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        console.log('Auth check rejected:', action.payload);
        state.user = null;
        state.isAuthChecked = true;
        state.hasError = false; // Это не ошибка, просто не авторизован
      })
      // Логин
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.hasError = false;
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
        state.hasError = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      // ВЫХОД
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Даже если API ошибка, считаем что выход выполнен
        state.user = null;
        state.isLoading = false;
        state.isAuthChecked = true;
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

export const { setAuthChecked, clearError, clearForgotPassword, forceLogout } =
  userSlice.actions;
export const userReducer = userSlice.reducer;

// ДОБАВЛЯЕМ ЭКСПОРТ ИНТЕРФЕЙСА
export type { IUserState };
