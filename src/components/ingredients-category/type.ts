import { RefObject } from 'react';
import { TIngredient } from '@utils-types';

export type TIngredientsCategoryProps = {
  title: string;
  titleRef: RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  getIngredientCount?: (ingredient: TIngredient) => number;
  handleAddIngredient?: (ingredient: TIngredient) => void;
  locationState?: any;
};
