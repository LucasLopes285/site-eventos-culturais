import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';

// 1. Importamos o nosso AuthContext para ter acesso aos dados do usuário
import { AuthContext } from '../context/AuthContext';

import Footer from './Footer.jsx'; 

// 2. Importamos o CSS para estilização
import './Layout.css';

function Layout() {
  // 3. Usamos o hook useContext para pegar o 'user' e a função 'logOut' do nosso contexto
  const { user, logOut } = useContext(AuthContext);

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <div className="site-header-content">
          {/* Link para a página inicial */}
          <Link to="/" className="site-title-link">
            <h1 className="site-title">Eventos Culturais Santarém</h1>
          </Link>

          {/* A navegação que mudará dinamicamente */}
          <nav>
            {/* Bloco 1: Renderiza se o usuário for do tipo 'ADMIN' */}
            {user && user.tipo === 'ADMIN' && (
              <>
                <Link to="/" className="auth-link">Eventos</Link>
                <Link to="/dashboard" className="auth-link">Dashboard</Link>
                {/* Futuramente: <Link to="/gerenciar-eventos" className="auth-link">Gerenciar</Link> */}
                <button onClick={logOut} className="auth-button">Sair</button>
              </>
            )}

            {/* Bloco 2: Renderiza se o usuário for do tipo 'COMUM' */}
            {user && user.tipo === 'COMUM' && (
              <>
                <Link to="/" className="auth-link">Eventos</Link>
                <Link to="/meus-eventos" className="auth-link">Meus Eventos</Link>
                <button onClick={logOut} className="auth-button">Sair</button>
              </>
            )}

            {/* Bloco 3: Renderiza se NÃO houver usuário logado */}
            {!user && (
              <>
                <Link to="/login" className="auth-link">Entrar</Link>
                <Link to="/register" className="auth-link">Cadastre-se</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="site-content">
        {/* O <Outlet /> é o espaço onde as páginas (Home, Detalhes, Login, etc.) serão renderizadas */}
        <Outlet />
      </main>
      <Footer /> {/* 4. Aqui incluímos o Footer que criamos */}
    </div>
  );
}

export default Layout;