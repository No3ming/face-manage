<template>
  <v-container fluid>
    <v-text-field label="Another input" v-model.lazy="tag1" @change="tagchange"></v-text-field>
    <v-data-table
      :headers="headers"
      :items="list.list"
      :items-per-page="limit"
      item-key="id"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>图片列表</v-toolbar-title>
          <v-btn @click="onReFatch" fab dark x-small color="primary">
            <v-icon dark >mdi-autorenew</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="add">新增</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.id="{item}">
        <div>
          <router-link :to="`/outline/update/${item.id}`">{{item.id}}</router-link>
        </div>
      </template>
      <template v-slot:item.img="{item}">
        <div style="width: 500px">
          <v-img :src="item.img" aspect-ratio="1.7"></v-img>
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
          <router-link :to="`/outline/update/${item.id}`">
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
      query: gql`query ($input: PriceListInput!){
          getPrices(input: $input){
            list {
               tags,
               img
            },
            total
          }
        }
      `,
      update: data => data.getPrices,
      variables () {
        return {
          input: {
            tag: this.tag,
            limit: this.limit,
            offset: this.page - 1
          }
        }
      },
      error (err) {
        console.log(err, 12312)
        if (err.graphQLErrors.length && err.graphQLErrors[0].message.statusCode === 401) {
          this.login()
        } else {
          this.tips(err.message)
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
        { text: 'tags', value: 'tags', sortable: false },
        { text: 'img', value: 'img', sortable: false }
      ],
      tag1: '',
      tag: '',
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
  filters: {
    format (value) {
      return value ? dayjs(value).format('YYYY-MM-DD hh:mm:ss') : ''
    }
  },
  computed: {
    pageCount () {
      return Math.ceil((this.list.total || 0) / this.limit)
    }
  },
  mounted () {
    this.$apollo.queries.list.refetch()
  },
  methods: {
    tagchange (val) {
      this.tag = val
    },
    onPage (n) {
      this.page = n
    },
    add () {
      this.$router.push('/price/add')
    },
    onDelete (item) {
      gqlError(async () => {
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($id: String!) {
            deleteOutline(id: $id) {
              id
            }
          }`,
          variables: {
            id: item.id
          },
          // 用结果更新缓存
          // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          update (store, { data: { deleteOutline } }) {
            return deleteOutline
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
    ...mapActions(['tips', 'login'])
  }
}
</script>
