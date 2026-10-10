import { useEffect, useState, useRef, useCallback } from "react";
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
import Locations from "../Locations/Locations";
import { findPlaces, calculateTravel } from "../../utils/ThirdPartyApi";
import Agenda from "../Agenda/Agenda";
import Dashboard from "../Dashboard/Dashboard";
import SessionForm from "../SessionForm/SessionForm";
import SessionResult from "../SessionResult/SessionResult";
import { todayInBrasilia } from "../../utils/sessionTime";
import Students from "../Students/Students";
import StudentForm from "../StudentForm/StudentForm";
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
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState("");
  const [studentsRetry, setStudentsRetry] = useState(0);
  const [studentForm, setStudentForm] = useState(null);
  const [studentError, setStudentError] = useState("");
  const [studentBusy, setStudentBusy] = useState(false);
  const [busyStudentId, setBusyStudentId] = useState(null);
  const studentRequest = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [agendaLoading, setAgendaLoading] = useState(true);
  const [agendaError, setAgendaError] = useState("");
  const [agendaRetry, setAgendaRetry] = useState(0);
  const [agendaDate, setAgendaDate] = useState(todayInBrasilia);
  const [sessionDialog, setSessionDialog] = useState(null);
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleBusy, setScheduleBusy] = useState(false);
  const scheduleRequest = useRef(null);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState("");
  const [locationsRetry, setLocationsRetry] = useState(0);
  const [locationError, setLocationError] = useState("");
  const [locationBusy, setLocationBusy] = useState(null);
  const locationRequest = useRef(null);
  const expireSession = useCallback(() => {
    locationRequest.current?.abort();
    locationRequest.current = null;
    setLocationBusy(null);
    setLocationError("");
    scheduleRequest.current?.abort();
    scheduleRequest.current = null;
    setSessions([]);
    setSavedLocations([]);
    setSessionDialog(null);
    setScheduleBusy(false);
    setScheduleError("");
    studentRequest.current?.abort();
    studentRequest.current = null;
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
    setStudents([]);
    setStudentForm(null);
    setStudentBusy(false);
    setBusyStudentId(null);
    setNotice("Sua sessão expirou. Entre novamente.");
    history.replace("/", { openLogin: true, from: history.location.pathname });
  }, [history]);
  useEffect(() => {
    if (!currentUser || location.pathname !== "/alunos") return;
    const controller = new AbortController();
    async function loadStudents() {
      setStudentsLoading(true);
      setStudentsError("");
      try {
        const items = await api.getStudents(
          localStorage.getItem(TOKEN_KEY),
          controller.signal,
        );
        if (!controller.signal.aborted) setStudents(items);
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error.status === 401) expireSession();
        else setStudentsError(error.message);
      } finally {
        if (!controller.signal.aborted) setStudentsLoading(false);
      }
    }
    loadStudents();
    return () => controller.abort();
  }, [currentUser, location.pathname, studentsRetry, expireSession]);
  useEffect(() => {
    if (!currentUser || !["/agenda", "/painel"].includes(location.pathname))
      return;
    const controller = new AbortController();
    async function loadAgenda() {
      setAgendaLoading(true);
      setAgendaError("");
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const [appointments, pupils, places] = await Promise.all([
          api.getSessions(token, controller.signal),
          api.getStudents(token, controller.signal),
          api.getLocations(token, controller.signal),
        ]);
        if (controller.signal.aborted) return;
        setSessions(appointments);
        setStudents(pupils);
        setSavedLocations(places);
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error.status === 401) expireSession();
        else setAgendaError(error.message);
      } finally {
        if (!controller.signal.aborted) setAgendaLoading(false);
      }
    }
    loadAgenda();
    return () => controller.abort();
  }, [currentUser, location.pathname, agendaRetry, expireSession]);
  const openSession = (
    date = todayInBrasilia(),
    session = null,
    status = null,
  ) => {
    setScheduleError("");
    setSessionDialog({ date, session, status });
  };
  const closeSession = () => {
    if (!scheduleRequest.current) {
      setSessionDialog(null);
      setScheduleError("");
    }
  };
  const saveSession = async (values) => {
    if (scheduleRequest.current) return;
    const controller = new AbortController();
    scheduleRequest.current = controller;
    setScheduleBusy(true);
    setScheduleError("");
    const { session, status } = sessionDialog;
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      let saved;
      if (status)
        saved = await api.updateSessionStatus(
          session._id,
          values,
          token,
          controller.signal,
        );
      else if (session)
        saved = await api.updateSession(
          session._id,
          values,
          token,
          controller.signal,
        );
      else saved = await api.createSession(values, token, controller.signal);
      if (controller.signal.aborted) return;
      setSessions((items) =>
        session
          ? items.map((item) => (item._id === saved._id ? saved : item))
          : [...items, saved],
      );
      setAgendaDate(saved.date);
      setSessionDialog(null);
      setNotice(status ? "Resultado registrado." : "Atendimento salvo.");
      if (location.pathname !== "/agenda") history.push("/agenda");
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error.status === 401) expireSession();
      else setScheduleError(error.message);
    } finally {
      if (scheduleRequest.current === controller) {
        scheduleRequest.current = null;
        setScheduleBusy(false);
      }
    }
  };
  useEffect(() => {
    if (!currentUser || location.pathname !== "/locais") return;
    const controller = new AbortController();
    async function loadLocations() {
      setLocationsLoading(true);
      setLocationsError("");
      try {
        const items = await api.getLocations(
          localStorage.getItem(TOKEN_KEY),
          controller.signal,
        );
        if (!controller.signal.aborted) setSavedLocations(items);
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error.status === 401) expireSession();
        else setLocationsError(error.message);
      } finally {
        if (!controller.signal.aborted) setLocationsLoading(false);
      }
    }
    loadLocations();
    return () => controller.abort();
  }, [currentUser, location.pathname, locationsRetry, expireSession]);
  const changeLocation = async (place, remove = false) => {
    if (locationRequest.current) return;
    if (!remove && savedLocations.some((item) => item.placeId === place.id))
      return;
    const controller = new AbortController();
    locationRequest.current = controller;
    setLocationBusy(remove ? place._id : place.id);
    setLocationError("");
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (remove) {
        await api.deleteLocation(place._id, token, controller.signal);
        if (controller.signal.aborted) return;
        setSavedLocations((items) =>
          items.filter((item) => item._id !== place._id),
        );
      } else {
        const saved = await api.createLocation(
          {
            name: place.name,
            address: place.address,
            category: place.category,
            coordinates: place.coordinates,
            placeId: place.id,
          },
          token,
          controller.signal,
        );
        if (controller.signal.aborted) return;
        setSavedLocations((items) =>
          items.some((item) => item._id === saved._id)
            ? items
            : [saved, ...items],
        );
      }
      setNotice(
        remove
          ? "Local removido. Os endereços dos atendimentos foram preservados."
          : "Local salvo para seus atendimentos.",
      );
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error.status === 401) expireSession();
      else {
        setLocationError(
          error.status === 409
            ? "Este local já está salvo na sua conta."
            : error.message,
        );
        if (error.status === 409 || error.status === 404)
          setLocationsRetry((value) => value + 1);
      }
    } finally {
      if (locationRequest.current === controller) {
        locationRequest.current = null;
        setLocationBusy(null);
      }
    }
  };
  const saveStudent = async (values, student = studentForm?.student) => {
    if (studentRequest.current) return;
    const controller = new AbortController();
    studentRequest.current = controller;
    setStudentBusy(true);
    setBusyStudentId(student?._id || null);
    setStudentError("");
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const saved = student
        ? await api.updateStudent(student._id, values, token, controller.signal)
        : await api.createStudent(values, token, controller.signal);
      if (controller.signal.aborted) return;
      setStudents((items) =>
        student
          ? items.map((item) => (item._id === saved._id ? saved : item))
          : [saved, ...items],
      );
      setStudentForm(null);
      setNotice("Dados do aluno salvos.");
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error.status === 401) expireSession();
      else setStudentError(error.message);
    } finally {
      if (studentRequest.current === controller) {
        studentRequest.current = null;
        setStudentBusy(false);
        setBusyStudentId(null);
      }
    }
  };
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
    locationRequest.current?.abort();
    locationRequest.current = null;
    setLocationBusy(null);
    setLocationError("");
    scheduleRequest.current?.abort();
    scheduleRequest.current = null;
    setSessions([]);
    setSavedLocations([]);
    setSessionDialog(null);
    setScheduleBusy(false);
    setScheduleError("");
    studentRequest.current?.abort();
    studentRequest.current = null;
    setStudents([]);
    setStudentForm(null);
    setStudentError("");
    setStudentBusy(false);
    setBusyStudentId(null);
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
                timeZone: "America/Sao_Paulo",
              })}
            </span>
            <span className="avatar avatar--salvia">
              {initials(currentUser?.name || "Profissional")}
            </span>
          </div>
        </header>
        <main className="area-profissional__conteudo" id="conteudo">
          {location.pathname === "/alunos" ? (
            <>
              {!studentForm && studentError && (
                <p className="formulario__erro" role="alert">
                  {studentError}
                </p>
              )}
              <Students
                students={students}
                loading={studentsLoading}
                error={studentsError}
                busyId={busyStudentId}
                onRetry={() => setStudentsRetry((value) => value + 1)}
                onNew={() => {
                  setStudentError("");
                  setStudentForm({ student: null });
                }}
                onEdit={(student) => {
                  setStudentError("");
                  setStudentForm({ student });
                }}
                onToggle={(student) =>
                  saveStudent({ active: !student.active }, student)
                }
              />
            </>
          ) : ["/agenda", "/painel"].includes(location.pathname) ? (
            agendaLoading ? (
              <Preloader label="Carregando sua agenda…" />
            ) : agendaError ? (
              <section className="secao estado-vazio">
                <p className="formulario__erro" role="alert">
                  {agendaError}
                </p>
                <button
                  className="botao botao--contorno"
                  onClick={() => setAgendaRetry((value) => value + 1)}
                >
                  Tentar novamente
                </button>
              </section>
            ) : location.pathname === "/agenda" ? (
              <Agenda
                sessions={sessions}
                students={students}
                date={agendaDate}
                setDate={setAgendaDate}
                now={now}
                onNew={(date) => openSession(date)}
                onEdit={(session) => openSession(session.date, session)}
                onStatus={(session, status) =>
                  openSession(session.date, session, status)
                }
              />
            ) : (
              <Dashboard
                sessions={sessions}
                students={students}
                onNewSession={() => openSession()}
              />
            )
          ) : (
            <Locations
              saved={savedLocations}
              savedLoading={locationsLoading}
              savedError={locationsError}
              mutationError={locationError}
              busyId={locationBusy}
              onRetry={() => setLocationsRetry((value) => value + 1)}
              onSave={(place) => changeLocation(place)}
              onRemove={(place) => changeLocation(place, true)}
              onSearch={findPlaces}
              onTravel={calculateTravel}
            />
          )}
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
      {sessionDialog &&
        currentUser &&
        (sessionDialog.status ? (
          <SessionResult
            key={sessionDialog.session._id + sessionDialog.status}
            session={sessionDialog.session}
            status={sessionDialog.status}
            studentName={
              students.find(
                (item) => item._id === sessionDialog.session.studentId,
              )?.name || "Aluno"
            }
            busy={scheduleBusy}
            error={scheduleError}
            onClose={closeSession}
            onSave={saveSession}
          />
        ) : (
          <SessionForm
            key={sessionDialog.session?._id || "new"}
            session={sessionDialog.session}
            date={sessionDialog.date}
            students={students}
            locations={savedLocations}
            busy={scheduleBusy}
            error={scheduleError}
            onClose={closeSession}
            onSave={saveSession}
          />
        ))}
      {studentForm && currentUser && (
        <StudentForm
          key={studentForm.student?._id || "new"}
          student={studentForm.student}
          busy={studentBusy}
          error={studentError}
          onSave={saveStudent}
          onClose={() => {
            if (!studentRequest.current) {
              setStudentForm(null);
              setStudentError("");
            }
          }}
        />
      )}
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
