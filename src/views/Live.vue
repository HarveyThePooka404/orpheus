<template>
  <div class="liveEvent">
    <h1>Name of the story: {{ liveEvent.titleEvent }}</h1>

    <p>
      Your event will start in {{ days }} days, {{ hours }} hours,
      {{ minutes }} minutes, {{ seconds }} seconds
    </p>
    <p>Today, you will play as {{ liveUser.storyline }}</p>

    <audio controls preload="none" id="lecteur" loop>
      <source src="" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <div class="button-wrapper">
      <button @click="playAudio()">Play audio</button>
      <button @click="stopAudio()">Stop audio</button>
    </div>

    <p>fallback listener: <a :href="waitURL">click here</a></p>
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
    };
  },

  methods: {
    playAudio() {
      let lecteur = document.querySelector("#lecteur");
      this.defineSource();

      if (this.isLive) {
        this.startfrom = Math.abs(this.distance / 1000);
        console.log(this.startfrom);
      }
      lecteur.currentTime = this.startfrom;
      lecteur.play();
    },

    stopAudio() {
      let lecteur = document.querySelector("#lecteur");
      lecteur.pause();
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

        //console.log(fireStoreDateHour);

        let countDownDate = fireStoreDateHour;

        //new Date("Apr 07, 2021 15:12:00").getTime();

        //console.log(countDownDate);
        //console.log(fireStoreDate);

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
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
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

    /*if (distance < 1000 && distance > 0) {
        this.stopAudio();
        startfrom = 0;
        //defineSource(-10);
        this.startAudio();
      } else if (distance > 0) {
  
      } else {
        let passedTime = currentTime - countDownDate;
        var days = Math.floor(passedTime / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (passedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((passedTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((passedTime % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.querySelector(".showingStart").innerHTML =
          days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
      }
      // If the count down is finished, write some text

      this.timetoEvent = distance;
    }, */
  },

  async created() {
    //getting info for event and user from firestore
    let route = this.$route.params.firestoreId;
    let liveEvent = (await db.collection("events").doc(route).get()).data();
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

    if (this.liveUser.storyline === "type-a") {
      console.log("this should be Blackwell");
      this.liveRef = storage.ref("first-test/Blackwell.wav");
    }

    if (this.liveUser.storyline === "type-b") {
      console.log("this should be Pierce");
      this.liveRef = storage.ref("first-test/Perce.wav");
    }

    let storageRef = storage.ref("first-story/type-a/Mozart.mp3");

    let x = await storageRef.getDownloadURL().then(function (url) {
      return url;
    });

    let y = await this.liveRef.getDownloadURL().then(function (url) {
      return url;
    });

    this.liveURL = y;
    this.waitURL = x;
    this.countDown();
  },
};
</script>

<style lang="css" scoped>
.liveEvent {
  padding: 2em;
}

h1 {
  font-size: 1em;
}

audio {
  display: none;
}

.button-wrapper {
  display: flex;
  flex-flow: column;
}

.button-wrapper button {
  margin: 2em 0;
  color: white;
  background-color: var(--bright-orange);
  border: none;
  height: 50px;
}
</style>