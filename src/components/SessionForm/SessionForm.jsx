import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import { todayInBrasilia, sessionInstant } from "../../utils/sessionTime";
export default function SessionForm({
  session,
  date,
  students,
  locations,
  busy,
  error,
  onClose,
  onSave,
}) {
  const activeStudents = students.filter((student) => student.active);
  const [values, setValues] = useState({
    studentId: session?.studentId || "",
    date: session?.date || date,
    time: session?.time || "",
    end: session?.end || "",
    location: session?.location || "",
    locationId: locations.some((item) => item._id === session?.locationId)
      ? session.locationId
      : "",
  });
  const [localError, setLocalError] = useState("");
  const change = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    setLocalError("");
  };
  const valid =
    activeStudents.some((student) => student._id === values.studentId) &&
    values.date &&
    values.time &&
    values.end &&
    (values.locationId || values.location.trim());
  return (
    <Modal
      title={session ? "Editar atendimento" : "Novo atendimento"}
      subtitle="Horário de Brasília. Reserve pelo menos 45 minutos entre aulas."
      onClose={onClose}
    >
      {!activeStudents.length ? (
        <div className="estado-vazio">
          <p>Cadastre ou ative um aluno antes de agendar.</p>
          <Link
            className="botao botao--principal"
            to="/alunos"
            onClick={onClose}
          >
            Ir para alunos
          </Link>
        </div>
      ) : (
        <form
          className="formulario"
          onSubmit={(event) => {
            event.preventDefault();
            if (!valid || busy) return;
            if (values.end <= values.time) {
              setLocalError(
                "O término deve ser depois do início, no mesmo dia.",
              );
              return;
            }
            if (
              !Number.isFinite(sessionInstant(values.date, values.time)) ||
              sessionInstant(values.date, values.time) <= Date.now()
            ) {
              setLocalError("Agende uma aula em um horário futuro.");
              return;
            }
            onSave({
              studentId: values.studentId,
              date: values.date,
              time: values.time,
              end: values.end,
              ...(values.locationId
                ? { locationId: values.locationId }
                : { location: values.location.trim() }),
            });
          }}
        >
          <div className="campo">
            <label className="campo__rotulo" htmlFor="sessao-aluno">
              Aluno
            </label>
            <select
              className="entrada"
              id="sessao-aluno"
              name="studentId"
              value={values.studentId}
              onChange={change}
              required
              disabled={busy}
            >
              <option value="">Selecione um aluno ativo</option>
              {activeStudents.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="sessao-data">
              Data
            </label>
            <input
              className="entrada"
              id="sessao-data"
              type="date"
              name="date"
              min={todayInBrasilia()}
              max="9999-12-31"
              value={values.date}
              required
              disabled={busy}
              onChange={change}
            />
          </div>
          <div className="formulario__linha">
            {[
              { name: "time", label: "Início" },
              { name: "end", label: "Término" },
            ].map((field) => (
              <div className="campo" key={field.name}>
                <label
                  className="campo__rotulo"
                  htmlFor={"sessao-" + field.name}
                >
                  {field.label}
                </label>
                <input
                  className="entrada"
                  id={"sessao-" + field.name}
                  type="time"
                  name={field.name}
                  value={values[field.name]}
                  required
                  disabled={busy}
                  onChange={change}
                />
              </div>
            ))}
          </div>
          <div className="campo">
            <label className="campo__rotulo" htmlFor="sessao-local-salvo">
              Local de atendimento
            </label>
            <select
              className="entrada"
              id="sessao-local-salvo"
              name="locationId"
              value={values.locationId}
              onChange={change}
              disabled={busy}
            >
              <option value="">Informar endereço ou descrição</option>
              {locations.map((place) => (
                <option key={place._id} value={place._id}>
                  {place.name} — {place.address}
                </option>
              ))}
            </select>
          </div>
          {!values.locationId && (
            <div className="campo">
              <label className="campo__rotulo" htmlFor="sessao-local">
                Endereço ou descrição do local
              </label>
              <input
                className="entrada"
                id="sessao-local"
                name="location"
                value={values.location}
                maxLength={500}
                required
                disabled={busy}
                onChange={change}
              />
            </div>
          )}
          {(localError || error) && (
            <p className="formulario__erro" role="alert">
              {localError || error}
            </p>
          )}
          {busy && <p role="status">Salvando atendimento…</p>}
          <div className="formulario__acoes">
            <button
              className="botao botao--contorno"
              type="button"
              onClick={onClose}
              disabled={busy}
            >
              Voltar
            </button>
            <button
              className="botao botao--principal"
              disabled={!valid || busy}
            >
              {busy ? "Salvando…" : "Salvar atendimento"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
