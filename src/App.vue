<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-group
          v-for="item in list"
          :key="item.title"
          v-model="item.active"
          :group="item.group"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in item.items"
            :key="subItem.title"
            @click="itemClick(subItem)"
            :to="subItem.path"
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>文章管理后台</v-toolbar-title>
    </v-app-bar>

    <v-content class="content">
      <router-view></router-view>
    </v-content>
    <v-footer
      color="primary"
      app
    >
      <span class="white--text">&copy; 2019</span>
    </v-footer>
    <Tips></Tips>
    <LoginModal/>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Tips from '@/components/Tips.vue'
import LoginModal from '@/components/login/LoginModal.vue'
import './styles/app.scss'
import { mapState } from 'vuex'
interface item {
  title: string
  path: string
  active: boolean
}
interface menu {
  action: string
  title: string
  active: boolean
  group: string
  items: item[]
}
interface iData {
  list: menu[],
  drawer?: boolean
}

export default Vue.extend({
  components: {
    Tips,
    LoginModal
  },
  data: (): iData => ({
    list: [
      {
        action: 'mdi-home',
        title: '文章',
        active: true,
        group: 'post|outline',
        items: [
          { title: '添加', path: '/post/add', active: false },
          { title: '文章', path: '/post/list', active: false },
          { title: '草稿', path: '/outline/list', active: false }
        ]
      },
      {
        action: 'mdi-tag',
        title: '分类',
        active: false,
        group: 'tag',
        items: [
          { title: '列表', path: '/tag/list', active: false }
        ]
      },
      {
        action: 'mdi-tag',
        title: '图片识别',
        active: false,
        group: 'price',
        items: [
          { title: '列表', path: '/price/list', active: false }
        ]
      }
    ],
    drawer: true
  }),
  computed: {
    activeNav (): string {
      return this.$route.path
    }
  },
  mounted () {
    console.log(this.list)
  },
  methods: {
    itemClick (subItem: item) {
      subItem.active = true
    }
  }
})
</script>
<style lang="scss">
.content {
    z-index: 1;
}
</style>
