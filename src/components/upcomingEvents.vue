<template>
  <div class="menu">
    <div class="left" v-if="data">
      <h1>Upcoming Events</h1>
      <div class="wrapper-upcoming-event">
        <div
          :id="event.id"
          v-for="event in events"
          :key="event"
          class="event upcomingEvent"
          @click="prepEvent($event)"
        >
          <div class="date">
            <span class="day"> {{ event.day }}</span>
            <span class="month">{{ event.month }}</span>
            <span class="hour"> {{ event.hour }}</span>
          </div>
          <div class="info-event">
            <h2 class="title-event">{{ event.titleEvent }}</h2>
            <p class="place-event">{{ event.placeEvent }}</p>

            <p class="users-list">
              <span class="users-made"> </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <h1>Set up events</h1>

      <div class="wrapper-add-user">
        <h2>Add users</h2>
        <form id="form-add-user" @submit.prevent="addUser">
          <input placeholder="Add an email" type="text" id="email" required />
          <select id="user-type" v-if="userload" required>
            <!--             <option value="" selected="true" disabled="disabled">
              Choose a character type
            </option> -->
            <option v-for="type in usersType" v-bind:key="type">
              {{ type.name }}
            </option>
          </select>
          <input id="add-user" type="submit" value="Add User" />
        </form>
      </div>

      <div v-if="userload" class="wrapper-delete-user">
        <h2>Registered users</h2>
        <ul>
          <li v-for="user in users" :key="user.mail" class="existingUsers">
            <span class="user-mail">{{ user.mail }}</span>

            <span class="user-type">
              {{ user.storyline }} -
              <router-link
                class="try-url"
                :to="{ path: `/events/${firestoreId}/${user.mail}` }"
                >url
              </router-link>
            </span>

            <img
              src="../assets/images/bin.png"
              alt="delete user icon"
              class="deleteIcon"
              :id="user.mail"
              @click="deleteUser($event)"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "upcomingEvents",

  data() {
    const store = useStore();

    return {
      data: false,
      userload: false,
      events: computed(() => store.getters.getEvents),
      users: computed(() => store.getters.getUsers),
      firestoreId: computed(() => store.getters.getFirestoreId),
      usersType: computed(() => store.getters.getUsersType),
    };
  },

  async created() {
    this.$store.commit("changeCurrentModule", "Users");
    await this.$store.dispatch("bindEventsfromFirestore");
    this.data = true;
  },

  methods: {
    async addUser() {
      let mail = document.querySelector("#email").value;
      let storyline = document.querySelector("#user-type").value;

      let url = "";

      this.usersType.forEach((type) => {
        if (type.name === storyline) {
          url = type.url;
        }
      });

      console.log(url);

      (this.userload = false),
        await this.$store.dispatch("addUsertoFirestore", {
          firestoreId: this.firestoreId,
          mail: mail,
          storyline: storyline,
          url: url,
        });

      this.userload = true;
    },

    deleteUser(clicked) {
      //set to be mail address
      let clickedUser = clicked.currentTarget.id;

      //query for specific user w/mail
      let userDelete_query = db
        .collection("events")
        .doc(this.firestoreId)
        .collection("users")
        .where("mail", "==", clickedUser);

      //deletes user
      userDelete_query.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
          console.log("user deleted");
        });
      });

      //deletes user from local array
      let userLocal = this.users.find((user) => user.mail === clickedUser);
      let userLocalIndex = this.users.indexOf(userLocal);

      if (userLocalIndex > -1) {
        this.users.splice(userLocalIndex, 1);
      }
    },

    async prepEvent(clicked) {
      let clickedEvent = clicked.currentTarget;
      let clickedId = clickedEvent.id;
      this.$store.commit("editEventID", clickedId);
      this.userload = false;

      if (clickedEvent.classList.contains("active")) {
        clickedEvent.classList.remove("active");
        this.$store.dispatch("unbindUsers");
      } else {
        const allEvents = document.querySelectorAll(".upcomingEvent");
        allEvents.forEach(function (event) {
          event.classList.remove("active");
        });

        clickedEvent.classList.add("active");
        await this.$store.dispatch("bindUsersfromFirestore", clickedId);

        let activeEvent = "";

        this.events.forEach((event) => {
          if (event.id === this.firestoreId) {
            activeEvent = event.titleEvent;
          }
        });

        await this.$store.getters.getStories.forEach((story) => {
          if (story.title === activeEvent) {
            this.$store.dispatch("bindUsersTypefromFirestore", story.id);
          }
        });

        setTimeout(() => (this.userload = true), 250);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
h1 {
  color: var(--bright-orange);
  font-size: 2em;
  align-self: center;
}

h2 {
  color: var(--bright-orange);
}

.menu {
  display: grid;
  grid-template-columns: auto 1fr;
}

.left,
.right {
  grid-template-rows: 80px auto;
  justify-self: center;
  display: grid;
}

.left {
  padding: 0 1em;
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
  background-color: #051029;
  border-radius: 30px 0 0 30px;
  padding: 0.5em;
  color: white;
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
  background-color: #051029;
  border-radius: 0 25px 25px 0;
}

.active .info-event p {
  color: white;
}

.active .date .day {
  color: var(--bright-orange);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  box-shadow: -4px 4px 6px 0px rgba(0, 0, 0, 0.32);
  color: black;
  display: grid;
  padding: 1em;
  border-radius: 20px;
  grid-template-rows: 1fr 1fr;
  margin: 1em 0;
}

#form-add-user {
  display: flex;
  flex-flow: column;
}

.deleteIcon {
  margin-left: 2em;
  justify-self: end;
  max-height: 40px;
  cursor: pointer;
  grid-column: 2 / 2;
  grid-row: 1 / span 2;
}

.deleteIcon:hover {
  transform: scale(1.1);
}

.try-url {
  grid-row: 1;
  color: black;
  position: relative;
  padding: 0;
  margin: 0;
  bottom: 0;
  width: 100%;
  display: inline;
}

.try-url:hover {
  text-decoration: underline;
  color: #174ac2;
  font-weight: bold;
}
.user-type {
  grid-area: 2 / 1;
  font-style: italic;
}

#email {
  border: none;
  margin: 0.5em 0;
  border-bottom: solid 1px grey;
  font-size: 1.1em;
  font-family: Lato;
}

#user-type {
  margin: 0.2em 0;
  border: none;
  font-size: 1.1em;
  font-family: Lato;
}

#add-user {
  color: white;
  background-color: #051029;
  border: none;
  font-family: Lato;
  padding: 0.75em;
  margin-top: 25px;
  border-radius: 5px;
  font-size: 1.1em;
}

.upcomingEvent {
  max-height: 200px;
}

.user-mail {
  text-transform: uppercase;
}
</style>
