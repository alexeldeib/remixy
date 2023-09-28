import type { Meta, StoryObj } from '@storybook/react';

import Signup from '../app/api/signup/page';

const meta = {
  title: 'Signup',
  argTypes: {},
  component: Signup,
  tags: ['autodocs'],
} satisfies Meta<typeof Signup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleOne: Story = {};

  