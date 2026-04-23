<script>
    import { fade } from "svelte/transition";
    import { allGroups, optionGroupModal } from "../hooks/states.svelte";
    import api from "../callApi";
    import emailjs from "@emailjs/browser";
    import { getCurrentUser } from "../auth/store";
    import { onMount } from "svelte";

    let {id, name, number} = $props()
    let newNameGroup = $state("")
    let emailUser = $state("")
    let status = $state("")
    let allUsers = $state()
    emailjs.init({
        publicKey: 'HKFfT-vqPCRfPYXaZ',
        // @ts-ignore
        privateKey: import.meta.env.VITE_EMAILJS_KEY,
        limitRate: {
            id: 'app',
            throttle: 10000,
        },
    });

    function closeModal() {
        optionGroupModal.bool = false
    }

    const getAllUsers = async () => {
        const { data } = await api(`/groups/users/${id}`)
        allUsers = data
    }

    const deleteGroup = async () => {
        await api(`/groups/${id}`, "DELETE")
        const groupIndex = allGroups.groups.findIndex((group) => group.id === id)
        allGroups.groups.splice(groupIndex, 1)
        closeModal()
    }

    const updateGroup = async () => {
        const updatedGrouName = await api(`/groups/${id}`, "PATCH", { name: newNameGroup })
        const groupIndex = allGroups.groups.findIndex((group) => group.id == updatedGrouName.data.id)
        allGroups.groups[groupIndex].name = newNameGroup
        newNameGroup = ""
        closeModal()
    }

    const getStatus = async () => {
        const { data } = await api(`/groups/getStatus/${id}/${getCurrentUser()}`)
        status = data[0].role
        console.log(data[0].role)
    }

    const addUserToGroup = async () => {
        await api(`/groups/${id}/users`, "POST", {email: emailUser})

        const templatParamEmail = {
            group_name: name,
            invite_link: `http://localhost:5173/#/invit/${id}`,
            email: emailUser
        }
        
        emailjs.send('service_w5z299i', 'template_we4c5l9', templatParamEmail).then(
            (response) => {
                console.log('SUCCESS!', response.status, response.text);
            },
            (error) => {
                console.log('FAILED...', error);
        });
        closeModal()
    }

    const deleteUser = async (user) => {
        await api(`/groups/${id}/users/${user}`, "DELETE")
        const userIndex = allUsers.findIndex((user) => user.User.id === user)
        allUsers.splice(userIndex, 1)
        number -= 1
    }
    onMount(() => {
        getStatus()
        getAllUsers()
    })

</script>

<div class="container" in:fade out:fade>
    {#if status == "admin"}
        <div class="gestionGroupe">
            <span>Changez le nom du groupe :</span>
            <input type="text" bind:value={newNameGroup}>
            <button onclick={updateGroup}>
                Valider
            </button>
        </div>
    {/if}

    <div class="gestionGroupe">
        <span>Inviter à rejoindre le groupe :</span>
        <input type="text" bind:value={emailUser}>
        <button onclick={addUserToGroup}>
            Inviter
        </button>
    </div>
    <strong>Tout les membres : </strong>
    <div class="allUtilisateurs">
        {#each allUsers as user}
            <div class="utilisateur">
                <div class="iconeName">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24" class="icone"><path fill="#000"
                    d="M11.5 14c4.14 0 7.5 1.57 7.5 3.5V20H4v-2.5c0-1.93 3.36-3.5 7.5-3.5m6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S5 16.12 5 17.5V19h13zM11.5 
                    5A3.5 3.5 0 0 1 15 8.5a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8 8.5A3.5 3.5 0 0 1 11.5 5m0 1A2.5 2.5 0 0 0 9 8.5a2.5 2.5 0 0 0 2.5 
                    2.5A2.5 2.5 0 0 0 14 8.5A2.5 2.5 0 0 0 11.5 6"/></svg>
                    <div class="name">
                        {user.User.first_name}
                    </div>
                </div>
                {#if status == "admin"}
                    <button class="deleteUser" aria-label="Remove user from group" onclick={() => deleteUser(user.User.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                            <path fill="#000" d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z" />
                        </svg>
                    </button>
                {/if}
            </div>
        {/each}
    </div>

    {#if status == "admin"}
        <button onclick={deleteGroup}>
            Supprimer
        </button>
    {/if}
    <button onclick={closeModal}>
        Fermer
    </button>
</div>

<style>
    .container{
        padding: 1rem;
        height: fit-content;
        width: 90%;
        background-color: #293a31;
        border-radius: 0.5rem;
        font-family: var(--text-font);
    }
    input{
        border: none;
        border-radius: .4rem;
        margin: 1rem 0 1rem 0;
    }
    button{
        border-radius: .4rem;
        border: none;
    }

    .deleteUser{
        background-color: inherit;
    }

    .iconeName{
        display: flex;
    }
    .deleteUser:hover{
        background-color: inherit;
        color: red;
        cursor: pointer;
    }
    .gestionGroupe{
        margin-bottom: 1rem;
    }
    button:hover{
        background-color: var(--secondary-color);
        transition: 0.3s;
    }

    .allUtilisateurs{
        background-color: #212e27;
        padding: 0.8rem;
        border-radius: 1rem;
        margin: .5rem 0 1rem 0;
    }

    .utilisateur{
        display: flex;
        border-radius: .5rem;
        justify-content: space-between;
    }
    .utilisateur:hover{
        background-color: #1c2520;
    }
    .name{
        padding-top: .4rem;
        margin-left: 0.5rem;
    }
</style>