import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.gmapKey,
    libraries: ['places', 'visualization']
  }
})

Vue.component('gmap-cluster', VueGoogleMaps.Cluster)
