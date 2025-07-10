import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './CriarEventoPage.css';

function CriarEventoPage() {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao_curta: '',
    descricao_longa: '',
    data_inicio: '',
    local: '',
    preco: 0,
    id_categoria: '',
    requer_inscricao: false,
    limite_participantes: 0,
    organizador: '',
    contato: '',
  });

  const [isPago, setIsPago] = useState(false);
  const [imagem, setImagem] = useState(null); // Estado para o arquivo da imagem
  const [categorias, setCategorias] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Busca as categorias para o dropdown
  useEffect(() => {
    axios.get('http://localhost:3001/api/categorias')
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Erro ao buscar categorias:", err));
  }, []);

  // Manipulador para campos de texto, número, etc.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Manipulador para o toggle de inscrição
  const handleInscricaoToggle = (e) => {
    const ativado = e.target.checked;
    setFormData(prevState => ({
      ...prevState,
      requer_inscricao: ativado,
      limite_participantes: ativado ? prevState.limite_participantes : 0,
    }));
  };

  // Manipulador para o toggle de preço
  const handleIsPagoToggle = (e) => {
    const ativado = e.target.checked;
    setIsPago(ativado);
    if (!ativado) {
      setFormData(prevState => ({ ...prevState, preco: 0 }));
    }
  };

  // Manipulador para o campo de imagem
  const handleImageChange = (e) => {
    setImagem(e.target.files[0]);
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dadosParaEnviar = new FormData();

    // Adiciona cada campo do formulário ao FormData
    for (const key in formData) {
      dadosParaEnviar.append(key, formData[key]);
    }
    if (imagem) {
      dadosParaEnviar.append('imagem', imagem);
    }

    try {
      await axios.post('http://localhost:3001/api/eventos', dadosParaEnviar, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Evento criado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Falha ao criar evento:', error);
      alert('Erro ao criar evento.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-evento">
      <h2>Criar Novo Evento</h2>

      {/* TODOS OS CAMPOS DO FORMULÁRIO */}
      <input name="titulo" type="text" placeholder="Título do Evento" value={formData.titulo} onChange={handleChange} required />
      <textarea name="descricao_curta" placeholder="Descrição Curta (aparece nos cards)" value={formData.descricao_curta} onChange={handleChange} />
      <textarea name="descricao_longa" placeholder="Descrição Completa do Evento" value={formData.descricao_longa} onChange={handleChange} rows="5" />
      <input name="data_inicio" type="datetime-local" value={formData.data_inicio} onChange={handleChange} required />
      <input name="local" type="text" placeholder="Local do Evento" value={formData.local} onChange={handleChange} />       
      <input name="organizador" type="text" placeholder="Organizador do Evento" value={formData.organizador} onChange={handleChange} />
      <input name="contato" type="text" placeholder="Contato (email ou telefone)" value={formData.contato} onChange={handleChange} />

      <select name="id_categoria" value={formData.id_categoria} onChange={handleChange} required>
        <option value="">Selecione uma Categoria</option>
        {categorias.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.nome}</option>
        ))}
      </select>

      {/* Toggle Switch para Inscrição */}
      <div className="toggle-switch-container">
        <label htmlFor="requer-inscricao-toggle">Requer Inscrição?</label>
        <label className="switch">
          <input id="requer-inscricao-toggle" type="checkbox" checked={formData.requer_inscricao} onChange={handleInscricaoToggle} />
          <span className="slider"></span>
        </label>
      </div>

      {formData.requer_inscricao && (
        <input name="limite_participantes" type="number" placeholder="Limite de Participantes (0 para ilimitado)" value={formData.limite_participantes} onChange={handleChange} />
      )}

      {/* Toggle Switch para Preço */}
      <div className="toggle-switch-container">
        <label htmlFor="evento-pago-toggle">Evento Pago?</label>
        <label className="switch">
          <input id="evento-pago-toggle" type="checkbox" checked={isPago} onChange={handleIsPagoToggle} />
          <span className="slider"></span>
        </label>
      </div>

      {isPago && (
        <input name="preco" type="number" step="0.01" placeholder="Preço do Ingresso (ex: 25.50)" value={formData.preco} onChange={handleChange} required min="0.01" />
      )}

      {/* Campo de Upload de Imagem */}
      <div className="form-item">
        <label htmlFor="imagem-upload">Imagem de Capa</label>
        <input id="imagem-upload" type="file" name="imagem" accept="image/png, image/jpeg" onChange={handleImageChange} />
      </div>

      <button type="submit">Criar Evento</button>
    </form>
  );
}

export default CriarEventoPage;