<template>
  <div id="Event">
    <div class="left">
      <h1 class="first-title">Select an Event</h1>
      <button class="new-event add-button" @click="setToCreate">+</button>
      <div class="existing-event">
        <get-event currentModule='Event'></get-event>
      </div>
    </div>

    <div class="right">
      <h1 class="first-title" v-if="actionEvent == 'create'">
        Create a new event
      </h1>
      <h1 class="first-title" v-else>Edit a scheduled event</h1>
      <create-event></create-event>
    </div>
  </div>
</template>


<script>
import getEvent from "../../components/getEvent.vue";
import createEvent from "../../components/createEvent.vue";

import { useStore } from "vuex";
import { computed } from "vue";

export default {
  components: {
    getEvent,
    createEvent,
  },

  props: ["currentModule"],

  methods: {
    setToCreate() {
      this.$store.commit("actionEventChange", "create");
      this.$store.commit("editEventID", null);

      document.querySelector("#createEventForm").reset();

      const allEvents = document.querySelectorAll(".event");
      allEvents.forEach(function (event) {
        event.classList.remove("active");
      });
    },
  },
  setup() {
    const store = useStore();

    return {
      actionEvent: computed(() => store.state.actionEvent),
    };
  },
};
</script>

<style scoped lang="css">
#Event {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.left,
.right {
  grid-template-rows: 80px auto;
  justify-self: center;
  display: grid;
}

label {
  color: var(--primary-background);
}

.first-title {
  grid-area: 1/1;
}

h1 {
  color: var(--bright-orange);
  font-size: 2em;
  align-self: center;
}

p {
  color: var(--primary-background);
  grid-area: 1 / 1;
  font-weight: 1200;
}

.new-event {
  grid-area: 1/1;
}

.add-button {
  width: 30px;
  height: 35px;
  color: white;
  border: none;
  background-color: #27192b;
  font-size: 2em;
  padding: 0;
  margin: 0;
  cursor: pointer;
  align-self: center;
  justify-self: flex-end;
}

#new-story:hover {
  transform: scale(1.1);
}

#show-more {
  grid-column: 2;
  grid-row-end: -1;
}

.existing-stories {
  grid-area: 2;
}

.existing-event {
  overflow-y: scroll;
  overflow-x: auto;
  padding: 0 1em;
  height: 60vh;
}

.existing-event::-webkit-scrollbar {
  background: transparent;
}
</style>
