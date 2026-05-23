import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Topbar from '../components/layout/Topbar';
import KPICard from '../components/ui/KPICard';
import DateFilter from '../components/ui/DateFilter';
import RevenueChart from '../components/charts/RevenueChart';
import CategoryChart from '../components/charts/CategoryChart';
import ChannelChart from '../components/charts/ChannelChart';
import api from '../services/api';
import { formatCurrency, formatNumber, getDateRange, formatDate } from '../utils/format';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState(getDateRange('30d'));
  const [kpis, setKpis] = useState(null);
  const [trend, setTrend] = useState([]);
  const [categories, setCategories] = useState([]);
  const [channels, setChannels] = useState([]);
  const [activity, setActivity] = useState([]);
  const [geo, setGeo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [kpiRes, trendRes, catRes, chanRes, actRes, geoRes] = await Promise.all([
          api.get('/analytics/kpis', { params: dateRange }),
          api.get('/analytics/revenue-trend', { params: { ...dateRange, groupBy: 'day' } }),
          api.get('/analytics/category-breakdown', { params: dateRange }),
          api.get('/analytics/channel-performance', { params: dateRange }),
          api.get('/analytics/recent-activity'),
          api.get('/analytics/geo-breakdown')
        ]);
        setKpis(kpiRes.data.data);
        setTrend(trendRes.data.data);
        setCategories(catRes.data.data);
        setChannels(chanRes.data.data);
        setActivity(actRes.data.data);
        setGeo(geoRes.data.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [dateRange]);

  const handleExport = async (type) => {
    try {
      const res = await api.get(`/export/${type}`, {
        params: dateRange,
        responseType: 'blob'
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) {
      alert('Export failed');
    }
  };

  return (
    <AppLayout>
      <Topbar title="Dashboard" subtitle="E-Commerce Analytics" />
      <div className="page-content page-enter">

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <DateFilter onChange={setDateRange} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-iq-outline" onClick={() => handleExport('sales')}>
              <i className="bi bi-download"></i> Export CSV
            </button>
            <button className="btn-iq" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="iq-spinner"></div></div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-6 col-xl-3">
                <KPICard
                  icon="bi-currency-dollar"
                  iconBg="rgba(99,179,237,0.12)"
                  iconColor="#63b3ed"
                  label="Total Revenue"
                  value={formatCurrency(kpis?.totalRevenue)}
                  badge={kpis?.revenueGrowth}
                  badgeUp={kpis?.revenueGrowth >= 0}
                />
              </div>
              <div className="col-6 col-xl-3">
                <KPICard
                  icon="bi-graph-up-arrow"
                  iconBg="rgba(72,187,120,0.12)"
                  iconColor="#48bb78"
                  label="Net Profit"
                  value={formatCurrency(kpis?.totalProfit)}
                  badge={kpis?.profitMargin}
                  badgeUp={true}
                />
              </div>
              <div className="col-6 col-xl-3">
                <KPICard
                  icon="bi-bag-check-fill"
                  iconBg="rgba(183,148,244,0.12)"
                  iconColor="#b794f4"
                  label="Total Orders"
                  value={formatNumber(kpis?.totalOrders)}
                  badge={kpis?.ordersGrowth}
                  badgeUp={kpis?.ordersGrowth >= 0}
                />
              </div>
              <div className="col-6 col-xl-3">
                <KPICard
                  icon="bi-people-fill"
                  iconBg="rgba(246,173,85,0.12)"
                  iconColor="#f6ad55"
                  label="Active Users"
                  value={formatNumber(kpis?.activeUsers)}
                />
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-xl-8">
                <div className="iq-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                      <div className="iq-card-title">Revenue Trend</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatCurrency(kpis?.totalRevenue)}
                      </div>
                    </div>
                  </div>
                  <RevenueChart data={trend} />
                </div>
              </div>
              <div className="col-12 col-xl-4">
                <div className="iq-card" style={{ height: '100%' }}>
                  <div className="iq-card-title" style={{ marginBottom: 16 }}>Revenue by Category</div>
                  <CategoryChart data={categories} />
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-lg-5">
                <div className="iq-card">
                  <div className="iq-card-title" style={{ marginBottom: 16 }}>Channel Performance</div>
                  <ChannelChart data={channels} />
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="iq-card">
                  <div className="iq-card-title" style={{ marginBottom: 16 }}>Top Countries</div>
                  {geo.map((item, i) => (
                    <div key={item.country} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      marginBottom: 12, fontSize: 13
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, width: 16 }}>{i + 1}</span>
                      <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{item.country}</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {formatCurrency(item.revenue)}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.orders} orders</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="iq-card">
                  <div className="iq-card-title" style={{ marginBottom: 16 }}>Recent Orders</div>
                  {activity.slice(0, 6).map(sale => (
                    <div key={sale._id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      marginBottom: 14, paddingBottom: 14,
                      borderBottom: '1px solid var(--border)'
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(99,179,237,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <i className="bi bi-bag" style={{ color: 'var(--accent)', fontSize: 13 }}></i>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sale.customer?.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sale.product?.name}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)', flexShrink: 0 }}>
                        ${sale.revenue?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
