import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import './DetalhesEvento.css';

function DetalhesEvento() {
    const [evento, setEvento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [estaInscrito, setEstaInscrito] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3001/api/eventos/${id}`)
          .then(response => {
              setEvento(response.data);
              if (token) {
                  axios.get(`http://localhost:3001/api/eventos/${id}/inscricao/status`, {
                      headers: { Authorization: `Bearer ${token}` }
                  }).then(statusRes => setEstaInscrito(statusRes.data.inscrito));
              }
          })
          .catch(error => {
            console.error("Erro ao buscar dados do evento:", error);
            setEvento(null);
          })
          .finally(() => setLoading(false));
    }, [id, token]);

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

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading) return <div className="loading-container"><p>Carregando...</p></div>;
    if (!evento) return <div className="loading-container"><p>Evento não encontrado.</p></div>;

    const dataFormatada = new Date(evento.data_inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    const horarioFormatado = new Date(evento.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <>
            <div className="detalhe-evento-pagina">
                <div className="evento-capa" style={{ backgroundImage: `url(${evento.url_imagem || 'https://via.placeholder.com/1200x350?text=Evento'})` }}>
                </div>
                
                <div className="detalhe-grid">
                    <div className="conteudo-principal">
                        <div className="detalhe-header">
                            <div className="header-info">
                                <h1 className="detalhe-titulo">{evento.titulo}</h1>
                                <div className="pills-container">
                                    <span className="pill"><i className="fa fa-calendar"></i> {dataFormatada}</span>
                                    <span className="pill"><i className="fa fa-clock-o"></i> {horarioFormatado}</span>
                                    <span className="pill"><i className="fa fa-map-marker"></i> {evento.local || 'Local a definir'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="sobre-evento">
                            <h2>Sobre o Evento</h2>
                            <p>{evento.descricao_longa || evento.descricao_curta || 'Nenhuma descrição fornecida.'}</p>
                        </div>
                        <div className="informacoes-adicionais">
                            <h2>Informações Adicionais</h2>
                            <div className="info-grid-adicional">
                                <div className="info-bloco"><span className="info-label">Organizador</span><span className="info-valor">{evento.organizador || 'Não especificado'}</span></div>
                                <div className="info-bloco"><span className="info-label">Classificação</span><span className="info-valor">{evento.classificacao_etaria || 'Livre'}</span></div>
                                <div className="info-bloco"><span className="info-label">Contato</span><span className="info-valor">{evento.contato || 'Não especificado'}</span></div>
                                <div className="info-bloco"><span className="info-label">Endereço</span><span className="info-valor">{evento.endereco || 'Não especificado'}</span></div>
                            </div>
                        </div>

                        <Link to="/" className="link-voltar">&larr; Voltar para todos os eventos</Link>
                        
                        {}
                        {user && (Number(user.id) === Number(evento.id_criador) || user.tipo === 'ADMIN') && (
                            <div className="admin-actions-bottom">
                                {Number(user.id) === Number(evento.id_criador) && (
                                    <Link to={`/eventos/${id}/editar`} className="botao-acao editar">Editar Evento</Link>
                                )}
                                <button onClick={handleExcluir} className="botao-acao excluir">Excluir Evento</button>
                            </div>
                        )}
                    </div>

                    <aside className="conteudo-lateral">
                        <div className="lateral-box">
                            <h2>Ingresso</h2>
                            {evento.preco > 0 ? (
                                <>
                                    <p className="preco-valor">R$ {parseFloat(evento.preco).toFixed(2).replace('.', ',')}</p>
                                    <button className="botao-comprar" onClick={openModal}>Comprar Ingresso</button>
                                </>
                            ) : (
                                <p className="preco-valor">Gratuito</p>
                            )}
                        </div>

                        {evento.requer_inscricao && (
                            <div className="lateral-box">
                                <h2>Inscrição</h2>
                                <p className="vagas-disponiveis">Vagas disponíveis: {evento.limite_participantes > 0 ? evento.limite_participantes : 'Ilimitadas'}</p>
                                {user && user.tipo === 'COMUM' && (
                                    <button onClick={handleInscricaoToggle} className={estaInscrito ? 'botao-cancelar' : 'botao-inscrever'}>{estaInscrito ? 'CANCELAR INSCRIÇÃO' : 'INSCREVER-SE'}</button>
                                )}
                                {!user && <p className="aviso-login"><Link to="/login">Faça login</Link> para se inscrever.</p>}
                            </div>
                        )}
                        
                        <div className="lateral-box compartilhar">
                            <h3>Compartilhar</h3>
                            <div className="icones-compartilhamento">
                                <a href="#"><i className="fa fa-facebook-square"></i></a>
                                <a href="#"><i className="fa fa-twitter-square"></i></a>
                                <a href="#"><i className="fa fa-whatsapp-square"></i></a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            
            <PaymentModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                evento={evento}
            />
        </>
    );
}

export default DetalhesEvento;