<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="list.list"
      item-key="id"
      :items-per-page="this.limit"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>列表</v-toolbar-title>
          <v-spacer></v-spacer>
          <add-form @on-ok="onAddOk"></add-form>
        </v-toolbar>
      </template>
    </v-data-table>
    <v-pagination v-model="page" :length="pageCount" @input="onPage"></v-pagination>
  </v-container>
</template>

<script>
import Vue from 'vue'
// @ is an alias to /src
import api from '@/api'
import AddForm from '@/components/tag/AddForm.vue'
import gql from 'graphql-tag'
import { mapActions } from 'vuex'
export default {
  name: 'tagList',
  components: {
    AddForm
  },
  apollo: {
    list: {
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
      update: data => data.findTags,
      variables () {
        return {
          input: {
            name: '',
            limit: 20,
            offset: this.page - 1
          }
        }
      }
    }
  },
  data: function () {
    return {
      headers: [
        {
          text: 'id',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: 'name', value: 'name', sortable: false },
        { text: 'action', value: 'action', sortable: false }
      ],
      list: {
        list: [],
        total: 0
      },
      page: 1,
      msg: '',
      limit: 30
    }
  },
  computed: {
    pageCount () {
      return Math.ceil((this.list.total || 0) / this.limit)
    }
  },
  mounted () {
    // this.getFace()
  },
  methods: {
    onPage (n) {
      this.page = n
    },
    onAddOk () {
      this.$apollo.queries.list.refetch()
    }
  }
}
</script>
