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

<div class="login-page">
  <div class="overlay"></div>
  {#if !showSignInPopup}
    <section class="login-container">
      <img src={logo} alt="logo" class="logo" />
      <div class="login-signin-container">
        <form action="" class="login-form" onsubmit={login}>
          <div class="logs-container">
            <label for="">Email</label>
            <input type="email" bind:value={email} />
          </div>
          <div class="logs-container">
            <label for="">Password</label>
            <input type="password" bind:value={password} />
          </div>
          <button type="submit" class="connect-button">Se connecter</button>
        </form>

        <div class="sign-in-container">
          <p>Pas encore de compte ?</p>
          <button class="sign-in-button" onclick={openPopup}>S'inscrire</button>
        </div>
      </div>
    </section>
  {:else}
    <section class="login-container">
      <img src={logo} alt="logo" class="logo" />
      <button onclick={closePopup} class="close-button" title="Fermer"
        ><svg viewBox="0 0 384 512"
          ><path
            d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
            fill="currentColor"
          /></svg
        ></button
      >
      <form action="" class="login-form" onsubmit={register}>
        <div class="logs-container">
          <label for="">Nom</label>
          <input type="text" bind:value={last_name} />
        </div>
        <div class="logs-container">
          <label for="">Prénom</label>
          <input type="text" bind:value={first_name} />
        </div>
        <div class="logs-container">
          <label for="">Email</label>
          <input type="email" bind:value={email} />
        </div>
        <div class="logs-container">
          <label for="">Password</label>
          <input type="password" bind:value={password} />
        </div>
        <button type="submit" class="connect-button"> S'inscrire</button>
      </form>
    </section>
  {/if}
</div>

<style>

  .login-page {
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../assets/login-background.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .logo {
    margin: auto;
    width: 5rem;
    height: 5rem;
  }

  input,
  button {
    border: none;
  }

  input:focus {
    outline: 2px solid var(--accent-color);
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    z-index: 1;
  }

  .login-container {
    width: 80%;
    position: relative;
    background-color: var(--primary-color);
    border-radius: 30px;
    border: solid 1px var(--dark-color);
    padding: 1rem 1rem 1rem 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--background);
    box-shadow: 0px 2px 10px var(--foreground);
    font-size: 1.5rem;
    z-index: 2;
  }

  /*---LOGIN FORM SECTION---*/

  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    .logs-container {
      display: flex;
      flex-direction: column;
      text-align: center;
      color: var(--background);
      font-family: var(--title-font);
      gap: 0.5rem;

      input {
        border-radius: 10px;
      }
    }
  }

  .connect-button {
    width: max-content;
    padding: 0 1rem;
    border-radius: 10px;
    background-color: var(--secondary-color);
    color: var(--background);
    border: solid 1px var(--light-color);
  }

  .connect-button:hover {
    cursor: pointer;
    border: solid 1px var(--accent-color);
    color: var(--foreground);
    background-color: var(--light-color);
  }

  .connect-button:active {
    opacity: 1;
    color: var(--background);
    background-color: var(--main-color);
  }

  /*---SIGN IN SECTION---*/

  .sign-in-container {
    margin: 1rem 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
    font-family: var(--title-font);
  }

  .sign-in-button {
    background-color: transparent;
    color: var(--background-color);
    border: none;
    text-decoration: underline;
    font-family: var(--additionnal-font);
    text-shadow: 0px 1px 2px black;
  }

  .sign-in-button:hover {
    cursor: pointer;
    color: var(--accent-color);
    text-decoration: none;
  }

  .sign-in-button:active {
    color: var(--accent-color);
  }

  /*---SIGN IN POPUP SECTION---*/

  .close-button {
    background-color: transparent;
    color: var(--background);
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    position: absolute;
    right: 1rem;
    top: 0.5rem;
  }

  .close-button:hover {
    cursor: pointer;
    opacity: 0.5;
  }

  /*---RESPONSIVE---*/

  @media (min-width: 768px) {
    .login-container {
      padding: 1rem 4rem 3rem 4rem;
      min-width: 550px;
      max-width: 650px;
    }

    .logo {
      margin: auto;
      width: 6rem;
      height: 6rem;
    }

    .login-signin-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4rem;
    }
  }
</style>
