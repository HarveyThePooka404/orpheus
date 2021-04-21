import { createStore } from "vuex"

const store = createStore({
    state() {
        return {
            events: [],
            firestoreid: "",
            actionEvent: "create"
        }
    },
    mutations: {
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

        DELETE_EVENT(state, id) {
            let index = state.events.findIndex(event => event.id == id);
            state.events.splice(index, 1);
        }
    },

    getters: {
        matchingEvent: state => {
            console.log(state);
            for (let i = 0; i < state.events.length; i++) {
                if (state.events[i].id == state.firestoreid) {
                    return state.events[i]
                }
            }
        }
    }


})

export default store