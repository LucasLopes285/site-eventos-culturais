// frontend/src/pages/MeusEventosPage.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import EventoCard from '../components/EventoCard'; 
import '../App.css'; 

export default function MeusEventosPage() {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:3001/api/meus-eventos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setInscricoes(response.data);
      })
      .catch(error => console.error("Erro ao buscar minhas inscrições:", error))
      .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return <p>Carregando seus eventos...</p>;
  }

  return (
    <div className="app-container">
      <h1>Meus Eventos</h1>
      <p>Eventos nos quais você se inscreveu.</p>
      {inscricoes.length === 0 ? (
        <p>Você ainda não se inscreveu em nenhum evento.</p>
      ) : (
        <ul className="lista-eventos">
          {inscricoes.map(inscricao => (
            
            <EventoCard key={inscricao.evento.id} evento={inscricao.evento} />
          ))}
        </ul>
      )}
    </div>
  );
}