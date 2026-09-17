import "./Preloader.css";
export default function Preloader({ label = "Buscando locais…" }) {
  return (
    <div className="carregamento" role="status">
      <span className="carregamento__indicador" />
      {label}
    </div>
  );
}
