import { TIngredient, TConstructorIngredient } from '@utils-types'; // Добавляем импорт

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: { number: number } | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  handleRemoveIngredient?: (index: number) => void;
};
