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
import Dashboard from "../Dashboard/Dashboard";
import Students from "../Students/Students";
import Agenda from "../Agenda/Agenda";
import Pending from "../Pending/Pending";
import EntryForm from "../EntryForm/EntryForm";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Modal from "../Modal/Modal";
import Icon from "../Icon/Icon";
import {
  DEMO_DATE,
  initialStudents,
  initialSessions,
  initialCharges,
  initialMakeups,
  initialLocations,
  initials,
} from "../../utils/demoData";
import "./App.css";
const DEMO_USER_KEY = "profissionalhub:demo-user";
const pages = {
  "/painel": "Visão geral",
  "/alunos": "Alunos",
  "/agenda": "Agenda",
  "/pendencias": "Pendências",
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
  const [entryForm, setEntryForm] = useState(null);
  const [occurrence, setOccurrence] = useState(null);
  const [grantMakeup, setGrantMakeup] = useState(false);
  const [notice, setNotice] = useState("");
  const [students, setStudents] = useState(initialStudents);
  const [sessions, setSessions] = useState(initialSessions);
  const [charges, setCharges] = useState(initialCharges);
  const [makeups, setMakeups] = useState(initialMakeups);
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
    setAuthMode(null);
    try {
      sessionStorage.removeItem(DEMO_USER_KEY);
    } catch {
      /* O estado em memória é encerrado mesmo sem acesso ao armazenamento. */
    }
    setStudents(initialStudents);
    setSessions(initialSessions);
    setCharges(initialCharges);
    setMakeups(initialMakeups);
    setMobileOpen(false);
    setEntryForm(null);
    setOccurrence(null);
    history.push("/");
    setNotice("Você saiu da demonstração.");
  };
  const newSession = (date = DEMO_DATE) =>
    setEntryForm({ kind: "session", entry: { date } });
  const saveEntry = (values) => {
    const id = crypto.randomUUID();
    if (entryForm.kind === "student") {
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
    } else if (entryForm.kind === "session") {
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
      if (
        values.makeupId &&
        !makeups.some(
          (makeup) =>
            makeup.id === values.makeupId && makeup.status === "pending",
        )
      )
        return "Esta reposição já foi agendada.";
      setSessions((items) => [
        ...items,
        {
          id,
          studentId: values.studentId,
          date: values.date,
          time: values.time,
          end: values.end,
          location: values.location,
          status: "scheduled",
          ...(values.makeupId ? { makeupId: values.makeupId } : {}),
        },
      ]);
      if (values.makeupId)
        setMakeups((items) =>
          items.map((item) =>
            item.id === values.makeupId
              ? { ...item, status: "scheduled" }
              : item,
          ),
        );
    } else {
      if (!Number.isFinite(Number(values.amount)) || Number(values.amount) <= 0)
        return "Informe um valor maior que zero.";
      setCharges((items) => [
        ...items,
        {
          id,
          studentId: values.studentId,
          description: values.description.trim(),
          amount: Math.round(Number(values.amount) * 100) / 100,
          due: values.due,
          paid: false,
        },
      ]);
    }
    setEntryForm(null);
    setNotice("Salvo na demonstração. As alterações são temporárias.");
    return "";
  };
  const applyStatus = (session, status, grant = false) => {
    if (sessions.find((item) => item.id === session.id)?.status !== "scheduled")
      return;
    setSessions((items) =>
      items.map((item) =>
        item.id === session.id ? { ...item, status } : item,
      ),
    );
    if (session.makeupId)
      setMakeups((items) =>
        items.map((item) =>
          item.id === session.makeupId
            ? {
                ...item,
                status: status === "completed" ? "completed" : "pending",
              }
            : item,
        ),
      );
    else if (grant && status !== "completed")
      setMakeups((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          studentId: session.studentId,
          sourceSessionId: session.id,
          reason:
            status === "missed"
              ? "Falta com reposição autorizada"
              : "Cancelamento com reposição autorizada",
          status: "pending",
        },
      ]);
    setOccurrence(null);
    setNotice(
      status === "completed"
        ? "Atendimento concluído na demonstração."
        : "Ocorrência registrada na demonstração.",
    );
  };
  const sessionStatus = (session, status) => {
    if (status === "completed") applyStatus(session, status);
    else {
      setGrantMakeup(false);
      setOccurrence({ session, status });
    }
  };
  const pendingCount =
    charges.filter((charge) => !charge.paid).length +
    makeups.filter((makeup) => makeup.status === "pending").length;
  const workspace = (
    <div className="area-profissional">
      <Navigation
        onSignOut={signOut}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pending={pendingCount}
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
            <strong>Modo demonstração</strong> · Dados fictícios e alterações
            temporárias. Nenhuma conta real foi criada.
          </span>
        </div>
        <main className="area-profissional__conteudo" id="conteudo">
          <Switch>
            <Route exact path="/painel">
              <Dashboard
                students={students}
                sessions={sessions}
                charges={charges}
                onNewSession={() => newSession()}
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
            <Route exact path="/pendencias">
              <Pending
                charges={charges}
                makeups={makeups}
                students={students}
                onPaid={(id) => {
                  setCharges((items) =>
                    items.map((item) =>
                      item.id === id
                        ? { ...item, paid: true, paidAt: DEMO_DATE }
                        : item,
                    ),
                  );
                  setNotice("Pagamento registrado na demonstração.");
                }}
                onSchedule={(makeup) =>
                  setEntryForm({
                    kind: "session",
                    entry: { studentId: makeup.studentId, makeupId: makeup.id },
                  })
                }
                onNewCharge={() => setEntryForm({ kind: "charge" })}
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
          key={entryForm.kind + (entryForm.entry?.id || "")}
          kind={entryForm.kind}
          entry={entryForm.entry}
          students={students}
          locations={initialLocations}
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
          <div className="ocorrencia">
            {occurrence.session.makeupId ? (
              <p>
                Esta sessão é uma reposição. Ela voltará à lista de reposições a
                agendar.
              </p>
            ) : (
              <label className="ocorrencia__opcao">
                <input
                  type="checkbox"
                  checked={grantMakeup}
                  onChange={(event) => setGrantMakeup(event.target.checked)}
                />
                Autorizar uma reposição para o aluno
              </label>
            )}
            <div className="formulario__acoes">
              <button
                className="botao botao--contorno"
                onClick={() => setOccurrence(null)}
              >
                Voltar
              </button>
              <button
                className="botao botao--principal"
                onClick={() =>
                  applyStatus(
                    occurrence.session,
                    occurrence.status,
                    grantMakeup,
                  )
                }
              >
                Confirmar
              </button>
            </div>
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
