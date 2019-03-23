import firebase from 'firebase';
import firestore from 'firebase/firestore'

var config = {
  apiKey: "AIzaSyA61dGUHP7-uqgQLWuBfp9qVfmuhakLRqE",
  authDomain: "ninja-smoothies-408cc.firebaseapp.com",
  databaseURL: "https://ninja-smoothies-408cc.firebaseio.com",
  projectId: "ninja-smoothies-408cc",
  storageBucket: "ninja-smoothies-408cc.appspot.com",
  messagingSenderId: "351951063077"
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore()


