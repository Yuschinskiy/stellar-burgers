import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday, isLoading } = useAppSelector(
    (s) => s.feed
  );

  console.log('Feed component state:', {
    orders: orders.length,
    total,
    totalToday,
    isLoading
  });

  useEffect(() => {
    console.log('Feed: fetching feeds...');
    dispatch(fetchFeeds());

    // Периодическое обновление (вместо WebSocket)
    const interval = setInterval(() => {
      console.log('Feed: refreshing feeds...');
      dispatch(fetchFeeds());
    }, 5000); // Обновлять каждые 5 секунд

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    console.log('Refreshing feeds...');
    dispatch(fetchFeeds());
  };

  console.log('Feed: rendering with', orders.length, 'orders');

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
