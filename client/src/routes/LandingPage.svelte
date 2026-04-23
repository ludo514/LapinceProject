<script>
	import { push } from "svelte-spa-router";
</script>

<section class="landing">
	<section class="hero">
		<div>
			<h1 class="main-title">Lapince</h1>
		</div>
		<!-- <p>
			Gérez votre budget en groupe simplement, suivez vos dépenses et
			visualisez vos finances en un coup d'œil.
		</p> -->

		<div class="actions">
			<button onclick={() => push("/login")}>Se connecter</button>
		</div>
	</section>
	<section class="info">
		<h2>Pourquoi Lapince ?</h2>
		<p>
			Lapince est né d’un constat simple : gérer son budget est souvent
			compliqué, voire décourageant. Notre objectif est de rendre cette
			gestion simple, claire et accessible à tous.
		</p>

		<h3 class="with">Avec Lapince, vous pouvez gérez:</h3>
		<div class="features">
			<div class="card">
				<h2>Dépenses</h2>
				<p>Ajoutez et suivez facilement les transactions du groupe.</p>
			</div>

			<div class="card">
				<h2>Budgets</h2>
				<p>Définissez des budgets mensuels pour mieux anticiper.</p>
			</div>

			<div class="card">
				<h2>Visualisation</h2>
				<p>
					Consultez des graphiques clairs pour comprendre vos
					finances.
				</p>
			</div>
		</div>
	</section>
</section>

<style>
	.landing {
		font-family: var(--text-font);
		overflow-x: hidden;
		height: 100dvh;
	}

	.hero {
		max-width: 100%;
		background: linear-gradient(135deg, #26633f, #4a7c78);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: var(--background);
		position: relative;
		padding: 2rem;
		border-bottom: solid 1px var(--accent-color);
	}

	.main-title {
		font-size: 3rem;
		margin-bottom: 1rem;
		font-family: var(--title-font);
		text-shadow: 1px 1px 0px var(--accent-color);
	}

	.info {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 2rem;
		margin: 2rem 0;
	}

	p {
		font-size: 1.1rem;
		line-height: 1.6;
		text-align: center;
	}

	.with {
		margin: 5rem 0;
	}

	.features {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 1.5rem;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		background-color: #f2d28c67;
		padding: 2rem;
	}

	.card h2 {
		margin-bottom: 0.8rem;
		font-size: 1.3rem;
	}

    button {
		font-family: var(--additionnal-font);
        padding: 0.8rem 0.8rem;
        border-radius: 8px;
        border: none;
        color: var(--background);
		background-color: var(--secondary-color);
        border: solid 1px var(--light-color);
    }

	button:hover {
		cursor: pointer;
        border: solid 1px var(--accent-color);
        background-color: var(--light-color);
	}

	@media (min-width: 768px) {
		.features {
			flex-direction: row;
		}

		.actions {
			position: absolute;
			top: 1rem;
			right: 1rem;
		}

		.hero {
			padding: 5%;
		}
	}
</style>
