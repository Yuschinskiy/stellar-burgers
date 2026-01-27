import { forwardRef } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerIngredientUI } from '@ui'; // Правильный импорт из @ui
import { TIngredientsCategoryProps } from './type';

// Временное решение - inline стили вместо CSS файла
const styles = {
  items: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    listStyle: 'none',
    margin: 0,
    padding: 0
  }
};

export const IngredientsCategory = forwardRef<
  HTMLDivElement,
  TIngredientsCategoryProps
>(
  (
    {
      title,
      titleRef,
      ingredients,
      getIngredientCount,
      handleAddIngredient,
      locationState
    },
    ref
  ) => (
    <div ref={ref}>
      <h2 className='text text_type_main-medium mb-6' ref={titleRef}>
        {title}
      </h2>
      <ul className='pl-4' style={styles.items}>
        {ingredients.map((ingredient) => (
          <BurgerIngredientUI
            key={ingredient._id}
            ingredient={ingredient}
            count={getIngredientCount ? getIngredientCount(ingredient) : 0}
            handleAdd={
              handleAddIngredient
                ? () => handleAddIngredient(ingredient)
                : undefined
            }
            locationState={locationState}
          />
        ))}
      </ul>
    </div>
  )
);
