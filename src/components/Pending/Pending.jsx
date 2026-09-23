import { useHistory, useLocation } from "react-router-dom";
import Icon from "../Icon/Icon";
import { money, formatDate, initials } from "../../utils/demoData";
import "./Pending.css";
export default function Pending({
  charges,
  makeups,
  students,
  onPaid,
  onSchedule,
  onNewCharge,
}) {
  const history = useHistory();
  const location = useLocation();
  const tab =
    new URLSearchParams(location.search).get("aba") === "reposicoes"
      ? "makeups"
      : "charges";
  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <span className="chamada">TUDO NO SEU TEMPO</span>
          <h1>Pendências</h1>
          <p>Cuide dos detalhes que mantêm sua rotina em dia.</p>
        </div>
        <button className="botao botao--principal" onClick={onNewCharge}>
          <Icon name="plus" size={17} />
          Nova cobrança
        </button>
      </div>
      <div className="abas" aria-label="Tipo de pendência">
        <button
          className={
            "abas__botao" + (tab === "charges" ? " abas__botao--ativo" : "")
          }
          aria-pressed={tab === "charges"}
          onClick={() => history.replace("/pendencias")}
        >
          <Icon name="wallet" size={17} />
          Cobranças
          <span>{charges.filter((charge) => !charge.paid).length}</span>
        </button>
        <button
          className={
            "abas__botao" + (tab === "makeups" ? " abas__botao--ativo" : "")
          }
          aria-pressed={tab === "makeups"}
          onClick={() => history.replace("/pendencias?aba=reposicoes")}
        >
          <Icon name="repeat" size={17} />
          Reposições
          <span>
            {makeups.filter((makeup) => makeup.status !== "completed").length}
          </span>
        </button>
      </div>
      <section className="secao">
        {tab === "charges" ? (
          <>
            <div className="secao__cabecalho">
              <div>
                <h2>Suas cobranças</h2>
                <p>Quitação integral, registrada por você.</p>
              </div>
              <strong className="pendencias__total">
                {money(
                  charges
                    .filter((charge) => !charge.paid)
                    .reduce((sum, charge) => sum + charge.amount, 0),
                )}
                <small>em aberto</small>
              </strong>
            </div>
            <div className="pendencias__lista">
              {charges.length ? (
                charges.map((charge) => {
                  const student = students.find(
                    (item) => item.id === charge.studentId,
                  );
                  return (
                    <article className="pendencia" key={charge.id}>
                      <span className={"avatar avatar--" + student?.color}>
                        {initials(student?.name || "Aluno")}
                      </span>
                      <div className="pendencia__informacoes">
                        <h3>{student?.name}</h3>
                        <p>
                          {charge.description} · Vence em{" "}
                          {formatDate(charge.due)}
                        </p>
                      </div>
                      <strong className="pendencia__valor">
                        {money(charge.amount)}
                      </strong>
                      <span
                        className={
                          "etiqueta etiqueta--" +
                          (charge.paid ? "verde" : "laranja")
                        }
                      >
                        {charge.paid ? "Pago" : "Em aberto"}
                      </span>
                      {!charge.paid && (
                        <button
                          className="botao botao--contorno botao--pequeno"
                          onClick={() => onPaid(charge.id)}
                        >
                          Registrar pagamento
                        </button>
                      )}
                    </article>
                  );
                })
              ) : (
                <p className="estado-vazio">Nenhuma cobrança cadastrada.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="secao__cabecalho">
              <div>
                <h2>Uma nova oportunidade de encontro</h2>
                <p>
                  Agendar uma reposição reserva o horário. Realizá-la conclui a
                  pendência.
                </p>
              </div>
            </div>
            <div className="pendencias__lista">
              {makeups.length ? (
                makeups.map((makeup) => {
                  const student = students.find(
                    (item) => item.id === makeup.studentId,
                  );
                  return (
                    <article className="pendencia" key={makeup.id}>
                      <span className="avatar avatar--salvia">
                        <Icon name="repeat" size={19} />
                      </span>
                      <div className="pendencia__informacoes">
                        <h3>{student?.name}</h3>
                        <p>{makeup.reason}</p>
                      </div>
                      <span
                        className={
                          "etiqueta etiqueta--" +
                          (makeup.status === "completed" ? "verde" : "laranja")
                        }
                      >
                        {makeup.status === "pending"
                          ? "A agendar"
                          : makeup.status === "scheduled"
                            ? "Agendada"
                            : "Concluída"}
                      </span>
                      {makeup.status === "pending" && (
                        <button
                          className="botao botao--contorno botao--pequeno"
                          disabled={!student?.active}
                          title={
                            !student?.active
                              ? "Ative o aluno antes de agendar."
                              : undefined
                          }
                          onClick={() => onSchedule(makeup)}
                        >
                          Agendar reposição
                        </button>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="estado-vazio">
                  <Icon name="check" size={30} />
                  <h2>Tudo em dia por aqui.</h2>
                  <p>As reposições autorizadas aparecerão nesta lista.</p>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
