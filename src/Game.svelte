<script>
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import ScrumfaceCard from "./components/ScrumfaceCard.svelte";
  let selected = null;
  export let deck;
  let values = deck.values;

  function myfly(node, { delay = 0, duration = 300 }) {
    console.log(
      node.getBoundingClientRect().top,
      selected.node.getBoundingClientRect().top
    );
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;
    const y =
      -node.getBoundingClientRect().top +
      selected.node.getBoundingClientRect().top;
    const x =
      -node.getBoundingClientRect().left +
      selected.node.getBoundingClientRect().left;
    return {
      delay,
      duration,
      easing: cubicOut,
      css: (t, u) => `
      transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) *
        y}px) scale(${t});`
    };
  }
</script>

<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    grid-row-gap: 10px;
    filter: blur(0);
    transition: filter 175ms ease-in-out;
    position: relative;
  }
  .cards.blurred {
    filter: blur(10px);
  }
  .selected {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(2);
  }
</style>

<div>
  <div class="cards" class:blurred={selected !== null}>
    {#each values as value, i}
      <ScrumfaceCard
        faceUp={true}
        {value}
        clickable
        on:click={e => {
          selected = { value, node: e.target };
        }} />
    {/each}
  </div>
  {#if selected !== null}
    <div class="selected" transition:myfly>
      <ScrumfaceCard
        faceUp={selected.faceUp}
        value={selected.value}
        clickable
        on:click={() => {
          if (selected.faceUp) {
            selected = null;
          } else {
            selected.faceUp = true;
          }
        }} />
    </div>
  {/if}
</div>
