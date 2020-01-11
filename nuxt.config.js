import path from 'path'
import fs from 'fs'
import colors from 'vuetify/es5/util/colors'

require('dotenv').config()

export default {
  mode: 'spa',
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: colors.blue.darken2 },
  css: [
  ],
  plugins: [
    '~/plugins/location.client',
    '~/plugins/google-maps'
  ],
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    ['@nuxtjs/eslint-module', { fix: true }],
    '@nuxtjs/vuetify'
  ],
  modules: [
    '@nuxtjs/apollo'
  ],
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  },
  apollo: {
    clientConfigs: {
      default: '~/apollo/client-configs/default.js'
    }
  },
  build: {
    extend (config, ctx) {
    }
  },
  env: {
    graphqlApiUrl: process.env.GRAPHQL_API_URL
  },
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
    // }
  }
}
