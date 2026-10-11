import { useState } from "react";
import Modal from "../Modal/Modal";
export default function SessionResult({
  status,
  session,
  studentName,
  busy,
  error,
  onClose,
  onSave,
}) {
  const [cancelledBy, setCancelledBy] = useState("");
  const cancelling = status === "cancelled";
  return (
    <Modal
      title={
        cancelling
          ? "Cancelar atendimento"
          : status === "completed"
            ? "Confirmar aula realizada"
            : "Registrar falta"
      }
      subtitle={
        studentName +
        " · " +
        session.date.split("-").reverse().join("/") +
        " · " +
        session.time +
        "–" +
        session.end
      }
      onClose={onClose}
    >
      <form
        className="formulario"
        onSubmit={(event) => {
          event.preventDefault();
          if (!busy && (!cancelling || cancelledBy))
            onSave({ status, ...(cancelling ? { cancelledBy } : {}) });
        }}
      >
        {cancelling ? (
          <>
            <p>
              O atendimento continuará no histórico e não poderá ser reaberto.
            </p>
            <div className="campo">
              <label className="campo__rotulo" htmlFor="cancelado-por">
                Quem cancelou?
              </label>
              <select
                className="entrada"
                id="cancelado-por"
                value={cancelledBy}
                onChange={(event) => setCancelledBy(event.target.value)}
                required
                disabled={busy}
              >
                <option value="">Selecione</option>
                <option value="professional">Profissional</option>
                <option value="student">Aluno</option>
              </select>
            </div>
          </>
        ) : (
          <p>
            Confirme o resultado deste atendimento. Realização e falta podem ser
            corrigidas posteriormente.
          </p>
        )}
        {error && (
          <p className="formulario__erro" role="alert">
            {error}
          </p>
        )}
        {busy && <p role="status">Registrando resultado…</p>}
        <div className="formulario__acoes">
          <button
            className="botao botao--contorno"
            type="button"
            disabled={busy}
            onClick={onClose}
          >
            Voltar
          </button>
          <button
            className="botao botao--principal"
            disabled={busy || (cancelling && !cancelledBy)}
          >
            {busy ? "Salvando…" : "Confirmar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
