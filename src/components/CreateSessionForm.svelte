<script>
  import { getContext } from 'svelte';
  import decks from '../data/decks.js';
  import firebase from 'firebase/app';
  import { navigate } from 'svelte-routing';
  import DeckSelector from './DeckSelector.svelte';
  import { Button, TextInput, Form } from './core';

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

<Form on:submit={createSession} fluid>
  <h3>Create a session</h3>
  <TextInput name="username" bind:value={username} label="Your name" />

  <div class="deck-select">
    <h5>Select a deck</h5>
    <DeckSelector bind:value={deck} />
  </div>
  <footer class="non-fluid" slot="footer">
    <Button class="submit-btn" icon="🚀" type="submit" disabled={!username}
      >Create</Button
    >
  </footer>
</Form>

<style>
  .deck-select {
    margin-bottom: 1em;
  }
  footer.non-fluid {
    width: var(--form-control-width);
  }
</style>
