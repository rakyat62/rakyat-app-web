<template>
  <div>
    <GmapMap
      :center="userLocation"
      :zoom="gmapZoom"
      :options="{mapTypeControl: false, streetViewControl: false, zoomControl: false, fullscreenControl: false}"
      map-type-id="terrain"
      style="width: 100%; height: 300px"
    >
      <GmapMarker :position="userLocation" />
      <div slot="visible">
        <v-btn @click="setUserLocation"
               absolute
               bottom
               right
               fab
        >
          <v-icon>mdi-crosshairs-gps</v-icon>
        </v-btn>
      </div>
    </GmapMap>
    <v-container>
      <div>new incident {{ incidentLabelId }}</div>
      <v-textarea v-model="additionalInformation"
                  outlined
                  label="Informasi Tambahan"
      />
      <v-btn :loading="loadingSubmit"
             @click="submitIncident"
             color="primary"
             block
      >
        Kirim
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import storageKeys from '../../../constants/storageKeys'

export default {
  data () {
    return {
      userLocation: { lat: 1, lng: 1 },
      gmapZoom: 7,
      additionalInformation: '',
      loadingSubmit: false
    }
  },

  computed: {
    incidentLabelId () {
      return parseInt(this.$route.params.labelId)
    }
  },

  async created () {
    await this.$nextTick()
    this.setUserLocation()
  },

  methods: {
    setUserLocation () {
      this.userLocation.lat = parseFloat(localStorage.getItem(storageKeys.LOCATION_LAT))
      this.userLocation.lng = parseFloat(localStorage.getItem(storageKeys.LOCATION_LNG))
      this.gmapZoom = 16
    },
    async submitIncident () {
      try {
        this.loadingSubmit = true
        await this.$apollo.mutate({
          mutation: gql`mutation($information: String!, $lat: Float!, $lng: Float!, $label: Int!) {
            createIncident(input: {
              information: $information
              locationLat: $lat
              locationLng: $lng
              label: $label
            }) {
              id
              information
              locationLat
              locationLng
              createdBy {
                username
              }
            }
          }`,
          variables: {
            information: this.additionalInformation,
            lat: this.userLocation.lat,
            lng: this.userLocation.lng,
            label: this.incidentLabelId
          }
        })
        this.loadingSubmit = false
        this.$router.push('/')
      } catch (error) {
        console.error(error)
        this.loadingSubmit = false
      }
    }
  }
}
</script>
