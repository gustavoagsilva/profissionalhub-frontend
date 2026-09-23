import { useEffect, useRef } from "react";
import Icon from "../Icon/Icon";
import "./Modal.css";
export default function Modal({ title, subtitle, children, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby="modal-title"
      aria-describedby={subtitle ? "modal-subtitle" : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) {
          const rect = dialog.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="botao-icone modal__fechar"
        onClick={onClose}
        aria-label="Fechar janela"
      >
        <Icon name="close" />
      </button>
      <div className="modal__simbolo">
        <Icon name="spark" size={26} />
      </div>
      <h2 id="modal-title" className="modal__titulo">
        {title}
      </h2>
      {subtitle && (
        <p id="modal-subtitle" className="modal__subtitulo">
          {subtitle}
        </p>
      )}
      {children}
    </dialog>
  );
}
