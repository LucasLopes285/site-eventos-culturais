// frontend/src/components/EventoCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './EventoCard.css';

function EventoCard({ evento }) {
  // --- Lógica para formatar a data ---
  const data = new Date(evento.data_inicio);
  
  // Usamos toLocaleDateString para pegar os nomes em português e de forma segura
  const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit' });
  const diaDaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', '');
  const horario = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    // O card inteiro continua sendo um link para a página de detalhes
    <Link to={`/eventos/${evento.id}`} className="card-link">
      <div className="evento-card-novo">
        {/* A imagem do evento */}
        <img 
          src={evento.url_imagem || 'https://via.placeholder.com/400x200?text=Evento+Sem+Imagem'} 
          alt={`Capa do evento ${evento.titulo}`} 
          className="card-imagem-novo"
        />
        
        <div className="card-conteudo-novo">
          {/* Caixa da Data (à esquerda) */}
          <div className="data-box">
            <span className="mes">{mes}</span>
            <span className="dia">{dia}</span>
            <span className="semana">{diaDaSemana}</span>
          </div>

          {/* Informações Gerais (no meio) */}
          <div className="info-box">
            <h2 className="card-titulo-novo">{evento.titulo}</h2>
            <span className="info-local">{evento.local || 'Local a definir'}</span>
          </div>

          {/* Informações Adicionais (à direita) */}
          <div className="info-adicional">
            <span>Abertura: {horario}</span>
            <span>Censura: {evento.classificacao_etaria || 'Livre'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EventoCard;