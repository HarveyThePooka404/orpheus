import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from "firebase"
import './assets/style.css'



const firebaseConfig = {
    apiKey: "AIzaSyDevsd2GP8oN6yUEa3c73-tko50O2-McI4",
    authDomain: "vue-orpheus.firebaseapp.com",
    projectId: "vue-orpheus",
    storageBucket: "vue-orpheus.appspot.com",
    messagingSenderId: "952248085912",
    appId: "1:952248085912:web:2d3c69c90d5e46558bcfed"
};

firebase.initializeApp(firebaseConfig)

createApp(App).use(router).mount('#app')
