<script>
    import api from "../callApi.js";
    import { activeGroup, sumTransa, transactionGroup } from "../hooks/states.svelte.js";
    import { createNewTransaction } from "../transactions/transactions.js";

    let { onClose, onCreateNewTransaction, selectedGroupId } = $props();
    const todayDate = new Date().toISOString().split("T")[0];
    let categories = $state()
    let form = $state({
        name: "",
        type: "",
        amount: null,
        is_monthly: false,
        date_transaction: todayDate,
        group_id: selectedGroupId,
        category_id: null,
    });

    async function handleSubmit(e) {
        e.preventDefault();

        const amount = Number(form.amount);

        if (Number.isNaN(amount) || amount <= 0) {
            alert("Le montant doit être supérieur à 0");
            return;
        }

        const payload = {
            ...form,
            amount,
            group_id: selectedGroupId
        };

        const { data, error } = await createNewTransaction(payload);

        if (error) return;
        
        onCreateNewTransaction(data);

        let exist = sumTransa.data.findIndex((total) => total.category_id == form.category_id)

        if (exist != -1) {
            const newTotal = Number(sumTransa.data[exist].total) + amount;
            sumTransa.data[exist].total = newTotal
        }else{       
            sumTransa.data.push({
                category: {
                    name: categories?.find((category) => category.id == form.category_id)?.name,
                },
                category_id: Number(form.category_id),
                group: {
                    name: activeGroup?.name,
                },
                total: amount,
            });
        }

        onClose();
    }

    async function allCategories() {
        const { data } = await api('/categories/')
        categories = data
    }

    allCategories()

</script>

<div class="overlay" onclick={onClose}></div>
<div class="form-container">
    <button onclick={onClose} class="close-button" aria-label="Fermer" title="Fermer"
        ><svg viewBox="0 0 384 512"
            ><path
                d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
                fill="currentColor"
            /></svg
        ></button
    >
    <form class="add-transactions-form" onsubmit={handleSubmit}>
        <div class="subcontainers">
            <label for="name">Libellé :</label>
            <input id="name" type="text" bind:value={form.name} />
        </div>
        <div class="subcontainers">
            <label for="type-group">Type :</label>
            <div id="type-group" class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="type" value="income" bind:group={form.type} />
                    Rentrees
                </label>
                <label class="radio-option">
                    <input type="radio" name="type" value="expense" bind:group={form.type} />
                    Sorties
                </label>
            </div>
        </div>

        <div class="subcontainers">
            <label for="amount">Montant :</label>
            <div class="montant-input">
                <input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    bind:value={form.amount}
                />
                <span class="currency">€</span>
            </div>
        </div>

        <div class="subcontainers">
            <label for="recurrence-group">Mensuel :</label>
            <div id="recurrence-group" class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="is_monthly" value={true} bind:group={form.is_monthly} />
                    Oui
                </label>
                <label class="radio-option">
                    <input type="radio" name="is_monthly" value={false} bind:group={form.is_monthly} />
                    Non
                </label>
            </div>
        </div>
        <div class="subcontainers">
            <label for="date">Date de la transaction :</label>
            <input type="date" id="date" bind:value={form.date_transaction} />
        </div>
        <div class="subcontainers">
    <label for="category">Catégorie :</label>
    <select id="category" bind:value={form.category_id}>
        <option value="">-- Choisir --</option>
        {#each categories as category }
            <option value={category.id}>{category.name}</option>
        {/each}
    </select>
</div>
        <button type="submit" class="add-button">Ajouter</button>
    </form>
</div>

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 2;
    }
    .form-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--primary-color);
        padding: 2rem;
        border-radius: 20px;
        z-index: 3;
        width: 90%;
        max-width: 600px;
        color: var(--background);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .close-button {
        background-color: transparent;
        color: var(--background);
        width: 1.75rem;
        height: 1.75rem;
        border: none;
        position: absolute;
        right: 1rem;
        top: 0.5rem;
    }

    .close-button:hover {
        cursor: pointer;
    }

    .add-transactions-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    .subcontainers {
        display: flex;
        gap: 0.25rem;
        flex-direction: column;
        align-items: center;
        font-size: 1.25rem;
        width: 100%;

        input,
        select {
            border-radius: 10px;
            border: none;
            padding: 0.25rem;
        }

        label,
        input,
        select {
            font-family: var(--title-font);
        }

        input:focus {
            outline: 2px solid var(--secondary-color);
        }
    }

    .radio-group {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }

    .add-button {
        margin-top: 1rem;
        font-size: 1.25rem;
        padding: 0.25rem 1rem;
        border-radius: 10px;
        border: none;
    }

    .add-button:hover {
        cursor: pointer;
        opacity: 0.5;
    }

    .add-button:active {
        opacity: 1;
        color: var(--background);
        background-color: var(--main-color);
    }

    /*---RESPONSIVE---*/

    @media (min-width: 768px) {

        .add-transactions-form {
            gap: 2rem;
        }

        .subcontainers {
            flex-direction: row;
            justify-content: space-between;
        }

        .radio-group {
            justify-content: center;
            gap: 2rem;
        }

        label {
            display: block;
        }
    }
</style>