<script>
  export let name = '';
  export let value = '';
  export let label;
</script>

<div>
  <input {name} bind:value class:empty={!value} {...$$restProps} />
  <label for={name}>{label}</label>
</div>

<style>
  div {
    position: relative;
    --input-padding: 1em;
    width: var(--form-control-width);
  }
  input {
    display: block;
    border-width: var(--border-width);
    border-radius: var(--border-radius);
    padding: var(--input-padding);
    outline: none;
    border-color: var(--gray);
    width: 100%;
  }
  input:not(.empty) {
    border-color: var(--primary-color);
  }

  label {
    position: absolute;
    display: inline-block;
    left: calc(var(--input-padding) + var(--border-width));
    top: calc(var(--input-padding) + var(--border-width));
    pointer-events: none;
    z-index: 1;
    color: var(--gray);
    opacity: 0.5;
    transition: all 175ms ease-in-out;
  }

  input:active,
  input:focus {
    border-color: var(--primary-color);
  }

  input:focus ~ label,
  input:not(.empty) ~ label {
    top: -0.5em;
    left: var(--border-radius);
    font-size: 0.9em;
    padding: 1px 0.5em;
    opacity: 1;
  }

  input:not(.empty) ~ label {
    background-color: white;
    color: var(--primary-color);
  }
  input:focus ~ label {
    background-color: var(--primary-color);
    color: white;
  }

  /* input:disabled {
    color: #ccc;
  } */
</style>
