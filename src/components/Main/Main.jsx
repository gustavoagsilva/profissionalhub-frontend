import Icon from "../Icon/Icon";
import Header from "../Header/Header";
import About from "../About/About";
import Footer from "../Footer/Footer";
import "./Main.css";
export default function Main({ onLogin, onRegister, onDemo, onSignOut }) {
  return (
    <div className="apresentacao">
      <Header onLogin={onLogin} onRegister={onRegister} onSignOut={onSignOut} />
      <main id="inicio">
        <section className="destaque">
          <div className="destaque__conteudo">
            <span className="chamada">
              <span className="ponto-status" /> PARA QUEM CUIDA DO MOVIMENTO
            </span>
            <h1>
              Sua profissão.
              <br />
              Sua rotina.
              <br />
              <span>Em equilíbrio.</span>
            </h1>
            <p>
              Você cuida dos seus alunos. O ProfissionalHub ajuda a organizar o
              que acontece entre um atendimento e outro.
            </p>
            <div className="destaque__acoes">
              <button className="botao botao--principal" onClick={onRegister}>
                Organizar minha rotina
                <Icon name="arrow" size={18} />
              </button>
              <button
                className="botao botao--simples"
                onClick={onDemo}
                disabled={!onDemo}
                title="Disponível em uma próxima etapa"
              >
                Explorar demonstração
              </button>
            </div>
            <div className="destaque__nota">
              <Icon name="check" size={16} />
              Feito para profissionais de Educação Física autônomos.
            </div>
          </div>
          <div className="destaque__visual">
            <div className="destaque__circulo" />
            <div className="previa">
              <div className="previa__topo">
                <span className="previa__marca">
                  <Icon name="spark" size={16} /> Seu dia, com clareza
                </span>
                <span className="previa__pontos">•••</span>
              </div>
              <div className="previa__cabecalho">
                <div>
                  <span className="chamada">UM PASSO DE CADA VEZ</span>
                  <h2>
                    Bom dia, profissional <span>☀</span>
                  </h2>
                </div>
              </div>
              <div className="previa__resumos">
                <div>
                  <span>Atendimentos hoje</span>
                  <strong>
                    04<small> sessões</small>
                  </strong>
                </div>
                <div>
                  <span>Alunos ativos</span>
                  <strong>
                    12<small> alunos</small>
                  </strong>
                </div>
              </div>
              <div className="previa__agenda">
                <span>Na sua agenda</span>
                <span>Exemplo ilustrativo</span>
              </div>
              {[
                {
                  time: "07:00",
                  name: "Mariana Costa",
                  location: "Parque Ibirapuera",
                  done: true,
                },
                {
                  time: "09:00",
                  name: "Rafael Oliveira",
                  location: "Studio Vila Mariana",
                },
                {
                  time: "14:00",
                  name: "Camila Santos",
                  location: "Parque Ibirapuera",
                },
              ].map((item) => (
                <div className="previa__atendimento" key={item.time}>
                  <time>{item.time}</time>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.location}</span>
                  </div>
                  <span
                    className={
                      "previa__indicador" +
                      (item.done ? " previa__indicador--concluido" : "")
                    }
                  >
                    <Icon name={item.done ? "check" : "clock"} size={15} />
                  </span>
                </div>
              ))}
            </div>
            <div className="destaque__aviso">
              <span>
                <Icon name="check" size={19} />
              </span>
              <div>
                <strong>Menos abas. Mais presença.</strong>
                <small>Seu trabalho em um só lugar.</small>
              </div>
            </div>
          </div>
        </section>
        <section id="recursos" className="recursos">
          <div className="recursos__introducao">
            <span className="chamada">ESPAÇO PARA O QUE IMPORTA</span>
            <h2>
              Uma rotina conectada.
              <br />
              Do primeiro horário ao último check.
            </h2>
          </div>
          <div className="recursos__grade">
            {[
              {
                icon: "calendar",
                title: "Agenda que faz sentido",
                text: "Acompanhe horários, locais e o resultado de cada atendimento.",
              },
              {
                icon: "users",
                title: "Cada aluno, por perto",
                text: "Encontre contatos e acompanhe quem faz parte da sua rotina.",
              },
              {
                icon: "wallet",
                title: "Pendências à vista",
                text: "Organize cobranças e reposições para saber o que precisa de atenção.",
              },
            ].map((item) => (
              <article className="recurso" key={item.title}>
                <span className="recurso__icone">
                  <Icon name={item.icon} size={25} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
        <About onDemo={onDemo} />
      </main>
      <Footer />
    </div>
  );
}
