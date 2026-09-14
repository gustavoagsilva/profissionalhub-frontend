import { useState } from "react";
import Main from "../Main/Main";
import AuthModal from "../AuthModal/AuthModal";
import Modal from "../Modal/Modal";
import "./App.css";
export default function App() {
  const [authMode, setAuthMode] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit() {
    setAuthMode(null);
    setSubmitted(true);
  }
  return (
    <>
      <Main
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
      />
      {authMode && (
        <AuthModal
          key={authMode}
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onModeChange={setAuthMode}
          onEnter={handleSubmit}
        />
      )}
      {submitted && (
        <Modal
          title="Formulário validado"
          subtitle="Esta é uma prévia visual. Nenhuma conta foi criada e nenhum login foi realizado."
          onClose={() => setSubmitted(false)}
        >
          <button
            className="botao botao--principal botao--largura-total"
            onClick={() => setSubmitted(false)}
          >
            Voltar para o início
          </button>
        </Modal>
      )}
    </>
  );
}
