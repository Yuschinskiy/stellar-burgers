import { TIngredient, TConstructorIngredient } from '@utils-types';

export type BurgerConstructorUIProps = {
  price: number;
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: { number: number } | null; // добавьте этот тип
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
