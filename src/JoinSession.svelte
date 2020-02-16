<script>
  import firebase from "firebase/app";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let sessionId;
  let username;
  let error;
  async function joinSession() {
    if (!sessionId || !username) {
      return;
    }
    error = null;
    const { user } = await firebase.auth().signInAnonymously();
    const ref = firebase
      .firestore()
      .collection("sessions")
      .doc(sessionId);
    const snap = await ref.get();
    if (snap.exists) {
      await ref
        .collection("users")
        .doc(user.uid)
        .set({
          name: username,
          joinedAt: Date.now()
        });
      dispatch("session", {
        id: sessionId,
        ...snap.data()
      });
    } else {
      error = "We didn't find this session.";
    }
  }
</script>

<h3>Join an existing session</h3>
<form class="join" on:submit|preventDefault={joinSession}>
  <label>
    Enter the session id
    <input bind:value={sessionId} />
  </label>
  <label>
    Your name
    <input bind:value={username} />
  </label>
  <input type="submit" value="Join" disabled={!sessionId || !username} />
  {#if error}{error}{/if}
</form>
