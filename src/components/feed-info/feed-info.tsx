import { FC } from 'react';
import { useAppSelector } from '../../services/hooks';
import { FeedInfoUI } from '../ui/feed-info';
import { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные из store
  const { orders, total, totalToday } = useAppSelector((s) => s.feed);

  console.log('FeedInfo data:', {
    ordersCount: orders.length,
    total,
    totalToday
  });

  // Исправим получение уникальных статусов
  const uniqueStatuses: string[] = [];
  orders.forEach((order) => {
    if (!uniqueStatuses.includes(order.status)) {
      uniqueStatuses.push(order.status);
    }
  });

  console.log('Уникальные статусы заказов:', uniqueStatuses);

  // Посчитаем заказы по статусам
  const statusCounts: Record<string, number> = {};
  orders.forEach((order) => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });
  console.log('Количество по статусам:', statusCounts);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  console.log('Готовые заказы:', readyOrders.length);
  console.log('Заказы в работе:', pendingOrders.length);

  const feed = {
    total,
    totalToday
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
