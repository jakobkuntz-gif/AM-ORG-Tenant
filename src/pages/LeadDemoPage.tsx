import { useState } from 'react';
import { MarketingModal } from '../components/MarketingModal/MarketingModal';

export function LeadDemoPage() {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {!open && (
        <button type="button" onClick={() => setOpen(true)}>
          Modal erneut öffnen
        </button>
      )}
      <MarketingModal
        variant="lead"
        open={open}
        onClose={() => setOpen(false)}
        onPrimary={() => {
          // click-dummy
          console.info('Kostenlos testen');
        }}
        onLater={() => setOpen(false)}
      />
    </div>
  );
}
