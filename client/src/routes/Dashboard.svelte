<script>
// @ts-nocheck

    import NavBar from "../lib/components/NavBar.svelte";
    import BottomBar from "../lib/components/BottomBar.svelte";
    import Button from "../lib/components/Button.svelte";
    import Transaction from "../lib/components/Transaction.svelte";
    import Group from "../lib/components/Group.svelte";
    import Graph from "../lib/components/Graph.svelte";
    import { useWindowSize } from "../lib/hooks/useWindowSize.svelte.js";
    import AddGroup from "../lib/components/AddGroup.svelte";
    import ModalAddGroup from "../lib/modals/ModalAddGroup.svelte";
    import Addbudget from "../lib/components/Addbudget.svelte";
    import api from "../lib/callApi";
    import { allGroups, transactionGroup, activeGroup, sumTransa } from "../lib/hooks/states.svelte";
    import { deleteTransaction } from "../lib/transactions/transactions.js";
    import { replace } from "svelte-spa-router";
    import { clearAuth } from "../lib/auth/store.js";

    let showOverlay = $state(false);
    const windowSize = useWindowSize();

    const getGroups = async () => {
        const { data } = await api("/groups/me");
        allGroups.groups = data;

        if (data?.length > 0 && !activeGroup.id) {
            activeGroup.id = data[0].id;
            activeGroup.name = data[0].name;

            const { data: transactions } = await api(`/transactions/${data[0].id}`);
            const { data: amount } = await api(`/transactions/sumTransac/${activeGroup?.id}`)
            sumTransa.data = amount
            transactionGroup.transactions = transactions;
        }
    };


    const TABLET = 768;

    function openOverlay() {
        showOverlay = true;
    }

    function closeOverlay() {
        showOverlay = false;
    }

    function logOut() {
        clearAuth();
        replace("/");
    }

    let filteredTransactions = $state([]);
    let filter = $state("income");

    function filteringTransaction(activeFilter) {
        if (!activeFilter) return;
        filter = activeFilter;
        filteredTransactions = transactionGroup.transactions.filter(
            (t) => t.type === activeFilter,
        );
    }
    const displayedTransactions= $derived.by (()=>{
        const transactions = transactionGroup.transactions || [];

        if (filter === "income"){
            return transactions.filter((t)=> t.type === "income");
        }
        if (filter === "expense") {
            return transactions.filter ((t) => t.type === "expense");
        }
        if (filter === "recurring") {
            return transactions.filter ((t) => t.is_monthly === true);
        }
        return transactions;
    })

    async function handleCreateNewTransaction(newTransaction) {
        transactionGroup.transactions = [
            ...(transactionGroup.transactions || []),
            newTransaction,
        ];

    }

    const CHART_COLORS = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(210, 105, 30)",
        "rgb(20, 207, 61)",
        "rgb(95, 255, 202)",
        "rgb(205, 17, 243)",
    ];

    const data = $derived({
        labels: sumTransa.data?.map((t) => t.category.name),
        datasets: [
            {
                fill: true,
                backgroundColor: sumTransa.data?.map(
                    (_, i) => CHART_COLORS[i % CHART_COLORS.length],
                ),
                data: sumTransa.data?.map((t) => t.total),
            },
        ],
    });

    async function handleDeleteTransaction(id) {
        const { error } = await deleteTransaction(id);
        const transaction = transactionGroup.transactions.find((transaction) => transaction.id == id)
        console.log(transaction)
        const totalCategory = sumTransa.data.find((total) => total.category_id == transaction.category_id)
        console.log(totalCategory)
        totalCategory.total -= transaction.amount
        if (error) return;
        transactionGroup.transactions = (transactionGroup.transactions || []).filter(
            (transaction) => transaction.id !== id
        );
    }

    getGroups();
</script>

<div id="layout">
    {#if windowSize.width < TABLET}
        <!-- MOBILE -->
        {#if !showOverlay}
            <button
                onclick={openOverlay}
                class="burger-button"
                aria-label="Ouvrir menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 6h18M3 12h18M3 18h18"
                    />
                </svg>
            </button>
        {:else if showOverlay}
            <aside id="group-list" class="overlay-mobile">
                <button
                    onclick={closeOverlay}
                    class="cross-button"
                    aria-label="Fermer menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m7 7l10 10M7 17L17 7"
                        />
                    </svg>
                </button>

                {#each allGroups.groups as group (group.id)}
                    <Group name={group.name} id={group.id} />
                {/each}

                <AddGroup />
                <button class="disconnect-button" onclick={logOut}>
                    <strong>Déconnexion</strong>
                </button>
            </aside>
        {/if}
    {:else}
        <!-- DESKTOP -->
        <aside id="group-list" class="overlay-desktop">
            {#each allGroups.groups as group (group.id)}
                <Group name={group.name} id={group.id} />
            {/each}

            <AddGroup />
            <button class="disconnect-button" onclick={logOut}>
                <strong>Déconnexion</strong>
            </button>
        </aside>
    {/if}

    <main>
        <NavBar groupName="La Pince" />
        {#if activeGroup.id }
            <div id="filter-buttons">
                <Button
                    filter={"all"}
                    onClick={() => filteringTransaction("all")}
                >
                    Tout
                </Button>
                <Button
                    filter={"income"}
                    onClick={() => filteringTransaction("income")}
                >
                    Entrées
                </Button>

                <Button
                    filter={"recurring"}
                    onClick={() => filteringTransaction("recurring")}
                >
                    Récurrences
                </Button>

                <Button
                    filter={"expense"}
                    onClick={() => filteringTransaction("expense")}
                >
                    Sorties
                </Button>
            </div>
            {#if transactionGroup.transactions?.length != 0}
                <Graph {data} />
            {/if}

            <div class="add-budget">
                <Addbudget transactions={transactionGroup.transactions} />
            </div>

            <section class="transactions">
                <div>
                    <strong class="noGroup">Transactions :</strong> 
                </div>
                {#each displayedTransactions as transaction (transaction.id)}
                    <Transaction
                        id={transaction.id}
                        name={transaction.name}
                        date={transaction.date_transaction}
                        amount={transaction.amount}
                        type={transaction.type}
                        categoryId={transaction.category_id}
                        onDelete={handleDeleteTransaction}
                    />
                {/each}
            </section>



            <BottomBar
                onCreateNewTransaction={handleCreateNewTransaction}
                selectedGroupId={activeGroup.id}
            />
        {:else}
            <div class="container">  
                <div class="containerNoGroup">
                    <strong class="noGroup">Choisir un groupe</strong>
                </div>
            </div>
        {/if}
        <ModalAddGroup groups={allGroups.groups} />
    </main>
</div>

<style>
    #layout {
        display: flex;
        flex-direction: row;
        height: 100dvh;
        overflow: hidden;
    }
    
    .noGroup {
        font-size: 1.8rem;
        color: var(--foreground);
    }
    .burger-button,
    .cross-button {
        display: block;
        width: 3rem;
        position: absolute;
        top: 1rem;
        left: 1rem;
        background-color: transparent;
        border: none;
        z-index: 2;
    }
    .container {
        height: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .containerNoGroup {
        padding: 1rem;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: .5rem;
    }
    .burger-button {
        color: var(--foreground);
    }

    .cross-button {
        color: var(--background);
    }

    .overlay-mobile {
        position: fixed;
        top: 0;
        left: 0;
        height: 100dvh;
        width: 100dvw;
        z-index: 2;
        padding: 1rem;
    }

    .disconnect-button {
        background-color: transparent;
        color: var(--foreground);
        border: none;
        margin-top: auto;
        margin-bottom: 3.5rem;
        margin-right: auto;
        transition: all 0ms;
    }

    .disconnect-button:hover {
        cursor: pointer;
        color: var(--accent-color);
    }

    strong {
        font-family: var(--title-font);
    }

    .overlay-desktop {
        display: none;
    }

    #group-list {
        flex-shrink: 0;
        background-color: var(--primary-color);
        padding: 5rem 1rem 1.5rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border-right: solid 1px var(--dark-color);
        box-shadow: 1px 0 2.5px var(--foreground);
    }

    main {
        flex: 1;
        min-height: 100vh;
        padding-bottom: 80px;
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
    }

    .add-budget {
        display: flex;
        justify-content: center;
        margin: 2rem 0;
    }

    .transactions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
    }

    #filter-buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 0.75rem;
        padding: 0.75rem 1.25rem;
    }



    @media (min-width: 768px) {
        section {
            padding-left: 6rem;
            padding-right: 6rem;
        }

        .burger-button {
            display: none;
        }

        .overlay-desktop {
            display: block;
            left: 0;
            top: 0;
            width: 280px;
            border-right: 1px solid #ddd;
            padding: 1rem;
        }

        .overlay-mobile {
            display: none;
        }

        #group-list {
            width: 24rem;
        }

        .disconnect-button {
            margin-bottom: 0;
        }
    }
</style>
