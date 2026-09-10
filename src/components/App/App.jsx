import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <a className="app__brand" href="#inicio">ProfissionalHub<span className="app__brand-dot">.</span></a>
        <span className="app__badge">Em desenvolvimento</span>
      </header>
      <main className="app__main" id="inicio">
        <p className="app__eyebrow">Sua rotina profissional, organizada</p>
        <h1 className="app__title">Mais clareza para cuidar do seu trabalho.</h1>
        <p className="app__description">Alunos, atendimentos, reposições e cobranças em um só lugar. Uma ferramenta para profissionais de Educação Física autônomos.</p>
        <div className="app__notice">
          <h2 className="app__notice-title">O ProfissionalHub está começando.</h2>
          <p className="app__notice-text">Estamos preparando a primeira versão. As funcionalidades estarão disponíveis nas próximas etapas.</p>
        </div>
      </main>
      <footer className="app__footer">Desenvolvido por Gustavo Augusto.</footer>
    </div>
  );
}
