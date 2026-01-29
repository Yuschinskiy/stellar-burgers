import { useState, useRef, useEffect, FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import {
  addBun,
  addIngredient
} from '../../services/slices/burgerConstructorSlice';
import { v4 as uuidv4 } from 'uuid';

export const BurgerIngredients: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { ingredients } = useAppSelector((s) => s.ingredients); // исправлено: ingredients вместо items
  const { bun, ingredients: constructorIngredients } = useAppSelector(
    (s) => s.burgerConstructor
  );

  // Фильтруем ингредиенты по типам
  const buns = ingredients.filter((item: TIngredient) => item.type === 'bun');
  const mains = ingredients.filter((item: TIngredient) => item.type === 'main');
  const sauces = ingredients.filter(
    (item: TIngredient) => item.type === 'sauce'
  );

  // Считаем количество каждого ингредиента в конструкторе
  const getIngredientCount = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      return bun && bun._id === ingredient._id ? 2 : 0;
    }

    return constructorIngredients.filter((item) => item._id === ingredient._id)
      .length;
  };

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Обработчик добавления ингредиента
  const handleAddIngredient = (ingredient: TIngredient) => {
    console.log(
      'BurgerIngredients: handleAddIngredient called for',
      ingredient.name
    );

    if (ingredient.type === 'bun') {
      console.log('Adding bun to constructor:', ingredient.name);
      dispatch(addBun(ingredient));
    } else {
      const ingredientWithUuid = {
        ...ingredient,
        uuid: uuidv4()
      };
      console.log(
        'Adding ingredient to constructor:',
        ingredient.name,
        'with uuid:',
        ingredientWithUuid.uuid
      );
      dispatch(addIngredient(ingredientWithUuid));
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      getIngredientCount={getIngredientCount}
      handleAddIngredient={handleAddIngredient}
      locationState={{ background: location }}
    />
  );
};
