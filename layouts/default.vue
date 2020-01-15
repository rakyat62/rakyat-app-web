<template>
  <v-app>
    <v-app-bar dense
               fixed
               app
               clipped-left
               clipped-right
    >
      <v-toolbar-title @click="$router.push('/')">
        <img :style="{ height: '36px'}"
             src="~assets/logo-rakyat62.png"
             alt="avatar"
        >
      </v-toolbar-title>
      <v-spacer />
      <!-- <v-btn @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark" icon>
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn> -->
      <v-avatar @click="drawer = !drawer"
                style="cursor: pointer"
                size="40px"
      >
        <img :src="authUser.avatarUrl" alt="avatar">
      </v-avatar>
    </v-app-bar>

    <v-content>
      <nuxt />
    </v-content>

    <v-navigation-drawer v-model="drawer"
                         color="primary"
                         temporary
                         fixed
                         right
                         dark
    >
      <v-list dense class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar tile>
            <img :src="authUser.avatarUrl">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="authUser.username" />
            <v-list-item-subtitle v-text="userFullName" />
          </v-list-item-content>
        </v-list-item>

        <v-divider />
      </v-list>
      <v-list dense nav>
        <v-subheader>
          Organisasi Anda
          <!-- <v-spacer />
          <v-btn text icon>
            <v-icon v-text="'mdi-plus'" />
          </v-btn> -->
        </v-subheader>
        <v-list-item v-for="org in authUser.organizations"
                     :key="org.id"
                     :to="`/org/${org.id}`"
                     link
        >
          <v-list-item-avatar tile>
            <img :src="org.logoUrl">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="org.name" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer inset>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { queryMe } from '~/apollo/gql'

export default {
  middleware: 'auth',
  apollo: {
    authUser: {
      query: queryMe,
      update: data => data.me
    }
  },
  data () {
    return {
      title: 'Rakyat62',
      drawer: false,
      authUser: {}
    }
  },

  computed: {
    userFullName () {
      return this.authUser.firstName ? `${this.authUser.firstName} ${this.authUser.lastName}` : '(no name)'
    }
  }
}
</script>
