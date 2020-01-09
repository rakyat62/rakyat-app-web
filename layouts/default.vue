<template>
  <v-app>
    <v-app-bar dense
               fixed
               app
               clipped-left
               clipped-right
    >
      <v-toolbar-title v-text="title" @click="$router.push('/')" />
      <v-spacer />
      <!-- <v-btn @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark" icon>
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn> -->
      <v-avatar @click="drawer = !drawer"
                style="cursor: pointer"
                size="40px"
      >
        <img :src="avatarUrl" alt="avatar">
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
            <img :src="avatarUrl">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="authUser.username" />
            <v-list-item-subtitle v-text="userFullName" />
          </v-list-item-content>
        </v-list-item>

        <v-divider />
      </v-list>
      <v-list dense nav>
        <v-subheader>Organisasi Anda</v-subheader>
        <v-list-item v-for="org in authUser.organizations"
                     :key="org.id"
                     :to="`/org/${org.id}`"
                     link
        >
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

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
import gql from 'graphql-tag'
export default {
  middleware: 'auth',
  apollo: {
    authUser: {
      query: gql`{
        me {
          id
          username
          firstName
          lastName
          organizations {
            id
            name
            role
          }
        }
      }`,
      update: data => data.me
    }
  },
  data () {
    return {
      title: 'Rakyat62',
      drawer: false,
      authUser: {},
      avatarUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.svhealthcare.org%2F_%2Fmedia%2Fimages%2Fmodules%2Fphysician-directory%2Fphysicians%2Flbtavatar0473.jpg%3Fh%3D192%26la%3Den%26w%3D192&f=1&nofb=1'
    }
  },

  computed: {
    userFullName () {
      return this.authUser.firstName ? `${this.authUser.firstName} ${this.authUser.lastName}` : '(no name)'
    }
  }
}
</script>
