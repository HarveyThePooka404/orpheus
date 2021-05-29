
<template>
  <div class="wrapper" v-if="data">
    <div
      :id="story.id"
      v-for="story in stories"
      :key="story.title"
      class="story"
      @click="selectStory($event)"
    >
      <h1>{{ story.title }}</h1>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  methods: {
    async selectStory(clicked) {
      let clickedStory = clicked.currentTarget;
      this.$store.commit("changeStoryId", clickedStory.id);
      this.$store.commit("changeTypeStatus", false);
      console.log(this.$store.getters.getUsersTypeLoad);

      // checks if the clicked event was already active
      if (clickedStory.classList.contains("active")) {
        clickedStory.classList.remove("active");
        this.$store.commit("actionStoryChange", "create");
        console.log(this.$store.getters.getActionStoryFirestore);
      } else {
        //checks for other active events - then removes and displays event
        const allStories = document.querySelectorAll(".story");
        allStories.forEach(function (story) {
          story.classList.remove("active");
        });

        clickedStory.classList.add("active");

        await this.$store.dispatch(
          "bindUsersTypefromFirestore",
          clickedStory.id
        );
        this.$store.commit("actionStoryChange", "edit");
        this.$store.commit("changeTypeStatus", true);
      }
    },
  },

  data() {
    const store = useStore();

    return {
      data: computed(() => store.getters.getData),
      stories: computed(() => store.getters.getStories),
    };
  },

  async created() {
    this.$store.commit("changeDataStatus", false);

    await this.$store.dispatch("bindStoriesfromFirestore");
    this.$store.commit("changeDataStatus", true);
  },
};
</script>

<style scoped>
.story {
  border-radius: 30px;
  font-size: 2em;
  padding: 1em;
  box-shadow: -4px 8px 12px 0px rgba(0, 0, 0, 0.32);
  color: black;
  cursor: pointer;
  margin: 0.5em 0;
  text-align: center;
}

h1 {
  margin: 0;
}

.story:hover {
  background-color: #0c245c;
  color: white;
}

.active {
  background-color: #051029;
  color: white;
}
</style>