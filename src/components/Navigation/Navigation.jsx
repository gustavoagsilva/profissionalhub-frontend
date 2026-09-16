import { NavLink, Link } from "react-router-dom";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { initials } from "../../utils/demoData";
import Icon from "../Icon/Icon";
import "./Navigation.css";
const links = [
  { path: "/painel", icon: "grid", name: "Visão geral" },
  { path: "/alunos", icon: "users", name: "Alunos" },
  { path: "/agenda", icon: "calendar", name: "Agenda" },
];
export default function Navigation({ onSignOut, open, onClose }) {
  const user = useContext(CurrentUserContext);
  return (
    <>
      <button
        className={"fundo-menu" + (open ? " fundo-menu--visivel" : "")}
        onClick={onClose}
        aria-label="Fechar navegação"
        tabIndex={open ? 0 : -1}
      />
      <aside className={"menu-lateral" + (open ? " menu-lateral--aberto" : "")}>
        <Link
          to="/painel"
          className="marca menu-lateral__marca"
          onClick={onClose}
        >
          <span className="marca__simbolo">
            <Icon name="spark" size={21} />
          </span>
          Profissional<span className="marca__leve">Hub</span>
        </Link>
        <div className="menu-lateral__espaco">
          <span className="menu-lateral__icone-espaco">
            <Icon name="home" size={19} />
          </span>
          <div>
            <strong>Meu espaço</strong>
            <small>Profissional autônomo</small>
          </div>
          <span className="ponto-status" />
        </div>
        <p className="menu-lateral__rotulo">PRINCIPAL</p>
        <nav
          className="menu-lateral__navegacao"
          aria-label="Navegação do painel"
        >
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              activeClassName="menu-lateral__atalho--ativo"
              className="menu-lateral__atalho"
              onClick={onClose}
            >
              <Icon name={link.icon} size={19} />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="menu-lateral__nota">
          <Icon name="tree" size={26} />
          <strong>Seu trabalho merece espaço.</strong>
          <p>Uma rotina organizada começa com um atendimento de cada vez.</p>
        </div>
        <div className="menu-lateral__perfil">
          <span className="avatar avatar--salvia">{initials(user.name)}</span>
          <div>
            <strong>{user.name}</strong>
            <small>Conta de demonstração</small>
          </div>
          <button
            className="botao-icone"
            aria-label="Sair da conta"
            title="Sair"
            onClick={onSignOut}
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
