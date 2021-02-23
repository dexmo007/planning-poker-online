<script>
  export let value;
  export let label;
</script>

<span role="img" aria-label={label} {...$$restProps}>{value}</span>

<style>
  span {
    line-height: 1em;
  }
</style>
