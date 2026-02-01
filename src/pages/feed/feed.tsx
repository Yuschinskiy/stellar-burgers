import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday, isLoading, hasError } = useAppSelector(
    (s) => s.feed
  );

  console.log('🟠 Feed component state:', {
    orders: orders.length,
    total,
    totalToday,
    isLoading,
    hasError
  });

  useEffect(() => {
    console.log('🟠 Feed: Fetching feeds via HTTP...');
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleRefresh = () => {
    console.log('🔄 MANUAL REFRESH: Manual refresh requested');
    dispatch(fetchFeeds());
  };

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  if (hasError) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Ошибка загрузки ленты заказов</h2>
        <button onClick={handleRefresh}>Попробовать снова</button>
      </div>
    );
  }

  console.log('🟠 Feed: rendering with', orders.length, 'orders');
  console.log('🟠 Passing handleRefresh to FeedUI:', !!handleRefresh);

  return <FeedUI orders={orders} handleGetFeeds={handleRefresh} />;
};
