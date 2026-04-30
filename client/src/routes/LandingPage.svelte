<script>
	import { push } from "svelte-spa-router";
</script>

<section class="landing">
	<section class="hero">
		<nav>
			<h1 class="main-title">Lapince</h1>
			<div>
				<span class="contact">Contact</span>
				<button onclick={() => push("/login")}>Se connecter</button>
			</div>

		</nav>
		<section class="containerHero">
			<div class="leftContainer">
				<span>Gestion de budget collaboratif</span>
				<h2>Gérez vos finances en groupe, simplement.</h2>
				<p>Suivez vos dépenses, définissez des budgets et visualisez vos finances en un coup d'œil — seul ou à plusieurs.</p>
				<button>Commencer gratuitement</button>
				<small>Sans carte bancaire · Données chiffrées</small>
			</div>
			<div>
				<div class="exemple">
					<h4>Budget — Famille</h4>
					<span>760 €</span>
					<small>restants sur 2 400 €</small>
					<p>TRANSACTIONS RÉCENTES</p>
					<div class="mini-bar"><div class="mini-fill"></div></div>
					<div class="transac">
						<div>
							<small class="cate">Loyer</small>
							<small class="cate">Salaire</small>
							<small class="cate">Carrefour</small>
						</div>
						<div>
							<small class="expense">-950€</small>
							<small class="income">+2400€</small>
							<small class="expense">-84€</small>
						</div>
					</div>
				</div>
			</div>
		</section>
	</section>
	<section class="containerBody">
		<div class="textBody">
			<p class="needToHave">Tout ce qu'il vous faut</p>
			<p class="tools">Des outils simples pour une gestion claire et partagée.</p>
		</div>
		<div class="containerCards">
			<div class="cards">
				<strong>Suivi des dépenses</strong>
				<p>Ajoutez et catégorisez chaque transaction en quelques secondes, avec ou sans récurrence.</p>
			</div>
			<div class="cards">
				<strong>Suivi des dépenses</strong>
				<p>Ajoutez et catégorisez chaque transaction en quelques secondes, avec ou sans récurrence.</p>
			</div>
			<div class="cards">
				<strong>Suivi des dépenses</strong>
				<p>Ajoutez et catégorisez chaque transaction en quelques secondes, avec ou sans récurrence.</p>
			</div>
		</div>
	</section>
	<footer>
		<section class="firstPartFooter">
			<div>
				<span>Prêt à reprendre le contrôle ?</span>
				<p>Créez votre compte en 30 secondes, c'est gratuit.</p>
			</div>
			<button>
				Créer un compte
			</button>
		</section>	
		<section class="secondPartFooter">
			<p>© 2026 Lapince — Projet étudiant</p>
			<a href="">Mentions légales</a>
		</section>
	</footer>
</section>

<style>
	.landing {
		font-family: var(--text-font);
	}

	nav {
		display: flex;
		justify-content: space-between;
		padding: 1rem;
		h1{
			color: #F2D28C; /* --color-accent */
		}
	}

	.contact{
		margin-right: 1rem;
	}
	.hero {
		max-width: 100%;
		background: #1E2F2C; /* --bg-dark */
		color: var(--background);
		position: relative;
		height: 55%;
		padding-bottom: 1rem;
	}

	.exemple{
		width: 18rem;
		h4{
			font-weight: 300;
			font-size: .9rem;
			color: rgba(255,255,255,0.55); /* --text-on-dark-tertiary */
			margin-bottom: .5rem;
		}
		.transac{
			display: flex;
			justify-content: space-between;
		}
		span{
			font-size: 1.8rem;
		}
		small{
			color: rgba(255,255,255,0.35);
		}
		p{
			font-size: 0.8rem;
			color: rgba(255,255,255,0.55);/* --text-on-dark-tertiary */
			margin-bottom: 1rem;
		}
		.expense{
			color: #D85A30; /*--color-expense*/
		}
		.income{
			color: #1D9E75; /*--color-income*/
		}
		.cate{
			color: rgba(255,255,255,0.75);
		}

		  .mini-bar {
			height: 5px;
			background: rgba(255,255,255,0.1);
			border-radius: 99px;
			margin-bottom: 16px;
			overflow: hidden;
		}
 
		.mini-fill {
			height: 100%;
			width: 68%;
			background: #4A7C78; /* --color-primary */
			border-radius: 99px;
		}
	}
	
	.containerHero{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 3rem;
		.leftContainer{
			width: 30rem;
			h2{
				font-size: 3rem;
				margin: 1rem 0 2rem 0;
			}
			span{
				font-size: 0.8rem;
				background-color: rgba(242,210,140,0.3); /* --color-accent-border */
				padding: .5rem;
				border-radius: 2rem;
				color: #F2D28C;
				outline: solid 1px #F2D28C; /* --color-accent */
			}
			p{
				color: rgba(255,255,255,0.55); /* --text-on-dark-tertiary */
				margin-bottom: 1rem;
			}
			button{
				margin-bottom: 1rem;
			}
			small{
				color: rgba(255,255,255,0.30); /* --text-on-dark-dim */
			}
		}
		.exemple{
			background-color: #2F4640; /* --bg-dark-mid */
			padding: 2rem;
			outline: solid 1px rgba(255, 255, 255, 0.25); /* --border-nav-btn */
			border-radius: .8rem;
			margin-left: 15rem;
		}
	}
	small{
		display: block;
	}


    button {
        padding: 0.5rem 0.5rem;
        border-radius: 8px;
        border: none;
        color: #1E2F2C; /* --bg-dark */
		background-color: #F2D28C; /* --color-accent*/
		font-weight: 600;
    }

	.containerBody{
		padding-top: 5rem;
		width: 100%;
		.textBody{
			text-align: center;
		}
		.needToHave{
			font-size: 1.6rem;
			font-weight: 500;
			color: #1E2F2C; /* --text-on-light-primary*/
		}
		.tools{
			color: #888888; /* --text-on-light-secondary */
		}
		.containerCards{
			display: flex;
			gap: 8rem;
			width: 100%;
			padding: 1rem;
			justify-content: center;
			margin-top: 1.5rem;
		}
		.cards{
			width: 20rem;
			background-color: #ffffff; /* --bg-white */
			padding: 1.6rem;
			border-radius: 1rem;
			outline: solid 1px rgba(0, 0, 0, 0.07);
			p{
				margin: 1rem 0 1rem 0;
			}
		}
	}

	footer{
		width: 100%;
		margin-top: 5rem;
		.firstPartFooter{
			background-color: #1E2F2C;
			padding: 2rem;
			display: flex;
			justify-content: space-around;
			span{
				color: #ffffff;
				font-weight: bold;
				font-size: 1.2rem;
			}
			p{
				color: rgba(255,255,255,0.35); /* --text-on-dark-muted*/
			}
		}
		.secondPartFooter{
			background-color: #152320; /* --bg-dark-deep*/
			display: flex;
			justify-content: space-between;
			padding: 1rem;
			p{
				color: rgba(255,255,255,0.30); /* --text-on-dark-dim*/
			}
			a{
				text-decoration: none;
				color: rgba(255,255,255,0.30);
			}
		}
	}
	button:hover {
		cursor: pointer;
	}

</style>
