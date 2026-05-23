import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend
} from 'chart.js';
import { CHART_COLORS } from '../../utils/format';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ChannelChart({ data = [] }) {
  const chartData = {
    labels: data.map(d => d.channel?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(d => d.revenue),
        backgroundColor: CHART_COLORS.map(c => c + 'bb'),
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
          label: ctx => ` Revenue: $${ctx.parsed.y?.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#4a5568', font: { size: 11 } },
        border: { display: false }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#4a5568',
          font: { size: 11 },
          callback: val => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}`
        },
        border: { display: false }
      }
    }
  };

  return (
    <div className="chart-container" style={{ height: 220 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
