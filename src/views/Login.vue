<template>
  <div class="login">
    <h1>Orpheus</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="Email" v-model="email" />
      <input
        type="password"
        placeholder="Password"
        v-model="password"
        autocomplete="current-password"
      />
      <input type="submit" value="Login" />
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import firebase from "firebase";
import image from "../assets/images/Lyra.png";
import store from "@/store/store.js";

export default {
  data: function () {
    return {
      image: image,
      store: store,
    };
  },

  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit("logUserIn", true);
        this.$router.push({ name: "Dashboard" });
      }
    });
  },

  setup() {
    const email = ref("");
    const password = ref("");

    const Login = () => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(console.log("logged"))
        .catch((err) => alert(err.message));
    };

    return {
      Login,
      email,
      password,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 4em;
}

.login {
  display: flex;
  flex-flow: column;
  align-items: center;
  border-radius: 5px;
}

.login > form {
  display: flex;
  flex-flow: column;
  width: 100%;
  max-width: 500px;
}

.login > form > input {
  margin: 15px;
  border-radius: 2px;
  padding: 2px;
  border: none;
  font-size: 2em;
}

.login > form > input[type="text"],
.login > form > input[type="password"] {
  background-color: transparent;
  border-bottom: solid 1px #051029;
}

.login > form > input::placeholder {
  color: #314675;
  font-family: "Lato", sans-serif;
}

.login > form > input[type="submit"] {
  margin-top: 1em;
  min-height: 60px;
  border-radius: 10px;
  background-color: #314675;
  color: white;
  font-family: "Lato", sans-serif;
}

img {
  width: 100%;
}
</style>