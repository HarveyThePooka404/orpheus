<template>
  <div class="liveEvent">
    <h1>{{ liveEvent.titleEvent }}</h1>
    <div class="wrapper-event">
      <p v-if="!isLive">
        L'événement commence dans <br /><span>{{ days }}</span> jours,
        <span>{{ hours }}</span> heures, <span>{{ minutes }}</span> minutes,
        <span>{{ seconds }}</span> secondes
      </p>

      <p v-if="isLive">
        L'événement est live depuis <br /><span>{{ days }}</span> jours,
        <span>{{ hours }}</span> heures, <span>{{ minutes }}</span> minutes,
        <span>{{ seconds }}</span> secondes
      </p>

      <audio controls preload="none" id="lecteur" loop>
        <source src="" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>

    <a id="button" @click="playAudio()">
      <span v-if="!isReading && !isLive"> Essayer </span>
      <span v-if="!isReading && isLive"> Commencer </span>
      <span v-if="isReading && !isLive"> Stop </span>
      <span v-if="isReading && isLive"> Live </span>

      <div class="liquid"></div>
    </a>

    <!-- <button @click="stopAudio()">Stop audio</button> -->
  </div>
</template>

<script>
  import { db, storage } from "../main.js";

  export default {
    data() {
      return {
        timeToEvent: "",
        liveEvent: "",
        liveUser: "",
        waitURL: "",
        liveREF: "",

        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,

        distance: 0,
        startfrom: 0,

        isLive: false,
        isReading: false,
      };
    },

    methods: {
      playAudio() {
        let lecteur = document.querySelector("#lecteur");

        if (!this.isReading) {
          this.defineSource();

          if (this.isLive) {
            this.startfrom = Math.abs(this.distance / 1000);
          }

          this.isReading = true;
          document.querySelector(".liquid").classList.add("isReading");

          lecteur.currentTime = this.startfrom;
          lecteur.play();
        } else if (this.isReading && !this.isLive) {
          this.isReading = false;
          document.querySelector(".liquid").classList.remove("isReading");

          lecteur.pause();
        }
      },

      stopAudio() {
        let lecteur = document.querySelector("#lecteur");
        lecteur.pause();

        this.defineSource();
      },

      defineSource() {
        let lecteur = document.querySelector("#lecteur");
        console.log(this.distance);

        if (!this.isLive) {
          lecteur.setAttribute("src", this.waitURL);
        } else {
          lecteur.setAttribute("src", this.liveURL);
        }
      },

      countDown() {
        setInterval(() => {
          // Find the distance between now and the count down date

          let fireStoreDate = this.liveEvent.fulldate.toDate();
          let fireStoreDateHour = fireStoreDate.getTime();

          let countDownDate = fireStoreDateHour;
          let currentTime = new Date();
          let distance = countDownDate - currentTime;
          this.distance = distance;

          //event is not yet
          if (distance < 1000 && distance > 0) {
            this.isLive = true;
            this.stopAudio();
            this.startfrom = 0;
            this.playAudio();
          }

          if (distance > 0) {
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            var minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element
            this.days = days;
            this.hours = hours;
            this.minutes = minutes;
            this.seconds = seconds;
          } else {
            this.isLive = true;
            let passedTime = currentTime - countDownDate;
            days = Math.floor(passedTime / (1000 * 60 * 60 * 24));
            hours = Math.floor(
              (passedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            minutes = Math.floor((passedTime % (1000 * 60 * 60)) / (1000 * 60));
            seconds = Math.floor((passedTime % (1000 * 60)) / 1000);

            // Display the result in the element
            this.days = days;
            this.hours = hours;
            this.minutes = minutes;
            this.seconds = seconds;
          }
        }, 1000);
      },
    },

    async created() {
      //getting info for event and user from firestore
      let route = this.$route.params.firestoreId;
      let liveEvent = (
        await db
          .collection("events")
          .doc(route)
          .get()
      ).data();
      this.liveEvent = liveEvent;

      let user = this.$route.params.usermail;
      let liveUser = "";

      await db
        .collection("events")
        .doc(route)
        .collection("users")
        .where("mail", "==", user)
        .get()
        .then((querySnaphot) => {
          querySnaphot.forEach((doc) => {
            liveUser = doc.data();
          });
        });

      this.liveUser = liveUser;
      console.log(this.liveUser);
      console.log(this.liveEvent);
      //getting info for audio from storage?

      let storageRef = storage.ref("first-story/type-a/Mozart.mp3");
      let x = await storageRef.getDownloadURL().then(function(url) {
        return url;
      });

      console.log(this.liveUser.url);
      let y = this.liveUser.url;

      this.liveURL = y;
      this.waitURL = x;
      this.countDown();
    },
  };
</script>

<style lang="css" scoped>
  .liveEvent {
    display: flex;
    flex-flow: column;
    justify-content: center;

    height: 100vh;
    background: linear-gradient(
      rgba(5, 16, 41, 1) 50%,
      rgba(255, 255, 255, 1) 100%
    );
  }

  .wrapper-event {
    padding: 0 2em;
    align-self: center;
  }

  h1 {
    text-align: center;
    margin: 0;
    font-size: 6em;
    color: white;
  }

  p {
    text-align: center;
    color: white;
  }

  p span {
    font-weight: 400;
    font-size: 1.5em;
  }

  audio {
    display: none;
  }

  /* button for the liquid button => from: https://codepen.io/fliseno1k/pen/WNboLBy */
</style>
