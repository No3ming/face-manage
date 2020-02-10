<template>
  <v-container class="fill-height" fluid>
    <div class="markdown-context">
      <post-form v-model="post" @on-ok="onOk" @on-outline="onOutline" outline push name="文章"/>
      <Markd v-model="post.post"  @on-save="onSave"/>
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
          findOnePost(id: $id){
            title,
            tag {
                id
            },
            creator {
                username,
                id
            },
            post
          }
        }
      `,
      update: data => data.findOnePost,
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
      const status = 1
      gqlError(async () => {
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($input: PostUpdateInput!) {
            updatePost(input: $input) {
              id
              title
            }
          }`,
          variables: {
            input: {
              id,
              title,
              tag,
              post,
              status
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
      const id = this.$route.params.id
      const title = form.title
      const tag = form.tag.id
      const post = this.post.post
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
              title,
              tag,
              post,
              postId: id
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
    },
    async onSave (value) {
      this.onOutline({
        ...this.post
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
