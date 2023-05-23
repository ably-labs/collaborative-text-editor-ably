<template>
  <div>
    <div
      v-if="contentBlock.type == 'div'"
      :id="contentBlock.id"
      class="p-2 hover:bg-gray-100 border border-transparent"
      :class="contentBlock.styling"
      style="outline: 0px solid transparent"
      contenteditable
      @focus="setBlockLocation($event)"
    >
      {{ contentBlock.content }}
      <ul v-if="contentBlock.listItems" v-for="item in contentBlock.listItems" class="list-disc pl-5">
        <li>{{ item }}</li>
      </ul>
    </div>
    <hr v-if="contentBlock.type == 'hr'" class="h-px my-8 bg-gray-300 border-1 dark:bg-gray-300" />
    <div
      v-if="contentBlock.type == 'checkbox'"
      :id="contentBlock.id"
      class="hover:bg-gray-100 flex items-center border border-transparent"
      :class="contentBlock.styling"
      contenteditable
      style="outline: 0px solid transparent"
      @focus="setBlockLocation($event)"
    >
      <input
        :id="contentBlock.id + 'box'"
        :checked="contentBlock.isChecked"
        type="checkbox"
        value=""
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        style="outline: 0px solid transparent"
      />
      <label :for="contentBlock.id + 'box'" class="ml-2 checkbox-1">{{ contentBlock.content }}</label>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "TextBlock",
  props: ["contentBlock"],
  data() {
    return {
      locationUpdate: null,
      borderColours: {
        red: "border-red-400",
        orange: "border-orange-400",
        green: "border-green-400",
        amber: "border-amber-400",
        lime: "border-lime-400",
        cyan: "border-cyan-400",
        blue: "border-blue-400",
        indigo: "border-indigo-400"
      }
    };
  },
  computed: {
    ...mapGetters(["getLocationUpdate"])
  },
  watch: {
    getLocationUpdate: function (update) {
      const currentElement = document.getElementById(update.currentLocation.blockId);
      const oldElement = document.getElementById(update.previousLocation.blockId);
      const memberAvatarColour = update.member.profileData.avatarColour;
      const borderColour = this.borderColours[memberAvatarColour];

      //hack until it's fixed in the API
      if (update.currentLocation.blockId != update.previousLocation.blockId) {
        if (currentElement) currentElement.classList.replace("border-transparent", borderColour);
        if (oldElement) oldElement.classList.replace(borderColour, "border-transparent");
      } else {
        currentElement.classList.replace("border-transparent", borderColour);
      }
    }
  },
  methods: {
    ...mapActions(["setBlockLocation", "setCursorLocation"]),
    mouseMove(event) {
      // this.setCursorLocation(event.clientX, event.clientY);
    }
  },
  components: {},
  created() {
    console.log("COMPONENT CREATED");
  }
};
</script>