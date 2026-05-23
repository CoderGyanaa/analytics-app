import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Topbar from '../components/layout/Topbar';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Food'];
const STATUSES = ['', 'completed', 'pending', 'refunded', 'cancelled'];
const CHANNELS = ['', 'organic', 'paid_search', 'social', 'email', 'direct', 'referral'];

export default function Sales() {
  const { isAnalyst, isAdmin } = useAuth();
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '', category: '', channel: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/sales', { params: { ...filters, page, limit: 20 } });
      setSales(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const handleFilterChange = (key, val) => {
    setFilters(p => ({ ...p, [key]: val }));
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sale?')) return;
    try {
      await api.delete(`/sales/${id}`);
      fetchSales();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/export/sales', { params: filters, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch { alert('Export failed'); }
  };

  const statusClass = { completed: 'badge-completed', pending: 'badge-pending', refunded: 'badge-refunded', cancelled: 'badge-cancelled' };

  return (
    <AppLayout>
      <Topbar title="Sales" subtitle={`${pagination.total.toLocaleString()} records`} />
      <div className="page-content page-enter">

        {/* Filters */}
        <div className="iq-card mb-3">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-4">
              <div style={{ position: 'relative' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }}></i>
                <input
                  className="iq-input"
                  style={{ paddingLeft: 34 }}
                  placeholder="Search orders, customers, products..."
                  value={filters.search}
                  onChange={e => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
            <div className="col-6 col-md-2">
              <select className="iq-select" style={{ width: '100%' }} value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s || 'All Status'}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="iq-select" style={{ width: '100%' }} value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="iq-select" style={{ width: '100%' }} value={filters.channel} onChange={e => handleFilterChange('channel', e.target.value)}>
                {CHANNELS.map(ch => <option key={ch} value={ch}>{ch ? ch.replace('_', ' ') : 'All Channels'}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <button className="btn-iq-outline" style={{ width: '100%' }} onClick={handleExport}>
                <i className="bi bi-download"></i> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="iq-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 48 }}><div className="iq-spinner"></div></div>
            ) : (
              <table className="iq-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Revenue</th>
                    <th>Profit</th>
                    <th>Status</th>
                    <th>Channel</th>
                    <th>Date</th>
                    {isAdmin && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      No sales found
                    </td></tr>
                  ) : sales.map(sale => (
                    <tr key={sale._id}>
                      <td><span className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{sale.orderId}</span></td>
                      <td>
                        <strong>{sale.customer?.name}</strong>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sale.customer?.country}</div>
                      </td>
                      <td style={{ maxWidth: 160 }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                          {sale.product?.name}
                        </div>
                      </td>
                      <td><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sale.product?.category}</span></td>
                      <td><strong style={{ color: 'var(--accent-green)' }}>{formatCurrency(sale.revenue)}</strong></td>
                      <td style={{ color: sale.profit >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {formatCurrency(sale.profit)}
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass[sale.status] || ''}`}>
                          {sale.status}
                        </span>
                      </td>
                      <td><span style={{ fontSize: 12, textTransform: 'capitalize' }}>{sale.channel?.replace('_', ' ')}</span></td>
                      <td style={{ fontSize: 12 }}>{formatDate(sale.date)}</td>
                      {isAdmin && (
                        <td>
                          <button
                            onClick={() => handleDelete(sale._id)}
                            style={{ background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.2)', color: '#fc8181', borderRadius: 7, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Page {pagination.page} of {pagination.pages} · {pagination.total.toLocaleString()} total
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="btn-iq-outline"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <i className="bi bi-chevron-left"></i> Prev
                </button>
                <button
                  className="btn-iq-outline"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                >
                  Next <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
