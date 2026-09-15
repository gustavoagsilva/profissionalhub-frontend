import { useState } from "react";
import Icon from "../Icon/Icon";
import { initials } from "../../utils/demoData";
import "./Students.css";
export default function Students({ students, onNew, onEdit, onToggle }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const normalize = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const results = students.filter(
    (student) =>
      normalize(student.name + " " + student.email).includes(
        normalize(query),
      ) &&
      (filter === "all" || student.active === (filter === "active")),
  );
  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <span className="chamada">PESSOAS EM PRIMEIRO LUGAR</span>
          <h1>Seus alunos</h1>
          <p>Cada pessoa, seu objetivo e um próximo passo.</p>
        </div>
        <button className="botao botao--principal" onClick={onNew}>
          <Icon name="plus" size={17} />
          Novo aluno
        </button>
      </div>
      <section className="secao">
        <div className="barra-ferramentas">
          <div className="busca">
            <Icon name="search" size={18} />
            <input
              aria-label="Buscar alunos"
              placeholder="Buscar por nome ou e-mail"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            className="entrada barra-ferramentas__selecao"
            aria-label="Filtrar alunos por status"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">Todos os alunos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
        <div className="lista-alunos">
          {results.length ? (
            results.map((student) => (
              <article className="aluno" key={student.id}>
                <span
                  className={"avatar avatar--grande avatar--" + student.color}
                >
                  {initials(student.name)}
                </span>
                <div className="aluno__informacoes">
                  <h2>{student.name}</h2>
                  <p>{student.email}</p>
                  <span>{student.goal || "Objetivo ainda não informado"}</span>
                </div>
                <span
                  className={
                    "etiqueta etiqueta--" +
                    (student.active ? "verde" : "neutra")
                  }
                >
                  {student.active ? "Ativo" : "Inativo"}
                </span>
                <div className="aluno__acoes">
                  <button
                    className="botao botao--contorno botao--pequeno"
                    onClick={() => onEdit(student)}
                  >
                    Editar
                  </button>
                  <button
                    className="botao-texto aluno__alternar-status"
                    onClick={() => onToggle(student.id)}
                  >
                    {student.active ? "Inativar" : "Ativar"}
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="estado-vazio">
              <Icon name="search" size={30} />
              <h2>Nenhum aluno encontrado</h2>
              <p>Tente outro nome ou altere o filtro.</p>
            </div>
          )}
        </div>
        <div className="secao__rodape">
          {results.length} aluno(s) nesta lista
        </div>
      </section>
    </>
  );
}
