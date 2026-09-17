import { useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import Preloader from "../Preloader/Preloader";
import { findPlaces, calculateTravel } from "../../utils/ThirdPartyApi";
import "./Locations.css";
export default function Locations({ saved, onSave }) {
  const [category, setCategory] = useState("sport.fitness");
  const [results, setResults] = useState(null);
  const [visible, setVisible] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState([]);
  const [travel, setTravel] = useState(null);
  const [travelLoading, setTravelLoading] = useState(false);
  const [travelError, setTravelError] = useState("");
  const searchController = useRef(null);
  const travelController = useRef(null);
  useEffect(
    () => () => {
      searchController.current?.abort();
      travelController.current?.abort();
    },
    [],
  );
  const search = async (event) => {
    event.preventDefault();
    searchController.current?.abort();
    travelController.current?.abort();
    const controller = new AbortController();
    searchController.current = controller;
    setLoading(true);
    setTravelLoading(false);
    setError("");
    setResults(null);
    setSelected([]);
    setTravel(null);
    setTravelError("");
    setVisible(3);
    try {
      const places = await findPlaces(category, controller.signal);
      if (!controller.signal.aborted) setResults(places);
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure.message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };
  const toggle = (place) => {
    travelController.current?.abort();
    setTravelLoading(false);
    setTravel(null);
    setTravelError("");
    setSelected((items) =>
      items.some((item) => item.id === place.id)
        ? items.filter((item) => item.id !== place.id)
        : items.length < 2
          ? [...items, place]
          : items,
    );
  };
  const route = async () => {
    travelController.current?.abort();
    const controller = new AbortController();
    travelController.current = controller;
    setTravelLoading(true);
    setTravelError("");
    try {
      const result = await calculateTravel(
        selected[0],
        selected[1],
        controller.signal,
      );
      if (!controller.signal.aborted) setTravel(result);
    } catch (failure) {
      if (!controller.signal.aborted) setTravelError(failure.message);
    } finally {
      if (!controller.signal.aborted) setTravelLoading(false);
    }
  };
  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <span className="chamada">ESPAÇO PARA NOVAS POSSIBILIDADES</span>
          <h1>Explorar locais</h1>
          <p>Busque espaços reais para sua rotina em São Paulo.</p>
        </div>
        <span className="etiqueta etiqueta--verde">
          <Icon name="pin" size={12} />
          São Paulo · SP
        </span>
      </div>
      <section className="locais__introducao">
        <div>
          <h2>Onde será seu próximo atendimento?</h2>
          <p>
            Busca em um raio de 15 km do centro. Confira as condições de acesso
            com cada local.
          </p>
        </div>
        <form className="locais__busca" onSubmit={search}>
          <label className="texto-acessivel" htmlFor="category">
            Tipo de local
          </label>
          <select
            id="category"
            className="entrada"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="sport.fitness">Academias e espaços fitness</option>
            <option value="leisure.park">Parques e praças</option>
            <option value="sport.sports_centre">Centros esportivos</option>
          </select>
          <button className="botao botao--principal" disabled={loading}>
            <Icon name="search" size={17} />
            Buscar locais
          </button>
        </form>
      </section>
      {loading && <Preloader />}
      {error && (
        <p className="formulario__erro" role="alert">
          {error}
        </p>
      )}
      {results !== null && !loading && (
        <>
          <div className="titulo-secao">
            <h2>Resultados da busca</h2>
            <span>{results.length} local(is) · dados da Geoapify</span>
          </div>
          {results.length === 0 ? (
            <div className="estado-vazio">
              <Icon name="search" size={30} />
              <h2>Nada encontrado</h2>
              <p>Experimente outra categoria.</p>
            </div>
          ) : (
            <>
              <div className="lista-locais">
                {results.slice(0, visible).map((place) => {
                  const checked = selected.some((item) => item.id === place.id);
                  const isSaved = saved.some((item) => item.id === place.id);
                  return (
                    <article className="local" key={place.id}>
                      <div className="local__visual">
                        <Icon
                          name={
                            category === "leisure.park" ? "tree" : "building"
                          }
                          size={38}
                        />
                        <span>São Paulo</span>
                      </div>
                      <div className="local__conteudo">
                        <h3>{place.name}</h3>
                        <p>
                          <Icon name="pin" size={13} />
                          {place.address}
                        </p>
                        <label className="local__selecao">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!checked && selected.length === 2}
                            onChange={() => toggle(place)}
                          />
                          {checked
                            ? "Selecionado para o trajeto"
                            : "Selecionar para trajeto"}
                        </label>
                        <button
                          className="botao botao--contorno botao--largura-total botao--pequeno"
                          disabled={isSaved}
                          onClick={() => onSave(place)}
                        >
                          <Icon name={isSaved ? "check" : "plus"} size={15} />
                          {isSaved ? "Local salvo" : "Salvar local"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
              {visible < results.length && (
                <div className="locais__mais">
                  <button
                    className="botao botao--contorno"
                    onClick={() => setVisible(visible + 3)}
                  >
                    Mostrar mais
                    <Icon name="plus" size={17} />
                  </button>
                </div>
              )}
              <section className="deslocamento">
                <div>
                  <h2>
                    <Icon name="arrow" size={20} />
                    Entre um atendimento e outro
                  </h2>
                  <p>
                    {selected.length === 2
                      ? selected[0].name + " → " + selected[1].name
                      : "Selecione dois resultados para estimar o deslocamento de carro."}
                  </p>
                  {travel && (
                    <strong className="deslocamento__resultado">
                      {(travel.distance / 1000).toLocaleString("pt-BR", {
                        maximumFractionDigits: 1,
                      })}{" "}
                      km · cerca de {Math.max(1, Math.round(travel.time / 60))}{" "}
                      min
                      <small>
                        Estimativa do serviço, sem garantia de trânsito em tempo
                        real.
                      </small>
                    </strong>
                  )}
                  {travelError && (
                    <p className="campo__erro" role="alert">
                      {travelError}
                    </p>
                  )}
                </div>
                <button
                  className="botao botao--principal"
                  disabled={selected.length !== 2 || travelLoading}
                  onClick={route}
                >
                  {travelLoading ? "Calculando…" : "Calcular deslocamento"}
                </button>
              </section>
            </>
          )}
        </>
      )}
      <div className="titulo-secao">
        <h2>Meus locais de atendimento</h2>
        <span>Lista temporária da demonstração</span>
      </div>
      <div className="locais-salvos">
        {saved.map((place) => (
          <article className="local-salvo" key={place.id}>
            <span className="avatar avatar--salvia">
              <Icon name={place.icon || "pin"} size={20} />
            </span>
            <div>
              <h3>{place.name}</h3>
              <p>{place.address}</p>
            </div>
            <Icon name="check" size={17} />
          </article>
        ))}
      </div>
      <p className="locais__creditos">
        Powered by{" "}
        <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">
          Geoapify
        </a>{" "}
        · Dados ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap contributors
        </a>
      </p>
    </>
  );
}
