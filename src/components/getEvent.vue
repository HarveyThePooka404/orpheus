
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

<script>

import { db } from '../main.js';

export default {
  components: {
      name: 'getEvent'
  },

  data() {
    return {
      events: []
    }
  },

  created: function() {
      db.collection('events').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let item = doc.data()
          item.id = doc.id
          this.events.push(item)
        })
      })
  }  
}
</script>