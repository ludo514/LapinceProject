<script>
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";
    import api from "../lib/callApi";
    import NavBar from "../lib/components/NavBar.svelte";
    import { allGroups } from "../lib/hooks/states.svelte";
    import DeleteAccount from "../lib/modals/DeleteAccountModal.svelte";
    import { deleteUser } from "../lib/auth/auth"

    let user = $state({});
    let openedModal = $state(false);

    function openModal() {
        openedModal = true;
    }

    function closeModal() {
        openedModal = false;
    }

    async function userProfil() {
        const res = await api("/auth/me");
        user = res.data;
    }

    async function handleDelete() {
        try {
            await deleteUser();
            localStorage.removeItem("token");
            openedModal = false;
            window.location.href = "/";
        } catch (err) {
            console.error("erreur supression ", err);
        }
    }

    onMount(() => {
        userProfil();
    });
</script>

<NavBar groupName={"LaPince"} />
<div class="main">
    <div class="container">
        <div class="header">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6em"
                height="6em"
                viewBox="0 0 24 24"
            >
                <path
                    fill="#000"
                    d="M11.5 14c4.14 0 7.5 1.57 7.5 3.5V20H4v-2.5c0-1.93 3.36-3.5 7.5-3.5m6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S5 16.12 5 17.5V19h13zM11.5 5A3.5 3.5 0 0 1 15 8.5a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8 8.5A3.5 3.5 0 0 1 11.5 5m0 1A2.5 2.5 0 0 0 9 8.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 14 8.5A2.5 2.5 0 0 0 11.5 6"
                />
            </svg>
        </div>

        <div class="content">
            <div class="section">
                <h2>Informations</h2>
                <div class="info">
                    <span class="label">Email :</span>
                    <span>{user.email}</span>
                </div>
                <div class="info">
                    <span class="label">Nom :</span>
                    <span>{user.last_name}</span>
                </div>
                <div class="info">
                    <span class="label">Prénom :</span>
                    <span>{user.first_name}</span>
                </div>
            </div>

            <div class="section">
                <h2>Groupes créés :</h2>
                {#each allGroups.groups as group (group.id)}
                    <div class="info">
                        <span class="label">{group.name}</span>
                    </div>
                {/each}
            </div>
            <div class="section last">
                <!-- <button class="button">Modifier le profil</button> -->
                <button onclick={openModal} class="button delete"
                    >Supprimer le compte</button
                >
                <button onclick={() => push("/dashboard")} class="button close">
                    Fermer
                </button>
            </div>
            {#if openedModal}
                <DeleteAccount onClose={closeModal} onDelete={handleDelete} id={user.id} />
            {/if}
        </div>
    </div>
</div>

<style>
    .main {
        min-height: 100dvh;
        background: var(--background);
        padding: 3rem;
        font-family: var(--text-font);
    }

    a {
        text-decoration: none;
        color: var(--background);
    }

    .container {
        max-width: 40rem;
        margin: 2rem auto;
        background: white;
        border-radius: 12px;
        border: solid 1px var(--primary-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    .header {
        /* background: linear-gradient(135deg, var(--primary-color), #26633f); */
        background: url(../assets/login-background.png);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        padding: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content {
        padding: 30px;
    }

    .section {
        margin-bottom: 25px;
    }

    .last {
        display: flex;
        justify-content: center;
        gap: 2rem;
    }

    .section h2 {
        margin-bottom: 10px;
        color: var(--secondary-color);
        border-bottom: 2px solid var(--light-color);
        padding-bottom: 5px;
    }

    .info {
        display: flex;
        justify-content: space-between;
        margin: 8px 0;
    }

    .label {
        font-weight: bold;
        color: var(--dark-color);
    }

    .value {
        color: var(--foreground);
    }

    .button {
        padding: 0.8rem 0.8rem;
        border-radius: 8px;
        border: none;
        color: var(--background);
    }

    .button:hover {
        cursor: pointer;
    }

    .delete {
        background-color: darkred;
        border: solid 1px var(--foreground);
    }

    .delete:hover {
        border: solid 1px darkred;
        background-color: red;
    }

    .close {
        background-color: var(--secondary-color);
        border: solid 1px var(--light-color);
    }

    .close:hover {
        border: solid 1px var(--accent-color);
        background-color: var(--light-color);

        a {
            color: var(--foreground)
        }
    }

    @media (min-width: 768px) {
        .container {
            max-width: 70%;
        }

        .content {
            padding: 3rem;
        }
    }
</style>
