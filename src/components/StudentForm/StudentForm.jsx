import { useState } from "react";
import Modal from "../Modal/Modal";
import { phoneDigits, isStudentPhone } from "../../utils/studentPhone";
import "./StudentForm.css";
export default function StudentForm({ student, onClose, onSave, busy, error }) {
  const [values, setValues] = useState({
    name: student?.name || "",
    phone: phoneDigits(student?.phone || ""),
    email: student?.email || "",
    goal: student?.goal || "",
  });
  const [touched, setTouched] = useState({});
  const errors = {
    name:
      values.name.trim().length < 2 || values.name.trim().length > 60
        ? "Use entre 2 e 60 caracteres."
        : "",
    phone: isStudentPhone(values.phone)
      ? ""
      : "Informe um DDD válido e um celular com 9 dígitos, começando com 9.",
    email:
      !values.email.trim() ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
        ? ""
        : "Informe um e-mail válido.",
    goal: values.goal.trim().length > 120 ? "Use até 120 caracteres." : "",
  };
  const valid = !Object.values(errors).some(Boolean);
  const change = (name, value) => {
    setValues({ ...values, [name]: value });
    setTouched({ ...touched, [name]: true });
  };
  const digits = values.phone;
  const maskedPhone =
    digits.length > 2
      ? "(" +
        digits.slice(0, 2) +
        ") " +
        digits.slice(2, 7) +
        (digits.length > 7 ? "-" + digits.slice(7) : "")
      : digits;
  return (
    <Modal
      title={student ? "Editar aluno" : "Um novo aluno por perto."}
      subtitle="Nome e WhatsApp são obrigatórios."
      onClose={onClose}
    >
      <form
        className="formulario"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setTouched({ name: true, phone: true, email: true, goal: true });
          if (!valid || busy) return;
          onSave({
            ...(student ? {} : { name: values.name.trim() }),
            phone: "+55" + values.phone,
            email: values.email.trim().toLowerCase(),
            goal: values.goal.trim(),
          });
        }}
      >
        {[
          {
            name: "name",
            label: "Nome completo",
            maxLength: 60,
            required: true,
          },
          { name: "phone", label: "WhatsApp", type: "tel", required: true },
          { name: "email", label: "E-mail (opcional)", type: "email" },
          { name: "goal", label: "Objetivo (opcional)", maxLength: 120 },
        ].map((field) => (
          <div className="campo" key={field.name}>
            <label className="campo__rotulo" htmlFor={"aluno-" + field.name}>
              {field.label}
            </label>
            <div
              className={field.name === "phone" ? "telefone-aluno" : undefined}
            >
              {field.name === "phone" && (
                <span className="telefone-aluno__prefixo" aria-hidden="true">
                  +55
                </span>
              )}
              <input
                className="entrada"
                id={"aluno-" + field.name}
                type={field.type || "text"}
                value={
                  field.name === "phone" ? maskedPhone : values[field.name]
                }
                disabled={busy}
                readOnly={Boolean(student && field.name === "name")}
                required={field.required}
                maxLength={field.maxLength}
                placeholder={
                  field.name === "phone" ? "(11) 99999-9999" : undefined
                }
                aria-invalid={Boolean(
                  touched[field.name] && errors[field.name],
                )}
                aria-describedby={
                  field.name === "phone"
                    ? "telefone-ajuda erro-phone"
                    : "erro-" + field.name
                }
                onChange={(event) =>
                  change(
                    field.name,
                    field.name === "phone"
                      ? phoneDigits(event.target.value)
                      : event.target.value,
                  )
                }
                onBlur={() => setTouched({ ...touched, [field.name]: true })}
              />
            </div>
            {field.name === "phone" && (
              <small id="telefone-ajuda">
                Brasil (+55). Digite somente o DDD e o celular cadastrado no
                WhatsApp.
              </small>
            )}
            {student && field.name === "name" && (
              <small>O nome não pode ser alterado após o cadastro.</small>
            )}
            <span className="campo__erro" id={"erro-" + field.name}>
              {touched[field.name] ? errors[field.name] : ""}
            </span>
          </div>
        ))}
        {error && (
          <p role="alert" className="formulario__erro">
            {error}
          </p>
        )}
        {busy && <p role="status">Salvando aluno…</p>}
        <div className="formulario__acoes">
          <button
            type="button"
            className="botao botao--contorno"
            disabled={busy}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="botao botao--principal"
            disabled={!valid || busy}
          >
            {busy ? "Salvando…" : "Salvar aluno"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
