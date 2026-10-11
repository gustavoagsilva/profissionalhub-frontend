import { Link } from "react-router-dom";
import { initials } from "../../utils/formatters";
import Icon from "../Icon/Icon";
import "./Dashboard.css";
import { todayInBrasilia } from "../../utils/sessionTime";

const sessionStatus = {
  scheduled: { label: "Agendada", color: "neutra" },
  completed: { label: "Realizada", color: "verde" },
  missed: { label: "Falta", color: "laranja" },
};

export default function Dashboard({ students, sessions, onNewSession }) {
  const today = todayInBrasilia();
  const activeStudents = students.filter((student) => student.active);
  const todaySessions = sessions
    .filter(
      (session) => session.date === today && session.status !== "cancelled",
    )
    .sort((first, second) => first.time.localeCompare(second.time));

  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <h1>Visão geral</h1>
          <p>Acompanhe seus alunos e os atendimentos de hoje.</p>
        </div>
        <button className="botao botao--principal" onClick={onNewSession}>
          <Icon name="plus" size={17} />
          Novo atendimento
        </button>
      </div>

      <div className="resumos">
        <article className="resumo">
          <h2 className="resumo__rotulo">Alunos ativos</h2>
          <strong className="resumo__valor">{activeStudents.length}</strong>
        </article>
        <article className="resumo">
          <h2 className="resumo__rotulo">Atendimentos hoje</h2>
          <strong className="resumo__valor">{todaySessions.length}</strong>
        </article>
      </div>

      <section className="secao">
        <div className="secao__cabecalho">
          <div>
            <h2>Atendimentos de hoje</h2>
            <p>
              {new Date(today + "T12:00:00").toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <Link to="/agenda" className="link-texto">
            Ver agenda
            <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="painel__atendimentos">
          {todaySessions.map((session) => {
            const student = students.find(
              (item) => item._id === session.studentId,
            );
            const status = sessionStatus[session.status];

            return (
              <div className="atendimento-resumido" key={session._id}>
                <div className="atendimento-resumido__horario">
                  <strong>{session.time}</strong>
                  <small>até {session.end}</small>
                </div>
                <span
                  className={"avatar avatar--" + (student?.color || "salvia")}
                >
                  {initials(student?.name || "Aluno")}
                </span>
                <div className="atendimento-resumido__aluno">
                  <strong>{student?.name || "Aluno"}</strong>
                  <small>{session.location}</small>
                </div>
                <span className={"etiqueta etiqueta--" + status.color}>
                  {status.label}
                </span>
              </div>
            );
          })}
          {todaySessions.length === 0 && (
            <p className="estado-vazio">
              Nenhum atendimento para hoje. Use o botão “Novo atendimento” para
              agendar.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
