import React from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useNavigate, Link } from 'react-router-dom';
import CardsHome from '../components/CardsHome';
import CardDollarHome from '../components/CardDollarHome';
import '../index.css';

const Dashboard = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const navigate = useNavigate();

  if (checkingStatus) {
    return <p>Carregando...</p>;
  }

  if (!loggedIn) {
    navigate('/sign-in');
    return null;
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard - iStock Wallet</h1>
          <p>Bem-vindo ao seu painel de investimentos</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Patrimônio Total</h3>
            <p className="stat-value">R$ 0,00</p>
            <span className="stat-change positive">+0,00%</span>
          </div>
          <div className="stat-card">
            <h3>Rendimento Mensal</h3>
            <p className="stat-value">R$ 0,00</p>
            <span className="stat-change neutral">0,00%</span>
          </div>
          <div className="stat-card">
            <h3>Últimas 24h</h3>
            <p className="stat-value">R$ 0,00</p>
            <span className="stat-change neutral">0,00%</span>
          </div>
        </div>

        <div className="dashboard-quick-actions">
          <h2>Ações Rápidas</h2>
          <div className="quick-actions-grid">
            <Link to="/wallet" className="action-card">
              <div className="action-icon">📊</div>
              <h3>Minha Carteira</h3>
              <p>Visualizar todos os investimentos</p>
            </Link>
            <Link to="/stock" className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Pesquisar Ações</h3>
              <p>Buscar e analisar ativos</p>
            </Link>
            <Link to="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <h3>Perfil</h3>
              <p>Gerenciar conta e configurações</p>
            </Link>
            <div className="action-card disabled">
              <div className="action-icon">📈</div>
              <h3>Relatórios</h3>
              <p>Em breve</p>
            </div>
          </div>
        </div>

        <div className="dashboard-market-overview">
          <h2>Visão Geral do Mercado</h2>
          <div className="market-cards">
            <div className="market-section">
              <h3>Moedas</h3>
              <CardDollarHome />
            </div>
            <div className="market-section">
              <h3>Ações em Destaque</h3>
              <CardsHome />
            </div>
          </div>
        </div>

        <div className="dashboard-recent-activity">
          <h2>Atividade Recente</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📊</span>
              <div className="activity-content">
                <p>Bem-vindo ao iStock Wallet!</p>
                <small>Comece explorando sua carteira de investimentos</small>
              </div>
              <span className="activity-time">Agora</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
