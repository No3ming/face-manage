<template>
  <v-dialog
    v-model="tips.show"
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">tips</v-card-title>
      <v-card-text>{{tips.ms}}</v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  name: 'tips',
  props: {
    msg: String,
    value: Boolean
  },
  data: () => {
    return {
      dialog: false
    }
  },
  computed: {
    ...mapState(['tips'])
  }
})
</script>
