<script>
  import { Router, Link, Route } from "svelte-routing";
  import { FirebaseApp } from "sveltefire";
  import Home from "./views/Home.svelte";
  import Session from "./views/Session.svelte";
  import JoinSession from "./views/JoinSession.svelte";
  import SessionNotFound from "./views/SessionNotFound.svelte";
  import firebase from "firebase/app";

  export let url = "";
</script>

<style>
  header {
    text-align: center;
  }
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    flex: 1;
  }
  footer {
    text-align: center;
  }
</style>

<Router {url}>
  <FirebaseApp {firebase}>
    <header>
      <h1>Planning Poker</h1>
    </header>

    <main>
      <Route path="/join/:sessionId" component={JoinSession} />
      <Route path="/session/:sessionId" component={Session} />
      <Route path="/session/:sessionId/not-found" component={SessionNotFound} />
      <Route path="/">
        <Home />
      </Route>
    </main>
    <footer>
      Made with ❤️ by
      <a href="https://github.com/dexmo007">dexmo</a>
    </footer>
  </FirebaseApp>
</Router>
