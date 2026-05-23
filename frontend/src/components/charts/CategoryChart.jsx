import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CHART_COLORS, formatCurrency } from '../../utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ data = [] }) {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [{
      data: data.map(d => d.revenue),
      backgroundColor: CHART_COLORS.map(c => c + '99'),
      borderColor: CHART_COLORS,
      borderWidth: 2,
      hoverOffset: 8
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#131929',
        borderColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        titleColor: '#f0f4ff',
        bodyColor: '#8892aa',
        padding: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed)}`
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: 180, height: 180, flexShrink: 0 }}>
        <Doughnut data={chartData} options={options} />
      </div>
      <div style={{ flex: 1 }}>
        {data.slice(0, 6).map((item, i) => (
          <div key={item.category} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 10, fontSize: 13
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: CHART_COLORS[i], flexShrink: 0
            }} />
            <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{item.category}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
