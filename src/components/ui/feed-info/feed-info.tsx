import { FC, memo } from 'react';

import styles from './feed-info.module.css';

import { FeedInfoUIProps } from './type';

export const FeedInfoUI: FC<FeedInfoUIProps> = memo(
  ({ readyOrders, pendingOrders, feed }) => {
    console.log('FeedInfoUI rendering with:', {
      readyOrdersCount: readyOrders.length,
      pendingOrdersCount: pendingOrders.length,
      feed
    });

    return (
      <div className={styles.content}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={`${styles.title} text text_type_main-medium mb-6`}>
              Готовы:
            </h3>
            <ul className={`${styles.list} ${styles.list_ready}`}>
              {readyOrders.map((number) => (
                <li
                  key={number}
                  className={`${styles.list_item} text text_type_digits-default`}
                >
                  {number}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={`${styles.title} text text_type_main-medium mb-6`}>
              В работе:
            </h3>
            <ul className={styles.list}>
              {pendingOrders.map((number) => (
                <li
                  key={number}
                  className={`${styles.list_item} text text_type_digits-default`}
                >
                  {number}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`${styles.total} mt-15`}>
          <h3 className='text text_type_main-medium'>
            Выполнено за все время:
          </h3>
          <p className={`${styles.total_text} text text_type_digits-large`}>
            {feed.total.toLocaleString()}
          </p>
        </div>
        <div className={`${styles.total} mt-15`}>
          <h3 className='text text_type_main-medium'>Выполнено за сегодня:</h3>
          <p className={`${styles.total_text} text text_type_digits-large`}>
            {feed.totalToday.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
);
