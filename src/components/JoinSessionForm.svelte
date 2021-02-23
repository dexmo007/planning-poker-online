<script>
  import { navigate } from 'svelte-routing';
  import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
  import { Button, TextInput, Form } from './core';

  let sessionId;

  async function joinSession() {
    if (!sessionId) {
      return;
    }
    navigate(`/join/${sessionId}`);
  }
</script>

<div>
  <Form on:submit={joinSession}>
    <h3>Join an existing session</h3>
    <TextInput label="Session id" bind:value={sessionId} name="sessionId" />
    <footer slot="footer">
      <Button icon={faSignInAlt} type="submit" disabled={!sessionId}
        >Join</Button
      >
    </footer>
  </Form>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
