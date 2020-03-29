<script>
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { Router, Link, Route } from "svelte-routing";
  import { FirebaseApp, User } from "sveltefire";
  import Home from "./views/Home.svelte";
  import Session from "./views/Session.svelte";
  import JoinSession from "./views/JoinSession.svelte";
  import SessionNotFound from "./views/SessionNotFound.svelte";
  import firebase from "firebase/app";

  export let url = "";
  let user = writable(null);
  let ctx = {};
  setContext("user", ctx);

  function setUser(u) {
    ctx.user = u;
    user.set(u);
  }

  onMount(() => {
    firebase.auth().onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .then(({ user: u }) => {
            setUser(u);
          });
      }
    });
  });
</script>

<style>
  header {
    text-align: center;
    display: flex;
    justify-content: center;
    position: relative;
  }
  header h1 {
    margin: 0.5em 0;
  }
  header button {
    position: absolute;
    right: 1em;
    top: 50%;
    transform: translateY(-50%);
  }
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    flex: 1;
  }
  footer {
    text-align: center;
    margin-bottom: 0.1em;
  }
</style>

<Router {url}>
  <FirebaseApp {firebase}>
    {#if $user}
      <header>
        <h1>Planning Poker</h1>
        {#if $user.isAnonymous}
          <button disabled>Sign in</button>
        {:else}
          <button>{$user.displayName}</button>
        {/if}
      </header>

      <main>
        <Route path="/join/:sessionId" component={JoinSession} />
        <Route path="/session/:sessionId" component={Session} />
        <Route
          path="/session/:sessionId/not-found"
          component={SessionNotFound} />
        <Route path="/">
          <Home />
        </Route>
      </main>
      <footer>
        Made with ❤️ by
        <a href="https://github.com/dexmo007">dexmo</a>
      </footer>
    {/if}
  </FirebaseApp>
</Router>
