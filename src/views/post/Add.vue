<template>
  <v-container class="fill-height" fluid>
    <div class="markdown-context">
      <post-form v-model="post" @on-ok="onOk" @on-outline="onOutline" outline push name="文章"/>
      <Markd v-model="post.post" />
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
        },
        status: 0
      }
    }
  },
  mounted () {

  },
  methods: {
    async onOk (form, cb) {
      const title = form.title
      const tag = form.tag.id
      const post = this.post.post
      const status = form.status
      gqlError(async () => {
        const quey = {}
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($input: PostAddInput!) {
            createPost(input: $input) {
              id
              title,
              tag {
                id,
                name
              },
              post,
              status
            }
          }`,
          variables: {
            input: {
              title: title,
              tag: tag,
              post: post,
              status: status
            }
          },
          // 用结果更新缓存
          // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          update (store, { data: { createPost } }) {
            return createPost
          }
        })
        if (res.data) {
          cb ? cb(res.data.createPost) : this.$router.replace('/post/list')
        }
      })
    },
    async onOutline (form) {
      await this.onOk(form, (createPost) => {
        gqlError(async () => {
          const quey = {}
          const res = await this.$apollo.mutate({
            mutation: gql`mutation ($input: OutlineAddInput!) {
            createOutline(input: $input) {
              id
              title,
            }
          }`,
            variables: {
              input: {
                title: createPost.title,
                tag: createPost.tag.id,
                post: createPost.post,
                postId: createPost.id
              }
            },
            // 用结果更新缓存
            // 查询将先通过乐观响应、然后再通过真正的变更结果更新
            update (store, { data: { createOutline } }) {
              return createOutline
            }
          })
          if (res.data) {
            this.$router.replace(`/outline/update/${res.data.createOutline.id}`)
          }
        })
      })
    },
    ...mapActions(['tips', 'login'])
  }
}
</script>
<style lang="scss">
.markdown-context {
    flex: 1;
    width: 100%;
}
.markdown-body {
    height: 80vh;
}
</style>
