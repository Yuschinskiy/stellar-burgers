import { userOrdersReducer, fetchUserOrders, setUserOrders, setUserOrdersLoading, setUserOrdersError, wsConnect, wsDisconnect, wsConnecting, wsOpen, wsClose, wsError, wsMessage } from '../userOrdersSlice';
import { TOrder } from '../../../utils/types';

// Мокаем API
jest.mock('../../../utils/burger-api', () => ({
  getOrdersApi: jest.fn()
}));

describe('userOrdersSlice', () => {
  const initialState = {
    orders: [],
    isLoading: false,
    hasError: false,
    wsConnected: false,
    wsError: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: 'order1',
      number: 12345,
      name: 'My Order 1',
      status: 'done',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      ingredients: ['ing1', 'ing2']
    },
    {
      _id: 'order2',
      number: 12346,
      name: 'My Order 2',
      status: 'pending',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      ingredients: ['ing3', 'ing4']
    }
  ];

  it('should return initial state', () => {
    expect(userOrdersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('reducers', () => {
    it('should handle setUserOrders', () => {
      const action = setUserOrders(mockOrders);
      const newState = userOrdersReducer(initialState, action);
      
      expect(newState.orders).toEqual(mockOrders);
    });

    it('should handle setUserOrdersLoading', () => {
      const action = setUserOrdersLoading(true);
      const newState = userOrdersReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
    });

    it('should handle setUserOrdersError', () => {
      const action = setUserOrdersError(true);
      const newState = userOrdersReducer(initialState, action);
      
      expect(newState.hasError).toBe(true);
    });
  });

  describe('WebSocket reducers', () => {
    it('should handle wsConnect', () => {
      const action = wsConnect('wss://test.com');
      const state = userOrdersReducer(initialState, action);
      expect(state).toEqual(initialState);
    });

    it('should handle wsDisconnect', () => {
      const stateWithConnection = {
        ...initialState,
        wsConnected: true
      };
      
      const action = wsDisconnect();
      const state = userOrdersReducer(stateWithConnection, action);
      
      expect(state.wsConnected).toBe(false);
    });

    it('should handle wsConnecting', () => {
      const action = wsConnecting();
      const state = userOrdersReducer(initialState, action);
      
      expect(state.wsConnected).toBe(false);
    });

    it('should handle wsOpen', () => {
      const action = wsOpen();
      const state = userOrdersReducer(initialState, action);
      
      expect(state.wsConnected).toBe(true);
      expect(state.wsError).toBeNull();
    });

    it('should handle wsClose', () => {
      const stateWithConnection = {
        ...initialState,
        wsConnected: true
      };
      
      const action = wsClose();
      const state = userOrdersReducer(stateWithConnection, action);
      
      expect(state.wsConnected).toBe(false);
    });

    it('should handle wsError', () => {
      const action = wsError('Connection failed');
      const state = userOrdersReducer(initialState, action);
      
      expect(state.wsError).toBe('Connection failed');
    });

    it('should handle wsMessage', () => {
      const action = wsMessage({
        orders: mockOrders,
        total: 100,
        totalToday: 10
      });
      const state = userOrdersReducer(initialState, action);
      
      expect(state.orders).toEqual(mockOrders);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchUserOrders async thunk', () => {
    it('should handle fetchUserOrders.pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = userOrdersReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should handle fetchUserOrders.fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = userOrdersReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
    });

    it('should handle fetchUserOrders.rejected', () => {
      const action = { type: fetchUserOrders.rejected.type };
      const state = userOrdersReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(true);
    });
  });
});
