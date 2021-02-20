<script>
  import { getContext } from 'svelte';
  import decks from '../data/decks.js';
  import firebase from 'firebase/app';
  import { navigate } from 'svelte-routing';
  import DeckSelector from './DeckSelector.svelte';

  let username;
  let deck = decks.find(({ recommended }) => recommended);
  const { user } = getContext('user');
  async function createSession() {
    if (!username) {
      return;
    }
    const session = {
      owner: user.uid,
      deck: deck.name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      state: 'CREATED',
    };

    const ref = await firebase.firestore().collection('sessions').add(session);
    await ref.collection('users').doc(user.uid).set({
      name: username,
      joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
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
  <div class="deck-select">
    <h5>Select a deck</h5>
    <DeckSelector bind:value={deck} />
  </div>
  <input type="submit" value="Create" disabled={!username} />
</form>

<style>
  .deck-select {
    margin-bottom: 1em;
  }
</style>
