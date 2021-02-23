<script>
  import { FlippableCard } from './core';

  export let faceUp;
  export let value;
  export let clickable = false;
  export let width = '180px';
</script>

<FlippableCard flipped={!faceUp} {width} height={`calc(1.66667 * ${width})`}>
  <div
    slot="front"
    class="card front"
    style={clickable ? 'cursor: pointer' : ''}
    on:click
  >
    <span>{typeof value === 'undefined' ? '' : value}</span>
  </div>
  <div
    slot="back"
    class="card back"
    style={clickable ? 'cursor: pointer' : ''}
    on:click
  />
</FlippableCard>

<style>
  .card {
    border-radius: 3px;
    width: 100%;
    height: 100%;
  }
  .card.front {
    border: 1px solid #b9b9b9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 64px;
    font-weight: bold;
    background-color: white;
  }
  .card.back {
    background-color: white;
    border: 1px solid #b9b9b9;
    position: relative;
  }
  .card.back::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border: 1px solid #b9b9b9;
    border-radius: 3px;
  }
</style>
