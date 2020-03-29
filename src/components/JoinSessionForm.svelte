<script>
  import firebase from "firebase/app";
  import { navigate } from "svelte-routing";

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
  <button type="submit" disabled={!sessionId}>Join</button>
</form>
