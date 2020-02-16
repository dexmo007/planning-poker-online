<script>
  import App from "./App.svelte";
</script>

<style>
  :global(body) {
    display: flex;
    flex-direction: column;
  }
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

<header>
  <h1>Planning Poker</h1>
</header>

<main>
  <App />
</main>
<footer>
  Made with ❤️ by
  <a href="https://github.com/dexmo007">dexmo</a>
</footer>
