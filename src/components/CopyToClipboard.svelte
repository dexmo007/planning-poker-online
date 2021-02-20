<script>
  export let value;
  export let label;

  let textarea;

  function onCopyToClipboard() {
    textarea.select();
    document.execCommand('copy');
  }
</script>

<div>
  <textarea rows="1" cols={value.length} {value} bind:this={textarea} />
  <button on:click={onCopyToClipboard}>{label || 'Copy To Clipboard'}</button>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  textarea {
    resize: none;
  }
</style>
