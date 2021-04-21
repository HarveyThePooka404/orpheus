
<template>
  <div
    :id="events.id"
    v-for="events in events"
    :key="events"
    class="event"
    @click="selectEvent($event)"
  >
    <div class="date">
      <span class="day"> {{ events.day }}</span>
      <span class="month">{{ events.month }}</span>
      <span class="hour"> {{ events.hour }}</span>
    </div>
    <div class="info-event">
      <h2 class="title-event">{{ events.titleEvent }}</h2>
      <p class="place-event">{{ events.placeEvent }}</p>

      <p class="people-attending">
        <span class="number-attending">
          {{ events.numberAttending }}
        </span>
        attending
      </p>
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  methods: {
    selectEvent(clicked) {
      let clickedEvent = clicked.currentTarget;

      // checks if the clicked event was already active
      if (clickedEvent.classList.contains("active")) {
        clickedEvent.classList.remove("active");
        document.querySelector("#createEventForm").reset();
        this.$store.commit("actionEventChange", "create");
      } else {
        //checks for other active events - then removes and displays event
        const allEvents = document.querySelectorAll(".event");
        allEvents.forEach(function (event) {
          event.classList.remove("active");
        });

        clickedEvent.classList.add("active");

        let clickedId = clickedEvent.id;

        this.$store.commit("actionEventChange", "edit");
        this.$store.commit("editEventID", clickedId);
      }
    },
  },

  setup() {
    const store = useStore();

    return {
      events: computed(() => store.state.events),
      firestoreid: computed(() => store.state.firestoreid),
      actionEvent: computed(() => store.state.actionEvent),
    };
  },

  created: function () {
    db.collection("events")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let item = doc.data();
          item.id = doc.id;
          this.events.push(item);
        });
      });
  },

};
</script>

<style scoped>
.event {
  display: grid;
  grid-template-columns: 120px 8fr;
  font-size: 2em;
  border-radius: 30px;
  box-shadow: -4px 8px 12px 0px rgba(0, 0, 0, 0.32);
  text-align: center;
  margin: 20px 0;
}

.event:hover {
  cursor: pointer;
}

.date {
  display: flex;
  flex-flow: column;
  background-color: var(--primary-background);
  border-radius: 30px 0 0 30px;
  padding: 0.5em;
}

.date > .day {
  font-size: 2em;
}

.date > .month {
  font-size: 0.6em;
}

.date > .hour {
  font-size: 0.6em;
}

.id-event {
  display: none;
}

.info-event {
  color: black;
  text-align: left;
  padding: 20px;
  padding-bottom: 0px;
}
.info-event > h2 {
  color: var(--bright-orange);
  font-size: 1em;
  margin: 5px 0;
}

.people-attending {
  margin: 10px 0;
  font-size: 0.6em;
}

.people-attending > span {
  color: var(--bright-orange);
  font-weight: bold;
  font-size: 2em;
}

.place-event {
  margin: 0;
  font-size: 0.5em;
}

.active .info-event {
  background-color: var(--primary-background);
  border-radius: 0 25px 25px 0;
}

.active .info-event p {
  color: white;
}

.active .date .day {
  color: var(--bright-orange);
}
</style>