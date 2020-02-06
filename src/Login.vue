<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Login"
                    name="login"
                    v-model="username"
                    prepend-icon="mdi-account"
                    type="text"
                  />

                  <v-text-field
                    id="password"
                    v-model="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <Tips :msg="msg" ref="tips"></Tips>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import md5 from 'blueimp-md5'
import gql from 'graphql-tag'
import Tips from '@/components/Tips.vue'
import { onLogin } from './apollo'

export default Vue.extend({
  props: {
    source: String
  },
  components: {
    Tips
  },
  data: () => {
    return {
      username: '',
      password: '',
      msg: ''
    }
  },
  methods: {
    onTips (msg: string) {
      this.msg = msg
      let tips: any = this.$refs.tips
      tips.dialog = true
    },
    async login () {
      try {
        const password = md5(this.password)
        // @ts-ignore
        const res = await this.$apollo.query({
          query: gql`query ($user: AuthInput!){
              login(user: $user){
                access_token
              }
            }
          `,
          variables: {
            user: {
              username: this.username,
              password
            }
          }
        })
        console.log(res.data)
        // @ts-ignore
        onLogin(this.$apollo, res.data.login.access_token)
        // localStorage.setItem('Token', res.access_token)
        location.replace('/')
      } catch (e) {
        this.onTips(e.msg)
      }
    }
  }
})
</script>
