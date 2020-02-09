<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="list.list"
      :items-per-page="this.limit"
      item-key="id"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>文章列表</v-toolbar-title>
          <v-btn @click="onReFatch" fab dark x-small color="primary">
            <v-icon dark >mdi-autorenew</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="add">新增版本</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.id="{item}">
        <div>
          <router-link :to="`/post/update/${item.id}`">{{item.id}}</router-link>
        </div>
      </template>
      <template v-slot:item.createdAt="{item}">
        <div>
          {{item.createdAt | format}}
        </div>
      </template>
      <template v-slot:item.updatedAt="{item}">
        <div>
          {{item.updatedAt | format}}
        </div>
      </template>
      <template v-slot:item.action="{item}">
        <div>
          <router-link :to="`/post/update/${item.id}`">
            <v-icon color="primary">mdi-autorenew</v-icon>
          </router-link>
          <span style="margin: 0 10px"></span>
          <v-icon color="red" @click="onDelete(item)">mdi-delete</v-icon>
        </div>
      </template>
    </v-data-table>
    <v-pagination v-model="page" :length="pageCount" @input="onPage"></v-pagination>
  </v-container>
</template>

<script>
// @ is an alias to /src
import gql from 'graphql-tag'
import dayjs from 'dayjs'
import api from '@/api'
import { gqlError } from '@/util/gqlError'
import { mapActions } from 'vuex'

export default {
  name: 'list',
  components: {},
  apollo: {
    list: {
      query: gql`query ($input: PostListInput!){
          findPosts(input: $input){
            list {
              id,
              title,
              createdAt,
              updatedAt
            },
            total
          }
        }
      `,
      update: data => data.findPosts,
      variables () {
        return {
          input: {
            title: '',
            limit: this.limit,
            offset: this.page - 1
          }
        }
      }
    }
  },
  data: () => {
    return {
      headers: [
        {
          text: 'id',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'title', value: 'title', sortable: false },
        { text: 'createdAt', value: 'createdAt', sortable: false },
        { text: 'updatedAt', value: 'updatedAt', sortable: false },
        { text: 'action', value: 'action', sortable: false }
      ],
      list: {
        list: [],
        total: 0
      },
      page: 1,
      total: 0,
      msg: '',
      limit: 30
    }
  },
  computed: {
    pageCount () {
      return Math.ceil((this.list.total || 0) / this.limit)
    }
  },
  filters: {
    format (value) {
      return value ? dayjs(value).format('YYYY-MM-DD hh:mm:ss') : ''
    }
  },
  mounted () {
    this.$apollo.queries.list.refetch()
  },
  methods: {
    onPage (n) {
      this.page = n
    },
    add () {
      this.$router.push('/post/add')
    },
    onDelete (item) {
      gqlError(async () => {
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($id: String!) {
            deletePost(id: $id) {
              id
            }
          }`,
          variables: {
            id: item.id
          },
          // 用结果更新缓存
          // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          update (store, { data: { createPost } }) {
            return createPost
          }
        })
        if (res.data) {
          this.tips('成功')
          this.$apollo.queries.list.refetch()
        }
      })
    },
    onReFatch () {
      this.$apollo.queries.list.refetch()
    },
    ...mapActions(['tips'])
  }
}
</script>
