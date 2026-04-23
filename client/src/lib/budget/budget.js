import api from "../callApi.js";

export const createBudget = async (body) => {
    return await api("/budgets/", "POST", body);
};

export const getBudget = async () => {
    return await api ("/budgets/me", "GET");
};

export const deleteBudget = async (id) => {
    return await api (`/budgets/${id}`, "DELETE");
};