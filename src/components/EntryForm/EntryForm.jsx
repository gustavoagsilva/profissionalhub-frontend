import { useState } from "react";
import Modal from "../Modal/Modal";
export default function EntryForm({ entry, onClose, onSave }) {
  const [values, setValues] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    goal: "",
    ...entry,
  }));
  const [error, setError] = useState("");
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
      title={entry?.id ? "Editar aluno" : "Um novo aluno por perto."}
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
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
