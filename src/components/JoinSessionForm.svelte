<script>
  import { navigate } from 'svelte-routing';
  import Button from './Button.svelte';
  import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

  let sessionId;

  async function joinSession() {
    if (!sessionId) {
      return;
    }
    navigate(`/join/${sessionId}`);
  }
</script>

<h3>Join an existing session</h3>
<form class="join" on:submit|preventDefault={joinSession}>
  <label>
    Enter the session id
    <input bind:value={sessionId} />
  </label>
  <footer>
    <Button icon={faSignInAlt} type="submit" disabled={!sessionId}>Join</Button>
  </footer>
</form>

<style>
  footer {
    display: flex;
    justify-content: center;
  }
</style>
