<script>
  import App from '../App.svelte';
  import Avatar from './Avatar.svelte';

  export let value;
  export let label;
</script>

<span role="img" aria-label={label} {...$$restProps}>{value}</span>
