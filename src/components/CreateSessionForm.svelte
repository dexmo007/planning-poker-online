<script>
  import { getContext } from 'svelte';
  import decks from '../data/decks.js';
  import firebase from 'firebase/app';
  import { navigate } from 'svelte-routing';
  import DeckSelector from './DeckSelector.svelte';
  import { Button, TextInput, Form } from './core';
  import faker from 'faker/locale/en';
  import { capitalize } from '../utils/string';
  import { faLightbulb } from '@fortawesome/free-regular-svg-icons';

  let sessionName;

  let deck = decks.find(({ recommended }) => recommended);
  const ctx = getContext('user');
  $: user = ctx.user;
  let username = ctx.username;
  function generateSessionName() {
    return capitalize(faker.company.bs());
  }
  async function createSession() {
    if (!username) {
      return;
    }
    localStorage.setItem('username', username);
    ctx.username = username;
    const session = {
      owner: user.uid,
      deck: deck.name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      name: sessionName || generateSessionName(),
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
  <div class="flex-row">
    <div class="flex-pane" />
    <TextInput
      name="sessionName"
      bind:value={sessionName}
      label="Session Name"
    />
    <div class="flex-pane">
      <Button
        type="button"
        theme="secondary"
        icon={faLightbulb}
        on:click={() => (sessionName = generateSessionName())}
        >Suggest me one!</Button
      >
    </div>
  </div>
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
  .flex-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .flex-row > :global(:not(:last-child)) {
    margin-right: 1em;
  }
  .flex-pane {
    flex: 1;
  }
  footer.non-fluid {
    width: var(--form-control-width);
  }
</style>
