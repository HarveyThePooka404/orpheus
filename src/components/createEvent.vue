<template>
  <div class="wrapper-right">
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

        <div v-if="dataOptions">
          <select :value="value" id="story-event">
            <option v-for="story in stories" v-bind:key="story.title">
              {{ story.title }}
            </option>
          </select>
        </div>
      </div>

      <div class="paxEvent labelInput">
        <label for="pax-event">How many participants?</label>
        <input type="number" id="pax-event" name="pax-event" />
      </div>
    </form>

    <button
      class="button-class"
      id="buttonSubmitEvent"
      @click="createEvent"
      v-if="actionEvent === 'create'"
    >
      Create event
    </button>
    <div class="wrapper-delete" v-else>
      <button class="button-class" id="buttonSubmitEvent" @click="createEvent">
        Edit event
      </button>
      <img
        class="bin"
        src="../assets/images/bin.png"
        alt="delete icon"
        @click="deleteEvent"
      />
    </div>
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

    data() {
      const store = useStore();

      return {
        events: computed(() => store.getters.getEvents),
        actionEvent: computed(() => store.getters.getActionFirestore),
        firestoreid: computed(() => store.state.firestoreid),
        stories: computed(() => store.getters.getStories),
        dataOptions: computed(() => store.getters.getDataOptions),
        value: "",
      };
    },

    async created() {
      this.$store.commit("changeDataOptions", false);
      await this.$store.dispatch("bindStoriesfromFirestore");
      console.log(this.test);
      this.$store.commit("changeCurrentModule", "Event");
      this.$store.subscribe((mutation) => {
        if (
          mutation.type === "editEventID" &&
          mutation.payload != null &&
          this.$store.getters.getCurrentModule === "Event"
        ) {
          //state is the editEventid and not impacting events
          this.displayEvent(this.$store.getters.matchingEvent);
        }
      });
      this.$store.commit("changeDataOptions", true);
    },

    methods: {
      async createEvent() {
        this.$store.commit("changeDataStatus", false);
        const input = document.querySelector("#date-event").value;
        const placeEvent = document.querySelector("#place-event").value;
        const paxEvent = document.querySelector("#pax-event").value;
        const hours = document.querySelector("#hour-event").value;
        const title = document.querySelector("#story-event").value;

        let d = new Date(input);
        let month = d.getMonth();
        let day = ("0" + d.getDate()).slice(-2);
        let hour = hours.charAt(0) + hours.charAt(1);
        let minutes = hours.charAt(3) + hours.charAt(4);

        d.setHours(hour, minutes);

        let monthCartouche = monthNames[month];

        if (this.actionEvent === "create") {
          console.log(title);
          //adds to server
          await db.collection("events").add({
            fulldate: d,
            day: day,
            hour: hour + ":" + minutes,
            month: monthCartouche,
            numberAttending: paxEvent,
            placeEvent: placeEvent,
            titleEvent: title,
          });

          this.$store.commit("changeDataStatus", true);
          document.querySelector("#createEventForm").reset();
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

          this.$store.commit("changeDataStatus", true);
        }
      },

      displayEvent(data) {
        //sets up data and selector
        let date = document.querySelector("#date-event");
        let dateServer = data.fulldate.toDate();

        let month = ("0" + (dateServer.getMonth() + 1)).slice(-2);
        let day = ("0" + dateServer.getDate()).slice(-2);
        let year = dateServer.getFullYear();

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
        story.value = titleServer;

        //finally doing it for the pax
        let pax = document.querySelector("#pax-event");
        let paxServer = data.numberAttending;
        pax.value = paxServer;
      },

      async deleteEvent() {
        //delete from Firestore storage
        this.$store.commit("changeDataStatus", false);
        await this.$store.dispatch(
          "deleteEventfromFirestore",
          this.firestoreid
        );

        //reset forms after displaying events
        document.querySelector("#createEventForm").reset();
        this.$store.commit("actionEventChange", "create");
        console.log(this.$store.state.events);
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

  .wrapper-delete {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
  }

  .wrapper-delete img {
    margin-top: 25px;
    max-height: 50px;
    cursor: pointer;
  }

  .wrapper-delete img:hover {
    transform: scale(1.1);
  }
</style>
