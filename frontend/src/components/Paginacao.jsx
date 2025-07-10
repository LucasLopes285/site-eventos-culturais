// frontend/src/components/Paginacao.jsx
import React from 'react';
import './Paginacao.css';

function Paginacao({ paginaAtual, totalPaginas, onPageChange }) {
  if (totalPaginas <= 1) return null; // Não mostra nada se tiver só uma página

  return (
    <div className="paginacao-container">
      <button 
        onClick={() => onPageChange(paginaAtual - 1)} 
        disabled={paginaAtual === 1}
      >
        Anterior
      </button>
      <span>Página {paginaAtual} de {totalPaginas}</span>
      <button 
        onClick={() => onPageChange(paginaAtual + 1)} 
        disabled={paginaAtual === totalPaginas}
      >
        Próxima
      </button>
    </div>
  );
}
export default Paginacao;