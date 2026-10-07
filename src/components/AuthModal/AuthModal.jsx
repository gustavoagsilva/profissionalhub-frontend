import { useState } from "react";
import Modal from "../Modal/Modal";
import Icon from "../Icon/Icon";
import "./AuthModal.css";
export default function AuthModal({
  mode,
  onClose,
  onModeChange,
  onEnter,
  busy,
  error,
}) {
  const register = mode === "register";
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [visible, setVisible] = useState(false);
  const errors = {
    name:
      values.name.trim().length < 2 || values.name.trim().length > 30
        ? "Use entre 2 e 30 caracteres."
        : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
      ? ""
      : "Informe um e-mail válido.",
    password:
      values.password.length < 8
        ? "Use pelo menos 8 caracteres."
        : new TextEncoder().encode(values.password).length > 72
          ? "A senha deve ter no máximo 72 bytes."
          : "",
  };
  const valid =
    !errors.email && !errors.password && (!register || !errors.name);
  const fields = [
    ...(register
      ? [
          {
            name: "name",
            label: "Seu nome",
            placeholder: "Como podemos chamar você?",
            type: "text",
            autoComplete: "name",
          },
        ]
      : []),
    {
      name: "email",
      label: "E-mail",
      placeholder: "voce@exemplo.com",
      type: "email",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Senha",
      placeholder: "Pelo menos 8 caracteres",
      type: visible ? "text" : "password",
      autoComplete: register ? "new-password" : "current-password",
    },
  ];
  return (
    <Modal
      title={
        register ? "Seu próximo passo começa aqui." : "Bom ter você de volta."
      }
      subtitle={
        register
          ? "Prepare seu espaço para uma rotina mais organizada."
          : "Entre para acompanhar seus alunos e atendimentos."
      }
      onClose={onClose}
    >
      <form
        className="formulario"
        onSubmit={(event) => {
          event.preventDefault();
          if (valid && !busy)
            onEnter({
              name: values.name.trim(),
              email: values.email.trim().toLowerCase(),
              password: values.password,
            });
        }}
        noValidate
      >
        {fields.map((field) => (
          <div className="campo" key={field.name}>
            <label className="campo__rotulo" htmlFor={"auth-" + field.name}>
              {field.label}
            </label>
            <div className="autenticacao__campo-senha">
              <input
                id={"auth-" + field.name}
                className="entrada"
                type={field.type}
                value={values[field.name]}
                placeholder={field.placeholder}
                disabled={busy}
                required
                autoComplete={field.autoComplete}
                maxLength={field.name === "name" ? 30 : undefined}
                minLength={field.name === "password" ? 8 : undefined}
                aria-invalid={Boolean(
                  touched[field.name] && errors[field.name],
                )}
                aria-describedby={
                  touched[field.name] && errors[field.name]
                    ? "error-" + field.name
                    : undefined
                }
                onChange={(event) => {
                  setValues({ ...values, [field.name]: event.target.value });
                  setTouched({ ...touched, [field.name]: true });
                }}
                onBlur={() => setTouched({ ...touched, [field.name]: true })}
              />
              {field.name === "password" && (
                <button
                  className="botao-icone autenticacao__visibilidade-senha"
                  type="button"
                  aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={visible}
                  onClick={() => setVisible(!visible)}
                >
                  <Icon name="eye" size={18} />
                </button>
              )}
            </div>
            {touched[field.name] && errors[field.name] && (
              <span id={"error-" + field.name} className="campo__erro">
                {errors[field.name]}
              </span>
            )}
          </div>
        ))}
        {error && (
          <p className="formulario__erro" role="alert">
            {error}
          </p>
        )}
        {busy && (
          <p role="status">
            Conectando. O primeiro acesso pode levar cerca de um minuto.
          </p>
        )}
        <button
          className="botao botao--principal botao--largura-total"
          disabled={!valid || busy}
        >
          {busy ? "Aguarde…" : register ? "Criar conta" : "Entrar"}
          <Icon name="arrow" size={18} />
        </button>
      </form>
      <p className="autenticacao__alternancia">
        {register ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
        <button
          className="botao-texto"
          disabled={busy}
          onClick={() => onModeChange(register ? "login" : "register")}
        >
          {register ? "Entrar" : "Cadastre-se"}
        </button>
      </p>
    </Modal>
  );
}
