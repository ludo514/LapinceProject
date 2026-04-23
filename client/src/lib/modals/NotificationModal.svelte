<script>
    import { onMount } from "svelte";
    import { getCurrentUser } from "../auth/store";
    import api from "../callApi";
    import { allGroups, openNotifModal } from "../hooks/states.svelte";

    let { invitsGroup, numberInvit } = $props()
    const acceptedOrRefused = async (group, invits, status) => {
        await api(`/groups/${group.id}/users/${getCurrentUser()}`, "PATCH", { status : status})
        allGroups.groups.push(group)
        invitsGroup.splice(invitsGroup.findIndex((invit) => invit.id === invits.id), 1)
        numberInvit.count -= 1
        openNotifModal.bool = false
    }

</script>

<div class="container">
    {#each invitsGroup as invits}
        <div class="containerInvits">
            <p>Vous êtes invité à rejoindre le groupe : <strong>{invits.Group.name}</strong></p>
            <button onclick={() => acceptedOrRefused(invits.Group, invits, "accepted")}>
                Accepter
            </button>
            <button onclick={() => acceptedOrRefused(invits.Group, invits, "refused")}>
                Refuser
            </button>
        </div>
    {/each}
</div>

<style>
    .container{
        font-family: "Roboto", sans-serif;
        width: fit-content;
        height: fit-content;
        background-color: white;
        position: fixed;
        right: 6%;
        top: 6%;
        padding: 1rem;
        border-radius: .5rem;
    }
</style>