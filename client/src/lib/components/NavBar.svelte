<script>
    import { push } from "svelte-spa-router";
    import { getCurrentUser } from "../auth/store";
    import api from "../callApi";
    import { openNotifModal } from "../hooks/states.svelte";
    import { useWindowSize } from "../hooks/useWindowSize.svelte";
    import NotificationModal from "../modals/NotificationModal.svelte";
    import { activeGroup } from "../hooks/states.svelte";

    //const windowSize = useWindowSize();
    let { groupName = "Mon groupe", groupImg = "" } = $props();
    //const TABLET = 768;
    let numberInvit = $state({ count: 0, rows: null });
    const getInvits = async () => {
        const userId = getCurrentUser()
        const { data } = await api(`/groups/countInvits/${userId}`)
        numberInvit = data
    }

    function openNotif() {
        openNotifModal.bool = true;
    }

    function closeNotif() {
        openNotifModal.bool = false;
    }
    getInvits();
</script>

<nav id="nav">
    <div class="nav-left">
        <!-- Image du groupe - pas encore implémenté
        {#if groupImg}
            <img id="group-img" src={groupImg} alt={groupName} />
        {/if}
        -->

        <strong id="group-name">{activeGroup.name}</strong>
    </div>
    <div class="nav-right">
        <button
            id="notification-bell"
            aria-label="Notifications"
            onclick={() => (openNotifModal.bool ? closeNotif() : openNotif())}
        >
            <i class="fa-solid fa-bell"></i>
            {#if numberInvit.count > 0}
                <span>{numberInvit.count}</span>
            {/if}
        </button>
        <button
            onclick={() => push("/profil")}
            aria-label="Profile"
            class="profil-button"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 24 24"
                class="icone"
                ><path
                    fill="currentColor"
                    d="M11.5 14c4.14 0 7.5 1.57 7.5 3.5V20H4v-2.5c0-1.93 3.36-3.5 7.5-3.5m6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S5 16.12 5 17.5V19h13zM11.5 5A3.5 3.5 0 0 1 15 8.5a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8 8.5A3.5 3.5 0 0 1 11.5 5m0 1A2.5 2.5 0 0 0 9 8.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 14 8.5A2.5 2.5 0 0 0 11.5 6"
                /></svg
            >
    </button>
        {#if openNotifModal.bool == true}
            <NotificationModal invitsGroup={numberInvit.rows} {numberInvit} />
        {/if}
    </div>
</nav>

<style>
    #nav {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 1rem 1.25rem;
        box-sizing: border-box;
    }
    span {
        color: white;
        background-color: red;
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border-radius: 2rem;
        font-size: 0.8rem;
        position: relative;
        left: -25%;
    }

    .nav-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        margin: auto;
    }

    .nav-right {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    :global(#group-img) {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
    }

    #group-name {
        font-family: var(--additionnal-font);
        font-size: 2rem;
        font-weight: 600;
        color: var(--foreground);
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: inherit;
        cursor: pointer;
    }

    .fa-bell {
        font-size: 1.5rem;
        color: var(--foreground);
    }

    .fa-bell:hover, .profil-button:hover {
        color: var(--accent-color);
    }

    .profil-button {
        color: var(--foreground);
    }

    @media (min-width: 768px) {
        #nav {
            justify-content: space-between;
        }

        .nav-left {
            margin: 0;
        }
    }
</style>
