import type { Middleware, MiddlewareAPI } from 'redux';
import type { AppDispatch, RootState } from '../store';
import { TOrdersData } from '../../utils/types';

type TWsActionTypes = {
  wsConnect: string;
  wsDisconnect: string;
  wsConnecting: string;
  wsOpen: string;
  wsClose: string;
  wsError: string;
  wsMessage: string;
};

export const socketMiddleware = (wsActions: TWsActionTypes): Middleware =>
  ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;
    let isConnected = false;
    let reconnectTimer = 0;
    let url = '';

    return (next) => (action: any) => {
      // используем any для action
      const { dispatch } = store;
      const { type, payload } = action;

      if (type === wsActions.wsConnect) {
        console.log('WebSocket: Connecting...');
        url = payload;
        socket = new WebSocket(url);
        isConnected = true;
        dispatch({ type: wsActions.wsConnecting });

        socket.onopen = () => {
          console.log('WebSocket: Connected');
          dispatch({ type: wsActions.wsOpen });
        };

        socket.onerror = (error) => {
          console.error('WebSocket: Error', error);
          dispatch({ type: wsActions.wsError, payload: 'WebSocket error' });
        };

        socket.onclose = (event) => {
          console.log('WebSocket: Closed', event.code, event.reason);
          dispatch({ type: wsActions.wsClose });

          if (isConnected) {
            console.log('WebSocket: Reconnecting...');
            reconnectTimer = window.setTimeout(() => {
              dispatch({ type: wsActions.wsConnect, payload: url });
            }, 3000);
          }
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.success) {
              dispatch({ type: wsActions.wsMessage, payload: data });
            } else {
              dispatch({
                type: wsActions.wsError,
                payload: data.message || 'WebSocket message error'
              });
            }
          } catch (error) {
            console.error('WebSocket: Parse error', error);
            dispatch({
              type: wsActions.wsError,
              payload: 'Message parsing error'
            });
          }
        };
      }

      if (type === wsActions.wsDisconnect && socket) {
        console.log('WebSocket: Disconnecting...');
        clearTimeout(reconnectTimer);
        isConnected = false;
        reconnectTimer = 0;
        socket.close();
        socket = null;
      }

      next(action);
    };
  }) as Middleware;
