<template>
  <v-container class="fill-height" fluid>
    <div class="markdown-context">
      <post-form :value.sync="post" @on-ok="onOk"/>
      <Markd :value.sync="post.post" />
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
import api from '@/api'
import Markd from '@/components/Markd.vue'
import PostForm from '@/components/PostForm'
import { mapActions } from 'vuex'
import gql from 'graphql-tag'
import { gqlError } from '@/util/gqlError'

export default {
  name: 'add',
  components: {
    Markd,
    PostForm
  },
  data: () => {
    return {
      post: {
        id: '',
        title: '',
        tag: {
          id: ''
        },
        post: '',
        creator: {
          id: '',
          username: ''
        }
      }
    }
  },
  mounted () {

  },
  methods: {
    async onOk (form) {
      const title = form.title
      const tag = form.tag.id
      const post = this.post.post
      gqlError(async () => {
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($input: PostAddInput!) {
            createPost(input: $input) {
              id
              title
            }
          }`,
          variables: {
            input: {
              title: title,
              tag: tag,
              post: post
            }
          },
          // 用结果更新缓存
          // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          update (store, { data: { createPost } }) {
            return createPost
          }
        })
        if (res.data) {
          this.tips('成功')
          this.$router.replace('/post/list')
        }
      })
    },
    ...mapActions(['tips', 'login'])
  }
}
</script>
<style lang="scss">
.markdown-context {
    flex: 1;
}
.markdown-body {
    height: 80vh;
}
</style>
