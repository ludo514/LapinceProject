<script>
    let { onClose, onDelete } = $props();

</script>

<div class="overlay" onclick={onClose}></div>
<div class="container">
    <p class="question">
        Êtes‑vous sûr de vouloir supprimer votre compte ? Cette action est
        définitive.
    </p>
    <div class="buttons">
        <button onclick={onClose} class="button return">Retour</button>
        <button onclick={ () => onDelete()} class="button delete">Supprimer</button>
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 2;
    }
    .container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        background: var(--primary-color);
        padding: 2rem;
        border-radius: 20px;
        z-index: 3;
        width: 90%;
        max-width: 90%;
        color: var(--background);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        font-size: 1.2rem;
    }

    .question {
        text-align: justify;
    }

    .buttons {
        display: flex;
        gap: 2rem;
    }

    .button {
        padding: 0.8rem 0.8rem;
        border-radius: 8px;
        border: none;
        color: var(--background);
        font-weight: 600;
    }

    .button:hover {
        cursor: pointer;
    }

    .return {
        background-color: var(--secondary-color);
        border: solid 1px var(--light-color);
    }

    .return:hover {
        border: solid 1px var(--accent-color);
        color: var(--foreground);
        background-color: var(--light-color);
    }

    .delete {
        background-color: darkred;
        border: solid 1px var(--foreground);
    }

    .delete:hover {
        border: solid 1px darkred;
        background-color: red;
    }

    @media (min-width: 768px) {
        .container {
            width: 60%;
        }
    }
</style>
