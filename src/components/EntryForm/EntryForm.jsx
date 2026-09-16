import { useState } from "react";
import Modal from "../Modal/Modal";
import { DEMO_DATE } from "../../utils/demoData";
export default function EntryForm({
  kind,
  students,
  locations,
  entry,
  onClose,
  onSave,
}) {
  const [values, setValues] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    goal: "",
    studentId: students.find((student) => student.active)?.id || "",
    date: DEMO_DATE,
    time: "10:00",
    end: "11:00",
    location: locations[0]?.name || "",
    amount: "",
    due: DEMO_DATE,
    description: "Atendimento",
    ...entry,
  }));
  const [error, setError] = useState("");
  const titles = {
    student: entry?.id ? "Editar aluno" : "Um novo aluno por perto.",
    session: entry?.makeupId ? "Agendar reposição" : "Novo atendimento",
    charge: "Nova cobrança",
  };
  const input = (name, label, type = "text", extra = {}) => (
    <div className="campo" key={name}>
      <label className="campo__rotulo" htmlFor={"entry-" + name}>
        {label}
      </label>
      <input
        id={"entry-" + name}
        className="entrada"
        type={type}
        value={values[name]}
        required
        {...extra}
        onChange={(event) => {
          setError("");
          setValues({ ...values, [name]: event.target.value });
        }}
      />
    </div>
  );
  return (
    <Modal
      title={titles[kind]}
      subtitle="Dados de demonstração. As alterações duram enquanto esta página estiver aberta."
      onClose={onClose}
    >
      <form
        className="formulario"
        onSubmit={(event) => {
          event.preventDefault();
          const message = onSave(values);
          if (message) setError(message);
        }}
      >
        {kind === "student" ? (
          <>
            {input("name", "Nome completo", "text", {
              minLength: 2,
              maxLength: 60,
            })}
            {input("email", "E-mail", "email")}
            {input("phone", "Telefone", "tel", { required: false })}
            {input("goal", "Objetivo ou observação", "text", {
              required: false,
              maxLength: 120,
            })}
          </>
        ) : (
          <>
            <div className="campo">
              <label className="campo__rotulo" htmlFor="entry-student">
                Aluno
              </label>
              <select
                id="entry-student"
                className="entrada"
                value={values.studentId}
                required
                disabled={Boolean(entry?.makeupId)}
                onChange={(event) =>
                  setValues({ ...values, studentId: event.target.value })
                }
              >
                <option value="" disabled>
                  Selecione um aluno
                </option>
                {students
                  .filter((student) => student.active)
                  .map((student) => (
                    <option value={student.id} key={student.id}>
                      {student.name}
                    </option>
                  ))}
              </select>
            </div>
            {kind === "session" ? (
              <>
                {input("date", "Data", "date")}
                <div className="formulario__linha">
                  {input("time", "Início", "time")}
                  {input("end", "Término", "time")}
                </div>
                <div className="campo">
                  <label className="campo__rotulo" htmlFor="entry-location">
                    Local
                  </label>
                  <select
                    id="entry-location"
                    className="entrada"
                    value={values.location}
                    required
                    onChange={(event) =>
                      setValues({ ...values, location: event.target.value })
                    }
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                {input("description", "Descrição")}
                {input("amount", "Valor (R$)", "number", {
                  min: "0.01",
                  step: "0.01",
                })}
                {input("due", "Vencimento", "date")}
              </>
            )}
          </>
        )}
        {error && (
          <p role="alert" className="formulario__erro">
            {error}
          </p>
        )}
        <div className="formulario__acoes">
          <button
            className="botao botao--contorno"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button className="botao botao--principal" type="submit">
            {kind === "session" ? "Agendar" : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
