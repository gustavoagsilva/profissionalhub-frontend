const BASE_URL = (
  import.meta.env.VITE_API_URL || "https://profissionalhub-backend.onrender.com"
).replace(/\/$/, "");

async function request(path, { token, signal, ...options } = {}) {
  let response;
  try {
    response = await fetch(BASE_URL + path, {
      ...options,
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(90000)])
        : AbortSignal.timeout(90000),
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "Não foi possível conectar. Confira sua conexão e tente novamente.",
    );
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(
      data?.message || "Não foi possível concluir a solicitação.",
    );
    error.status = response.status;
    throw error;
  }
  if (!data) throw new Error("Resposta inválida do servidor. Tente novamente.");
  return data;
}
export const signup = (values) =>
  request("/signup", { method: "POST", body: JSON.stringify(values) });
export const signin = (values) =>
  request("/signin", { method: "POST", body: JSON.stringify(values) });
export const getCurrentUser = (token, signal) =>
  request("/users/me", { token, signal });

export const getStudents = (token, signal) =>
  request("/students", { token, signal });
export const createStudent = (values, token, signal) =>
  request("/students", {
    method: "POST",
    body: JSON.stringify(values),
    token,
    signal,
  });
export const updateStudent = (id, values, token, signal) =>
  request("/students/" + encodeURIComponent(id), {
    method: "PATCH",
    body: JSON.stringify(values),
    token,
    signal,
  });

export const getSessions = (token, signal) =>
  request("/sessions", { token, signal });
export const getLocations = (token, signal) =>
  request("/locations", { token, signal });
export const createSession = (values, token, signal) =>
  request("/sessions", {
    method: "POST",
    body: JSON.stringify(values),
    token,
    signal,
  });
export const updateSession = (id, values, token, signal) =>
  request("/sessions/" + encodeURIComponent(id), {
    method: "PATCH",
    body: JSON.stringify(values),
    token,
    signal,
  });
export const updateSessionStatus = (id, values, token, signal) =>
  request("/sessions/" + encodeURIComponent(id) + "/status", {
    method: "PATCH",
    body: JSON.stringify(values),
    token,
    signal,
  });

export const createLocation = (values, token, signal) =>
  request("/locations", {
    method: "POST",
    body: JSON.stringify(values),
    token,
    signal,
  });
export const deleteLocation = (id, token, signal) =>
  request("/locations/" + encodeURIComponent(id), {
    method: "DELETE",
    token,
    signal,
  });
