<script>
  import ScrumfaceCard from "./ScrumfaceCard.svelte";
  import Game from "./Game.svelte";
  import CreateSession from "./CreateSession.svelte";
  import JoinSession from "./JoinSession.svelte";
  import Session from "./Session.svelte";
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import decks from "./decks.js";

  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  // import 'firebase/performance';
  // import 'firebase/analytics';
  const firebaseConfig = {
    apiKey: "AIzaSyAM_nio_ZQ7ZsaccbHWpQkw2uK04QLXjUY",
    authDomain: "planning-poker-55cfa.firebaseapp.com",
    databaseURL: "https://planning-poker-55cfa.firebaseio.com",
    projectId: "planning-poker-55cfa",
    storageBucket: "planning-poker-55cfa.appspot.com",
    messagingSenderId: "340398036300",
    appId: "1:340398036300:web:ea42f4b26060e7334d6be9",
    measurementId: "G-MZZSDK2LBB"
  };
  firebase.initializeApp(firebaseConfig);

  let session;

  function gotSession(e) {
    session = e.detail;
    localStorage.setItem("session", JSON.stringify(e.detail));
  }

  const persistent = localStorage.getItem("session");
  if (persistent) {
    session = JSON.parse(persistent);
  }
</script>

<style>
  .hr {
    display: block;
    width: 100%;
    position: relative;
    padding: 1em;
  }
  .hr::before,
  .hr::after {
    content: "";
    position: absolute;
    border-top: 1px solid black;
    top: 50%;
  }
  .hr::before {
    left: 0;
    right: calc(50% + 2ch);
  }
  .hr::after {
    right: 0;
    left: calc(50% + 2ch);
  }
</style>

<FirebaseApp {firebase}>

  {#if !session}
    <div>
      <CreateSession on:session={gotSession} />
    </div>

    <span class="hr">OR</span>
    <div>
      <JoinSession on:session={gotSession} />
    </div>
  {:else}
    <div>
      <Session sessionId={session.id} />
    </div>
  {/if}
</FirebaseApp>
