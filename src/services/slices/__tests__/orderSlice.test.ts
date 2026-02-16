import { orderReducer, createOrder, setOrderNumber, setOrderLoading, setOrderError, clearOrder } from '../orderSlice';

// Мокаем API
jest.mock('../../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn()
}));

describe('orderSlice', () => {
  const initialState = {
    orderNumber: null,
    isLoading: false,
    hasError: false
  };

  it('should return initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('reducers', () => {
    it('should handle setOrderNumber', () => {
      const action = setOrderNumber(12345);
      const newState = orderReducer(initialState, action);
      
      expect(newState.orderNumber).toBe(12345);
    });

    it('should handle setOrderLoading', () => {
      const action = setOrderLoading(true);
      const newState = orderReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
    });

    it('should handle setOrderError', () => {
      const action = setOrderError(true);
      const newState = orderReducer(initialState, action);
      
      expect(newState.hasError).toBe(true);
    });

    it('should handle clearOrder', () => {
      const stateWithOrder = {
        orderNumber: 12345,
        isLoading: true,
        hasError: false
      };
      
      const action = clearOrder();
      const newState = orderReducer(stateWithOrder, action);
      
      expect(newState).toEqual(initialState);
    });
  });

  describe('createOrder async thunk', () => {
    const ingredientIds = ['ing1', 'ing2', 'ing3'];

    it('should handle createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should handle createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: 12345
      };
      const state = orderReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.orderNumber).toBe(12345);
    });

    it('should handle createOrder.rejected', () => {
      const action = { type: createOrder.rejected.type };
      const state = orderReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(true);
      expect(state.orderNumber).toBeNull();
    });
  });
});
