import { FC, memo } from 'react';
import styles from './feed.module.css';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

export const FeedUI: FC<FeedUIProps> = memo(({ orders, handleGetFeeds }) => {
  console.log('🔄 FeedUI rendering with orders:', orders.length);
  console.log('🔄 handleGetFeeds function exists:', !!handleGetFeeds);

  const handleRefreshClick = () => {
    console.log('🔄 Refresh button clicked!');
    console.log('🔄 handleGetFeeds:', handleGetFeeds);
    if (handleGetFeeds) {
      console.log('🔄 Calling handleGetFeeds...');
      handleGetFeeds();
    } else {
      console.error('🔄 handleGetFeeds is undefined!');
    }
  };

  if (orders.length === 0) {
    return (
      <main className={styles.containerMain}>
        <div className={`${styles.titleBox} mt-10 mb-5`}>
          <h1 className={`${styles.title} text text_type_main-large`}>
            Лента заказов
          </h1>
          <RefreshButton
            text='Обновить'
            onClick={handleRefreshClick} // Используем обертку
            extraClass={'ml-30'}
          />
        </div>
        <div className={`${styles.main} text-center`}>
          <p className='text text_type_main-default mt-20'>
            Заказов пока нет. Будьте первым!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <div className={`${styles.titleBox} mt-10 mb-5`}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          Лента заказов
        </h1>
        <RefreshButton
          text='Обновить'
          onClick={handleRefreshClick} // Используем обертку
          extraClass={'ml-30'}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.columnOrders}>
          <OrdersList orders={orders} />
        </div>
        <div className={styles.columnInfo}>
          <FeedInfo />
        </div>
      </div>
    </main>
  );
});
