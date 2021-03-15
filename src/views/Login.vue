<template>
  <div class="login">
    <img src="" alt="Logo Lyra" />
    <h1>Orpheus</h1>
    <form @submit.prevent="Login">
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="submit" value="Login" />
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import firebase from "firebase";

export default {
  setup() {
    const email = ref("");
    const password = ref("");

    const Login = () => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then((data) => console.log(data))
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

<style>
h1 {
  font-size: 4em;
}

.login {
  display: flex;
  flex-flow: column;
  align-items: center;
  background-color: var(--secondary-background);
  border-radius: 5px;
}

.login > form {
  display: flex;
  flex-flow: column;
}

.login > form > input {
  margin: 7px;
  border-radius: 2px;
  padding: 2px;
  border: none;
}
</style>