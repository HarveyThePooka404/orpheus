<template>
  <div id="createStory">
    <form action="" id="createStoryForm">
      <div class="namestory labelInput">
        <label for="name-story">Name of the Story</label>
        <input
          type="text"
          placeholder="Name it"
          id="name-story"
          name="name-story"
        />
      </div>
    </form>

    <button id="buttonSubmitStory" @click="createStory">Create story</button>
  </div>
</template>

<script>
import "vue-js-modal/dist/styles.css";

export default {
  name: "createStory",

  methods: {
    async createStory() {
      this.$store.commit("changeDataStatus", false);
      console.log("called");
      await this.$store.dispatch(
        "addStorytoFirestore",
        document.querySelector("#name-story").value
      );

      this.$store.commit("changeDataStatus", true);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
#createStory {
  display: flex;
  flex-flow: column;
}

label,
.labelInput {
  display: flex;
  flex-flow: column;
  margin: 0.5em 0;
}

#buttonSubmitStory {
  color: white;
  background-color: #051029;

  border: none;
  margin: 20px 0;
  font-size: 1.2em;
  padding: 0.5em;
  cursor: pointer;
}
</style>
