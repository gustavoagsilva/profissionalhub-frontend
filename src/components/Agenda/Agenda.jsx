import { useState } from "react";
import Icon from "../Icon/Icon";
import { DEMO_DATE, initials } from "../../utils/demoData";
import "./Agenda.css";
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

export default function Agenda({ sessions, students, onNew, onStatus }) {
  const [date, setDate] = useState(DEMO_DATE);
  const rows = sessions
    .filter((session) => session.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
  const changeDay = (offset) => {
    const next = new Date(date + "T12:00:00");
    next.setDate(next.getDate() + offset);
    setDate(next.toLocaleDateString("en-CA"));
  };
  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <span className="chamada">UM ATENDIMENTO DE CADA VEZ</span>
          <h1>Sua agenda</h1>
          <p>Horários, lugares e pessoas em sintonia.</p>
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
              onClick={() => setDate(DEMO_DATE)}
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
                (item) => item.id === session.studentId,
              );
              return (
                <article
                  className={
                    "atendimento atendimento--" + statusClasses[session.status]
                  }
                  key={session.id}
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
                      {session.makeupId && (
                        <span className="etiqueta etiqueta--verde">
                          Reposição
                        </span>
                      )}
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
                    </span>
                    {session.status === "scheduled" && (
                      <div className="atendimento__acoes">
                        <button
                          className="botao botao--contorno botao--pequeno"
                          onClick={() => onStatus(session, "completed")}
                        >
                          <Icon name="check" size={14} />
                          Realizada
                        </button>
                        <button
                          className="botao-texto"
                          onClick={() => onStatus(session, "missed")}
                        >
                          Falta
                        </button>
                        <button
                          className="botao-texto"
                          onClick={() => onStatus(session, "cancelled")}
                        >
                          Cancelar
                        </button>
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
