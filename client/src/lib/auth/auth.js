import api from "../callApi.js";
import { saveAuth } from "./store.js";

export const registerUser = async (body) => {
  const { data, error } = await api("/auth/register", "POST", body);
  if (error) {
    return;
  }
  saveAuth(data.token, data.user.id);
  await api("/groups", "POST", { name: "Personnel" });
  return { token: data.token, user: data.user };
};

export const loginUser = async (body) => {
  const { data, error } = await api("/auth/login", "POST", body);
  if (error) return;
  saveAuth(data.token, data.user.id);
  return { token: data.token, user: data.user };
};

export const getUser = async () => {
  return await api("/auth/me", "GET");
};

export const deleteUser = async () => {
  return await api("/auth/me", "DELETE");
}
