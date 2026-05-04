<script>
  import logo from "../assets/Logo.png";
  import { loginUser, registerUser } from "../lib/auth/auth";
  import { saveAuth } from "../lib/auth/store";
  import { replace } from "svelte-spa-router";

  let showSignInPopup = $state(false);

  function openPopup() {
    showSignInPopup = true;
  }

  function closePopup() {
    showSignInPopup = false;
  }

  let email = $state("");
  let first_name = $state("");
  let last_name = $state("");
  let password = $state("");

  const login = async (e) => {
    e.preventDefault();
    const result = await loginUser({ email, password });
    if (!result) return;
    replace("/dashboard");
  };

  const register = async (e) => {
    e.preventDefault();
    const result = await registerUser({
      first_name,
      last_name,
      email,
      password,
    });
    if (!result) return;
    closePopup();
    password = "";
  };
</script>

<!-- ── PAGE ── -->
<div class="login-page">

  {#if !showSignInPopup}

    <!-- ── LOGIN ── -->
    <div class="login-card">
      <div class="login-card__logo-wrap">
        <img src={logo} alt="Logo Lapince" class="login-card__logo" />
        <span class="login-card__app-name">Lapince</span>
      </div>

      <p class="login-card__subtitle">Bienvenue, connectez-vous pour continuer</p>

      <form class="login-form" onsubmit={login}>
        <div class="login-form__field">
          <label class="login-form__label" for="login-email">Email</label>
          <input
            id="login-email"
            class="login-form__input"
            type="email"
            placeholder="vous@exemple.fr"
            bind:value={email}
          />
        </div>

        <div class="login-form__field">
          <label class="login-form__label" for="login-password">Mot de passe</label>
          <input
            id="login-password"
            class="login-form__input"
            type="password"
            placeholder="••••••••"
            bind:value={password}
          />
        </div>

        <button type="submit" class="login-form__submit">Se connecter</button>
      </form>

      <p class="login-card__switch">
        Pas encore de compte ?
        <button class="login-card__switch-link" onclick={openPopup}>S'inscrire</button>
      </p>
    </div>

  {:else}

    <!-- ── REGISTER ── -->
    <div class="login-card">
      <button class="login-card__close-btn" onclick={closePopup} aria-label="Fermer">
        <svg viewBox="0 0 384 512" class="login-card__close-icon">
          <path
            d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div class="login-card__logo-wrap">
        <img src={logo} alt="Logo Lapince" class="login-card__logo" />
        <span class="login-card__app-name">Lapince</span>
      </div>

      <p class="login-card__subtitle">Créez votre compte gratuitement</p>

      <form class="login-form" onsubmit={register}>
        <div class="login-form__row">
          <div class="login-form__field">
            <label class="login-form__label" for="register-lastname">Nom</label>
            <input
              id="register-lastname"
              class="login-form__input"
              type="text"
              placeholder="Dupont"
              bind:value={last_name}
            />
          </div>
          <div class="login-form__field">
            <label class="login-form__label" for="register-firstname">Prénom</label>
            <input
              id="register-firstname"
              class="login-form__input"
              type="text"
              placeholder="Marie"
              bind:value={first_name}
            />
          </div>
        </div>

        <div class="login-form__field">
          <label class="login-form__label" for="register-email">Email</label>
          <input
            id="register-email"
            class="login-form__input"
            type="email"
            placeholder="vous@exemple.fr"
            bind:value={email}
          />
        </div>

        <div class="login-form__field">
          <label class="login-form__label" for="register-password">Mot de passe</label>
          <input
            id="register-password"
            class="login-form__input"
            type="password"
            placeholder="••••••••"
            bind:value={password}
          />
        </div>

        <button type="submit" class="login-form__submit">Créer mon compte</button>
      </form>

      <p class="login-card__switch">
        Déjà un compte ?
        <button class="login-card__switch-link" onclick={closePopup}>Se connecter</button>
      </p>
    </div>

  {/if}

</div>

<style>
  /* ─────────────────────────────────────────
     PAGE WRAPPER
     ───────────────────────────────────────── */

  .login-page {
    min-height: 100dvh;
    background: var(--bg-dark);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 1rem;
    font-family: var(--font-body);
  }

  /* ─────────────────────────────────────────
     CARD CENTRALE
     ───────────────────────────────────────── */

  .login-card {
    position: relative;
    width: 100%;
    max-width: 26rem;
    background: var(--bg-dark-mid);
    border-radius: 1.25rem;
    border: 0.03rem solid var(--border-card-dark);
    padding: 2.25rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.35);
  }

  /* ─────────────────────────────────────────
     LOGO & NOM DE L'APP
     ───────────────────────────────────────── */

  .login-card__logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  .login-card__logo {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.88rem;
  }

  .login-card__app-name {
    font-family: var(--font-display);
    font-size: 1.38rem;
    font-weight: 500;
    color: var(--color-accent);
    letter-spacing: -0.01em;
  }

  /* ─────────────────────────────────────────
     SOUS-TITRE
     ───────────────────────────────────────── */

  .login-card__subtitle {
    font-size: 0.8rem;
    color: var(--text-on-dark-tertiary);
    text-align: center;
    line-height: 1.5;
  }

  /* ─────────────────────────────────────────
     BOUTON FERMER (inscription)
     ───────────────────────────────────────── */

  .login-card__close-btn {
    position: absolute;
    top: 0.88rem;
    right: 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-on-dark-tertiary);
    padding: 0.25rem;
    border-radius: 0.38rem;
    transition: color 0.2s;
  }

  .login-card__close-btn:hover {
    color: var(--text-on-dark-primary);
  }

  .login-card__close-icon {
    width: 0.88rem;
    height: 0.88rem;
    display: block;
  }

  /* ─────────────────────────────────────────
     FORMULAIRE
     ───────────────────────────────────────── */

  .login-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Ligne à deux colonnes (nom / prénom) */
  .login-form__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .login-form__field {
    display: flex;
    flex-direction: column;
    gap: 0.38rem;
  }

  .login-form__label {
    font-size: 0.75rem;
    color: var(--text-on-dark-tertiary);
    font-family: var(--font-title);
    letter-spacing: 0.02em;
  }

  .login-form__input {
    background: var(--bg-dark);
    border: 0.03rem solid var(--border-separator);
    border-radius: 0.6rem;
    padding: 0.6rem 0.86rem;
    font-size: 0.875rem;
    color: var(--text-on-dark-secondary);
    font-family: var(--font-body);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }

  .login-form__input::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }

  .login-form__input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 0.1875rem rgba(74, 124, 120, 0.2);
  }

  /* Bouton soumettre */
  .login-form__submit {
    margin-top: 0.25rem;
    width: 100%;
    background: var(--color-accent);
    color: var(--bg-dark);
    border: none;
    border-radius: 0.6rem;
    padding: 0.75rem;
    font-size: 0.8rem;
    font-weight: 500;
    font-family: var(--font-title);
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .login-form__submit:hover {
    opacity: 0.88;
  }

  .login-form__submit:active {
    opacity: 1;
  }

  /* ─────────────────────────────────────────
     LIEN BASCULE LOGIN ↔ REGISTER
     ───────────────────────────────────────── */

  .login-card__switch {
    font-size: 0.8rem;
    color: var(--text-on-dark-muted);
    text-align: center;
    font-family: var(--font-body);
  }

  .login-card__switch-link {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-accent);
    font-size: 0.8rem;
    font-family: var(--font-body);
    text-decoration: underline;
    padding: 0;
    transition: opacity 0.2s;
  }

  .login-card__switch-link:hover {
    opacity: 0.75;
  }

  /* ─────────────────────────────────────────
     RESPONSIVE MOBILE
     ───────────────────────────────────────── */

  @media (max-width: 480px) {
    .login-card {
      padding: 1.75rem 1.25rem 1.5rem;
      border-radius: 1rem;
    }

    .login-form__row {
      grid-template-columns: 1fr;
    }
  }
</style>