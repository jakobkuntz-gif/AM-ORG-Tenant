import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MarketingModal } from './MarketingModal';

const meta = {
  title: 'Marketing/MarketingModal',
  component: MarketingModal,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: '#e8ecef', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MarketingModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function WelcomeStateful() {
  const [open, setOpen] = useState(true);
  return (
    <MarketingModal
      variant="welcome"
      open={open}
      onClose={() => setOpen(false)}
      onLater={() => setOpen(false)}
    />
  );
}

function LeadStateful() {
  const [open, setOpen] = useState(true);
  return (
    <MarketingModal
      variant="lead"
      open={open}
      onClose={() => setOpen(false)}
      onLater={() => setOpen(false)}
    />
  );
}

export const WelcomeVideo: Story = {
  render: () => <WelcomeStateful />,
};

export const LeadGeneration: Story = {
  render: () => <LeadStateful />,
};
