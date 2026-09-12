import "./About.css";
import Icon from "../Icon/Icon";
export default function About({ onDemo }) {
  return (
    <section id="sobre" className="sobre">
      <div>
        <span className="chamada">SOBRE O PROJETO</span>
        <h2>Tecnologia a serviço da sua rotina.</h2>
        <p>
          Desenvolvido por Gustavo Augusto, o ProfissionalHub nasce para apoiar
          a organização de profissionais autônomos de Educação Física. Esta é
          uma versão demonstrativa em desenvolvimento.
        </p>
      </div>
      <button
        className="botao botao--contorno"
        onClick={onDemo}
        disabled={!onDemo}
        title="Disponível em uma próxima etapa"
      >
        Conhecer por dentro
        <Icon name="arrow" size={18} />
      </button>
    </section>
  );
}
