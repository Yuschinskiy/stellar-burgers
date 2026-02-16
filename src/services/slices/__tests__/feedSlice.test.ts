import { feedReducer, fetchFeeds, wsConnect, wsDisconnect, wsConnecting, wsOpen, wsClose, wsError, wsMessage } from '../feedSlice';
import { TOrder } from '../../../utils/types';

// Мокаем API
jest.mock('../../../utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    hasError: false,
    wsConnected: false,
    wsError: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: 'order1',
      number: 12345,
      name: 'Order 1',
      status: 'done',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      ingredients: ['ing1', 'ing2']
    },
    {
      _id: 'order2',
      number: 12346,
      name: 'Order 2',
      status: 'pending',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      ingredients: ['ing3', 'ing4']
    }
  ];

  it('should return initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('WebSocket reducers', () => {
    it('should handle wsConnect', () => {
      const action = wsConnect('wss://test.com');
      const state = feedReducer(initialState, action);
      // wsConnect не меняет состояние, только передает URL в middleware
      expect(state).toEqual(initialState);
    });

    it('should handle wsDisconnect', () => {
      const stateWithConnection = {
        ...initialState,
        wsConnected: true
      };
      
      const action = wsDisconnect();
      const state = feedReducer(stateWithConnection, action);
      
      expect(state.wsConnected).toBe(false);
    });

    it('should handle wsConnecting', () => {
      const action = wsConnecting();
      const state = feedReducer(initialState, action);
      
      expect(state.wsConnected).toBe(false);
    });

    it('should handle wsOpen', () => {
      const action = wsOpen();
      const state = feedReducer(initialState, action);
      
      expect(state.wsConnected).toBe(true);
      expect(state.wsError).toBeNull();
    });

    it('should handle wsClose', () => {
      const stateWithConnection = {
        ...initialState,
        wsConnected: true
      };
      
      const action = wsClose();
      const state = feedReducer(stateWithConnection, action);
      
      expect(state.wsConnected).toBe(false);
    });

    it('should handle wsError', () => {
      const action = wsError('Connection failed');
      const state = feedReducer(initialState, action);
      
      expect(state.wsError).toBe('Connection failed');
    });

    it('should handle wsMessage', () => {
      const action = wsMessage({
        orders: mockOrders,
        total: 100,
        totalToday: 10
      });
      const state = feedReducer(initialState, action);
      
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchFeeds async thunk', () => {
    it('should handle fetchFeeds.pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should handle fetchFeeds.fulfilled', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: {
          orders: mockOrders,
          total: 100,
          totalToday: 10
        }
      };
      const state = feedReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });

    it('should handle fetchFeeds.rejected', () => {
      const action = { type: fetchFeeds.rejected.type };
      const state = feedReducer(initialState, action);
      
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(true);
    });
  });
});
