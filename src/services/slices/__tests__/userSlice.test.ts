import { 
  userReducer, 
  setAuthChecked, 
  clearError, 
  clearForgotPassword, 
  forceLogout,
  checkUserAuth,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  forgotPassword,
  resetPassword
} from '../userSlice';
import { TUser } from '../../../utils/types';

// Мокаем API
jest.mock('../../../utils/burger-api', () => ({
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  updateUserApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn()
}));

// Мокаем cookie
jest.mock('../../../utils/cookie', () => ({
  deleteCookie: jest.fn(),
  getCookie: jest.fn()
}));

describe('userSlice', () => {
  // Реальный initialState из слайса
  const initialState: IUserState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    hasError: false,
    forgotPasswordRequest: false,
    forgotPasswordSuccess: false
  };

  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  it('should return initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('reducers', () => {
    it('should handle setAuthChecked', () => {
      const action = setAuthChecked(true);
      const newState = userReducer(initialState, action);
      
      expect(newState.isAuthChecked).toBe(true);
    });

    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        hasError: true
      };
      
      const action = clearError();
      const newState = userReducer(stateWithError, action);
      
      expect(newState.hasError).toBe(false);
    });

    it('should handle clearForgotPassword', () => {
      const stateWithSuccess = {
        ...initialState,
        forgotPasswordSuccess: true
      };
      
      const action = clearForgotPassword();
      const newState = userReducer(stateWithSuccess, action);
      
      expect(newState.forgotPasswordSuccess).toBe(false);
    });

    it('should handle forceLogout', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };
      
      const action = forceLogout();
      const newState = userReducer(stateWithUser, action);
      
      expect(newState.user).toBeNull();
      expect(newState.isAuthChecked).toBe(true);
    });
  });

  describe('checkUserAuth async thunk', () => {
    it('should handle checkUserAuth.fulfilled', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should handle checkUserAuth.rejected', () => {
      const action = {
        type: checkUserAuth.rejected.type,
        payload: 'Not authenticated'
      };
      const state = userReducer(initialState, action);
      
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.hasError).toBe(false); // Это не ошибка, просто не авторизован
    });
  });

  describe('loginUser async thunk', () => {
    it('should handle loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should handle loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.hasError).toBe(false);
    });

    it('should handle loginUser.rejected', () => {
      const action = { type: loginUser.rejected.type };
      const state = userReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(true);
    });
  });

  describe('registerUser async thunk', () => {
    it('should handle registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should handle registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.hasError).toBe(false);
    });

    it('should handle registerUser.rejected', () => {
      const action = { type: registerUser.rejected.type };
      const state = userReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(true);
    });
  });

  describe('logoutUser async thunk', () => {
    it('should handle logoutUser.pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = userReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
    });

    it('should handle logoutUser.fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };
      
      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(stateWithUser, action);
      
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle logoutUser.rejected', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };
      
      const action = { type: logoutUser.rejected.type };
      const state = userReducer(stateWithUser, action);
      
      // Даже при ошибке пользователь должен быть разлогинен
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUserProfile async thunk', () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };

    it('should handle updateUserProfile.fulfilled', () => {
      const action = {
        type: updateUserProfile.fulfilled.type,
        payload: updatedUser
      };
      const state = userReducer(initialState, action);
      
      expect(state.user).toEqual(updatedUser);
    });
  });

  describe('forgotPassword async thunk', () => {
    it('should handle forgotPassword.pending', () => {
      const action = { type: forgotPassword.pending.type };
      const state = userReducer(initialState, action);
      
      expect(state.forgotPasswordRequest).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should handle forgotPassword.fulfilled', () => {
      const action = { type: forgotPassword.fulfilled.type };
      const state = userReducer(initialState, action);
      
      expect(state.forgotPasswordRequest).toBe(false);
      expect(state.forgotPasswordSuccess).toBe(true);
    });

    it('should handle forgotPassword.rejected', () => {
      const action = { type: forgotPassword.rejected.type };
      const state = userReducer(initialState, action);
      
      expect(state.forgotPasswordRequest).toBe(false);
      expect(state.hasError).toBe(true);
    });
  });

  describe('resetPassword async thunk', () => {
    it('should handle resetPassword.fulfilled', () => {
      const stateWithSuccess = {
        ...initialState,
        forgotPasswordSuccess: true
      };
      
      const action = { type: resetPassword.fulfilled.type };
      const state = userReducer(stateWithSuccess, action);
      
      expect(state.forgotPasswordSuccess).toBe(false);
    });
  });
});
