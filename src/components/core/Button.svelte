<script>
  import Fa from 'svelte-fa';
  import Emoji from './Emoji.svelte';

  export let theme = 'primary';
  export let icon = null;

  $: isFaIcon = !!icon?.prefix?.match(/fa./);
  function isEmojiChar(c) {
    return typeof c === 'string' && c.length === 2;
  }
  $: isEmoji = !!icon?.emoji || isEmojiChar(icon);
  $: emoji = icon?.emoji ? icon.emoji : isEmojiChar(icon) ? icon : null;
  $: emojiLabel = icon?.emoji ? icon.label : null;
</script>

<button class={theme} on:click {...$$restProps}>
  {#if isFaIcon}
    <Fa {icon} />
  {:else if isEmoji}
    <Emoji value={emoji} label={emojiLabel} />
  {/if}
  <span>
    <slot />
  </span>
</button>

<style>
  button {
    color: #fff;
    background-color: var(--primary-color);
    border: none;
    border-radius: 9px;
    padding: calc(1em + var(--border-width)) 2em;
    outline: none;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  button.primary {
    background-color: var(--primary-color);
  }
  button.secondary {
    background-color: var(--secondary-color);
  }

  button.danger {
    background-color: var(--dark-red);
  }

  button > :global(:not(:last-child)) {
    margin-right: 0.4em;
  }

  button:disabled {
    color: #fff;
    cursor: not-allowed;
    opacity: 0.8;
  }

  button:not(:disabled):active,
  button:focus {
    opacity: 0.9;
  }

  /* button:focus {
    outline: black;
    outline-offset: 1px;
    outline-style: solid;
    outline-width: 1px;
  } */
</style>
