<template>
  <v-container class="fill-height" fluid>
    <div class="markdown-context">
      <post-form v-model="post" @on-ok="onOk" @on-outline="onOutline" outline push name="草稿"/>
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
  name: 'update',
  components: {
    Markd,
    PostForm
  },
  apollo: {
    post: {
      query: gql`query ($id: String!){
          findOneOutline(id: $id){
            title,
            tag {
                id
            },
            creator {
                username,
                id
            },
            post,
            postId
          }
        }
      `,
      update: data => data.findOneOutline,
      variables () {
        return {
          id: this.$route.params.id
        }
      }
    }
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
    this.$apollo.queries.post.refetch()
  },
  methods: {
    async onOk (form) {
      const id = this.$route.params.id
      const title = form.title
      const tag = form.tag.id
      const post = this.post.post
      const postId = this.post.postId
      gqlError(async () => {
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($id: String!, $input: OutlineUpdateInput) {
            pushOutline(id: $id, input: $input)
          }`,
          variables: {
            id,
            input: {
              id,
              postId,
              title,
              tag,
              post
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
        }
      })
    },
    async onOutline (form) {
      gqlError(async () => {
        const quey = {}
        const id = this.$route.params.id
        const title = form.title
        const tag = form.tag.id
        const post = this.post.post
        const postId = this.post.postId
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($input: OutlineUpdateInput!) {
            updateOutline(input: $input) {
              id
              title,
            }
          }`,
          variables: {
            input: {
              id,
              title,
              tag,
              post,
              postId
            }
          },
          // 用结果更新缓存
          // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          update (store, { data: { createOutline } }) {
            return createOutline
          }
        })
        if (res.data) {
          this.tips('保存成功')
        }
      })
    },
    ...mapActions(['tips'])
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
