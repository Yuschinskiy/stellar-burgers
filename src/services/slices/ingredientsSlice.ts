import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

interface IIngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  hasError: boolean;
}

const initialState: IIngredientsState = {
  items: [],
  isLoading: false,
  hasError: false
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    console.log('Fetching ingredients from API...');
    try {
      const data = await getIngredientsApi();
      console.log('Ingredients fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
