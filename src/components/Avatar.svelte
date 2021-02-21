<script>
  export let name;
  export let avatarStyle = 'bottts';
</script>

<img
  class="avatar"
  src={`https://avatars.dicebear.com/api/${avatarStyle}/${name}.svg`}
  alt={name}
/>

<style>
  img {
    height: 4em;
  }
</style>
