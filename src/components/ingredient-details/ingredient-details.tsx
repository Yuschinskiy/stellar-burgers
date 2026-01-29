import { FC } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/hooks';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const background = location.state?.background;

  const { ingredients } = useAppSelector((state) => state.ingredients);
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return background ? null : <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
