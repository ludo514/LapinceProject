import api from "../callApi.js";

export async function getAllTransactions() {
    return await api("/transactions");
}

export async function createNewTransaction(params) {
    return await api("/transactions", "POST", params);
}

export async function deleteTransaction(id) {
    return await api(`/transactions/${id}`, "DELETE");
}