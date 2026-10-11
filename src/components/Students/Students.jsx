import { useState } from "react";
import Preloader from "../Preloader/Preloader";
import { formatStudentPhone } from "../../utils/studentPhone";
import Icon from "../Icon/Icon";
import { initials } from "../../utils/formatters";
import "./Students.css";
export default function Students({
  students,
  onNew,
  onEdit,
  onToggle,
  loading,
  error,
  onRetry,
  busyId,
}) {
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
        <button
          className="botao botao--principal"
          disabled={loading || Boolean(error) || Boolean(busyId)}
          onClick={onNew}
        >
          <Icon name="plus" size={17} />
          Novo aluno
        </button>
      </div>
      {loading ? (
        <Preloader label="Carregando alunos…" />
      ) : error ? (
        <section className="secao estado-vazio">
          <p role="alert">{error}</p>
          <button className="botao botao--contorno" onClick={onRetry}>
            Tentar novamente
          </button>
        </section>
      ) : (
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
                <article className="aluno" key={student._id}>
                  <span className={"avatar avatar--grande avatar--salvia"}>
                    {initials(student.name)}
                  </span>
                  <div className="aluno__informacoes">
                    <h2>{student.name}</h2>
                    <p>{formatStudentPhone(student.phone)}</p>
                    {student.email && <p>{student.email}</p>}
                    <span>
                      {student.goal || "Objetivo ainda não informado"}
                    </span>
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
                      disabled={Boolean(busyId)}
                      aria-label={"Editar " + student.name}
                      onClick={() => onEdit(student)}
                    >
                      Editar
                    </button>
                    <button
                      className="botao-texto aluno__alternar-status"
                      disabled={Boolean(busyId)}
                      aria-label={
                        (student.active ? "Inativar " : "Ativar ") +
                        student.name
                      }
                      onClick={() => onToggle(student)}
                    >
                      {busyId === student._id
                        ? "Aguarde…"
                        : student.active
                          ? "Inativar"
                          : "Ativar"}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="estado-vazio">
                <Icon name="search" size={30} />
                <h2>
                  {students.length
                    ? "Nenhum aluno encontrado"
                    : "Você ainda não cadastrou alunos"}
                </h2>
                <p>
                  {students.length
                    ? "Tente outro nome ou altere o filtro."
                    : "Use o botão Novo aluno para começar."}
                </p>
              </div>
            )}
          </div>
          <div className="secao__rodape">
            {results.length} aluno(s) nesta lista
          </div>
        </section>
      )}
    </>
  );
}
