<script>
  import { getContext } from 'svelte';
  import firebase from 'firebase/app';
  import { navigate } from 'svelte-routing';
  import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
  import { Button, TextInput, Form } from '../components/core';

  export let sessionId;
  let username;
  let error;
  const { user } = getContext('user');
  async function joinSession() {
    if (!sessionId || !username) {
      return;
    }
    error = null;

    const ref = firebase.firestore().collection('sessions').doc(sessionId);
    const snap = await ref.get();

    if (snap.exists) {
      await ref.collection('users').doc(user.uid).set({
        name: username,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      navigate(`/session/${sessionId}`);
    } else {
      error = "We didn't find this session.";
    }
  }
</script>

<Form on:submit={joinSession}>
  <h3>Join an existing session</h3>
  <TextInput label="Your name" bind:value={username} />

  <footer slot="footer">
    <Button icon={faSignInAlt} type="submit" disabled={!username}>Join</Button>
    {#if error}{error}{/if}
  </footer>
</Form>
