import { FeedInfoUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/FeedInfo',
  component: FeedInfoUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FeedInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultFeedInfo: Story = {
  args: {
    // Правильные пропсы согласно FeedInfoUIProps
    readyOrders: [12345, 12346, 12347, 12348, 12349],
    pendingOrders: [12350, 12351, 12352],
    feed: {
      total: 12345,
      totalToday: 123
      // УБРАТЬ orders - его нет в типе!
    }
  }
};
