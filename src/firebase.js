import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// import 'firebase/performance';
// import 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.GOOGLE_API_KEY,
  authDomain: 'planning-poker-55cfa.firebaseapp.com',
  databaseURL: 'https://planning-poker-55cfa.firebaseio.com',
  projectId: 'planning-poker-55cfa',
  storageBucket: 'planning-poker-55cfa.appspot.com',
  messagingSenderId: '340398036300',
  appId: '1:340398036300:web:ea42f4b26060e7334d6be9',
  measurementId: 'G-MZZSDK2LBB',
};
firebase.initializeApp(firebaseConfig);

export default firebase;
