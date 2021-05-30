<template>
  <div class="user-types">
    <div class="wrapper-delete-user">
      <h2>Existing users' type</h2>
      <button class="button-class" id="buttonAddUser" @click="show">
        Add User Type
      </button>

      <div class="modal hide">
        <div class="modal-background" @click.self="hide">
          <div class="modal-content">
            <h1>Add a name for the character type</h1>
            <label for="name">Name</label><input type="text" id="name" />
            <label for="file"> Add a soundtrack </label>
            <input
              type="file"
              @input="fileSelected($event.target.files[0])"
              name="file"
              id="uploader"
            />

            <button class="button-class" id="addUserInfo" @click="addUserType">
              Add
            </button>
          </div>
        </div>
      </div>

      <ul v-if="usersTypeLoad">
        <li v-for="user in usersType" :key="user.name" class="existingUsers">
          <span class="user-mail">{{ user.name }}</span>
          <span class="user-mail">
            <a :href="user.url" target="_blank"> URL</a></span
          >

          <img
            src="../assets/images/bin.png"
            alt="delete user icon"
            class="deleteIcon"
            @click="deleteUser($event)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { computed } from "vue";
  import { useStore } from "vuex";
  import { storage } from "../main.js";

  export default {
    data() {
      const store = useStore();

      return {
        usersType: computed(() => store.getters.getUsersType),
        usersTypeLoad: computed(() => store.getters.getUsersTypeLoad),
        soundtrackData: null,
        url: "",
      };
    },

    methods: {
      show() {
        document.querySelector(".modal").classList.add("show");
        document.querySelector(".modal").classList.remove("hide");
      },
      hide() {
        document.querySelector(".modal").classList.add("hide");
        document.querySelector(".modal").classList.remove("show");
      },

      async addUserType() {
        const getUrl = await this.addAudioFile();
        getUrl;
      },

      async createNewUser() {
        console.log("post function", this.url);
        let name = document.querySelector("#name").value;
        await this.$store.dispatch("addUserTypetoFirestore", {
          name: name,
          url: this.url,
        });

        this.$store.commit("changeTypeStatus", true);
        this.hide();
        document.querySelector("#addUserInfo").disabled = false;
      },

      fileSelected(event) {
        this.soundtrackData = event;
      },

      async addAudioFile() {
        document.querySelector("#addUserInfo").disabled = true;
        this.$store.commit("changeTypeStatus", false);
        await storage
          .ref(`${this.$store.getters.getStoryID}/${this.soundtrackData.name}`)
          .put(this.soundtrackData)
          .then(async (snapshot) => {
            let url = await snapshot.ref.getDownloadURL();
            this.url = url;
            this.createNewUser();
          });
      },

      async deleteUser(event) {
        this.$store.commit("changeTypeStatus", false);
        let name = event.currentTarget.parentNode.firstChild.innerHTML;
        await this.$store.dispatch("deleteUserTypefromFirestore", name);

        setTimeout(() => this.reRenderUsers(), 100);
      },

      reRenderUsers() {
        this.$store.commit("changeTypeStatus", true);
      },
    },
  };
</script>

<style lang="css" scoped>
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

  /* start of the modal */

  .modal-content {
    height: 400px;
    width: 400px;
    z-index: 10;
    border: black;
    background-color: white;
    position: absolute;
    top: 20vh;
    left: 40vw;
    border-radius: 20px;
    padding: 2em;
  }

  .modal-background {
    background-color: rgba(0, 0, 0, 0.7);
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
  }

  #addUserInfo {
    position: absolute;
    bottom: 20px;
    left: 20px;
  }

  label,
  .labelInput {
    display: flex;
    flex-flow: column;
    margin: 0.5em 0;
  }

  .hide {
    display: none;
  }

  .show {
    display: block;
  }

</style>
