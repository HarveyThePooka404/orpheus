import { createStore } from "vuex"
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from "../main"

const store = createStore({
    state() {
        return {
            activeEvent: [],
            events: [],
            stories: [],
            firestoreid: "",
            actionEvent: "create",
            actionStory: "create",
            users: [],
            currentModule: "",
            data: false,
            dataOptions: false,
            isLogged: false,
            usersTypeLoad: false,
            usersType: [],
            storyID: "",
        }
    },
    mutations: {
        ...vuexfireMutations,
        editEventID(state, id) {
            state.firestoreid = id
        },

        actionEventChange(state, action) {
            state.actionEvent = action
        },

        actionStoryChange(state, action) {
            state.actionStory = action
        },

        changeCurrentModule(state, module) {
            state.currentModule = module
        },

        changeDataStatus(state, status) {
            state.data = status
        },

        logUserIn(state, status) {
            state.isLogged = status
        },

        changeTypeStatus(state, status) {
            state.usersTypeLoad = status
        },

        changeStoryId(state, id) {
            state.storyID = id
        },

        changeDataOptions(state, status) {
            state.dataOptions = status
        },



    },

    getters: {

        getData: state => {
            return state.data
        },

        getDataOptions: state => {
            return state.dataOptions
        },

        getCurrentModule: state => {
            return state.currentModule
        },

        getUsers: state => {
            return state.users
        },

        getFirestoreId: state => {
            return state.firestoreid
        },

        getActionFirestore: state => {
            return state.actionEvent
        },

        getActionStoryFirestore: state => {
            return state.actionStory
        },

        getEvents: state => {
            return state.events
        },

        getActiveEvent: state => {
            return state.activeEvent
        },

        getStories: state => {
            return state.stories
        },

        getStoryID: state => {
            return state.storyID
        },

        getUsersType: state => {
            return state.usersType
        },

        getUsersTypeLoad: state => {
            return state.usersTypeLoad
        },

        matchingEvent: state => {
            for (let i = 0; i < state.events.length; i++) {
                if (state.events[i].id == state.firestoreid) {
                    return state.events[i]
                }
            }
        },

    },

    actions: {

        deleteEventfromFirestore: firestoreAction((context, payload) => {

            db.collection("events")
                .doc(payload)
                .delete()
                .then(() => {
                    store.commit("changeDataStatus", true);
                    console.log("document deleted from Firestore");
                }).catch(err => console.log(err));
        }),


        addUsertoFirestore: firestoreAction((context, payload) => {

            return db.collection("events")
                .doc(payload.firestoreId)
                .collection('users')
                .add({
                    mail: payload.mail,
                    storyline: payload.storyline,
                    url: payload.url,
                })
                .then(() => {
                    console.log("user added to Firestore");
                });
        }),

        bindEventsfromFirestore: firestoreAction(({ bindFirestoreRef }) => {
            return bindFirestoreRef('events', db.collection('events'))
        }),

        bindStoriesfromFirestore: firestoreAction(({ bindFirestoreRef }) => {

            return bindFirestoreRef('stories', db.collection('stories'))
        }),

        addStorytoFirestore: firestoreAction((context, payload) => {
            return db.collection("stories").add({
                title: payload
            }).then(() => {
                console.log("added new story")
            })
        }),

        deleteStoryfromFirestore: firestoreAction(() => {
            return db.collection('stories').doc(store.state.storyID).delete();
        }),

        deleteAllUsersTypefromFirestore: firestoreAction(() => {
            return db.collection('stories').doc(store.state.storyID).collection('userType').delete();
        }),

        bindUsersfromFirestore: firestoreAction(({ bindFirestoreRef }, payload) => {
            return bindFirestoreRef('users', db.collection('events').doc(payload).collection('users'))
        }),

        bindUsersTypefromFirestore: firestoreAction(({ bindFirestoreRef }, payload) => {
            return bindFirestoreRef('usersType', db.collection('stories').doc(payload).collection('userType'))
        }),

        addUserTypetoFirestore: firestoreAction((context, payload) => {
            return db.collection("stories")
                .doc(store.state.storyID)
                .collection('userType')
                .add({
                    name: payload.name,
                    url: payload.url
                })
        }),

        deleteUserTypefromFirestore: firestoreAction((context, payload) => {

            let query = db.collection('stories').doc(store.state.storyID).collection("userType").where('name', '==', payload);
            return query.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    doc.ref.delete();
                })
            });

        }),

        unbindUsers: firestoreAction(({ unbindFirestoreRef }) => {
            unbindFirestoreRef('users')
        }),
    }


})

export default store