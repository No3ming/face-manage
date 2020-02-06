<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">新增</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Tag Form</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="name" label="Tag" required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="onClose">关闭</v-btn>
        <v-btn color="blue darken-1" text @click="onSubmit">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import Vue from 'vue'
import gql from 'graphql-tag'
import { mapActions } from 'vuex'
import { gqlError } from '@/util/gqlError'

interface data {
    show: boolean,
    name: string
}
export default Vue.extend({
  name: 'tag-form',
  data: (): data => ({
    show: false,
    name: ''
  }),
  methods: {
    async onSubmit () {
      gqlError(async () => {
        const tag = this.name
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($input: TagAddInput!) {
          createTag(input: $input) {
            id
            name
          }
        }`,
          variables: {
            input: {
              name: tag
            }
          },
          // 用结果更新缓存
          // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          update (store: any, { data: { createTag } }: any) {
            return createTag
          }
        })
        this.$emit('on-ok')
        this.onClose()
      })
    },
    onClose () {
      this.show = false
      this.name = ''
    },
    ...mapActions(['tips'])
  }
})
</script>
