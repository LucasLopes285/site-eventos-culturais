import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { loginAction } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAction({ email, senha });
      navigate('/'); // Redireciona para a página inicial após o login
    } catch (error) {
      alert('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Acesse sua Conta</h2>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
        </div>

        <button type="submit">Entrar</button>

        <p className="switch-link">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}
export default LoginPage;