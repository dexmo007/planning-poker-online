<script>
  export let fluid = false;
  export let margin = '1em';
</script>

<form
  on:submit|preventDefault
  class:fluid
  style={`--form-child-margin: ${margin}`}
>
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
  form > :global(:not(:last-child)) {
    margin-bottom: var(--form-child-margin);
  }
  form > :global(*),
  form :global([slot='footer']) > :global(*) {
    width: 100%;
  }
  form :global([slot='footer']) {
    display: flex;
    justify-content: center;
  }
</style>
