<template>
  <router-view />
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
</template>

<script>
import { onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import firebase from "firebase";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    onBeforeMount(() => {
      firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          router.replace("/login");
        } else if (route.path == "/login" || route.path == "/register") {
          router.replace("/");
        }
      });
    });
  },
};
</script>

<style>
@import url("https://use.typekit.net/wrq1yyn.css");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap");

h1 {
  font-family: var(--orpheus-font);
  font-weight: 300;
}

#app {
  margin: 5vw;
}

#nav {
  position: absolute;
  bottom: 10px;
  text-align: center;
}
#nav > a {
  color: white;
}
</style>
