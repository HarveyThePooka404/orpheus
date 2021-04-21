import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from "firebase"
import { firestorePlugin } from 'vuefire'
import './assets/style.css'
import store from './store/store.js'

const firebaseConfig = {
    apiKey: "AIzaSyDevsd2GP8oN6yUEa3c73-tko50O2-McI4",
    authDomain: "vue-orpheus.firebaseapp.com",
    projectId: "vue-orpheus",
    databaseURL: "https://vue-orpheus-default-rtdb.europe-west1.firebasedatabase.app/",
    storageBucket: "vue-orpheus.appspot.com",
    messagingSenderId: "952248085912",
    appId: "1:952248085912:web:2d3c69c90d5e46558bcfed"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

export { db, storage, store }

const app = createApp(App);
app.use(router, firestorePlugin);
app.use(store);
app.mount('#app');


