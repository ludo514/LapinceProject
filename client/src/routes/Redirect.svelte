<script>
  import { onMount } from "svelte";
  import { push, router } from "svelte-spa-router";
  import api from "../lib/callApi";
  import { getCurrentUser } from "../lib/auth/store";

  onMount(async () => {
    await api(`/groups/${router.params.id}/users/${getCurrentUser()}`, "PATCH", { status : "accepted"})
    push("/");
  });
</script>