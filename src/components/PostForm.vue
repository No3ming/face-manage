<template>
   <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="value.title"
        :counter="100"
        :rules="nameRules"
        label="title"
        required
      ></v-text-field>

      <v-select
        v-model="value.tag.id"
        :items="tags"
        item-text="name"
        item-value="id"
        :rules="[v => !!v || 'tag is required']"
        label="tag"
        required
      ></v-select>

      <!-- <v-checkbox
        v-model="post.push"
        label="是否发布?"
      ></v-checkbox> -->

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="onValidate"
      >
        提交
      </v-btn>
      <p></p>
    </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { mapActions } from 'vuex'

interface data {
  tags: any[],
  post: any,
  valid: boolean,
  nameRules: any[]
}

export default Vue.extend({
  name: 'post-form',
  apollo: {
    tags: {
      query: gql`query ($input: TagListInput!){
          findTags(input: $input){
            list {
              id,
              name
            },
            total
          }
        }
      `,
      update: data => data.findTags.list,
      variables () {
        return {
          input: {
            name: '',
            limit: 100,
            offset: 0
          }
        }
      }
    }
  },
  props: {
    value: Object
  },
  data: () => ({
    tags: [],
    valid: false,
    nameRules: [
      (v: string) => !!v || 'title is required',
      (v: string) => (v && v.length <= 100) || 'Title must be less than 100 characters'
    ]
  }),
  methods: {
    onValidate () {
      const form: any = this.$refs.form
      if (form.validate()) {
        this.$emit('on-ok', this.value)
      }
    }
  }
})
</script>
