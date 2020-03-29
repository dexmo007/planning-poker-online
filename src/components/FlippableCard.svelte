<script>
  export let width = "100%";
  export let height = "100%";
  export let flipped = false;
</script>

<style>
  .scene {
    perspective: 600px;
  }

  .card {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform-origin: center right;
    transition: transform 1s;
  }

  .card.flipped {
    transform: translateX(-100%) rotateY(-180deg);
  }

  .card__face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }

  .card__face--back {
    transform: rotateY(180deg);
  }
</style>

<div class="scene" style={`height: ${height}; width: ${width};`}>
  <div class="card" class:flipped>
    <div class="card__face card__face--front">
      <slot name="front" />
    </div>
    <div class="card__face card__face--back">
      <slot name="back" />
    </div>
  </div>
</div>
