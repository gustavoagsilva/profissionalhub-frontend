import "./About.css";
import Icon from "../Icon/Icon";
export default function About({ onRegister }) {
  return (
    <section id="sobre" className="sobre">
      <div>
        <span className="chamada">SOBRE O PROFISSIONALHUB</span>
        <h2>Mais organização para cuidar de quem se movimenta.</h2>
        <p>
          O ProfissionalHub foi pensado para profissionais autônomos de Educação
          Física que dividem o dia entre alunos, atendimentos e a gestão do
          próprio trabalho.
        </p>
        <p>
          Reúna sua agenda, organize seus alunos e encontre locais para atender
          em um só lugar. Uma forma simples de organizar os detalhes da rotina e
          dedicar mais atenção aos seus alunos.
        </p>
      </div>
      <button className="botao botao--contorno" onClick={onRegister}>
        Conhecer por dentro
        <Icon name="arrow" size={18} />
      </button>
    </section>
  );
}
