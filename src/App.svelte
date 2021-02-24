<script>
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { Router, Route } from 'svelte-routing';
  import { FirebaseApp } from 'sveltefire';
  import Home from './views/Home.svelte';
  import Session from './views/Session.svelte';
  import JoinSession from './views/JoinSession.svelte';
  import SessionNotFound from './views/SessionNotFound.svelte';
  import { Emoji } from './components/core';

  import firebase from 'firebase/app';

  export let url = '';
  let user = writable(null);
  let ctx = {
    username: localStorage.getItem('username'),
  };
  setContext('user', ctx);

  function setUser(u) {
    ctx.user = u;
    user.set(u);
  }

  if (window.matchMedia) {
    function setThemedFavicon(dark) {
      const faviconSuffix = dark ? '-dark' : '';
      const href = `/ace-of-spades${faviconSuffix}`;
      document
        .querySelector('link[rel=icon]')
        .setAttribute('href', href + '.svg');
      document
        .querySelector('link[rel="alternate icon"]')
        .setAttribute('href', href + '.png');
    }
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    setThemedFavicon(m.matches);
    m.addEventListener('change', (e) => {
      setThemedFavicon(e.matches);
    });
  }

  onMount(() => {
    firebase.auth().onAuthStateChanged((u) => {
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

<Router {url}>
  <FirebaseApp {firebase}>
    {#if $user}
      <header>
        <img class="logo" src="/poker-chip-filled.svg" alt="Planning Poker" />
        <h1>Planning Poker</h1>
      </header>

      <main>
        <Route path="/join/:sessionId" component={JoinSession} />
        <Route path="/session/:sessionId" component={Session} />
        <Route
          path="/session/:sessionId/not-found"
          component={SessionNotFound}
        />
        <Route path="/">
          <Home />
        </Route>
      </main>
      <footer>
        <div>
          Made with
          <Emoji value="❤️" label="heart" />
          by
          <a href="https://github.com/dexmo007">dexmo</a>
        </div>
        <div>
          Icons made by <a
            href="https://www.flaticon.com/authors/prettycons"
            title="prettycons">prettycons</a
          >
          & <a href="https://www.freepik.com" title="Freepik">Freepik</a>
          from
          <a href="https://www.flaticon.com/" title="Flaticon"
            >www.flaticon.com</a
          >
        </div>
      </footer>
    {/if}
  </FirebaseApp>
</Router>

<style>
  header {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  header h1 {
    margin: 0.5em 0;
  }
  .logo {
    height: 3em;
    margin-right: 0.5em;
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
    font-size: 1.1em;
  }
</style>
