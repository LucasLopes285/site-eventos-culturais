import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import EventoCard from '../components/EventoCard';
import '../App.css';

export default function MeusEventosPage() {
  const [eventosCriados, setEventosCriados] = useState([]);
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      setLoading(true);
      // Chamamos nosso novo e poderoso endpoint
      axios.get('http://localhost:3001/api/usuarios/meus-eventos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        // Atualizamos os dois estados com as listas recebidas
        setEventosCriados(res.data.eventosCriados);
        setEventosInscritos(res.data.eventosInscritos);
      })
      .catch(err => {
        console.error("Erro ao buscar 'Meus Eventos':", err);
      })
      .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return <p>Carregando seus eventos...</p>;
  }

  return (
    <div className="app-container">
      <h1>Meus Eventos</h1>

      <Link to="/eventos/criar" className="botao-acao-principal" style={{marginBottom: '2rem'}}>
        <i className="fa fa-plus-circle"></i> Criar Novo Evento
      </Link>

      {/* Seção 1: Eventos Criados */}
      <div className="secao-meus-eventos">
        <h2>Eventos que criei</h2>
        {eventosCriados.length > 0 ? (
          <ul className="lista-eventos">
            {eventosCriados.map(evento => (
              <EventoCard key={evento.id} evento={evento} />
            ))}
          </ul>
        ) : (
          <p>Você ainda não criou nenhum evento. Que tal <Link to="/eventos/criar">criar um agora</Link>?</p>
        )}
      </div>

      {/* Seção 2: Eventos Inscritos */}
      <div className="secao-meus-eventos">
        <h2>Eventos em que me inscrevi</h2>
        {eventosInscritos.length > 0 ? (
          <ul className="lista-eventos">
            {eventosInscritos.map(evento => (
              <EventoCard key={evento.id} evento={evento} />
            ))}
          </ul>
        ) : (
          <p>Você ainda não se inscreveu em nenhum evento. Explore a <Link to="/">página inicial</Link> para encontrar algo!</p>
        )}
      </div>
    </div>
  );
}