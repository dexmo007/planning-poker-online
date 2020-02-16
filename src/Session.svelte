<script>
  import firebase from "firebase/app";
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import ScrumfaceCard from "./ScrumfaceCard.svelte";
  import Game from "./Game.svelte";
  import decks from "./decks.js";
  import { collectionStore, docStore } from "sveltefire";

  export let sessionId;

  let session;
  const sessionStore = docStore(`sessions/${sessionId}`);
  sessionStore.subscribe(v => (session = v));

  let players;
  const playersStore = collectionStore(`sessions/${sessionId}/users`, ref =>
    ref.orderBy("joinedAt")
  );
  playersStore.subscribe(v => (players = v));

  $: deck = session && decks.find(({ name }) => name === session.deck);
  $: isReveal =
    session &&
    players &&
    session.state === "STARTED" &&
    players.every(player => player.choice);

  async function setSessionState(sessionState) {
    await firebase
      .firestore()
      .collection("sessions")
      .doc(sessionId)
      .set(
        {
          state: sessionState
        },
        { merge: true }
      );
  }

  let choice;
  async function confirmChosenCard(userId) {
    await firebase
      .firestore()
      .doc(`sessions/${sessionId}/users/${userId}`)
      .set(
        {
          choice
        },
        { merge: true }
      );
    choice = null;
  }
  async function nextRound() {
    choice = null;
    const db = firebase.firestore();
    const batch = db.batch();
    batch.update(db.collection("sessions").doc(sessionId), {
      state: "STARTED"
    });
    for (const player of players) {
      batch.update(player.ref, { choice: null });
    }
    await batch.commit();
  }
</script>

<style>
  .board {
    display: flex;
    justify-content: center;
  }
  .board > :not(:last-child) {
    margin-right: 1em;
  }
  .board-footer {
    margin-top: 24px;
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
</style>

<User let:user>

  {#if session}
    <h3>
      Welcome in {sessionId}
      {#if session.owner === user.uid}(Owner){/if}
    </h3>
    {#if session.owner === user.uid && session.state !== 'STARTED'}
      <button on:click={() => setSessionState('STARTED')}>Start session</button>
    {/if}
    {#if session.state === 'STARTED'}
      {#if players}
        <div class="board">
          {#each players as player}
            <div>
              <span>{player.ref.id === user.uid ? 'You' : player.name}</span>
              {#if player.choice || (player.ref.id === user.uid && choice)}
                <div>
                  <ScrumfaceCard
                    faceUp={isReveal || !player.choice}
                    value={player.choice ? player.choice.value : choice.value} />
                  {#if !player.choice}
                    <button on:click={() => confirmChosenCard(user.uid)}>
                      Confirm
                    </button>
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
            <button on:click={nextRound}>Next round</button>
          </div>
        {/if}
      {:else}
        <span>Loading users...</span>
      {/if}
      <div class="deck-container">
        {#if !players || !players.find(p => p.ref.id === user.uid).choice}
          <span>Choose a card</span>
          <div class="deck">
            {#each deck.values as value}
              <ScrumfaceCard
                faceUp
                {value}
                width="90px"
                clickable
                on:click={() => (choice = { value })} />
            {/each}
          </div>
        {:else if !isReveal}
          <span>Waiting for other players</span>
        {/if}
      </div>
    {:else}
      <Collection
        path={`sessions/${sessionId}/users`}
        query={ref => ref.orderBy('joinedAt')}
        let:data={users}
        let:ref={usersRef}
        log>

        {#if !users.length}No users yet...{/if}
        <ul>
          {#each users as user}
            <li>{user.name}</li>
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
