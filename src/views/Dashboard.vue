<template>
  <div class="dashboard">
    <div id="menu">
      <h1>Orpheus</h1>
      <ul class="features">
        <li
          @click="changeActive($event), changeModule($event)"
          id="createStory"
        >
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
        <li @click="changeActive($event)" id="pastEvents">Past Events</li>
        <li @click="changeActive($event)" id="calendar">Calendar</li>
        <li @click="changeActive($event)" id="settings">Settings</li>
      </ul>
    </div>

    <div id="modules">
      <div id="#components-demo">
        <create-story v-if="currentModule == 'createStory'"></create-story>
        <upcoming-events
          v-if="currentModule == 'upcomingEvents'"
        ></upcoming-events>
        <event
          :currentModule="currentModule"
          v-if="currentModule == 'Event'"
        ></event>
      </div>
    </div>
  </div>
</template>

<script>
import createStory from "../components/createStory.vue";
import upcomingEvents from "../components/upcomingEvents.vue";
import Event from "./pages/Event.vue";

export default {
  components: { createStory, upcomingEvents, Event },

  data: function () {
    return {
      currentModule: "createStory",
    };
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
  width: 200px;
  padding-left: 1em;
}

#menu > h1 {
  text-align: center;
  font-size: 2.8em;
}
.features {
  list-style-type: none;
  padding-left: 1em;
}

.features > li {
  cursor: pointer;
  margin: 30px 0;
  width: 103%;
  font-size: 1.3em;
}

.active,
.features > li:hover {
  color: var(--bright-orange);
  transform: scale(1.1);
  transform-origin: bottom left;
  border-right: solid 5px var(--bright-orange);
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
</style>
