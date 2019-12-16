<template>
  <v-app dark>
    <v-app-bar dense
               fixed
               app
               clipped-left
               clipped-right
    >
      <v-toolbar-title v-text="title" />
      <v-btn icon>
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark"
        icon
      >
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer inset>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: 'Vuetify.js'
    }
  }
}
</script>
