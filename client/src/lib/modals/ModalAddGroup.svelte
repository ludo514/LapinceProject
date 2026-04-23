<script>
    import api from "../callApi";
    import { newGroupModal } from "../hooks/states.svelte";
    import { useWindowSize } from "../hooks/useWindowSize.svelte";

    let { groups } = $props()

    const windowSize = useWindowSize();

    const TABLET = 768;

    function closeModal() {
        newGroupModal.bool = false
    }
    let newGroupName = $state("")
    
    const addNewGroup = async () => {
        const { data } = await api("/groups", "POST", { name : newGroupName })
        groups.push(data)
        closeModal()
    }

    function checkSize() {
        if (windowSize.width < TABLET) {
            return 27
        }
        return 50
    }
</script>

{#if newGroupModal.bool}
    <div class="container" style="--size: {checkSize()}%">
        <div class="containerButtonSpan">
            <div class="containerSpan">
                <span>Ajouter un nouveau groupe</span>
            </div>
            <div class="containerButton">
                <button class="button-close" aria-label="fermer la fenêtre" onclick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 13v-1h13v1z"/></svg>
                </button>
            </div>
        </div>
        <input type="text" name="search" placeholder="Nom du groupe" bind:value={newGroupName}>
        <div class="containerValidate">
            <button class="validate" onclick={addNewGroup}>
                Valider
            </button>
        </div>
    </div>
{/if}

<style>
    .container{
        width: 20rem;
        height: 10rem;
        background-color: var(--primary-color);
        font-family: var(--text-font);
        color: var(--background);
        position: fixed;
        z-index: 10;
        left: var(--size);
        top: 40%;
        padding: 0 1rem 0 1rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    }
    .button-close{
        border: none;
        background-color: inherit;
        cursor: pointer;
    }

    .containerSpan{
        padding-top: 0.5rem;
    }
    .containerButtonSpan{
        display: flex;
        margin: 0.5rem;
        justify-content: space-between;
        height: fit-content;
    }
    input{
        width: 100%;
        border: solid 1px rgb(146, 146, 146);
        border-radius: 0.5rem;
        height: 2rem;
        padding: 1rem;
    }
    input:focus{
        outline: none;
    }
    .validate{
        border: none;
        width: 6rem;
        height: 2.5rem;
        cursor: pointer;
        border-radius: 0.5rem;
    }
    .validate:hover{
        background-color: var(--secondary-color);
        transition: 0.3s;
    }
    .containerValidate{
        margin: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>