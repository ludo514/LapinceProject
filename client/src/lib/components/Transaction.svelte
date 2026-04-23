<script>
    import { onMount } from "svelte";
    import api from "../callApi";

    let { id, name, date, amount, type, onDelete, categoryId } = $props();
    let nameCategory = $state("")
    async function getNameCategory() {
        const { data } = await api(`/categories/${categoryId}`)
        nameCategory = data.name
    }
    onMount(() => {
        getNameCategory()
    })
</script>

<article>
    <div>
        <div id="category-date">
            <h2>{name}</h2>
            <h3>Catégorie : {nameCategory}</h3>
            <h3>{date}</h3>
        </div>
    </div>

    <div class="right">
        <p>{type === "income" ? "+" : "-"} {amount} €</p>

        <button
            class="delete-btn"
            onclick={() => onDelete(id)}
            aria-label="Supprimer la transaction"
            title="Supprimer la transaction"
        >
            ✖
        </button>
    </div>
</article>

<style>
    article {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: var(--dark-color);
        color: var(--background);
        font-size: 1rem;
        padding: 0.5rem 0.75rem 0.5rem 0.75rem;
        border-radius: 1rem;
        box-shadow: 0px 6px 6.5px #000F1510;
    }

    #category-date {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    h2 {
        font-family: "Roboto", sans-serif;
        font-weight: 400;
    }

    h3 {
        font-size: 0.75rem;
        font-family: "Lora", serif;
        font-weight: 400;
    }

    .right {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    p {
        font-size: 1.25rem;
        font-family: "Roboto", sans-serif;
        font-weight: 400;
    }

    .delete-btn {
        background: transparent;
        border: none;
        color: var(--background);
        font-size: 1rem;
        cursor: pointer;
        padding: 0;
    }

    .delete-btn:hover {
        color: var(--accent-color);
    }
</style>