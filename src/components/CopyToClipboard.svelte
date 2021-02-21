<script>
  import Fa from 'svelte-fa';
  import { faCopy } from '@fortawesome/free-regular-svg-icons';

  export let value;
  export let infoText = 'Copied!';
  export let infoTimeShown = 2500;

  let textarea;
  let showInfo = false;

  function onCopyToClipboard() {
    textarea.select();
    document.execCommand('copy');
    showInfo = true;
    setTimeout(() => {
      showInfo = false;
    }, infoTimeShown);
  }
</script>

<div>
  <span class="info" class:visible={showInfo}>{infoText}</span>
  <textarea rows="1" cols={value.length} {value} bind:this={textarea} />
  <span class="action" on:click={onCopyToClipboard}>
    <Fa icon={faCopy} />
  </span>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  textarea {
    resize: none;
    margin-bottom: 0;
    padding: 1em;
  }
  .action {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .info {
    position: absolute;
    background: black;
    color: white;
    padding: 0.5em 0.9em;
    border-radius: 100vh;
    opacity: 0;
    transform: translateY(0);
    transition: transform 175ms ease-in-out, opacity 175ms ease-in-out;
  }
  .info.visible {
    transform: translateY(-1.5em);
    opacity: 1;
  }
</style>
