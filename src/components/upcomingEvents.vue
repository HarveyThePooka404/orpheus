<template>
  <div class="menu">
    <div class="left">
      <h1>Upcoming Events</h1>
      <div
        :id="events.id"
        v-for="events in events"
        :key="events"
        class="event upcomingEvent"
        @click="prepEvent($event)"
      >
        <div class="date">
          <span class="day"> {{ events.day }}</span>
          <span class="month">{{ events.month }}</span>
          <span class="hour"> {{ events.hour }}</span>
        </div>
        <div class="info-event">
          <h2 class="title-event">{{ events.titleEvent }}</h2>
          <p class="place-event">{{ events.placeEvent }}</p>

          <p class="users-list">
            <span class="users-made">
              I'll add a list with the users there
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="right">
      <h1>Set up events</h1>
      <h2>Add users</h2>
      <form id="form-add-user" @submit.prevent="addUser">
        <input placeholder="email de l'utilisateur" type="text" id="email" />
        <select id="user-type">
          <option value="type-a">Type A</option>
          <option value="type-b">Type B</option>
        </select>
        <input type="submit" value="Add User" />
      </form>

      <h2>Registered users</h2>
      <ul>
        <li v-for="user in users" :key="user" class="existingUsers">
          {{ user.mail }}, {{ user.storyline }}
          <img
            src="../assets/images/bin.png"
            alt="delete user icon"
            class="deleteIcon"
            :id="user.mail"
            @click="deleteUser($event)"
          />

          <br />
          <router-link :to="{ path: `/events/${firestoreId}/${user.mail}` }">
            Try out url</router-link
          >
        </li>
      </ul>
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
    return {
      users: [],
      firestoreId: "",
    };
  },

  methods: {
    addUser() {
      let mail = document.querySelector("#email").value;
      let storyline = document.querySelector("#user-type").value;

      db.collection("events")
        .doc(this.firestoreId)
        .collection("users")
        .doc()
        .set({
          mail: mail,
          storyline: storyline,
        });

      this.users = [];
      db.collection("events")
        .doc(this.firestoreId)
        .collection("users")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            this.users.push(doc.data());
          });
        });
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
      console.log(this.users);
    },

    prepEvent(clicked) {
      let clickedEvent = clicked.currentTarget;
      let clickedId = clickedEvent.id;
      this.firestoreId = clickedId;
      this.users = [];

      if (clickedEvent.classList.contains("active")) {
        clickedEvent.classList.remove("active");
        //need to clear right sides there
      } else {
        const allEvents = document.querySelectorAll(".upcomingEvent");
        allEvents.forEach(function (event) {
          event.classList.remove("active");
        });

        clickedEvent.classList.add("active");
        db.collection("events")
          .doc(clickedId)
          .collection("users")
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              this.users.push(doc.data());
            });
          });
      }
    },
  },
  setup() {
    const store = useStore();

    return {
      events: computed(() => store.state.events),
    };
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
  grid-template-columns: 1fr 1fr;
}

.left,
.right {
  grid-template-rows: 80px auto;
  justify-self: center;
  display: grid;
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

li {
  color: black;
}

#form-add-user {
  display: flex;
  flex-flow: column;
}

.deleteIcon {
  height: 20px;
  align-self: flex-end;
  cursor: pointer;
}

.existingUsers {
  display: flex;
  justify-content: space-between;
}
</style>
