<template>
  <form action="" id="createEventForm">
    <div class="dateEvent labelInput">
      <label for="date-event">Date of the Event</label>
      <input type="date" id="date-event" name="date-event" />
    </div>

    <div class="hourEvent labelInput">
      <label for="hour-event">Time of the Event</label>
      <input type="time" id="hour-event" name="hour-event" />
    </div>

    <div class="placeEvent labelInput">
      <label for="place-event">Where?</label>
      <input type="textarea" id="place-event" name="place-event" />
    </div>

    <div class="storyEvent labelInput">
      <label for="story-event">Which story to use?</label>
      <select id="story-event" name="story-event">
        <option value="Lesson">Lesson</option>
        <option value="Something Else">Something Else</option>
        <option value="A cool name">A cool name</option>
        <option value="Divided by Iceberg">Divided by Iceberg</option>
      </select>
    </div>

    <div class="paxEvent labelInput">
      <label for="pax-event">How many participants?</label>
      <input type="number" id="pax-event" name="pax-event" />
    </div>
  </form>

  <button
    id="buttonSubmitEvent"
    @click="createEvent"
    v-if="actionEvent == 'create'"
  >
    Create event
  </button>
  <div class="wrapper-delete" v-else>
    <button id="buttonSubmitEvent" @click="createEvent">Edit event</button>
    <img
      src="../assets/images/bin.png"
      alt="delete icon"
      @click="deleteEvent"
    />
  </div>
</template>

<script>
import { db } from "../main.js";
import { computed } from "vue";
import { useStore } from "vuex";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default {
  props: ["currentModule"],

  setup() {
    const store = useStore();

    return {
      events: computed(() => store.state.events),
      firestoreid: computed(() => store.state.firestoreid),
      actionEvent: computed(() => store.state.actionEvent),
    };
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (
        mutation.type === "editEventID" &&
        mutation.payload != null &&
        this.currentModule === "Event"
      ) {
        console.log(state);
        //state is the editEventid and not impacting events
        this.displayEvent(this.$store.getters.matchingEvent);
      }
    });
  },

  methods: {
    createEvent() {
      const input = document.querySelector("#date-event").value;
      const placeEvent = document.querySelector("#place-event").value;
      const paxEvent = document.querySelector("#pax-event").value;
      const hours = document.querySelector("#hour-event").value;
      const title = document.querySelector("#story-event").value;
      console.log(title);

      let d = new Date(input);
      let month = d.getMonth();
      let day = ("0" + d.getDate()).slice(-2);
      let hour = hours.charAt(0) + hours.charAt(1);
      let minutes = hours.charAt(3) + hours.charAt(4);

      d.setHours(hour, minutes);

      let monthCartouche = monthNames[month];

      let createdEvent = {
        fulldate: d,
        day: day,
        hour: hour + ":" + minutes,
        month: monthCartouche,
        numberAttending: paxEvent,
        placeEvent: placeEvent,
        titleEvent: title,
      };

      if (this.actionEvent === "create") {
        //add to store for immediat re-render
        this.$store.commit("addNewEvent", createdEvent);

        //adds to server
        db.collection("events").add({
          fulldate: d,
          day: day,
          hour: hour + ":" + minutes,
          month: monthCartouche,
          numberAttending: paxEvent,
          placeEvent: placeEvent,
          titleEvent: title,
        });
      } else if (this.actionEvent === "edit") {
        //update event in the store
        this.$store.getters.matchingEvent.fulldate = d;
        this.$store.getters.matchingEvent.day = day;
        this.$store.getters.matchingEvent.hour = hour + ":" + minutes;
        this.$store.getters.matchingEvent.month = monthCartouche;
        this.$store.getters.matchingEvent.numberAttending = paxEvent;
        this.$store.getters.matchingEvent.placeEvent = placeEvent;
        this.$store.getters.matchingEvent.titleEvent = title;

        //update event on the server
        db.collection("events")
          .doc(this.firestoreid)
          .update({
            fulldate: d,
            day: day,
            hour: hour + ":" + minutes,
            month: monthCartouche,
            numberAttending: paxEvent,
            placeEvent: placeEvent,
            titleEvent: title,
          })
          .then(() => {
            console.log("updated document in firestore");
          });
      }
    },

    getEventFirestore(id) {
      db.collection("events")
        .doc(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log(doc.id);
            console.log("Document data: ", doc.data());
          } else {
            console.log("No such document");
          }
        })
        .catch((error) => {
          console.log("Error getting document: ", error);
        });
    },

    displayEvent(data) {
      //sets up data and selector
      let date = document.querySelector("#date-event");
      let dateServer = data.fulldate.toDate();

      let month = ("0" + (dateServer.getMonth() + 1)).slice(-2);
      let day = ("0" + dateServer.getDate()).slice(-2);
      let year = dateServer.getFullYear();
      console.log(year, month, day);

      date.value = `${year}-${month}-${day}`;
      //change date to fit input

      // same for hour
      const hour = document.querySelector("#hour-event");
      let hourServer = data.hour;
      hour.value = hourServer;

      //same for place
      const place = document.querySelector("#place-event");
      let placeServer = data.placeEvent;
      place.value = placeServer;

      //same for story
      const story = document.querySelector("#story-event");
      let titleServer = data.titleEvent;
      console.log(titleServer);
      story.value = titleServer;

      //finally doing it for the pax
      let pax = document.querySelector("#pax-event");
      let paxServer = data.numberAttending;
      pax.value = paxServer;
    },

    deleteEvent() {
      //delete from Firestore storage
      db.collection("events")
        .doc(this.firestoreid)
        .delete()
        .then(() => {
          console.log("document deleted from Firestore");
        });

      //delete from Events store
      this.$store.commit("DELETE_EVENT", this.firestoreid);

      //reset forms after displaying events
      document.querySelector("#createEventForm").reset();
    },
  },
};
</script>

<style scoped>
.labelInput {
  display: flex;
  flex-flow: column;
  color: var(--primary-background);
}

.labelInput > label,
.labelInput > input,
.labelInput > select {
  margin-bottom: 10px;
}

#buttonSubmitEvent {
  background-color: var(--dark-orange);
  color: white;
  border: none;
  margin: 50px 0;
  font-size: 1.2em;
  padding: 0.5em;
  cursor: pointer;
  max-height: 75px;
}

.wrapper-delete {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
}

.wrapper-delete img {
  max-height: 50px;
}
</style>