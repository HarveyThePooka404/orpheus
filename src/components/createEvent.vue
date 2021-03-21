<template>
  <div id="createEvent">
    <div class="left">
      <h1 class="first-title">Select an Event</h1>
      <button class="new-event add-button">+</button>
      <div class="existing-event">
        <template v-for="events in events" :key="events">
          <div class="event" @click="selectEvent($event)">
            <p class="id-event">{{ events.id }}</p>
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
      </div>
    </div>

    <div class="right">
      <h1 class="first-title" v-if="action == 'create'">Create a new event</h1>
      <h1 class="first-title" v-else>Edit an existing event</h1>
      <form action="">
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
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="fiat">Fiat</option>
            <option value="audi">Audi</option>
          </select>
        </div>

        <div class="paxEvent labelInput">
          <label for="pax-event">How many participants?</label>
          <input type="number" id="pax-event" name="pax-event" />
        </div>
      </form>

      <button
        id="buttonSubmitEvent"
        @click="createNewEvent"
        v-if="action == 'create'"
      >
        Create event
      </button>
      <div class="wrapper-delete" v-else>
        <button id="buttonSubmitEvent" @click="createNewEvent">
          Edit event
        </button>
        <img src="../assets/images/bin.png" alt="delete icon" />
      </div>
    </div>
  </div>

  <!-- <button id="show-more">show more</button> -->
</template>


<script>
import { db } from "../main.js";
import { ref } from "vue";

export default {
  name: "createEvent",

  data() {
    return {
      action: "create",
    };
  },

  methods: {
    selectEvent(event) {
      let clickedEvent = event.currentTarget;
      let idEvent = clickedEvent.firstChild.innerHTML;
      this.action = "edit";
      clickedEvent.classList.add("active");

      db.ref("events/" + idEvent).on("value", (snapshot) => {
        let data = snapshot.val();
        this.displayEvent(data);
      });
    },

    displayEvent(data) {
      //sets up data and selector
      this.action = "edit";

      let date = document.querySelector("#date-event");
      let dayServer = new Date(data.fulldate);

      //chops up the date to fit a fucking format no one undertands
      let yearServer = dayServer.getFullYear();
      let monthServer = ("0" + dayServer.getMonth()).slice(-2);
      let dayFormattedServer = ("0" + dayServer.getDate()).slice(-2);

      //changes form value
      let dayFormatted = `${yearServer}-${monthServer}-${dayFormattedServer}`;
      date.value = dayFormatted;

      // same for hour
      let hour = document.querySelector("#hour-event");
      let hourServer = data.hour;
      hour.value = hourServer;

      //same for place
      let place = document.querySelector("#place-event");
      let placeServer = data.placeEvent;
      place.value = placeServer;

      //finally doing it for the pax
      let pax = document.querySelector("#pax-event");
      let paxServer = data.numberAttending;
      pax.value = paxServer;
    },

    editEvent() {
      this.editDBevent(this.createEvent(), this.idEvent);
    },

    editDBevent(editedEvent, idEvent) {
      console.log(editedEvent, idEvent);
    },

    createEvent() {
      let input = document.querySelector("#date-event").value;
      let d = new Date(input);

      let month = d.getMonth();
      let day = ("0" + d.getDate()).slice(-2);

      let placeEvent = document.querySelector("#place-event").value;
      let paxEvent = document.querySelector("#pax-event").value;

      let hours = document.querySelector("#hour-event").value;
      let hour = hours.charAt(0) + hours.charAt(1);
      let minutes = hours.charAt(3) + hours.charAt(4);

      d.setHours(hour, minutes);
      console.log(d);

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
      let monthCartouche = monthNames[month];

      let newEvent = {
        fulldate: d,
        day: day,
        hour: hour + ":" + minutes,
        month: monthCartouche,
        numberAttending: paxEvent,
        placeEvent: placeEvent,
        titleEvent: "Lesson of Yoga",
      };

      return newEvent;
    },

    createNewEvent() {
      this.createNewDB(this.createEvent());
    },

    createNewDB(newEvent) {
      console.log(newEvent);
      this.createEvent();
      db.ref("events/" + this.id).set(newEvent);
      this.getLastRefServeur();
    },

    // this gets every events from the database => passed as data
    getLastRefServeur() {
      let lastEvent = db.ref("events/");
      lastEvent.on("value", (snapshot) => {
        const data = snapshot.val();
        this.getData(data);
      });
    },

    //
    getData(data) {
      this.events.push(data[Object.keys(data)[data.length - 1]]);
    },
  },

  setup() {
    let events = ref([]);
    let id = ref(-1);

    function renderEvents() {
      db.ref("events/").once("value", function (event) {
        event.forEach((stored) => {
          events.value.push(stored.val());
          id.value++;
        });
      });
    }

    renderEvents();

    return {
      events,
      id,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
#createEvent {
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
