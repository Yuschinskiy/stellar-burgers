import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems, handleClose }) => {
    const handleMoveDown = () => {
      console.log('Move down:', index);
    };

    const handleMoveUp = () => {
      console.log('Move up:', index);
    };

    // Создаем функцию по умолчанию если handleClose не передан
    const onClose =
      handleClose ||
      (() => {
        console.log('Default close handler for index:', index);
      });

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={onClose} // Всегда передаем функцию
      />
    );
  }
);
