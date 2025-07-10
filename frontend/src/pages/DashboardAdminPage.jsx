import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './DashboardAdminPage.css';

function DashboardAdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:3001/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setStats(res.data))
        .catch(err => console.error("Erro ao buscar estatísticas:", err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) return <p>Carregando dashboard...</p>;
  if (!stats) return <p>Não foi possível carregar os dados.</p>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard do Administrador</h1>


      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total de Eventos</h3>
            <p className="stat-valor">{stats.totalEventos}</p>
          </div>
          <div className="stat-icon">
            <i className="fa fa-calendar"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total de Usuários</h3>
            <p className="stat-valor">{stats.totalUsuarios}</p>
          </div>
          <div className="stat-icon">
            <i className="fa fa-users"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total de Categorias</h3>
            <p className="stat-valor">{stats.totalCategorias}</p>
          </div>
          <div className="stat-icon">
            <i className="fa fa-tags"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total de Inscrições</h3>
            <p className="stat-valor">{stats.totalInscricoes}</p>
          </div>
          <div className="stat-icon">
            <i className="fa fa-check-square-o"></i>
          </div>
        </div>
      </div>

      <div className="recentes-container">
        <h2>Eventos Criados Recentemente</h2>
        <Link to="/eventos/criar" className="botao-acao-principal">
          <i className="fa fa-plus-circle"></i> Criar Novo Evento
        </Link>
        <ul className="lista-recente">
          {stats.eventosRecentes.map(evento => (
            <li key={evento.id} className="item-recente">
              <div>
                <span className="item-recente-titulo">{evento.titulo}</span>
                <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                  Criado em: {new Date(evento.data_criacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <span className="item-recente-categoria">{evento.categoria?.nome || 'Sem Categoria'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default DashboardAdminPage;