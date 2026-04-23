<script>
    import { newGroupModal } from "../hooks/states.svelte";
    function modalOpen() {
        newGroupModal.bool = true
    }
</script>

<div class="addGroup">
    <button class="icone" onclick={modalOpen} aria-label="ajout group">
        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6z"/></svg>
    </button>
</div>

<style>
    .addGroup{
        border: dashed 0.2rem var(--light-color);
        width: 100%;
        height: 3rem;
        border-radius: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 2px 5px var(--foreground);
    }
    .icone{
        border: none;
        background-color: transparent;
        color: var(--accent-color);
        cursor: pointer;
    }
</style>