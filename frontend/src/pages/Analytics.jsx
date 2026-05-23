import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Topbar from '../components/layout/Topbar';
import DateFilter from '../components/ui/DateFilter';
import RevenueChart from '../components/charts/RevenueChart';
import CategoryChart from '../components/charts/CategoryChart';
import ChannelChart from '../components/charts/ChannelChart';
import api from '../services/api';
import { formatCurrency, formatNumber, getDateRange } from '../utils/format';

export default function Analytics() {
  const [dateRange, setDateRange] = useState(getDateRange('90d'));
  const [groupBy, setGroupBy] = useState('day');
  const [trend, setTrend] = useState([]);
  const [categories, setCategories] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [t, c, ch] = await Promise.all([
          api.get('/analytics/revenue-trend', { params: { ...dateRange, groupBy } }),
          api.get('/analytics/category-breakdown', { params: dateRange }),
          api.get('/analytics/channel-performance', { params: dateRange })
        ]);
        setTrend(t.data.data);
        setCategories(c.data.data);
        setChannels(ch.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [dateRange, groupBy]);

  const handleExport = async () => {
    try {
      const res = await api.get('/export/analytics', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_summary_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch { alert('Export failed'); }
  };

  const totalRevenue = categories.reduce((s, c) => s + c.revenue, 0);
  const totalOrders = categories.reduce((s, c) => s + c.orders, 0);
  const totalProfit = categories.reduce((s, c) => s + c.profit, 0);

  return (
    <AppLayout>
      <Topbar title="Analytics" subtitle="Deep Dive" />
      <div className="page-content page-enter">

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          <DateFilter onChange={setDateRange} />
          <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 9, overflow: 'hidden' }}>
            {['day', 'month'].map(g => (
              <button key={g} onClick={() => setGroupBy(g)} style={{
                padding: '7px 16px', border: 'none',
                background: groupBy === g ? 'var(--accent-glow)' : 'transparent',
                color: groupBy === g ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                textTransform: 'capitalize', borderRight: g === 'day' ? '1px solid var(--border)' : 'none'
              }}>
                {g === 'day' ? 'Daily' : 'Monthly'}
              </button>
            ))}
          </div>
          <button className="btn-iq-outline" onClick={handleExport} style={{ marginLeft: 'auto' }}>
            <i className="bi bi-download"></i> Export Summary
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><div className="iq-spinner"></div></div>
        ) : (
          <>
            {/* Summary row */}
            <div className="row g-3 mb-3">
              {[
                { label: 'Period Revenue', value: formatCurrency(totalRevenue), icon: 'bi-currency-dollar', color: '#63b3ed' },
                { label: 'Period Profit', value: formatCurrency(totalProfit), icon: 'bi-trending-up', color: '#48bb78' },
                { label: 'Total Orders', value: formatNumber(totalOrders), icon: 'bi-cart-check', color: '#b794f4' },
                { label: 'Avg Order Value', value: formatCurrency(totalRevenue / (totalOrders || 1)), icon: 'bi-calculator', color: '#f6ad55' }
              ].map(stat => (
                <div key={stat.label} className="col-6 col-md-3">
                  <div className="iq-card" style={{ textAlign: 'center' }}>
                    <i className={`bi ${stat.icon}`} style={{ fontSize: 22, color: stat.color, marginBottom: 8, display: 'block' }}></i>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue Trend */}
            <div className="iq-card mb-3">
              <div className="iq-card-title" style={{ marginBottom: 16 }}>
                Revenue & Profit Trend ({groupBy === 'day' ? 'Daily' : 'Monthly'})
              </div>
              <RevenueChart data={trend} />
            </div>

            {/* Category & Channel */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-lg-6">
                <div className="iq-card">
                  <div className="iq-card-title" style={{ marginBottom: 16 }}>Category Breakdown</div>
                  <CategoryChart data={categories} />
                  {/* Detail table */}
                  <div style={{ marginTop: 20 }}>
                    <table className="iq-table">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Revenue</th>
                          <th>Orders</th>
                          <th>Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(cat => (
                          <tr key={cat.category}>
                            <td><strong>{cat.category}</strong></td>
                            <td style={{ color: 'var(--accent-green)' }}>{formatCurrency(cat.revenue)}</td>
                            <td>{cat.orders}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2 }}>
                                  <div style={{ width: `${cat.percentage}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>{cat.percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="iq-card">
                  <div className="iq-card-title" style={{ marginBottom: 16 }}>Channel Performance</div>
                  <ChannelChart data={channels} />
                  <div style={{ marginTop: 20 }}>
                    <table className="iq-table">
                      <thead>
                        <tr>
                          <th>Channel</th>
                          <th>Revenue</th>
                          <th>Orders</th>
                          <th>Avg Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channels.map(ch => (
                          <tr key={ch.channel}>
                            <td><strong style={{ textTransform: 'capitalize' }}>{ch.channel?.replace('_', ' ')}</strong></td>
                            <td style={{ color: 'var(--accent-green)' }}>{formatCurrency(ch.revenue)}</td>
                            <td>{ch.orders}</td>
                            <td>{formatCurrency(ch.avgOrderValue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
