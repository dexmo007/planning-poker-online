<span class="hr">OR</span>

<style>
  .hr {
    display: block;
    width: 100%;
    position: relative;
    padding: 1em;
  }
  .hr::before,
  .hr::after {
    content: '';
    position: absolute;
    border-top: 1px solid black;
    top: 50%;
  }
  .hr::before {
    left: 0;
    right: calc(50% + 2ch);
  }
  .hr::after {
    right: 0;
    left: calc(50% + 2ch);
  }
</style>
