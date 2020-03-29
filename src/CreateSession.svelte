<script>
  import decks from "./decks.js";
  import firebase from "firebase/app";
  import { navigate } from "svelte-routing";

  let username;
  let deck;
  async function createSession() {
    if (!username) {
      return;
    }
    const { user } = await firebase.auth().signInAnonymously();
    const session = {
      owner: user.uid,
      deck,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      state: "CREATED"
    };

    const ref = await firebase
      .firestore()
      .collection("sessions")
      .add(session);
    console.log("created");

    await ref
      .collection("users")
      .doc(user.uid)
      .set({
        name: username,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    navigate(`/session/${ref.id}`);
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
