<template>
  <div id="Stories">
    <div class="left">
      <h1 class="first-title">Select a Story</h1>
      <button class="new-event add-button" @click="setToCreate">+</button>
      <div class="existing-event">
        <get-stories currentModule="Stories"></get-stories>
      </div>
    </div>

    <div class="right">
      <h1 class="first-title" v-if="actionStory == 'create'">
        Create a new story
      </h1>
      <h1 class="first-title" v-else>Edit an existing story</h1>
      <button v-if="actionStory == 'edit'" @click="deleteStory">
        Delete story
      </button>
      <div class="whatever" v-if="actionStory == 'create'">
        <create-story currentModule="Stories"></create-story>
      </div>

      <user-type v-if="actionStory == 'edit'"></user-type>
    </div>
  </div>
</template>


<script>
import getStories from "../../components/getStories.vue";
import createStory from "../../components/createStory.vue";
import userType from "../../components/userType.vue";

import { useStore } from "vuex";
import { computed } from "vue";

export default {
  components: {
    getStories,
    createStory,
    userType,
  },

  props: ["currentModule"],

  data() {
    const store = useStore();

    return {
      actionStory: computed(() => store.getters.getActionStoryFirestore),
      data: computed(() => store.getters.getData),
    };
  },

  methods: {
    async setToCreate() {
      await this.$store.commit("actionStoryChange", "create");
      const allStories = document.querySelectorAll(".story");
      allStories.forEach(function (story) {
        story.classList.remove("active");
      });

      document.querySelector("#name-story").focus();
    },

    async deleteStory() {
      this.$store.commit("changeDataStatus", false);
      this.deleteUsersFirst();
      await this.$store.dispatch("deleteStoryfromFirestore");

      this.$store.commit("changeDataStatus", true);
      this.$store.commit("actionStoryChange", "create");
    },

    async deleteUsersFirst() {
      await this.$store.dispatch("deleteAllUsersTypefromFirestore");
    },
  },
};
</script>

<style scoped lang="css">
#Stories {
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

button {
  color: white;
  background-color: #051029;

  border: none;
  margin: 20px 0;
  font-size: 1.2em;
  padding: 0.5em;
  cursor: pointer;
  max-height: 50px;
}
</style>
