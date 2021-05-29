<template>
  <router-view />
</template>

<script>

export default {
};
</script>

<style>
@import url("https://use.typekit.net/wrq1yyn.css");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap");

h1 {
  font-family: var(--orpheus-font);
  font-weight: 300;
}

#nav {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 30px;
  font-size: 1.2em;
  display: flex;
  justify-content: space-around;
  max-width: 600px;
}
#nav > a {
  color: white;
}

#\#logout {
  cursor: pointer;
  text-decoration: underline;
}

#login-link {
  align-self: right;
}
</style>
