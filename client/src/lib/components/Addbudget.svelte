<script>
    import { onMount } from "svelte";
    import { createBudget, getBudget, deleteBudget } from "../budget/budget";
    import { activeGroup } from "../hooks/states.svelte.js";

    let { transactions = [] } = $props();
    let showToast = $state(false);
    let toastMessage = $state("");

    let budget = $state(null);
    let formIsOpen = $state(false);
    let form = $state({
        amount: null,
        is_monthly: false
    });


    let lastAlert = $state(null);

    $effect(() => {
        if (!budgetAmount) return;

        let currentAlert = null;

        if (remainingBudget < 0) {
            currentAlert = "over";
        } else if (budgetUsagePercent >= 80) {
            currentAlert = "warning";
        }

        // reset si on est revenu à une zone normale
        if (!currentAlert) {
            lastAlert = null;
            return;
        }

        // déclenche seulement si l'alerte change
        if (currentAlert !== lastAlert) {
            lastAlert = currentAlert;

            toastMessage =
                currentAlert === "over"
                    ? "Budget dépassé !"
                    : "Attention : 80% du budget utilisé";

            showToast = true;

            setTimeout(() => {
                showToast = false;
            }, 3000);
        }
    });

    const totalExpenses = $derived(
        (transactions || [])
            .filter((transaction) => transaction.type === "expense")
            .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)
    );

    const totalIncome = $derived(
        (transactions || [])
            .filter((transaction) => transaction.type === "income")
            .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)
    );

    const remainingBudget = $derived(
        Number(budget?.amount || 0) + totalIncome - totalExpenses
    );

    const budgetAmount = $derived(
        Number(budget?.amount || 0)
    );

    const netExpenses = $derived(
        totalExpenses - totalIncome
    );

    const budgetUsagePercent = $derived(
        budgetAmount > 0
            ? Math.max(0, (netExpenses / budgetAmount) * 100)
            : 0
    );

    const alertType = $derived(
        !budgetAmount
            ? null
            : remainingBudget < 0
                ? "over"
                : budgetUsagePercent >= 80
                    ? "warning"
                    : null
    );

    onMount(() => {
        getTheBudget();
    });

    async function getTheBudget() {
        const { data, error } = await getBudget();
        if (error) return;
        budget = data[0] ?? null;
    }

    async function deleteTheBudget() {
        const { error } = await deleteBudget(budget.id);
        if (error) return;
        budget = null;
    }

    function openForm() {
        form.amount = budget?.amount ?? null;
        form.is_monthly = budget?.is_monthly ?? false;
        formIsOpen = true;
    }

    function closeForm() {
        formIsOpen = false;
    }

    async function saveBudget(e) {
        e.preventDefault();

        if (!form.amount || form.amount <= 0) {
            console.error("Budget invalide");
            return;
        }

        if (!activeGroup.id) {
            console.error("Aucun groupe sélectionné");
            return;
        }

            const { data, error } = await createBudget({
            amount: Number(form.amount),
            is_monthly: form.is_monthly === true,
            group_id: Number(activeGroup.id),
            name: "Budget",
            date_budget: new Date().toISOString()   
            });
            
            if (error) return;
            budget = data;
            closeForm();
    }
</script>

{#if !budget}
    <div class="budget-container">
        <p class="budget">Budget :</p>

        {#if !formIsOpen}
            <button class="add-budget_button" onclick={openForm}>
                Ajouter votre budget
            </button>
        {:else}
            <form class="budget-form" onsubmit={saveBudget}>
                <div class="subcontainer">
                    <label for="amount">Montant :</label>
                    <div class="input-amount-container">
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            bind:value={form.amount}
                            class="input-amount"
                        />
                        <span class="currency">€</span>
                    </div>
                </div>

                <div class="subcontainer">
                    <label for="recurrence-group">Mensuel :</label>
                    <div id="recurrence-group" class="radio-group">
                        <label class="radio-option">
                            <input
                                type="radio"
                                name="is_monthly"
                                value={true}
                                bind:group={form.is_monthly}
                            />
                            Oui
                        </label>
                        <label class="radio-option">
                            <input
                                type="radio"
                                name="is_monthly"
                                value={false}
                                bind:group={form.is_monthly}
                            />
                            Non
                        </label>
                    </div>
                </div>

                <button type="submit" class="confirm">Valider</button>
            </form>
        {/if}
    </div>
{:else}
    <div class="budget-container">
        <p class="budget">Budget :</p>

        <div class="display-budget">
    <div class="budget-main">
        <div class="budget-text">
            <p class="budget-remaining">{remainingBudget}€</p>
            <p class="budget-total">/ {budgetAmount}€</p>
        </div>

        <button
            onclick={deleteTheBudget}
            class="resetbudget-button"
            aria-label="Supprimer le budget"
            title="Supprimer le budget"
        >
            <svg viewBox="0 0 384 512">
                <path
                    d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
                    fill="currentColor"
                />
            </svg>
        </button>
    </div>

    <div class="budget-progress-wrapper">
        <div class="budget-progress">
            <div
                class="budget-progress-fill {alertType}"
                style={`width: ${Math.min(budgetUsagePercent, 100)}%;`}
            ></div>
        </div>

        <p class="budget-percent">{Math.round(budgetUsagePercent)}% utilisé</p>
    </div>
</div>

        {#if alertType === "warning"}
            <p class="budget-alert warning">
                Attention : 80% du budget ont été consommés.
            </p>
        {:else if alertType === "over"}
            <p class="budget-alert over">
                Budget dépassé.
            </p>
        {/if}
    </div>
{/if}

{#if showToast}
    <div class="toast">
        {toastMessage}
    </div>
{/if}

<style>
    .budget-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        width: 95%;
        padding: 0.75rem 1.25rem;
        background-color: var(--background);
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
        border-radius: 10px;
        font-size: 2rem;
    }

    .budget {
        font-weight: 700;
        font-family: var(--title-font);
        margin: 0;
    }

    .budget-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .subcontainer {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .input-amount-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .input-amount {
        border: none;
        border-radius: 10px;
    }

    .radio-group {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }

    .confirm {
        background-color: var(--primary-color);
        color: var(--background);
        border: none;
        border-radius: 8px;
        padding: 0.25rem 0.75rem;
        cursor: pointer;
    }

    .add-budget_button {
        background-color: var(--primary-color);
        color: var(--background);
        border: none;
        border-radius: 10px;
        padding: 0.25rem 0.75rem;
        cursor: pointer;
    }

    .display-budget {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1rem;
    }

    .budget-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 1rem;
    }

    .budget-text {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        color: var(--foreground);
}

    .budget-remaining {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        font-family: var(--additionnal-font);
        color: var(--foreground);
        line-height: 1;
    }

    .budget-total {
        margin: 0;
        font-size: 1rem;
        opacity: 0.7;
        font-family: var(--additionnal-font);
        line-height: 1.2;
    }

    .resetbudget-button {
        background-color: transparent;
        color: var(--foreground);
        width: 2rem;
        height: 2rem;
        border: none;
        cursor: pointer;
        flex-shrink: 0;
    }

    .resetbudget-button:hover {
        color: var(--accent-color);
    }

    .budget-progress-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        width: 100%;
    }

    .budget-progress {
        width: 100%;
        height: 14px;
        background-color: #ddd;
        border-radius: 999px;
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .budget-progress-fill {
        height: 100%;
        width: 0;
        transition: width 0.3s ease;
        background-color: #2e7d32;
    }

    .budget-progress-fill.warning {
        background-color: #f9a825;
    }

    .budget-progress-fill.over {
        background-color: #c62828;
    }

    .budget-percent {
        margin: 0;
        font-size: 0.9rem;
        text-align: right;
        opacity: 0.8;
        color: var(--foreground);
    }

    .budget-alert {
        margin-top: 1rem;
        text-align: center;
        font-size: 1rem;
        font-weight: 700;
    }

    .warning {
        color: #d97706;
    }

    .over {
        color: #dc2626;
    }

    .toast {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #111;
        color: white;
        padding: 0.75rem 1.25rem;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 2000;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @media (min-width: 768px) {
        .budget-container {
            width: max-content;
            min-width: 20%;
            font-size: 1.5rem;
        }

        .budget-form {
            gap: 2rem;
        }

        .subcontainer {
            flex-direction: row;
            gap: 2rem;
        }

        .add-budget_button {
            margin: auto;
        }

        .budget-remaining {
            font-size: 2.2rem;
        }

        .budget-total {
    font-size: 1rem;
    opacity: 0.7;
}

        .budget-percent {
            font-size: 0.95rem;
        }
    }
</style>