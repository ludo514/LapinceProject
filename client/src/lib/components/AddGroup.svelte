<script>
    import { newGroupModal } from "../hooks/states.svelte";
    function modalOpen() {
        newGroupModal.bool = true
    }
</script>

<div class="addGroup">
    
    <button class="button-add" onclick={modalOpen} aria-label="ajout group">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6z"/></svg>
        <span>Nouveau groupe</span>
    </button>
</div>

<style>
    .addGroup{
        font-family: var(--font-body);
        display: flex;
    }
    .button-add{
        border: none;
        background-color: transparent;
        color: var(--text-on-dark-secondary);
        cursor: pointer;
        width: 15rem;
        display: flex;
        padding: .5rem;
        border-radius: .5rem;
        span{
            padding-top: 0.1rem;
        }
    }
    .button-add:hover{
        background-color: rgba(255, 255, 255, 0.151);
    }
</style>