import { toast } from "svelte-sonner";

export default async function api(endpoint, method = "GET", body) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Si erreur HTTP
    if (!response.ok) {
      let error;

      const text = await response.text();

      try {
        error = text ? JSON.parse(text) : { message: "Erreur serveur" };
      } catch {
        error = { message: text || "Erreur serveur" };
      }

      throw error;
    }

    // Si réponse vide (très fréquent avec DELETE / 204)
    if (response.status === 204) {
      if (method !== "GET") {
        toast.success("Opération réussie");
      }
      return { data: null, error: null };
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (method !== "GET") {
      toast.success("Opération réussie");
    }

    return { data, error: null };
  } catch (e) {
    console.error(e);
    toast.error(e.message || "Une erreur est survenue");
    return { data: null, error: e };
  }
}