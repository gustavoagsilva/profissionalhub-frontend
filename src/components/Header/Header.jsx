import { useContext } from "react";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import "./Header.css";
import Icon from "../Icon/Icon";
export default function Header({ onLogin, onRegister, onSignOut }) {
  const user = useContext(CurrentUserContext);
  return (
    <header className="apresentacao__cabecalho">
      <a className="marca" href="#inicio">
        <span className="marca__simbolo">
          <Icon name="spark" size={21} />
        </span>
        Profissional<span className="marca__leve">Hub</span>
      </a>
      <nav className="apresentacao__navegacao" aria-label="Navegação principal">
        <a href="#recursos">A plataforma</a>
        <a href="#sobre">Sobre</a>
        {user ? (
          <>
            <Link className="link-texto" to="/painel">
              Abrir painel
            </Link>
            <button
              className="botao botao--contorno botao--pequeno"
              onClick={onSignOut}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <button className="botao-texto" onClick={onLogin}>
              Entrar
            </button>
            <button
              className="botao botao--principal botao--pequeno"
              onClick={onRegister}
            >
              Começar agora
              <Icon name="arrow" size={16} />
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
