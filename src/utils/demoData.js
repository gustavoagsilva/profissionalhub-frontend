export const DEMO_DATE = new Date().toLocaleDateString("en-CA");
export const initialStudents = [
  {
    id: "s1",
    name: "Mariana Costa",
    email: "mariana@example.com",
    phone: "(11) 99999-0101",
    goal: "Condicionamento físico",
    active: true,
    color: "salvia",
  },
  {
    id: "s2",
    name: "Rafael Oliveira",
    email: "rafael@example.com",
    phone: "(11) 99999-0102",
    goal: "Qualidade de vida",
    active: true,
    color: "pessego",
  },
  {
    id: "s3",
    name: "Camila Santos",
    email: "camila@example.com",
    phone: "(11) 99999-0103",
    goal: "Fortalecimento",
    active: true,
    color: "lavanda",
  },
  {
    id: "s4",
    name: "Lucas Ferreira",
    email: "lucas@example.com",
    phone: "(11) 99999-0104",
    goal: "Condicionamento físico",
    active: true,
    color: "azul",
  },
  {
    id: "s5",
    name: "Beatriz Lima",
    email: "beatriz@example.com",
    phone: "(11) 99999-0105",
    goal: "Mobilidade",
    active: false,
    color: "pessego",
  },
];
export const initialSessions = [
  {
    id: "a1",
    studentId: "s1",
    date: DEMO_DATE,
    time: "07:00",
    end: "08:00",
    location: "Parque Ibirapuera",
    status: "completed",
  },
  {
    id: "a2",
    studentId: "s2",
    date: DEMO_DATE,
    time: "09:00",
    end: "10:00",
    location: "Studio Vila Mariana",
    status: "scheduled",
  },
  {
    id: "a3",
    studentId: "s3",
    date: DEMO_DATE,
    time: "14:00",
    end: "15:00",
    location: "Parque Ibirapuera",
    status: "scheduled",
  },
  {
    id: "a4",
    studentId: "s4",
    date: DEMO_DATE,
    time: "17:00",
    end: "18:00",
    location: "Atendimento domiciliar",
    status: "scheduled",
  },
];
export const initialCharges = [
  {
    id: "c1",
    studentId: "s1",
    description: "Atendimentos do mês",
    amount: 640,
    due: DEMO_DATE,
    paid: true,
  },
  {
    id: "c2",
    studentId: "s2",
    description: "Atendimentos do mês",
    amount: 720,
    due: DEMO_DATE,
    paid: false,
  },
  {
    id: "c3",
    studentId: "s3",
    description: "Atendimentos do mês",
    amount: 640,
    due: DEMO_DATE,
    paid: true,
  },
  {
    id: "c4",
    studentId: "s4",
    description: "Atendimentos do mês",
    amount: 800,
    due: DEMO_DATE,
    paid: false,
  },
];
export const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
