<script>
	import Router from 'svelte-spa-router';
	import Dashboard from './routes/Dashboard.svelte';
	import Login from './routes/Login.svelte';
	import LandingPage from './routes/LandingPage.svelte';
	import { wrap } from 'svelte-spa-router/wrap';
	import Redirect from './routes/Redirect.svelte';
	import LegalPage from './routes/LegalPage.svelte';
	import { useAuth } from './lib/hooks/useAuth.js';
	import ProfilUser from './routes/ProfilUser.svelte';
	import { Toaster } from 'svelte-sonner';

	const { requireAuth, requireGuest } = useAuth();
</script>

<Toaster position="top-center" />
<Router routes={{
	'/': LandingPage,
	'/legal': LegalPage,
	'/login': wrap({ component: Login, conditions: [requireGuest] }),
	'/dashboard': wrap({ component: Dashboard, conditions: [requireAuth] }),
	'/profil': wrap({component: ProfilUser, conditions: [requireAuth]}),
	'/invit/:id': Redirect
}} />
