import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css'; // <<< Importa o mesmo CSS

function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { registerAction } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerAction({ nome, email, senha });
      alert('Cadastro realizado com sucesso! Por favor, faça o login.');
      navigate('/login');
    } catch (error) {
      alert('Falha no cadastro. O email já pode estar em uso.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Crie sua Conta</h2>

        <div className="input-group">
          <label htmlFor="nome">Nome Completo</label>
          <input id="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
        </div>

        <button type="submit">Cadastrar</button>

        <p className="switch-link">
          Já tem uma conta? <Link to="/login">Faça o login</Link>
        </p>
      </form>
    </div>
  );
}
export default RegisterPage;