// frontend/src/components/Destaques.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Destaques.css';

function Destaques() {
  const [destaques, setDestaques] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);

  // Busca os eventos em destaque
  useEffect(() => {
    axios.get('http://localhost:3001/api/eventos/destaques')
      .then(res => setDestaques(res.data))
      .catch(err => console.error("Erro ao buscar destaques", err));
  }, []);

  // Efeito para o carrossel automático
  useEffect(() => {
    // Só ativa o timer se tivermos eventos para mostrar
    if (destaques.length > 1) {
      const intervalo = setInterval(() => {
        // Avança para o próximo slide, voltando ao início se chegar no fim
        setIndiceAtual(prevIndice => (prevIndice + 1) % destaques.length);
      }, 5000); // Muda a cada 5 segundos (5000 milissegundos)

      // Função de limpeza: para o timer se o componente for desmontado
      return () => clearInterval(intervalo);
    }
  }, [destaques]);

  // Se não houver destaques, não renderiza nada
  if (destaques.length === 0) {
    return null;
  }

  const eventoAtual = destaques[indiceAtual];

  return (
    <div className="destaques-container">
      <div 
        className="slide-ativo" 
        style={{ backgroundImage: `url(${eventoAtual.url_imagem})` }}
      >
        <div className="slide-overlay">
          <div className="slide-conteudo">
            <h2 className="slide-titulo">{eventoAtual.titulo}</h2>
            <Link to={`/eventos/${eventoAtual.id}`} className="slide-botao">
              Ver Mais
            </Link>
          </div>
        </div>
      </div>
      {/* Indicadores de qual slide está ativo */}
      <div className="slide-indicadores">
        {destaques.map((evento, index) => (
          <span 
            key={evento.id} 
            className={`ponto ${index === indiceAtual ? 'ativo' : ''}`}
            onClick={() => setIndiceAtual(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Destaques;