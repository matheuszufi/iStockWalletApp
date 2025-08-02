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
  // Calcular a distribuição por tipo de ativo
  const getAssetDistribution = () => {
    const distribution = {};
    
    assets.forEach(asset => {
      const key = viewMode === 'type' ? asset.type : (asset.sector || 'Não informado');
      if (distribution[key]) {
        distribution[key] += asset.totalValue;
      } else {
        distribution[key] = asset.totalValue;
      }
    });
    
    return distribution;
  };

  const distribution = getAssetDistribution();

  // Configurar cores para cada tipo de ativo ou setor
  const getColorForAssetType = (key) => {
    if (viewMode === 'type') {
      const colors = {
        'acao': '#00cc66',
        'fii': '#3b82f6',
        'tesouro': '#f59e0b',
        'renda-fixa': '#ef4444'
      };
      return colors[key] || '#6b7280';
    } else {
      // Cores para setores
      const sectorColors = [
        '#00cc66', '#3b82f6', '#f59e0b', '#ef4444', 
        '#8b5cf6', '#06d6a0', '#f72585', '#4cc9f0',
        '#7209b7', '#560bad', '#480ca8', '#3a0ca3'
      ];
      const keys = Object.keys(distribution);
      const index = keys.indexOf(key);
      return sectorColors[index % sectorColors.length];
    }
  };

  // Configurar labels em português
  const getLabel = (key) => {
    if (viewMode === 'type') {
      const labels = {
        'acao': 'Ações',
        'fii': 'FIIs',
        'tesouro': 'Tesouro',
        'renda-fixa': 'Renda Fixa'
      };
      return labels[key] || key.toUpperCase();
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
