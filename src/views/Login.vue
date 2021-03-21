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

export default {
  data: function () {
    return {
      image: image,
    };
  },

  setup() {
    const email = ref("");
    const password = ref("");

    const Login = () => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(console.log("loggedin"))
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
  color: white;
  border-bottom: solid 1px white;
}

.login > form > input::placeholder {
  color: white;
  font-family: "Lato", sans-serif;
}

.login > form > input[type="submit"] {
  margin-top: 2em;
  min-height: 60px;
  background-color: var(--dark-orange);
  color: white;
  font-family: "Lato", sans-serif;
}

img {
  width: 100%;
}
</style>