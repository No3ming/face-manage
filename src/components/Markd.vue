<template>
  <mavon-editor :value.sync="value" :tabSize="4" @imgAdd="onImgAdd" @change="change" @save="onSave" ref="mavon"/>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import gql from 'graphql-tag'
import { computeMD5 } from '@/util/computeMD5'

export default Vue.extend({
  name: 'markd',
  props: {
    value: String
  },
  methods: {
    async onImgAdd (pos: any, file: any) {
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
        update: (data: any) => data.getPut,
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
        this.$refs.mavon.$img2Url(pos, origin + pathname)
      })
    },
    change (value: any) {
      this.$emit('input', value)
    },
    onSave (value: any) {
      this.$emit('input', value)
      setTimeout(() => {
        this.$emit('on-save', value)
      })
    }
  }
})
</script>
<style lang="scss">
.markdown-context {
    flex: 1;
}
.markdown-body {
    height: 80vh;
}

.v-application code {
  box-shadow: none;
}
</style>
