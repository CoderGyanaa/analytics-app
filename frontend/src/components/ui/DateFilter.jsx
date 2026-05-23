import { useState } from 'react';
import { getDateRange } from '../../utils/format';

const PRESETS = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '1Y', value: '1y' },
];

export default function DateFilter({ onChange }) {
  const [active, setActive] = useState('30d');
  const [custom, setCustom] = useState({ startDate: '', endDate: '' });
  const [showCustom, setShowCustom] = useState(false);

  const handlePreset = (preset) => {
    setActive(preset);
    setShowCustom(false);
    onChange(getDateRange(preset));
  };

  const handleCustomApply = () => {
    if (custom.startDate && custom.endDate) {
      setActive('custom');
      onChange(custom);
      setShowCustom(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <div style={{
        display: 'flex',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 9,
        overflow: 'hidden'
      }}>
        {PRESETS.map(p => (
          <button
            key={p.value}
            onClick={() => handlePreset(p.value)}
            style={{
              padding: '7px 14px',
              border: 'none',
              background: active === p.value ? 'var(--accent-glow)' : 'transparent',
              color: active === p.value ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              borderRight: '1px solid var(--border)',
              fontFamily: 'inherit',
              transition: 'all 0.15s'
            }}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          style={{
            padding: '7px 14px',
            border: 'none',
            background: active === 'custom' ? 'var(--accent-glow)' : 'transparent',
            color: active === 'custom' ? 'var(--accent)' : 'var(--text-secondary)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          <i className="bi bi-calendar3"></i>
          Custom
        </button>
      </div>

      {showCustom && (
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 9,
          padding: '6px 10px'
        }}>
          <input
            type="date"
            className="iq-input"
            style={{ width: 140, padding: '5px 10px' }}
            value={custom.startDate}
            onChange={e => setCustom(p => ({ ...p, startDate: e.target.value }))}
          />
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <input
            type="date"
            className="iq-input"
            style={{ width: 140, padding: '5px 10px' }}
            value={custom.endDate}
            onChange={e => setCustom(p => ({ ...p, endDate: e.target.value }))}
          />
          <button className="btn-iq" style={{ padding: '6px 14px', fontSize: 12 }} onClick={handleCustomApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
