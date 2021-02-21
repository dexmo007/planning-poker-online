<script>
  import decks from '../data/decks';

  export let value = null;
</script>

<div role="group">
  {#each decks as deck}
    <label class:checked={value === deck}>
      <input type="radio" name="deck" value={deck} bind:group={value} />
      <span class="check" />
      <span class="name">{deck.name}</span>
      <span class="description">{deck.description}</span>
      {#if deck.recommended}
        <span class="recommended">(Recommended)</span>
      {/if}
    </label>
  {/each}
</div>

<style>
  div[role='group'] {
    display: flex;
    flex-flow: row wrap;
    align-items: stretch;
  }
  div[role='group'] > * {
    flex: 1;
    flex-basis: 0;
    border: var(--border-width) solid var(--gray);
    border-radius: 10px;
    cursor: pointer;
  }
  div[role='group'] > :not(:last-child) {
    margin-right: 1em;
  }
  label {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    padding: 1em;
  }
  label.checked {
    border-color: var(--primary-color);
    /*box-shadow: 0 0 5px var(--primary-color);*/
  }
  input {
    display: none;
    /* width: 100%; */
  }
  input ~ .check {
    width: 1.3em;
    height: 1.3em;
    display: block;
    position: relative;
    background-color: #d3d3d3;
    border-radius: 50%;
  }
  input:checked ~ .check::before {
    content: '\2713';
    color: white;
    font-size: 1em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  input:checked ~ .check {
    background-color: var(--primary-color);
  }
  .name {
    font-weight: bold;
    font-size: 1.2em;
    margin: 0.5em 0;
  }
  .description {
    padding: 1em;
  }
  .recommended {
    font-style: italic;
  }
</style>
