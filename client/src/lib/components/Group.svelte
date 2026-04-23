<script>
    import { onMount } from "svelte";
    import api from "../callApi";
    import { optionGroupModal, transactionGroup,activeGroup, sumTransa } from "../hooks/states.svelte";
    import OptionGroupModal from "../modals/OptionGroupModal.svelte";

    let { name, id} = $props();

    let nameSauv = $state("")
    let number = $state(0)

    function openModal(nameModal) {
        nameSauv = nameModal
        optionGroupModal.bool = true
    }

    function closeModal() {
        nameSauv = ""
        optionGroupModal.bool = false
    }

    const getTransactionsGroup = async () => {
            activeGroup.id = id;
            activeGroup.name = name;

            const { data: transactions } = await api(`/transactions/${id}`);
            const { data: amount } = await api(`/transactions/sumTransac/${activeGroup?.id}`)
            sumTransa.data = amount
            transactionGroup.transactions = transactions;
    }

    onMount(async () => {
        const { data } = await api(`/groups/countUser/${id}`)
        number = data
    })
</script>

<article>
    <div class="container">
        <div class="containerHead">
            <button class="buttonGroup" onclick={getTransactionsGroup}>
                <h2>{name}</h2>
            </button>
            <div class="option-group">
                <p>{number} personnes</p>
                <button class="threedots-button" aria-label="option groupe" onclick={() => optionGroupModal.bool ? closeModal() : openModal(name)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m0 6a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m0 6a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1"/></svg>
                </button>
            </div>
        </div>

        <div class="modal">
            {#if optionGroupModal.bool && nameSauv == name}
                <OptionGroupModal {id} {name} {number}/>
                {nameSauv = ""}
            {/if} 
        </div>
    </div>

</article>



<style>
    .containerHead {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .container{
        height: fit-content;
        background-color: var(--dark-color);
        color: var(--background);
        padding: 0.5rem 0.75rem;
        border-radius: 1rem;
        box-shadow: 0px 3px 5px var(--foreground);
        font-family: var(--text-font);
    }
    .modal{
        width: 100%;
    }
    h2 {
        font-weight: 400;
        font-size: 1rem;
    }
    .option-group{
        display: flex;
    }

    p {
        font-family: "Lora", serif;
        font-weight: 400;
        font-size: 0.75rem;
        margin: .5rem .5rem 0 0;
    }

    button{
        border: none;
        cursor: pointer;
    }

    .buttonGroup{
        background-color: inherit;
        border: none;
        cursor: pointer;
        color: var(--background);
    }

    .threedots-button {
        background-color: transparent;
        color: var(--light-color);
    }

    .threedots-button:hover {
        color: var(--accent-color);
    }
</style>
