import {
  burgerConstructorReducer,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../burgerConstructorSlice';
import type { IBurgerConstructorState } from '../burgerConstructorSlice';
import { TIngredient } from '../../../utils/types';

// Мокаем uuid, чтобы он был предсказуемым в тестах
jest.mock('uuid', () => ({
  v4: () => 'unique-id-123'
}));

describe('burgerConstructorSlice', () => {
  const mockBun: TIngredient = {
    _id: 'bun-1',
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
  };

  const mockIngredient1: TIngredient = {
    _id: 'ing-1',
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
  };

  const mockIngredient2: TIngredient = {
    _id: 'ing-2',
    name: 'Сыр',
    type: 'main',
    proteins: 15,
    fat: 25,
    carbohydrates: 2,
    calories: 150,
    price: 150,
    image: 'cheese.jpg',
    image_large: 'cheese-large.jpg',
    image_mobile: 'cheese-mobile.jpg'
  };

  const mockSauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Кетчуп',
    type: 'sauce',
    proteins: 5,
    fat: 5,
    carbohydrates: 10,
    calories: 50,
    price: 50,
    image: 'ketchup.jpg',
    image_large: 'ketchup-large.jpg',
    image_mobile: 'ketchup-mobile.jpg'
  };

  const initialState: IBurgerConstructorState = {
    bun: null,
    ingredients: []
  };

  it('should return initial state', () => {
    expect(burgerConstructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addBun', () => {
    it('should add bun to state', () => {
      const action = addBun(mockBun);
      const newState = burgerConstructorReducer(initialState, action);

      expect(newState.bun).toEqual(mockBun);
      expect(newState.ingredients).toEqual([]);
    });

    it('should replace existing bun with new bun', () => {
      const stateWithBun = { ...initialState, bun: mockBun };
      const newBun = { ...mockBun, _id: 'bun-2', name: 'Новая булка' };

      const action = addBun(newBun);
      const newState = burgerConstructorReducer(stateWithBun, action);

      expect(newState.bun).toEqual(newBun);
      expect(newState.bun?._id).toBe('bun-2');
    });
  });

  describe('addIngredient', () => {
    it('should add ingredient to ingredients array', () => {
      const action = addIngredient(mockIngredient1);
      const newState = burgerConstructorReducer(initialState, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(mockIngredient1);
    });

    it('should add multiple ingredients to array', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockIngredient1)
      );
      state = burgerConstructorReducer(state, addIngredient(mockIngredient2));
      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]).toEqual(mockIngredient1);
      expect(state.ingredients[1]).toEqual(mockIngredient2);
      expect(state.ingredients[2]).toEqual(mockSauce);
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by index', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient1, mockIngredient2, mockSauce]
      };

      const action = removeIngredient(1); // удаляем второй элемент (индекс 1)
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0]).toEqual(mockIngredient1);
      expect(newState.ingredients[1]).toEqual(mockSauce);
    });

    it('should remove first ingredient', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      const action = removeIngredient(0);
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(mockIngredient2);
    });

    it('should remove last ingredient', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      const action = removeIngredient(1);
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(mockIngredient1);
    });

    it('should not remove anything if index out of bounds', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      const action = removeIngredient(5);
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients).toEqual(stateWithIngredients.ingredients);
    });
  });

  describe('moveIngredient', () => {
    it('should move ingredient from dragIndex to hoverIndex (downward move)', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient1, mockIngredient2, mockSauce]
      };

      // Перемещаем элемент с индекса 0 на индекс 2 (вниз)
      const action = moveIngredient({ dragIndex: 0, hoverIndex: 2 });
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0]).toEqual(mockIngredient2);
      expect(newState.ingredients[1]).toEqual(mockSauce);
      expect(newState.ingredients[2]).toEqual(mockIngredient1);
    });

    it('should move ingredient from dragIndex to hoverIndex (upward move)', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient1, mockIngredient2, mockSauce]
      };

      // Перемещаем элемент с индекса 2 на индекс 0 (вверх)
      const action = moveIngredient({ dragIndex: 2, hoverIndex: 0 });
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0]).toEqual(mockSauce);
      expect(newState.ingredients[1]).toEqual(mockIngredient1);
      expect(newState.ingredients[2]).toEqual(mockIngredient2);
    });

    it('should move ingredient to adjacent position', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient1, mockIngredient2, mockSauce]
      };

      // Перемещаем элемент с индекса 0 на индекс 1
      const action = moveIngredient({ dragIndex: 0, hoverIndex: 1 });
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients[0]).toEqual(mockIngredient2);
      expect(newState.ingredients[1]).toEqual(mockIngredient1);
      expect(newState.ingredients[2]).toEqual(mockSauce);
    });

    it('should not change array if dragIndex equals hoverIndex', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredient1, mockIngredient2, mockSauce]
      };

      const action = moveIngredient({ dragIndex: 1, hoverIndex: 1 });
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(3);
      expect(newState.ingredients).toEqual(stateWithIngredients.ingredients);
    });
  });

  describe('clearConstructor', () => {
    it('should clear bun and ingredients', () => {
      const stateWithItems = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockSauce]
      };

      const action = clearConstructor();
      const newState = burgerConstructorReducer(stateWithItems, action);

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(0);
      expect(newState.ingredients).toEqual([]);
    });
  });
});
