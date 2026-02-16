import { ingredientsReducer, getIngredients } from '../ingredientsSlice';
import type { IIngredientsState } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

// Мокаем API
jest.mock('../../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

import { getIngredientsApi } from '../../../utils/burger-api';
const mockGetIngredientsApi = getIngredientsApi as jest.MockedFunction<
  typeof getIngredientsApi
>;

describe('ingredientsSlice', () => {
  const initialState: IIngredientsState = {
    ingredients: [],
    isLoading: false,
    hasError: false
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'bun.jpg',
      image_large: 'bun-large.jpg',
      image_mobile: 'bun-mobile.jpg'
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main',
      proteins: 20,
      fat: 20,
      carbohydrates: 5,
      calories: 200,
      price: 200,
      image: 'cutlet.jpg',
      image_large: 'cutlet-large.jpg',
      image_mobile: 'cutlet-mobile.jpg'
    }
  ];

  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('getIngredients async thunk', () => {
    describe('pending', () => {
      it('should set isLoading to true and hasError to false', () => {
        const action = { type: getIngredients.pending.type };
        const state = ingredientsReducer(initialState, action);

        expect(state.isLoading).toBe(true);
        expect(state.hasError).toBe(false);
        expect(state.ingredients).toEqual([]);
      });

      it('should set isLoading to true while keeping existing ingredients', () => {
        const stateWithIngredients = {
          ...initialState,
          ingredients: mockIngredients
        };

        const action = { type: getIngredients.pending.type };
        const state = ingredientsReducer(stateWithIngredients, action);

        expect(state.isLoading).toBe(true);
        expect(state.hasError).toBe(false);
        expect(state.ingredients).toEqual(mockIngredients); // данные пока сохраняются
      });
    });

    describe('fulfilled', () => {
      it('should set ingredients, isLoading to false, hasError to false', () => {
        const action = {
          type: getIngredients.fulfilled.type,
          payload: mockIngredients
        };
        const state = ingredientsReducer(initialState, action);

        expect(state.isLoading).toBe(false);
        expect(state.hasError).toBe(false);
        expect(state.ingredients).toEqual(mockIngredients);
        expect(state.ingredients).toHaveLength(2);
      });

      it('should replace existing ingredients with new ones', () => {
        const stateWithIngredients = {
          ...initialState,
          ingredients: [{ ...mockIngredients[0], _id: 'old' }]
        };

        const action = {
          type: getIngredients.fulfilled.type,
          payload: mockIngredients
        };
        const state = ingredientsReducer(stateWithIngredients, action);

        expect(state.ingredients).toEqual(mockIngredients);
        expect(state.ingredients[0]._id).toBe('1');
      });
    });

    describe('rejected', () => {
      it('should set hasError to true, isLoading to false', () => {
        const action = {
          type: getIngredients.rejected.type,
          error: { message: 'Failed to fetch' }
        };
        const state = ingredientsReducer(initialState, action);

        expect(state.isLoading).toBe(false);
        expect(state.hasError).toBe(true);
        expect(state.ingredients).toEqual([]);
      });

      it('should set hasError to true and keep existing ingredients', () => {
        const stateWithIngredients = {
          ...initialState,
          ingredients: mockIngredients
        };

        const action = {
          type: getIngredients.rejected.type,
          error: { message: 'Failed to fetch' }
        };
        const state = ingredientsReducer(stateWithIngredients, action);

        expect(state.isLoading).toBe(false);
        expect(state.hasError).toBe(true);
        expect(state.ingredients).toEqual(mockIngredients); // старые данные сохраняются
      });

      it('should set hasError to true even without error object', () => {
        const action = { type: getIngredients.rejected.type };
        const state = ingredientsReducer(initialState, action);

        expect(state.isLoading).toBe(false);
        expect(state.hasError).toBe(true);
      });
    });
  });
});
