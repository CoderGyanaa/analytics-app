import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Filler, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function RevenueChart({ data = [] }) {
  const labels = data.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.map(d => d.revenue),
        borderColor: '#63b3ed',
        backgroundColor: 'rgba(99,179,237,0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#63b3ed'
      },
      {
        label: 'Profit',
        data: data.map(d => d.profit),
        borderColor: '#48bb78',
        backgroundColor: 'rgba(72,187,120,0.05)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#48bb78'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#8892aa',
          font: { size: 12, family: 'Plus Jakarta Sans' },
          boxWidth: 12,
          boxHeight: 2,
          usePointStyle: false,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: '#131929',
        borderColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        titleColor: '#f0f4ff',
        bodyColor: '#8892aa',
        padding: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y?.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#4a5568', font: { size: 11 }, maxTicksLimit: 8 },
        border: { display: false }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#4a5568',
          font: { size: 11 },
          callback: (val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}`
        },
        border: { display: false }
      }
    }
  };

  return (
    <div className="chart-container" style={{ height: 280 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
