import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './DetalhesEvento.css';

function DetalhesEvento() {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estaInscrito, setEstaInscrito] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  // Efeito para buscar os dados do evento e o status da inscrição
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/eventos/${id}`)
      .then(response => {
        setEvento(response.data);
        if (token) {
          axios.get(`http://localhost:3001/api/eventos/${id}/inscricao/status`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(statusRes => setEstaInscrito(statusRes.data.inscrito))
          .catch(err => console.error("Erro ao verificar status da inscrição:", err));
        }
      })
      .catch(error => {
        console.error("Erro ao buscar dados do evento:", error);
        setEvento(null);
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  // Manipulador para o botão de excluir
  const handleExcluir = async () => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.');
    if (confirmar) {
      try {
        await axios.delete(`http://localhost:3001/api/eventos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Evento excluído com sucesso!');
        navigate('/');
      } catch (error) {
        console.error('Falha ao excluir evento:', error);
        alert('Erro ao excluir evento.');
      }
    }
  };

  // Manipulador para o botão de inscrever/cancelar
  const handleInscricaoToggle = async () => {
    const url = `http://localhost:3001/api/eventos/${id}/inscrever`;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (estaInscrito) {
        await axios.delete(url, { headers });
        setEstaInscrito(false);
        alert('Inscrição cancelada!');
      } else {
        await axios.post(url, {}, { headers });
        setEstaInscrito(true);
        alert('Inscrição realizada com sucesso!');
      }
    } catch (error) {
      console.error('Erro no processo de inscrição:', error);
      alert('Ocorreu um erro.');
    }
  };

  // Renderização de Loading e Erro
  if (loading) return <div className="loading-container"><p>Carregando...</p></div>;
  if (!evento) return <div className="loading-container"><p>Evento não encontrado.</p></div>;

  // Formatação de datas para exibição
  const dataFormatada = new Date(evento.data_inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horarioFormatado = new Date(evento.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Renderização principal do componente
  return (
    <div className="detalhe-evento-pagina">
      {/* 1. Capa do Evento com Imagem de Fundo */}
      <div className="evento-capa" style={{ backgroundImage: `url(${evento.url_imagem || 'https://via.placeholder.com/1200x400?text=Evento'})` }}>
        <div className="capa-overlay">
          <h1 className="capa-titulo">{evento.titulo}</h1>
          <div className="capa-pills">
            <span className="pill"><i className="fa fa-calendar"></i> {dataFormatada}</span>
            <span className="pill"><i className="fa fa-clock-o"></i> {horarioFormatado}</span>
            <span className="pill"><i className="fa fa-map-marker"></i> {evento.local || 'Local a definir'}</span>
          </div>
        </div>
      </div>

      {/* 2. Conteúdo Principal em Grid de 2 Colunas */}
      <div className="detalhe-grid-container">
        {/* Coluna Esquerda */}
        <div className="conteudo-principal">
          <div className="sobre-evento">
            <h2>Sobre o Evento</h2>
            <p>{evento.descricao_longa || evento.descricao_curta || 'Nenhuma descrição fornecida.'}</p>
          </div>
          <div className="informacoes-adicionais">
            <h2>Informações Adicionais</h2>
            <div className="info-grid-adicional">
              <div className="info-bloco">
                <span className="info-label">Organizador:</span>
                <span className="info-valor">{evento.organizador || 'Não especificado'}</span>
              </div>
              <div className="info-bloco">
                <span className="info-label">Classificação Etária:</span>
                <span className="info-valor">{evento.classificacao_etaria || 'Livre'}</span>
              </div>
              <div className="info-bloco">
                <span className="info-label">Contato:</span>
                <span className="info-valor">{evento.contato || 'Não especificado'}</span>
              </div>
              <div className="info-bloco">
                <span className="info-label">Endereço:</span>
                <span className="info-valor">{evento.endereco || 'Não especificado'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita (Barra Lateral) */}
        <aside className="conteudo-lateral">
          <div className="inscricao-box">
            <h2>Inscrição</h2>
            <span className="info-valor">{evento.preco > 0 ? `R$ ${parseFloat(evento.preco).toFixed(2).replace('.', ',')}` : 'Gratuito'}</span>
            {evento.requer_inscricao ? (
              <>
                <p>Vagas disponíveis: {evento.limite_participantes > 0 ? evento.limite_participantes : 'Ilimitadas'}</p>
                {user && user.tipo === 'COMUM' ? (
                  <button onClick={handleInscricaoToggle} className={estaInscrito ? 'botao-cancelar' : 'botao-inscrever'}>
                    {estaInscrito ? 'CANCELAR INSCRIÇÃO' : 'INSCREVER-SE'}
                  </button>
                ) : (
                  !user && <p className="aviso-login"><Link to="/login">Faça login</Link> para se inscrever.</p>
                )}
              </>
            ) : (
              <p>Este evento não requer inscrição.</p>
            )}
          </div>
          <div className="compartilhar">
            <h3>Compartilhar</h3>
            <div className="icones-compartilhamento">
              <a href="#" aria-label="Compartilhar no Facebook"><i className="fa fa-facebook"></i></a>
              <a href="#" aria-label="Compartilhar no Twitter"><i className="fa fa-twitter"></i></a>
              <a href="#" aria-label="Compartilhar no WhatsApp"><i className="fa fa-whatsapp"></i></a>
            </div>
          </div>
        </aside>
      </div>

      {/* Ações de Admin e Link para Voltar */}
      <div className="acoes-finais">
        {user && user.tipo === 'ADMIN' && (
          <div className="admin-actions-bottom">
            <Link to={`/eventos/${id}/editar`} className="botao-editar">Editar Evento</Link>
            <button onClick={handleExcluir} className="botao-excluir">Excluir Evento</button>
          </div>
        )}
        <Link to="/" className="link-voltar">&larr; Voltar para todos os eventos</Link>
      </div>
    </div>
  );
}

export default DetalhesEvento;