import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getHistoricalData } from '../services/brapiService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function StockChart({ ticker, period = '1mo' }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const periodConfigs = {
    '1d': { range: '1d', interval: '15m', label: '1 Dia' },
    '1w': { range: '5d', interval: '1d', label: '1 Semana' },
    '1mo': { range: '1mo', interval: '1d', label: '1 Mês' },
    '1y': { range: '1y', interval: '1wk', label: '1 Ano' },
    '5y': { range: '5y', interval: '1mo', label: '5 Anos' }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      if (!ticker) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const config = periodConfigs[period];
        const data = await getHistoricalData(ticker, config.range, config.interval);
        
        if (data && data.results && data.results.length > 0) {
          const stockData = data.results[0];
          const historicalData = stockData.historicalDataPrice || [];
          
          if (historicalData.length === 0) {
            setError('Dados históricos não disponíveis');
            return;
          }

          // Processar dados para o gráfico
          const labels = historicalData.map(item => {
            const date = new Date(item.date * 1000);
            if (period === '1d') {
              return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            } else if (period === '1w' || period === '1mo') {
              return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            } else {
              return date.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
            }
          });

          const prices = historicalData.map(item => item.close);
          const firstPrice = prices[0];
          const lastPrice = prices[prices.length - 1];
          const isPositive = lastPrice >= firstPrice;

          setChartData({
            labels,
            datasets: [
              {
                label: `${ticker} - Preço`,
                data: prices,
                borderColor: isPositive ? '#22c55e' : '#ef4444',
                backgroundColor: isPositive 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: isPositive ? '#22c55e' : '#ef4444',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
              }
            ]
          });
        } else {
          setError('Dados não encontrados');
        }
      } catch (err) {
        console.error('Erro ao carregar dados do gráfico:', err);
        setError('Erro ao carregar gráfico');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [ticker, period]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10
          },
          maxTicksLimit: 6
        }
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10
          },
          callback: function(value) {
            return `R$ ${value.toFixed(2)}`;
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    elements: {
      point: {
        hoverRadius: 6
      }
    }
  };

  if (loading) {
    return (
      <div className="stock-chart-container">
        <div className="stock-chart-loading">
          <div className="loading-spinner"></div>
          <span>Carregando gráfico...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-chart-container">
        <div className="stock-chart-error">
          <span>⚠️ {error}</span>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  return (
    <div className="stock-chart-container">
      <div className="stock-chart">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default StockChart;
