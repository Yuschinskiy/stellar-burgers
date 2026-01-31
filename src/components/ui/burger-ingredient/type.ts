import { TIngredient, TLocationState } from '@utils-types';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count: number;
  locationState?: TLocationState;
  handleAdd?: () => void;
};
