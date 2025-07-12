import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './CriarEventoPage.css';

function EditarEventoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao_curta: '',
    descricao_longa: '',
    data_inicio: '',
    local: '',
    endereco: '',
    preco: 0,
    id_categoria: '',
    requer_inscricao: false,
    limite_participantes: 0,
    organizador: '',
    contato: '',
    url_imagem: '',
  });

  const [isPago, setIsPago] = useState(false);
  const [novaImagem, setNovaImagem] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados iniciais do evento para preencher o formulário
  useEffect(() => {
    const buscarDadosIniciais = async () => {
      try {
        const [resCategorias, resEvento] = await Promise.all([
          axios.get('http://localhost:3001/api/categorias'),
          axios.get(`http://localhost:3001/api/eventos/${id}`)
        ]);

        setCategorias(resCategorias.data);
        const dadosDoEvento = resEvento.data;

        const dataFormatada = dadosDoEvento.data_inicio
          ? new Date(dadosDoEvento.data_inicio).toISOString().slice(0, 16)
          : '';

        setFormData({
          titulo: dadosDoEvento.titulo || '',
          descricao_curta: dadosDoEvento.descricao_curta || '',
          descricao_longa: dadosDoEvento.descricao_longa || '',
          data_inicio: dataFormatada,
          local: dadosDoEvento.local || '',
          endereco: dadosDoEvento.endereco || '',
          preco: dadosDoEvento.preco || 0,
          id_categoria: dadosDoEvento.id_categoria || '',
          requer_inscricao: dadosDoEvento.requer_inscricao || false,
          limite_participantes: dadosDoEvento.limite_participantes || 0,
          url_imagem: dadosDoEvento.url_imagem || '',
        });

        setIsPago(parseFloat(dadosDoEvento.preco) > 0);

      } catch (error) {
        console.error("Erro ao carregar dados para edição:", error);
        alert("Não foi possível carregar os dados do evento.");
      } finally {
        setLoading(false);
      }
    };

    buscarDadosIniciais();
  }, [id]);

  // Manipuladores de eventos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  const handleInscricaoToggle = (e) => {
    const ativado = e.target.checked;
    setFormData(prevState => ({ ...prevState, requer_inscricao: ativado, limite_participantes: ativado ? prevState.limite_participantes : 0 }));
  };
  const handleIsPagoToggle = (e) => {
    const ativado = e.target.checked;
    setIsPago(ativado);
    if (!ativado) setFormData(prevState => ({ ...prevState, preco: 0 }));
  };
  const handleImageChange = (e) => {
    setNovaImagem(e.target.files[0]);
  };

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dadosParaEnviar = new FormData();

    Object.keys(formData).forEach(key => {
      if (key !== 'url_imagem') {
        dadosParaEnviar.append(key, formData[key]);
      }
    });

    if (novaImagem) {
      dadosParaEnviar.append('imagem', novaImagem);
    }

    try {
      await axios.put(`http://localhost:3001/api/eventos/${id}`, dadosParaEnviar, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Evento atualizado com sucesso!');
      navigate(`/eventos/${id}`);
    } catch (error) {
      console.error('Falha ao atualizar evento:', error);
      alert('Erro ao atualizar evento.');
    }
  };

  if (loading) return <p>Carregando formulário de edição...</p>;

  return (
    <form onSubmit={handleSubmit} className="form-evento">
      <h2>Editar Evento</h2>

      {formData.url_imagem && (
        <div className="imagem-preview">
          <p>Imagem Atual:</p>
          <img src={formData.url_imagem} alt="Imagem atual do evento" width="200" />
        </div>
      )}

      <div className="form-item">
        <label htmlFor="imagem-upload">Alterar Imagem de Capa (opcional)</label>
        <input id="imagem-upload" type="file" name="imagem" accept="image/png, image/jpeg" onChange={handleImageChange} />
      </div>

      {/* Inputs para todos os campos */}
      <input name="titulo" type="text" placeholder="Título do Evento" value={formData.titulo} onChange={handleChange} required />
      <textarea name="descricao_curta" placeholder="Descrição Curta" value={formData.descricao_curta || ''} onChange={handleChange} />
      <textarea name="descricao_longa" placeholder="Descrição Completa" value={formData.descricao_longa || ''} onChange={handleChange} rows="5" />
      <input name="data_inicio" type="datetime-local" value={formData.data_inicio} onChange={handleChange} required />
      <input name="local" type="text" placeholder="Local do Evento" value={formData.local || ''} onChange={handleChange} />
      <input name="endereco" type="text" placeholder="Endereço Completo" value={formData.endereco || ''} onChange={handleChange} /> {/* <<< ADICIONE AQUI */}
      <input name="organizador" type="text" placeholder="Organizador do Evento" value={formData.organizador} onChange={handleChange} />
      <input name="contato" type="text" placeholder="Contato (email ou telefone)" value={formData.contato} onChange={handleChange} />


      <select name="id_categoria" value={formData.id_categoria} onChange={handleChange} required>
        <option value="">Selecione uma Categoria</option>
        {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
      </select>

      {/* Toggles Condicionais */}
      <div className="toggle-switch-container">
        <label htmlFor="requer-inscricao-toggle">Requer Inscrição?</label>
        <label className="switch">
          <input id="requer-inscricao-toggle" type="checkbox" checked={formData.requer_inscricao} onChange={handleInscricaoToggle} />
          <span className="slider"></span>
        </label>
      </div>
      {formData.requer_inscricao && (
        <input name="limite_participantes" type="number" placeholder="Limite de Participantes" value={formData.limite_participantes || 0} onChange={handleChange} />
      )}
      <div className="toggle-switch-container">
        <label htmlFor="evento-pago-toggle">Evento Pago?</label>
        <label className="switch">
          <input id="evento-pago-toggle" type="checkbox" checked={isPago} onChange={handleIsPagoToggle} />
          <span className="slider"></span>
        </label>
      </div>
      {isPago && (
        <input name="preco" type="number" step="0.01" placeholder="Preço do Ingresso" value={formData.preco} onChange={handleChange} required min="0.01" />
      )}

      <button type="submit">Salvar Alterações</button>
    </form>
  );
}
export default EditarEventoPage;