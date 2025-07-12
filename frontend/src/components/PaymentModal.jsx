// frontend/src/components/PaymentModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import './PaymentModal.css';

// Configuração de acessibilidade para o modal
Modal.setAppElement('#root');

function PaymentModal({ isOpen, onClose, evento }) {
  const [step, setStep] = useState('options'); // 'options', 'processing', 'success'
  const [paymentMethod, setPaymentMethod] = useState('pix');

  const handlePayment = () => {
    setStep('processing');
    // Simula um tempo de processamento da API de pagamento
    setTimeout(() => {
      setStep('success');
    }, 3000); // 3 segundos
  };

  const resetAndClose = () => {
    // Reseta para o estado inicial antes de fechar
    setTimeout(() => {
        setStep('options');
        onClose();
    }, 2000); // Fecha 2 segundos após a mensagem de sucesso
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="payment-modal"
      overlayClassName="payment-overlay"
    >
      {/* Etapa 1: Opções de Pagamento */}
      {step === 'options' && (
        <>
          <h2>Finalizar Compra</h2>
          <div className="evento-resumo">
            <strong>{evento.titulo}</strong>
            <span>R$ {parseFloat(evento.preco).toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="metodos-pagamento">
            <button 
              className={`metodo-btn ${paymentMethod === 'pix' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('pix')}
            >
              PIX
            </button>
            <button 
              className={`metodo-btn ${paymentMethod === 'cartao' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('cartao')}
            >
              Cartão de Crédito
            </button>
          </div>

          {paymentMethod === 'pix' && (
            <div className="detalhe-metodo">
              <p>Escaneie o QR Code para pagar com PIX:</p>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/220px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="Exemplo de QR Code" />
            </div>
          )}

          {paymentMethod === 'cartao' && (
            <div className="detalhe-metodo">
              <p>Preencha os dados do cartão (apenas demonstração):</p>
              <input type="text" placeholder="Número do Cartão" />
              <input type="text" placeholder="Nome no Cartão" />
              <div className="input-grupo-cartao">
                <input type="text" placeholder="Validade (MM/AA)" />
                <input type="text" placeholder="CVC" />
              </div>
            </div>
          )}

          <button className="botao-pagar" onClick={handlePayment}>Pagar Agora</button>
        </>
      )}

      {/* Etapa 2: Processando */}
      {step === 'processing' && (
        <div className="feedback-container">
          <div className="spinner"></div>
          <h3>Processando seu pagamento...</h3>
        </div>
      )}

      {/* Etapa 3: Sucesso */}
      {step === 'success' && (
        <div className="feedback-container">
          <div className="success-icon">✓</div>
          <h3>Pagamento Aprovado!</h3>
          <p>Você receberá a confirmação no seu email.</p>
          {/* Chama a função para fechar o modal após um tempo */}
          {setTimeout(resetAndClose, 0)}
        </div>
      )}
    </Modal>
  );
}

export default PaymentModal;