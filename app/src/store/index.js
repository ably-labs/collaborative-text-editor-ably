import Vue from "vue";
import Vuex from "vuex";
import * as Ably from "ably/promises";
import Spaces from "@ably-labs/spaces";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ablyClient: null,
    spaceClient: null,
    myClientId: null,
    collabSpace: null,
    allAvatarColours: ["red", "orange", "green", "amber", "lime", "cyan", "blue", "indigo"],
    collabMembers: [],
    locationUpdate: {},
    pointer: null,
    textEditorContentBlocks: [
      { id: "header-h1", type: "div", styling: "text-4xl font-black", content: "👩🏻‍💻 Collaborative block text editor" },
      { id: "hr-1", type: "hr", styling: "h-px my-8 bg-gray-300 border-1 dark:bg-gray-300" },
      {
        id: "body-1",
        type: "div",
        styling: "text-lg",
        content:
          "👋 Welcome! This is a demo text editor powered by Ably's Realtime Collaboration SDK. Open another instance of this in a new tab and explore the multiplayer collaboration features."
      },
      {
        id: "body-2",
        type: "div",
        styling: "text-lg",
        content: "Available features:",
        listItems: ["Avatar Stack", "User in-app location", "Live cursors", "Field locking", "Live app updates"]
      },
      { id: "hr-2", type: "hr", styling: "h-px my-8 bg-gray-300 border-1 dark:bg-gray-300" },
      { id: "header-h2-2", type: "div", styling: "text-lg pl-2", content: "TODOs" },
      { id: "chk-1", type: "checkbox", styling: "text-lg pl-2", content: "Tried the demo", isChecked: true },
      { id: "chk-2", type: "checkbox", styling: "text-lg pl-2", content: "Checked out the GitHub repo", isChecked: false },
      { id: "chk-3", type: "checkbox", styling: "text-lg pl-2", content: "Signed up to Ably", isChecked: true }
    ]
  },
  getters: {
    getAblyClient: (state) => state.ablyClient,
    getSpaceClient: (state) => state.spaceClient,
    getMyClientId: (state) => state.myClientId,
    getCollabSpace: (state) => state.collabSpace,
    getCollabMembers: (state) => state.collabMembers,
    getLocationUpdate: (state) => state.locationUpdate,
    getTextEditorContentBlocks: (state) => state.textEditorContentBlocks
  },

  mutations: {
    setAblyClient(state, client) {
      state.ablyClient = client;
    },
    setSpaceClient(state, client) {
      state.spaceClient = client;
    },
    setCollabSpace(state, space) {
      state.collabSpace = space;
    },
    setMyClientId(state, id) {
      state.myClientId = id;
    },
    setCollabMembers(state, members) {
      state.collabMembers = members;
    },
    setLocationUpdate(state, change) {
      state.locationUpdate = change;
    }
  },
  actions: {
    instantiateAbly(context) {
      const ablyClient = new Ably.Realtime({
        authUrl: "/auth-ably"
        //authUrl: "http://localhost:8082/auth-ably"
      });
      ablyClient.connection.once("connected", () => {
        const spaceClient = new Spaces(ablyClient);
        const collabSpace = spaceClient.get("text-editor");
        context.commit("setAblyClient", ablyClient);
        context.commit("setSpaceClient", spaceClient);
        context.commit("setCollabSpace", collabSpace);
        context.commit("setMyClientId", ablyClient.auth.clientId);
        context.state.collabSpace.enter({
          username: context.state.myClientId,
          initials: context.state.myClientId.slice(-2).toUpperCase(),
          avatarColour: context.state.allAvatarColours[Math.floor(Math.random() * context.state.allAvatarColours.length)]
        });
        context.dispatch("subscribeToMembers");
        context.dispatch("subscribeToLocations");
        context.dispatch("subscribeToCursors");
      });
    },
    subscribeToMembers(context) {
      context.state.collabSpace.on("membersUpdate", (members) => {
        context.commit("setCollabMembers", members);
        console.log("Total user count", context.state.collabMembers.length, "Members:", context.state.collabMembers[0].location);
      });
    },
    subscribeToLocations(context) {
      context.state.collabSpace.locations.on("locationUpdate", (change) => {
        context.commit("setLocationUpdate", change);
      });
    },
    setBlockLocation(context, element) {
      context.state.collabSpace.locations.set({ blockId: element.target.id });
    },
    subscribeToCursors(context) {
      context.state.pointer = context.state.collabSpace.cursors.get("pointer");
      context.state.collabSpace.cursors.on("cursorsUpdate", (event) => {
        console.log(event);
      });
    },
    setCursorLocation(context, xPos, yPos) {
      context.state.pointer.set({ position: { x: xPos, y: yPos }, data: { color: "red" } });
    }
  }
});
