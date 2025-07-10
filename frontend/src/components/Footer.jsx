// frontend/src/components/Footer.jsx

import React from 'react';
import './Footer.css'; // Importando o nosso arquivo de estilo

function Footer() {
  const anoAtual = new Date().getFullYear(); // Pega o ano atual automaticamente

  return (
    <footer className="site-footer">
      <p>&copy; {anoAtual} Eventos Culturais STM. Todos os direitos reservados.</p>
      <p>Um projeto para fins acadêmicos.</p>
    </footer>
  );
}

export default Footer;