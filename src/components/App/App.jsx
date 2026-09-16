import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import Main from "../Main/Main";
import AuthModal from "../AuthModal/AuthModal";
import Navigation from "../Navigation/Navigation";
import Students from "../Students/Students";
import EntryForm from "../EntryForm/EntryForm";
import Dashboard from "../Dashboard/Dashboard";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Agenda from "../Agenda/Agenda";
import Modal from "../Modal/Modal";
import Icon from "../Icon/Icon";
import {
  DEMO_DATE,
  initialLocations,
  initialStudents,
  initialSessions,
  initialCharges,
  initials,
} from "../../utils/demoData";
import "./App.css";
const DEMO_USER_KEY = "profissionalhub:demo-user";
const pages = {
  "/painel": "Visão geral",
  "/alunos": "Alunos",
  "/agenda": "Agenda",
};
function readDemoUser() {
  try {
    const user = JSON.parse(sessionStorage.getItem(DEMO_USER_KEY));
    return typeof user?.name === "string" && user.name.trim()
      ? { name: user.name }
      : null;
  } catch {
    return null;
  }
}
function Application() {
  const history = useHistory();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(readDemoUser);
  const [authMode, setAuthMode] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [students, setStudents] = useState(initialStudents);
  const [sessions, setSessions] = useState(initialSessions);
  const [occurrence, setOccurrence] = useState(null);
  const [entryForm, setEntryForm] = useState(null);
  const [notice, setNotice] = useState("");
  const activeMode = authMode || (location.state?.openLogin ? "login" : null);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    document.title =
      (pages[location.pathname] ? pages[location.pathname] + " · " : "") +
      "ProfissionalHub";
  }, [location.pathname]);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const closeAuth = () => {
    setAuthMode(null);
    if (location.state?.openLogin) history.replace("/", {});
  };
  const enter = (user = { name: "Gustavo" }) => {
    const profile = { name: user.name };
    setCurrentUser(profile);
    try {
      sessionStorage.setItem(DEMO_USER_KEY, JSON.stringify(profile));
    } catch {
      /* A prévia continua disponível sem persistência de sessão. */
    }
    setAuthMode(null);
    history.push("/painel");
    setNotice("Demonstração aberta. Nenhuma conta real foi criada.");
  };
  const signOut = () => {
    setCurrentUser(null);
    setStudents(initialStudents);
    setSessions(initialSessions);
    setOccurrence(null);
    setEntryForm(null);
    try {
      sessionStorage.removeItem(DEMO_USER_KEY);
    } catch {
      /* O estado em memória é encerrado mesmo sem acesso ao armazenamento. */
    }
    setMobileOpen(false);
    setAuthMode(null);
    history.push("/");
    setNotice("Você saiu da demonstração.");
  };
  function saveStudent(values) {
    const id = crypto.randomUUID();
    if (values.name.trim().length < 2)
      return "Informe um nome com pelo menos dois caracteres.";
    const data = {
      id: values.id || id,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      goal: values.goal.trim(),
      active: values.active ?? true,
      color: values.color || "salvia",
    };
    setStudents((items) =>
      values.id
        ? items.map((item) => (item.id === values.id ? data : item))
        : [...items, data],
    );

    setEntryForm(null);
    setNotice(
      values.id
        ? "Aluno atualizado na demonstração."
        : "Aluno adicionado à demonstração.",
    );
  }
  const newSession = (date = DEMO_DATE) =>
    setEntryForm({ kind: "session", entry: { date } });
  function saveEntry(values) {
    if (entryForm.kind === "student") return saveStudent(values);
    if (values.time >= values.end)
      return "O término precisa ser depois do início.";
    if (
      !students.some(
        (student) => student.id === values.studentId && student.active,
      )
    )
      return "Selecione um aluno ativo.";
    if (
      sessions.some(
        (session) =>
          session.date === values.date &&
          session.status !== "cancelled" &&
          session.status !== "missed" &&
          values.time < session.end &&
          values.end > session.time,
      )
    )
      return "Já existe um atendimento neste intervalo. Escolha outro horário.";
    setSessions((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        studentId: values.studentId,
        date: values.date,
        time: values.time,
        end: values.end,
        location: values.location,
        status: "scheduled",
      },
    ]);
    setEntryForm(null);
    setNotice("Atendimento agendado na demonstração.");
  }
  function applyStatus(session, status) {
    if (sessions.find((item) => item.id === session.id)?.status !== "scheduled")
      return;
    setSessions((items) =>
      items.map((item) =>
        item.id === session.id ? { ...item, status } : item,
      ),
    );
    setOccurrence(null);
    setNotice("Resultado do atendimento registrado na demonstração.");
  }
  function sessionStatus(session, status) {
    if (status === "completed") applyStatus(session, status);
    else setOccurrence({ session, status });
  }
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
        <div className="aviso-demonstracao">
          <Icon name="spark" size={14} />
          <span>
            <strong>Modo demonstração</strong> · Dados fictícios para conhecer a
            plataforma. Nenhuma conta real foi criada.
          </span>
        </div>
        <main className="area-profissional__conteudo" id="conteudo">
          <Switch>
            <Route exact path="/painel">
              <Dashboard
                students={students}
                sessions={sessions}
                onNewSession={() => newSession()}
                charges={initialCharges}
              />
            </Route>
            <Route exact path="/alunos">
              <Students
                students={students}
                onNew={() => setEntryForm({ kind: "student" })}
                onEdit={(entry) => setEntryForm({ kind: "student", entry })}
                onToggle={(id) => {
                  setStudents((items) =>
                    items.map((item) =>
                      item.id === id ? { ...item, active: !item.active } : item,
                    ),
                  );
                  setNotice(
                    "Status do aluno atualizado. O histórico foi preservado.",
                  );
                }}
              />
            </Route>
            <Route exact path="/agenda">
              <Agenda
                sessions={sessions}
                students={students}
                onNew={newSession}
                onStatus={sessionStatus}
              />
            </Route>
          </Switch>
          <footer className="area-profissional__rodape">
            <span>ProfissionalHub · Sua rotina em equilíbrio.</span>
            <span>Feito para quem cuida do movimento.</span>
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
            onLogin={() => setAuthMode("login")}
            onRegister={() => setAuthMode("register")}
            onDemo={() => enter()}
          />
        </Route>
        <ProtectedRoute user={currentUser} path={Object.keys(pages)} exact>
          {workspace}
        </ProtectedRoute>
        <Route>
          <main className="pagina-nao-encontrada">
            <Icon name="pin" size={42} />
            <h1>Esse caminho ainda não existe.</h1>
            <p>Volte para continuar organizando sua rotina.</p>
            <Link
              className="botao botao--principal"
              to={currentUser ? "/painel" : "/"}
            >
              Voltar ao início
            </Link>
          </main>
        </Route>
      </Switch>
      {activeMode && (
        <AuthModal
          key={activeMode}
          mode={activeMode}
          onClose={closeAuth}
          onModeChange={setAuthMode}
          onEnter={enter}
        />
      )}
      {entryForm && (
        <EntryForm
          key={entryForm.kind + (entryForm.entry?.id || "new")}
          kind={entryForm.kind}
          students={students}
          locations={initialLocations}
          entry={entryForm.entry}
          onClose={() => setEntryForm(null)}
          onSave={saveEntry}
        />
      )}
      {occurrence && (
        <Modal
          title={
            occurrence.status === "missed"
              ? "Registrar falta"
              : "Cancelar atendimento"
          }
          subtitle="Confirme o resultado deste atendimento."
          onClose={() => setOccurrence(null)}
        >
          <div className="formulario__acoes">
            <button
              className="botao botao--contorno"
              onClick={() => setOccurrence(null)}
            >
              Voltar
            </button>
            <button
              className="botao botao--principal"
              onClick={() => applyStatus(occurrence.session, occurrence.status)}
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )}
      <div
        className={"notificacao" + (notice ? " notificacao--visivel" : "")}
        role="status"
        aria-live="polite"
      >
        {notice && (
          <>
            <Icon name="check" size={18} />
            <span>{notice}</span>
            <button
              className="botao-icone"
              aria-label="Dispensar mensagem"
              onClick={() => setNotice("")}
            >
              <Icon name="close" size={15} />
            </button>
          </>
        )}
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
