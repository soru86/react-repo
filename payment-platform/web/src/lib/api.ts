import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: false,
});

export type User = {
  id: string;
  email: string;
  name: string;
  role: "PROVIDER" | "MERCHANT" | "ADMIN";
};

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken");
  }
}

export function storeUser(user?: User) {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : null;
}

export function initAuthFromStorage() {
  const token = localStorage.getItem("accessToken") || undefined;
  setAuthToken(token);
}

export function logout() {
  setAuthToken(undefined);
  storeUser(undefined);
}

initAuthFromStorage();
