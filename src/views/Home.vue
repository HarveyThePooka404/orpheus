<template>
  <div class="home">
    <h1>Welcome, {{ email }}</h1>
    <router-link to="/about"> About </router-link>

    <button class="logout" @click="Logout">Logout</button>
  </div>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import firebase from "firebase";

export default {
  setup() {
    const user = firebase.auth().currentUser;
    const name = ref("");

    onBeforeMount(() => {
      if (user) {
        name.value = user.email.split("@")[0];
      }
    });

    const Logout = () => {
      firebase
        .auth()
        .signOut()
        .then(() => console.log("signed out"))
        .catch((err) => alert(err.message));
    };

    return {
      name,
      Logout,
    };
  },
};
</script>
