<script>
  export let fluid = false;
</script>

<form on:submit|preventDefault class:fluid>
  <slot />
  <slot name="footer" />
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  form:not(.fluid) {
    width: var(--form-control-width);
  }
  form > :global(*),
  form :global([slot='footer']) > :global(*) {
    width: 100%;
  }
  form :global([slot='footer']) {
    display: flex;
    justify-content: center;
    margin-top: 1em;
  }
</style>
