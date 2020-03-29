<script>
  import { getContext } from "svelte";
  import firebase from "firebase/app";
  import { navigate } from "svelte-routing";

  export let sessionId;
  let username;
  let error;
  async function joinSession() {
    if (!sessionId || !username) {
      return;
    }
    error = null;
    const { user } = getContext("user");
    const ref = firebase
      .firestore()
      .collection("sessions")
      .doc(sessionId);
    const snap = await ref.get();
    console.log("get wroke", snap.data());

    if (snap.exists) {
      await ref
        .collection("users")
        .doc(user.uid)
        .set({
          name: username,
          joinedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      navigate(`/session/${sessionId}`);
    } else {
      error = "We didn't find this session.";
    }
  }
</script>

<h3>Join an existing session</h3>
<form class="join" on:submit|preventDefault={joinSession}>
  <label>
    Your name
    <input bind:value={username} />
  </label>
  <input type="submit" value="Join" disabled={!username} />
  {#if error}{error}{/if}
</form>
