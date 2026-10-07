import { useEffect, useState, useRef } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import * as api from "../../utils/MainApi";
import { initials } from "../../utils/formatters";
import Main from "../Main/Main";
import AuthModal from "../AuthModal/AuthModal";
import Navigation from "../Navigation/Navigation";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Preloader from "../Preloader/Preloader";
import Icon from "../Icon/Icon";
import "./App.css";
const TOKEN_KEY = "profissionalhub:token";
const pages = {
  "/painel": "Visão geral",
  "/alunos": "Alunos",
  "/agenda": "Agenda",
  "/locais": "Explorar locais",
};
function Application() {
  const history = useHistory();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const [retry, setRetry] = useState(0);
  const [authMode, setAuthMode] = useState(null);
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const activeMode = authMode || (location.state?.openLogin ? "login" : null);
  useEffect(() => {
    const controller = new AbortController();
    async function restore() {
      try {
        sessionStorage.removeItem("profissionalhub:demo-user");
        const token = localStorage.getItem(TOKEN_KEY);
        if (token)
          setCurrentUser(await api.getCurrentUser(token, controller.signal));
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setNotice("Sua sessão expirou. Entre novamente.");
        } else
          setSessionError(
            "Não foi possível verificar sua sessão. Tente novamente.",
          );
      } finally {
        if (!controller.signal.aborted) setChecking(false);
      }
    }
    restore();
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    document.title =
      (pages[location.pathname] ? pages[location.pathname] + " · " : "") +
      "ProfissionalHub";
  }, [location.pathname]);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 7000);
    return () => clearTimeout(timeout);
  }, [notice]);
  const closeAuth = () => {
    if (submitting.current) return;
    setAuthMode(null);
    setAuthError("");
    if (location.state?.openLogin) history.replace("/", {});
  };
  const openAuth = (mode) => {
    if (currentUser) {
      history.push("/painel");
      return;
    }
    setAuthError("");
    setAuthMode(mode);
  };
  const enter = async (values) => {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setAuthError("");
    let registered = false;
    try {
      if (activeMode === "register") {
        await api.signup(values);
        registered = true;
      }
      const { token } = await api.signin({
        email: values.email,
        password: values.password,
      });
      if (!token)
        throw new Error("Resposta de login inválida. Tente novamente.");
      const user = await api.getCurrentUser(token);
      localStorage.setItem(TOKEN_KEY, token);
      setCurrentUser(user);
      setAuthMode(null);
      const destination = location.state?.from;
      history.replace(pages[destination] ? destination : "/painel", {});
      setNotice(
        registered ? "Conta criada com sucesso." : "Você entrou na sua conta.",
      );
    } catch (error) {
      if (registered) {
        setAuthMode("login");
        setAuthError(
          "Sua conta foi criada, mas não foi possível entrar. Use seu e-mail e senha para tentar novamente.",
        );
      } else setAuthError(error.message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };
  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
    setAuthMode(null);
    setMobileOpen(false);
    history.push("/");
    setNotice("Você saiu da sua conta.");
  };
  if (checking) return <Preloader label="Verificando sua sessão…" />;
  if (sessionError)
    return (
      <main className="pagina-nao-encontrada">
        <h1>Não conseguimos conectar</h1>
        <p role="alert">{sessionError}</p>
        <button
          className="botao botao--principal"
          onClick={() => {
            setSessionError("");
            setChecking(true);
            setRetry(retry + 1);
          }}
        >
          Tentar novamente
        </button>
      </main>
    );
  const workspace = (
    <div className="area-profissional">
      <Navigation
        onSignOut={signOut}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="area-profissional__corpo">
        <header className="area-profissional__cabecalho">
          <div className="area-profissional__caminho">
            <button
              className="botao-icone area-profissional__menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir navegação"
              aria-expanded={mobileOpen}
            >
              <Icon name="menu" />
            </button>
            <span>Meu espaço</span>
            <Icon name="chevron" size={12} />
            <strong>{pages[location.pathname]}</strong>
          </div>
          <div className="area-profissional__data">
            <Icon name="calendar" size={16} />
            <span>
              {new Date().toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="avatar avatar--salvia">
              {initials(currentUser?.name || "Profissional")}
            </span>
          </div>
        </header>
        <main className="area-profissional__conteudo" id="conteudo">
          <div className="cabecalho-pagina">
            <div>
              <h1>
                {location.pathname === "/painel"
                  ? "Olá, " + currentUser?.name
                  : pages[location.pathname]}
              </h1>
              <p>
                {location.pathname === "/painel"
                  ? "Você está conectado à sua conta."
                  : "Esta área estará disponível em breve."}
              </p>
            </div>
          </div>
          <section className="secao estado-vazio">
            <Icon name="calendar" size={32} />
            <h2>Estamos preparando seu espaço</h2>
            <p>
              O acesso à conta já está disponível. Alunos, agenda e locais serão
              liberados em breve.
            </p>
          </section>
          <footer className="area-profissional__rodape">
            <span>ProfissionalHub · Sua rotina em equilíbrio.</span>
          </footer>
        </main>
      </div>
    </div>
  );
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <a
        className="atalho-conteudo"
        href={location.pathname === "/" ? "#inicio" : "#conteudo"}
      >
        Pular para o conteúdo
      </a>
      <Switch>
        <Route exact path="/">
          <Main
            onSignOut={signOut}
            onLogin={() => openAuth("login")}
            onRegister={() => openAuth("register")}
          />
        </Route>
        <ProtectedRoute user={currentUser} path={Object.keys(pages)} exact>
          {workspace}
        </ProtectedRoute>
        <Route>
          <main className="pagina-nao-encontrada">
            <h1>Esse caminho ainda não existe.</h1>
            <Link
              className="botao botao--principal"
              to={currentUser ? "/painel" : "/"}
            >
              Voltar ao início
            </Link>
          </main>
        </Route>
      </Switch>
      {activeMode && !currentUser && (
        <AuthModal
          mode={activeMode}
          onClose={closeAuth}
          onModeChange={openAuth}
          onEnter={enter}
          busy={busy}
          error={authError}
        />
      )}
      <div
        className={"notificacao" + (notice ? " notificacao--visivel" : "")}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </CurrentUserContext.Provider>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  );
}
