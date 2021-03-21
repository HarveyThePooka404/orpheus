<template>
  <div id="createStory">
    <div class="left">
      <h1 class="first-title">Select a story</h1>
      <button class="new-story add-button">+</button>
      <div class="existing-stories">
        <div class="first-story story">8e Cercle des Enfers</div>
      </div>
    </div>

    <div class="right">
      <h1 class="first-title">Create a new story</h1>
      <form action="">
        <div class="namestory labelInput">
          <label for="name-story">Name of the Story</label>
          <input
            type="text"
            placeholder="Name it"
            id="name-story"
            name="name-story"
          />
        </div>

        <div class="typestory labelInput">
          <label for="type-story">Choose a type:</label>
          <select id="type-story" name="type-story">
            <option value=" ">Volvo</option>
            <option value="saab">Saab</option>
            <option value="fiat">Fiat</option>
            <option value="audi">Audi</option>
          </select>
        </div>

        <div class="number-pax labelInput">
          <label for="number-pax">Number of participants:</label>
          <input type="number" />
        </div>

        <div class="number-absolute labelInput">
          <label for="number-absolute"
            >Is the number of participants absolute?</label
          >
          <input type="checkbox" />
        </div>

        <div class="description-story labelInput">
          <label for="description-story">Description of the story</label>
          <input type="textarea" />
        </div>

        <div class="addNewUser">
          <h1>User's type</h1>
          <button class="add-button" id="add-new-user-button">+</button>
        </div>
        <div class="story user">user #1</div>
      </form>

      

      <button id="buttonSubmitStory">Create story</button>
    </div>
  </div>

  <!-- <button id="show-more">show more</button> -->
</template>

<script>
export default {
  name: "createStory",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
#createStory {
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

.new-story {
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

.addNewUser {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}

.existing-stories {
  grid-area: 2;
}

.story {
  color: var(--bright-orange);
  padding: 0.5em 2em;
  font-size: 2em;
  border-radius: 50px;
  box-shadow: -4px 12px 24px 0px rgba(0, 0, 0, 0.32);
  text-align: center;
}

.user {
  padding: 0.2em 1em;
  font-size: 1.5em;
}

.story:hover {
  cursor: pointer;
  transform: scale(1.01);
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

#buttonSubmitStory {
  background-color: var(--dark-orange);
  color: white;
  border: none;
  margin: 50px 0;
  font-size: 1.2em;
  padding: 0.5em;
  cursor: pointer;
}
</style>
