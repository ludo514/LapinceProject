import { replace } from "svelte-spa-router";
import { getAuth } from "../auth/store.js";

export function useAuth() {
  const requireAuth = () => {
    if (!getAuth()) {
      replace("/login");
      return false;
    }
    return true;
  };

  const requireGuest = () => {
    if (getAuth()) {
      replace("/dashboard");
      return false;
    }
    return true;
  };

  return { requireAuth, requireGuest };
}
