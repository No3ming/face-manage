<template>
    <v-dialog
      v-model="loginModal.show"
      persistent
      max-width="290"
    >
      <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>重新登陆</v-toolbar-title>
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
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import md5 from 'blueimp-md5'
import { mapActions, mapState } from 'vuex'
import { onLogin } from '@/apollo'
import { gqlError } from '@/util/gqlError'

export default Vue.extend({
  name: 'login-modal',
  data: () => ({
    username: '',
    password: '',
    msg: ''
  }),
  computed: {
    ...mapState(['loginModal'])
  },
  methods: {
    async login () {
      gqlError(async () => {
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
        // @ts-ignore
        onLogin(this.$apollo, res.data.login.access_token)
        this.hideLogin()
      })
    },
    ...mapActions(['tips', 'hideLogin'])
  }
})
</script>
