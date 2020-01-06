<template>
  <v-container :style="{ paddingTop: '100px' }">
    <v-row justify="center">
      <v-col md="4">
        <v-card>
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab v-text="'Login'" />
            <v-tab v-text="'Buat Akun'" />
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card-text>
                <div class="headline text-center mb-4">
                  Login
                </div>
                <v-text-field v-model="username"
                              dense
                              label="Username"
                              outlined
                />
                <v-text-field v-model="password"
                              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPassword ? 'text' : 'password'"
                              @click:append="showPassword = !showPassword"
                              dense
                              label="Password"
                              outlined
                />
                <v-btn v-text="'Login'"
                       :loading="loadingSubmit"
                       @click="onClickLogin"
                       block
                       color="primary"
                />
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text>
                <div class="headline text-center mb-4">
                  Buat Akun
                </div>
                <v-text-field v-model="username"
                              dense
                              label="Username"
                              outlined
                />
                <v-row>
                  <v-col>
                    <v-text-field v-model="firstName"
                                  dense
                                  label="Nama Depan"
                                  outlined
                    />
                  </v-col>
                  <v-col>
                    <v-text-field v-model="lastName"
                                  dense
                                  label="Nama Belakang"
                                  outlined
                    />
                  </v-col>
                </v-row>
                <v-text-field v-model="email"
                              dense
                              label="Email"
                              outlined
                />
                <v-text-field v-model="password"
                              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPassword ? 'text' : 'password'"
                              @click:append="showPassword = !showPassword"
                              dense
                              label="Password"
                              outlined
                />
                <v-btn v-text="'Buat Akun'"
                       :loading="loadingSubmit"
                       @click="onClickCreateAccount"
                       block
                       color="primary"
                />
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mutationLogin } from '~/apollo/gql'
import storageKeys from '~/constants/storageKeys'

export default {
  layout: 'clean',
  data () {
    return {
      tab: 0,
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      loadingSubmit: false,
      showPassword: false
    }
  },

  methods: {
    async onClickLogin () {
      try {
        this.loadingSubmit = true
        const { data } = await this.$apollo.mutate({
          mutation: mutationLogin,
          variables: {
            username: this.username,
            password: this.password
          }
        })
        localStorage.setItem(storageKeys.AUTH_TOKEN, data.login.token)
        this.$router.replace('/')
        this.loadingSubmit = false
      } catch (error) {
        console.error(error)
        this.loadingSubmit = false
      }
    },
    onClickCreateAccount () {

    }
  }
}
</script>
