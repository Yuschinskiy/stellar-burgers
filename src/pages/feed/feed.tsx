import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((s) => s.feed);

  console.log('Feed component:', { ordersCount: orders.length, isLoading });

  useEffect(() => {
    console.log('Feed: fetching feeds...');
    dispatch(fetchFeeds());
  }, [dispatch]);

  // Если загружается и нет заказов, показываем прелоадер
  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    console.log('Refreshing feeds...');
    dispatch(fetchFeeds());
  };

  // УБЕДИТЕСЬ ЧТО ЕСТЬ return!
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
