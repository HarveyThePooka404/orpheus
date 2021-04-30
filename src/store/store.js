import { createStore } from "vuex"
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from "../main"

const store = createStore({
    state() {
        return {
            activeEvent: [],
            events: [],
            firestoreid: "",
            actionEvent: "create",
            users: [],
            currentModule: "", 
        }
    },
    mutations: {
        ...vuexfireMutations,
        editEventID(state, id) {
            state.firestoreid = id
        },

        actionEventChange(state, action) {
            state.actionEvent = action
        }
        ,

        addNewEvent(state, newEvent) {
            state.events.push(newEvent)
        },

        changeCurrentModule(state, module) {
            state.currentModule = module
        }
    },

    getters: {

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

        getEvents: state => {
            return state.events
        },

        matchingEvent: state => {
            for (let i = 0; i < state.events.length; i++) {
                if (state.events[i].id == state.firestoreid) {
                    return state.events[i]
                }
            }
        }
    },

    actions: {

        deleteEventfromFirestore: firestoreAction((payload) => {
            db.collection("events")
                .doc(payload)
                .delete()
                .then(() => {
                    console.log("document deleted from Firestore");
                });
        }),


        addUsertoFirestore: firestoreAction((context, payload) => {

            return db.collection("events")
                .doc(payload.firestoreId)
                .collection('users')
                .add({
                    mail: payload.mail,
                    storyline: payload.storyline
                })
                .then(() => {
                    console.log("user added to Firestore");
                });
        }),

        bindEventsfromFirestore: firestoreAction(({ bindFirestoreRef }) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('events', db.collection('events'))
        }),

        bindUsersfromFirestore: firestoreAction(({ bindFirestoreRef }, payload) => {
            // return the promise returned by `bindFirestoreRef`
            return bindFirestoreRef('users', db.collection('events').doc(payload).collection('users'))
        }),

        unbindUsers: firestoreAction(({ unbindFirestoreRef }) => {
            unbindFirestoreRef('users')
        }),
    }


})

export default store