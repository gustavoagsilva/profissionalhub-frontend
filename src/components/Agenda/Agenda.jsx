import Icon from "../Icon/Icon";
import { initials } from "../../utils/formatters";
import "./Agenda.css";
import { todayInBrasilia, sessionInstant } from "../../utils/sessionTime";
const labels = {
  scheduled: "Agendada",
  completed: "Realizada",
  missed: "Falta",
  cancelled: "Cancelada",
};
const statusClasses = {
  scheduled: "agendado",
  completed: "realizado",
  missed: "falta",
  cancelled: "cancelado",
};

export default function Agenda({
  sessions,
  students,
  onNew,
  onStatus,
  onEdit,
  date,
  setDate,
  now,
}) {
  const rows = sessions
    .filter((session) => session.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
  const changeDay = (offset) => {
    const next = new Date(date + "T12:00:00Z");
    next.setUTCDate(next.getUTCDate() + offset);
    setDate(next.toISOString().slice(0, 10));
  };
  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <span className="chamada">UM ATENDIMENTO DE CADA VEZ</span>
          <h1>Sua agenda</h1>
          <p>
            Horários de Brasília. Intervalo mínimo de 45 minutos entre aulas.
          </p>
        </div>
        <button className="botao botao--principal" onClick={() => onNew(date)}>
          <Icon name="plus" size={17} />
          Novo atendimento
        </button>
      </div>
      <section className="secao">
        <div className="barra-ferramentas agenda__barra-ferramentas">
          <div className="agenda__data">
            <button
              className="botao-icone agenda__anterior"
              aria-label="Dia anterior"
              onClick={() => changeDay(-1)}
            >
              <Icon name="chevron" size={16} />
            </button>
            <input
              className="entrada"
              type="date"
              aria-label="Data da agenda"
              value={date}
              onChange={(event) => {
                if (event.target.value) setDate(event.target.value);
              }}
            />
            <button
              className="botao-icone"
              aria-label="Próximo dia"
              onClick={() => changeDay(1)}
            >
              <Icon name="chevron" size={16} />
            </button>
            <button
              className="botao botao--contorno botao--pequeno"
              onClick={() => setDate(todayInBrasilia())}
            >
              Hoje
            </button>
          </div>
          <span className="barra-ferramentas__quantidade">
            {rows.length} atendimento(s)
          </span>
        </div>
        <div className="agenda__lista">
          {rows.length ? (
            rows.map((session) => {
              const student = students.find(
                (item) => item._id === session.studentId,
              );
              return (
                <article
                  className={
                    "atendimento atendimento--" + statusClasses[session.status]
                  }
                  key={session._id}
                >
                  <div className="atendimento__horario">
                    <strong>{session.time}</strong>
                    <small>até {session.end}</small>
                  </div>
                  <div className="atendimento__cartao">
                    <span
                      className={
                        "avatar avatar--" + (student?.color || "salvia")
                      }
                    >
                      {initials(student?.name || "Aluno")}
                    </span>
                    <div className="atendimento__aluno">
                      <h2>{student?.name}</h2>
                      <p>
                        <Icon name="pin" size={13} />
                        {session.location}
                      </p>
                    </div>
                    <span
                      className={
                        "etiqueta etiqueta--" +
                        (session.status === "completed"
                          ? "verde"
                          : session.status === "missed"
                            ? "laranja"
                            : "neutra")
                      }
                    >
                      {labels[session.status]}
                      {session.status === "cancelled"
                        ? session.cancelledBy === "student"
                          ? " pelo aluno"
                          : " pelo profissional"
                        : ""}
                    </span>
                    {session.status !== "cancelled" && (
                      <div className="atendimento__acoes">
                        {session.status === "scheduled" && (
                          <button
                            className="botao-texto"
                            onClick={() => onEdit(session)}
                          >
                            Editar
                          </button>
                        )}
                        {sessionInstant(session.date, session.end) > now && (
                          <small>Resultado disponível após o término.</small>
                        )}
                        <button
                          className="botao botao--contorno botao--pequeno"
                          disabled={
                            session.status === "completed" ||
                            sessionInstant(session.date, session.end) > now
                          }
                          onClick={() => onStatus(session, "completed")}
                        >
                          <Icon name="check" size={14} />
                          Realizada
                        </button>
                        <button
                          className="botao-texto"
                          disabled={
                            session.status === "missed" ||
                            sessionInstant(session.date, session.end) > now
                          }
                          onClick={() => onStatus(session, "missed")}
                        >
                          Falta
                        </button>
                        {session.status === "scheduled" && (
                          <button
                            className="botao-texto"
                            onClick={() => onStatus(session, "cancelled")}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="estado-vazio">
              <Icon name="calendar" size={32} />
              <h2>Espaço para novos encontros.</h2>
              <p>Você ainda não tem atendimentos nesta data.</p>
              <button
                className="botao botao--principal"
                onClick={() => onNew(date)}
              >
                Agendar atendimento
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
