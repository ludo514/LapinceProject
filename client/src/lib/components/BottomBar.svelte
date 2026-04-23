<script>
    import AddTransactionsForm from "./AddTransactionsForm.svelte";

    let { onCreateNewTransaction, selectedGroupId } = $props();

    let formIsOpen = $state(false);
    function openForm() {
        formIsOpen = true;
    }

    function closeForm() {
        formIsOpen = false;
    }


</script>

<div id="bottom-bar">
    <button id="add-button" aria-label="Ajouter une transaction" onclick={openForm}>
        <span>+</span>
    </button>
    <!-- <button class="groupButton" aria-label="afficher les groupes" onclick={openGroup}>
        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="#242424" d="M5 5h4l3 3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6.41l-3-3z"/></svg>
    </button> -->
</div>
{#if formIsOpen}
    <AddTransactionsForm 
    onClose={closeForm} 
    onCreateNewTransaction={onCreateNewTransaction} 
    selectedGroupId={selectedGroupId} />
{/if}

<!-- {#if openModalGroup.bool}
    <ShowAllGroupModal {groups}/>
{/if} -->

<style>
    #bottom-bar {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: var(--secondary-color);
        border-radius: 50px 50px 0 0;
        height: 60px;
        justify-content: center;
        align-items: flex-start;
        padding-top: 0;
        z-index: 1000;
    }

    #add-button {
        position: relative;
        top: -22px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 6px 6.5px #000F1540;
    }

    #add-button span {
        font-size: 2rem;
        color: var(--background);
        line-height: 1;
        font-weight: 300;
    }

    .groupButton{
        border: none;
        background-color: inherit;
        cursor: pointer;
    }

    @media (min-width: 768px) {
        #bottom-bar {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: auto;
            position: initial;
            box-shadow: 0px 6px 6.5px #000F1510;
            width: 95%;
            border-radius: 1rem;
            border: dashed .2rem var(--light-color); 
            background-color: var(--background);
            padding: .25rem 0;
            box-shadow: 0px 2px 5px var(--foreground);
        }

        #bottom-bar:hover {
            border: solid .2rem var(--light-color);
        }

        #add-button {
            position: initial;
            border-radius: 1rem;
            width: 100%;
            background-color: var(--background);
            box-shadow: none;
            font-size: 2rem;
        }

        #add-button span {
        font-size: 4rem;
        color: var(--accent-color);
    }

    }
</style>
