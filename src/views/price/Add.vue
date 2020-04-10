<template>
  <v-container class="fill-height" fluid>
    <div class="markdown-context">
      <v-form
        ref="form"
        lazy-validation
      >
        <v-file-input label="File input" @change="onImgAdd" ></v-file-input>
        <v-btn
          color="success"
          class="mr-4"
          @click="onOk"
        >
          发布
        </v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { mapActions } from 'vuex'
import gql from 'graphql-tag'
import { gqlError } from '@/util/gqlError'
import axios from 'axios'
import { computeMD5 } from '@/util/computeMD5'
export default {
  name: 'add',
  components: {

  },

  data: () => {
    return {
      tag: '',
      url: '',
      uu: ''
    }
  },
  mounted () {
  },
  methods: {
    async onOk () {
      console.log()
      const url = this.url
      console.log(url)
      gqlError(async () => {
        const res = await this.$apollo.mutate({
          mutation: gql`mutation ($url: String!) {
            addPrices(url: $url) {
               tags
            }
          }`,
          variables: {
            url
          },
          // 用结果更新缓存
          // 查询将先通过乐观响应、然后再通过真正的变更结果更新
          update (store, { data: { addPrices } }) {
            return addPrices
          }
        })
        if (res.data) {
          this.tips('成功')
        }
      })
    },
    onChange (f) {
      console.log(f)
    },
    async onImgAdd (file) {
      const hash = await computeMD5(file)
      const filePath = `${hash}/${file.name}`
      // @ts-ignore
      const { data } = await this.$apollo.query({
        query: gql`query ($name: String!, $type: String!){
            getPut(name: $name, type: $type){
              url
            }
          }
        `,
        // @ts-ignore
        update: (data) => data.getPut,
        variables: {
          name: filePath,
          type: file.type
        }
      })
      axios.put(data.getPut.url, file, {
        headers: { 'Content-Type': `${file.type}; charset=UTF-8` }
      }).then((url) => {
        const { origin, pathname } = new URL(data.getPut.url)
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        // @ts-ignore
        console.log(origin + pathname)
        this.url = origin + pathname
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
