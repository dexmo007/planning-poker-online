<script>
  import decks from "./decks.js";
  import firebase from "firebase/app";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let username;
  let deck;
  async function createSession() {
    if (!username) {
      return;
    }
    const { user } = await firebase.auth().signInAnonymously();
    const session = {
      owner: user.uid,
      deck
    };
    const ref = await firebase
      .firestore()
      .collection("sessions")
      .add(session);
    await ref
      .collection("users")
      .doc(user.uid)
      .set({
        name: username,
        joinedAt: Date.now()
      });
    console.log("Session", ref.id, "created");
    dispatch("session", {
      id: ref.id,
      ...session
    });
  }
</script>

<h3>Create a session</h3>
<form on:submit|preventDefault={createSession}>
  <label>
    Your name
    <input bind:value={username} />
  </label>
  <label>
    Select a deck
    <select bind:value={deck}>
      {#each decks as deck}
        <option value={deck.name}>{deck.name}</option>
      {/each}
    </select>
  </label>
  <input type="submit" value="Create" disabled={!username} />
</form>
