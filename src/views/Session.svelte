<script>
  import firebase from 'firebase/app';
  import { FirebaseApp, User, Doc, Collection } from 'sveltefire';
  import Button from '../components/Button.svelte';
  import ScrumfaceCard from '../components/ScrumfaceCard.svelte';
  import CopyToClipboard from '../components/CopyToClipboard.svelte';
  import Avatar from '../components/Avatar.svelte';
  import decks from '../data/decks.js';
  import { collectionStore, docStore } from 'sveltefire';
  import { navigate, Link } from 'svelte-routing';
  import {
    faPlay,
    faPowerOff,
    faCheck,
    faArrowRight,
  } from '@fortawesome/free-solid-svg-icons';

  export let sessionId;
  export let location;

  let session;
  const sessionStore = docStore(`sessions/${sessionId}`);
  sessionStore.subscribe((v) => {
    if (sessionStore.error || v === null) {
      navigate(`/session/${sessionId}/not-found`);
      return;
    }
    session = v;
  });

  let players;
  const playersStore = collectionStore(`sessions/${sessionId}/users`, (ref) =>
    ref.orderBy('joinedAt')
  );
  playersStore.subscribe((v) => (players = v));

  $: deck = session && decks.find(({ name }) => name === session.deck);
  $: isReveal =
    session &&
    players &&
    session.state === 'STARTED' &&
    players.every((player) => player.choice);

  async function setSessionState(sessionState) {
    await firebase.firestore().collection('sessions').doc(sessionId).set(
      {
        state: sessionState,
      },
      { merge: true }
    );
  }

  let choice;
  async function confirmChosenCard(userId) {
    await firebase.firestore().doc(`sessions/${sessionId}/users/${userId}`).set(
      {
        choice,
      },
      { merge: true }
    );
    choice = null;
  }
  async function nextRound() {
    choice = null;
    const db = firebase.firestore();
    const batch = db.batch();
    batch.update(db.collection('sessions').doc(sessionId), {
      state: 'STARTED',
    });
    for (const player of players) {
      batch.update(player.ref, { choice: null });
    }
    await batch.commit();
  }

  async function terminateSession() {
    const db = firebase.firestore();
    await db
      .collection('sessions')
      .doc(sessionId)
      .update({ state: 'TERMINATED' });
    navigate('/');
  }
</script>

<User let:user>
  {#if session}
    <h3>
      Welcome in {sessionId}
      {#if session.owner === user.uid}(Owner){/if}
    </h3>
    {#if session.state !== 'STARTED'}
      <div class="invite-container">
        <span>Copy the link to invite others</span>
        <CopyToClipboard
          infoText="Link copied!"
          value={`${location.origin}/join/${sessionId}`}
        />
      </div>
    {/if}
    {#if session.owner === user.uid}
      <div class="controls">
        {#if session.state !== 'STARTED'}
          <Button icon={faPlay} on:click={() => setSessionState('STARTED')}
            >Start session</Button
          >
        {/if}
        {#if session.state !== 'TERMINATED'}
          <Button
            theme="danger"
            icon={faPowerOff}
            on:click={() => terminateSession()}>Terminate session</Button
          >
        {/if}
      </div>
    {/if}
    {#if session.state === 'TERMINATED'}
      This session has been terminated.
      <Link to="/">back to home</Link>
    {/if}
    {#if session.state === 'STARTED'}
      {#if players}
        <div class="board">
          {#each players as player}
            <div class="player-area">
              <div class="player">
                <Avatar name={player.name} />
                <span> {player.ref.id === user.uid ? 'You' : player.name}</span>
              </div>
              {#if player.choice || (player.ref.id === user.uid && choice)}
                <div class="card-choice">
                  <ScrumfaceCard
                    faceUp={isReveal || !player.choice}
                    value={player.choice ? player.choice.value : choice.value}
                  />
                  {#if !player.choice}
                    <Button
                      icon={faCheck}
                      on:click={() => confirmChosenCard(user.uid)}
                    >
                      Confirm
                    </Button>
                  {/if}
                </div>
              {:else}
                <div class="card-skeleton">
                  <span>Choosing...</span>
                </div>
              {/if}
            </div>
          {/each}
        </div>
        {#if isReveal && session.owner === user.uid}
          <div class="board-footer">
            <Button icon={faArrowRight} on:click={nextRound}>Next round</Button>
          </div>
        {/if}
      {:else}
        <span>Loading users...</span>
      {/if}
      <div class="deck-container">
        {#if !players || !players.find((p) => p.ref.id === user.uid).choice}
          <span>Choose a card</span>
          <div class="deck">
            {#each deck.values as value}
              <ScrumfaceCard
                faceUp
                {value}
                width="90px"
                clickable
                on:click={() => (choice = { value })}
              />
            {/each}
          </div>
        {:else if !isReveal}
          <span>Waiting for other players</span>
        {/if}
      </div>
    {:else}
      <Collection
        path={`sessions/${sessionId}/users`}
        query={(ref) => ref.orderBy('joinedAt')}
        let:data={users}
        let:ref={usersRef}
        log
      >
        {#if !users.length}No users yet...{/if}
        <ul class="users">
          {#each users as user}
            <li>
              <Avatar name={user.name} />
              <span> {user.name} </span>
              {#if session.owner === user.id}
                <span class="host">(Host)</span>
              {/if}
            </li>
          {/each}
        </ul>
        <span slot="loading">Loading users...</span>
      </Collection>
      Waiting for owner to start the session.
    {/if}
  {:else}
    <div>Loading...</div>
  {/if}
</User>

<style>
  .board {
    display: flex;
    justify-content: center;
    margin-top: 1em;
  }
  .board > :not(:last-child) {
    margin-right: 1em;
  }
  .board-footer {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }
  .deck-container {
    margin-top: 64px;
  }
  .deck {
    display: flex;
    flex-wrap: wrap;
  }
  .deck > :global(*) {
    margin: 0.5em;
  }
  .card-skeleton {
    height: 300px;
    width: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .player {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.3em;
  }
  .card-choice {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .card-choice > :global(:not(:last-child)) {
    margin-bottom: 0.3em;
  }
  .invite-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
  }
  .invite-container > :global(:not(:last-child)) {
    margin-bottom: 0.3em;
  }
  .controls {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  .controls > :global(:not(:last-child)) {
    margin-right: 1em;
  }
  ul.users {
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  ul.users > :not(:last-child) {
    margin-right: 1em;
  }
  .users li {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  .users li .host {
    font-style: italic;
  }
</style>
