import { useState, useEffect } from 'react';
import axios from 'axios';
import EventoCard from './components/EventoCard';
import Paginacao from './components/Paginacao';
import Destaques from './components/Destaques'; 
import './App.css';

function App() {
  
  // Estados para os dados e UI
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para os filtros e busca
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  // Estados para a paginação
  const [infoPaginacao, setInfoPaginacao] = useState({});
  const [paginaAtual, setPaginaAtual] = useState(1);

  // --- EFEITOS (LÓGICA QUE RODA EM RESPOSTA A MUDANÇAS) ---

  // Efeito para buscar a lista de categorias (roda apenas uma vez)
  useEffect(() => {
    axios.get('http://localhost:3001/api/categorias')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar categorias:', error);
      });
  }, []);

  // Efeito principal: buscar os eventos. Roda sempre que um filtro ou a página mudar.
  useEffect(() => {
    setLoading(true);

    // Constrói os parâmetros da URL de forma limpa
    const params = new URLSearchParams();
    params.append('page', paginaAtual);
    params.append('limit', 9); // Define 9 eventos por página
    if (categoriaSelecionada) {
      params.append('categoriaId', categoriaSelecionada);
    }
    if (termoBusca) {
      params.append('termoBusca', termoBusca);
    }

    const apiUrl = `http://localhost:3001/api/eventos?${params.toString()}`;

    axios.get(apiUrl)
      .then(response => {
        // A API agora retorna um objeto com os eventos e dados de paginação
        setEventos(response.data.eventos);
        setInfoPaginacao({
          totalPaginas: response.data.totalPaginas,
          paginaAtual: response.data.paginaAtual
        });
      })
      .catch(error => {
        console.error('Houve um erro ao buscar dados:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoriaSelecionada, termoBusca, paginaAtual]);

  // Efeito para resetar a página para 1 sempre que um filtro for alterado
  useEffect(() => {
    setPaginaAtual(1);
  }, [categoriaSelecionada, termoBusca]);

  // --- FUNÇÕES DE MANIPULAÇÃO (HANDLERS) ---

  // Função que será chamada pelo componente de Paginação
  const handlePageChange = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <div className="app-container">
      <Destaques /> {}
      <div className="filtro-container">
        {/* Filtro de Categoria */}
        <div className="filtro-item">
          <label htmlFor="categoria-select">Filtrar por Categoria:</label>
          <select
            id="categoria-select"
            value={categoriaSelecionada}
            onChange={e => setCategoriaSelecionada(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de Busca por Texto */}
        <div className="filtro-item filtro-busca"> {}

          <label htmlFor="busca-input">Buscar por Título:</label>
          <input
            id="busca-input"
            type="text"
            placeholder="Digite o nome do evento..."
            value={termoBusca}
            onChange={e => setTermoBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Exibição condicional da lista ou da mensagem de carregamento */}
      {loading ? (
        <p>Carregando eventos...</p>
      ) : (
        <>
          <ul className="lista-eventos">
            {eventos.length === 0 ? (
              <p>Nenhum evento encontrado para esta seleção.</p>
            ) : (
              eventos.map(evento => (
                <EventoCard key={evento.id} evento={evento} />
              ))
            )}
          </ul>

          {/* Componente de Paginação */}
          <Paginacao
            paginaAtual={infoPaginacao.paginaAtual}
            totalPaginas={infoPaginacao.totalPaginas}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default App;