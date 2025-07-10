import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EditarEventoPage from './pages/EditarEventoPage'; 

// 1. Importando o Contexto de Autenticação
import { AuthProvider } from './context/AuthContext.jsx';

// 2. Importando os Componentes de Layout e Proteção
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// 3. Importando todas as nossas Páginas
import App from './App.jsx';
import DetalhesEvento from './pages/DetalhesEvento.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MeusEventosPage from './pages/MeusEventosPage.jsx';
import DashboardAdminPage from './pages/DashboardAdminPage.jsx';
import CriarEventoPage from './pages/CriarEventoPage.jsx';

// 4. Importando o CSS global
import './index.css';

// Criação do roteador com a estrutura aninhada e protegida
const router = createBrowserRouter([
  {
    // A Rota Raiz, que usa o nosso Layout principal para todas as páginas
    path: '/',
    element: <Layout />,
    // Todas as outras rotas são "filhas" do Layout, e serão renderizadas no <Outlet />
    children: [
      // --- Rotas Públicas (acessíveis a todos) ---
      {
        index: true, // A página inicial
        element: <App />,
      },
      {
        path: 'eventos/:id',
        element: <DetalhesEvento />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },

      // --- Rotas Protegidas (precisa estar logado, qualquer tipo de usuário) ---
      {
        element: <ProtectedRoute />, // Envolve as rotas com o componente de proteção
        children: [
          {
            path: 'meus-eventos',
            element: <MeusEventosPage />,
          },
          // Se tivéssemos uma página de "Editar Perfil", ela viria aqui dentro.
        ],
      },

      // --- Rotas de Admin (precisa estar logado E ser do tipo 'ADMIN') ---
      {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />, // Passamos a permissão necessária
        children: [
          {
            path: 'dashboard',
            element: <DashboardAdminPage />,
          },
          {
            path: 'eventos/criar',
            element: <CriarEventoPage />,
          },
          {
            path: 'eventos/:id/editar', 
            element: <EditarEventoPage />

          }, 
          // Todas as futuras páginas de administração viriam aqui.
        ],
      },
    ],
  },
]);

// Renderização da aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O AuthProvider envolve tudo para que todas as páginas e componentes
        tenham acesso ao contexto de autenticação (usuário, token, etc.) */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);