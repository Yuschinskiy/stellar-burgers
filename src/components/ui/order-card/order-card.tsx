import React, { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-card.module.css';

import { OrderCardUIProps } from './type';
import { OrderStatus } from '@components';

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients, locationState, onClick }) => {
    const location = useLocation();

    const content = (
      <>
        <div className={styles.order_info}>
          <span className={`text text_type_digits-default ${styles.number}`}>
            #{String(orderInfo.number).padStart(6, '0')}
          </span>
          <span className='text text_type_main-default text_color_inactive'>
            <FormattedDate date={orderInfo.date} />
          </span>
        </div>
        <h4 className={`pt-6 text text_type_main-medium ${styles.order_name}`}>
          {orderInfo.name}
        </h4>
        {location.pathname.includes('/profile/orders') && (
          <OrderStatus status={orderInfo.status || ''} />
        )}
        <div className={`pt-6 ${styles.order_content}`}>
          <ul className={styles.ingredients}>
            {orderInfo.ingredientsToShow.map((ingredient, index) => {
              let zIndex = maxIngredients - index;
              let right = 20 * index;

              // Ключевое исправление: проверяем, нужно ли показывать счетчик
              const isLastItem = index === maxIngredients - 1;
              const shouldShowRemains = orderInfo.remains > 0 && isLastItem;

              return (
                <li
                  className={styles.img_wrap}
                  style={{ zIndex: zIndex, right: right }}
                  key={index}
                >
                  <img
                    className={styles.img}
                    src={ingredient.image_mobile}
                    alt={ingredient.name}
                    style={{
                      opacity: shouldShowRemains ? '0.5' : '1'
                    }}
                  />
                  {/* Только если есть скрытые ингредиенты, показываем счетчик */}
                  {shouldShowRemains && (
                    <span
                      className={`text text_type_digits-default ${styles.remains}`}
                    >
                      +{orderInfo.remains}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div>
            <span
              className={`text text_type_digits-default pr-1 ${styles.order_total}`}
            >
              {orderInfo.total}
            </span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
      </>
    );

    if (onClick) {
      return (
        <div
          className={`p-6 mb-4 mr-2 ${styles.order} ${styles.clickable}`}
          onClick={onClick}
          style={{ cursor: 'pointer' }}
        >
          {content}
        </div>
      );
    }

    return (
      <Link
        to={orderInfo.number.toString()}
        relative='path'
        state={locationState}
        className={`p-6 mb-4 mr-2 ${styles.order}`}
      >
        {content}
      </Link>
    );
  }
);
