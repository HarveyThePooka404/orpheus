<template>
  <div class="dashboard">
    <div id="menu">
      <h1>Orpheus</h1>
      <ul class="features">
        <li @click="changeActive($event), changeModule($event)" id="Stories">
          Create Story
        </li>
        <li @click="changeActive($event), changeModule($event)" id="Event">
          Create Event
        </li>
        <li
          @click="changeActive($event), changeModule($event)"
          id="upcomingEvents"
        >
          Upcoming Events
        </li>
      </ul>

      <span id="logoutButton" @click="logout()">logout</span>
    </div>

    <div id="modules">
      <div id="#components-demo">
        <upcoming-events
          v-if="currentModule == 'upcomingEvents'"
        ></upcoming-events>
        <event
          :currentModule="currentModule"
          v-if="currentModule == 'Event'"
        ></event>

        <stories
          :currentModule="Stories"
          v-if="currentModule == 'Stories'"
        ></stories>
      </div>
    </div>
  </div>
</template>

<script>
import upcomingEvents from "../components/upcomingEvents.vue";
import Event from "./pages/Event.vue";
import Stories from "./pages/Stories.vue";
import firebase from "firebase";

export default {
  components: { upcomingEvents, Event, Stories },

  data: function () {
    return {
      currentModule: "Stories",
    };
  },

  beforeCreate() {
    if (!this.$store.state.isLogged) {
      this.$router.push({ name: "Login" });
    }
  },

  methods: {
    changeModule(event) {
      this.currentModule = event.target.id;
    },

    changeActive(event) {
      const allLi = document.querySelectorAll(".features > li");
      allLi.forEach((li) => {
        if (li.classList.contains("active")) {
          li.classList.remove("active");
        }
      });

      event.target.classList.add("active");
    },

    logout() {
      firebase
        .auth()
        .signOut()
        .then(
          this.$store.commit("logUserIn", false),
          this.$router.push({ name: "Login" })
        )
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="css" scoped>
.dashboard {
  display: grid;
  grid-template-columns: 245px auto;
  grid-template-rows: 1fr;
}

#menu {
  width: 120%;
  color: white;
  font-weight: bold;
  background-color: #314675;
  min-height: 100vh;
  height: 100%;
  padding-left: 1em;
}

#menu > h1 {
  font-size: 4em;
}
.features {
  list-style-type: none;
  padding-left: 1em;
}

.features > li {
  cursor: pointer;
  margin: 40px 0;
  width: 68%;
  font-size: 1.3em;
}

.active,
.features > li:hover {
  transform: scale(1.1);
  transform-origin: bottom left;
  color: #051029;
  border-right: solid 5px #051029;
}

#modules {
  padding: 1em;
  grid-column: 2;
  background-color: white;
  border-radius: 50px 0 0 50px;
}

#nav {
  display: none;
}

#logoutButton {
  position: absolute;
  bottom: 20px;
  cursor: pointer;
}

#logoutButton:hover {
  transform: scale(1.1);
}
</style>
