import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar os componentes necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const AssetsPieChart = ({ assets, viewMode }) => {
  // Calcular a distribuição por tipo de ativo, setor ou ticker
  const getAssetDistribution = () => {
    const distribution = {};
    
    assets.forEach(asset => {
      let key;
      
      if (viewMode === 'type') {
        key = asset.type;
      } else if (viewMode === 'sector') {
        key = asset.sector || 'Não informado';
      } else if (viewMode === 'ticker') {
        key = asset.name; // Usar o ticker/nome do ativo
      }
      
      if (distribution[key]) {
        distribution[key] += asset.totalValue;
      } else {
        distribution[key] = asset.totalValue;
      }
    });
    
    return distribution;
  };

  const distribution = getAssetDistribution();

  // Configurar cores para cada tipo de ativo, setor ou ticker
  const getColorForAssetType = (key) => {
    if (viewMode === 'type') {
      const colors = {
        'acao': '#00cc66',
        'fii': '#3b82f6',
        'cripto': '#f59e0b',
        'tesouro': '#ef4444',
        'renda-fixa': '#8b5cf6'
      };
      return colors[key] || '#6b7280';
    } else {
      // Cores dinâmicas para setores e tickers
      const dynamicColors = [
        '#00cc66', '#3b82f6', '#f59e0b', '#ef4444', 
        '#8b5cf6', '#06d6a0', '#f72585', '#4cc9f0',
        '#7209b7', '#560bad', '#480ca8', '#3a0ca3',
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
        '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe',
        '#fd79a8', '#00b894', '#00cec9', '#55a3ff',
        '#6c5ce7', '#fd79a8', '#fdcb6e', '#e84393'
      ];
      const keys = Object.keys(distribution);
      const index = keys.indexOf(key);
      return dynamicColors[index % dynamicColors.length];
    }
  };

  // Configurar labels em português
  const getLabel = (key) => {
    if (viewMode === 'type') {
      const labels = {
        'acao': 'Ações',
        'fii': 'FIIs',
        'cripto': 'Criptomoedas',
        'tesouro': 'Tesouro',
        'renda-fixa': 'Renda Fixa'
      };
      return labels[key] || key.toUpperCase();
    } else if (viewMode === 'ticker') {
      return key; // Para tickers, usar o nome do ativo diretamente
    } else {
      return key; // Para setores, usar o nome diretamente
    }
  };

  // Preparar dados para o gráfico
  const chartData = {
    labels: Object.keys(distribution).map(key => getLabel(key)),
    datasets: [
      {
        data: Object.values(distribution),
        backgroundColor: Object.keys(distribution).map(key => getColorForAssetType(key)),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Configurações do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: 'Montserrat'
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label;
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${percentage}%)`;
          }
        },
        titleFont: {
          family: 'Montserrat'
        },
        bodyFont: {
          family: 'Montserrat'
        }
      }
    }
  };

  // Se não há ativos, mostrar mensagem
  if (!assets || assets.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>Adicione ativos para visualizar a distribuição</p>
      </div>
    );
  }

  return (
    <div className="chart-content">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default AssetsPieChart;
