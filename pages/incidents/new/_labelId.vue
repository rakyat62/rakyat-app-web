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
        <v-btn @click="loadUserLocation"
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
      <v-row>
        <v-col>
          Laporkan
          <br>
          <v-chip label
                  outlined
                  large
          >
            <v-icon v-text="selectedIncident.icon" left />
            {{ selectedIncident.name }}
          </v-chip>
        </v-col>
      </v-row>
      <v-textarea v-model="additionalInformation"
                  outlined
                  label="Informasi Tambahan"
      />
      <v-file-input v-model="inputImage"
                    accept="image/png,image/jpeg"
                    multiple
                    prepend-icon="mdi-camera"
                    label="Tambahkan Gambar"
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
import { mutationCreateIncident, queryIncidentLabels } from '../../../apollo/gql'
import { loadCurrentPosition, getCachedCurrentPosition } from '~/utils/location'

export default {
  apollo: {
    incidentLabels: {
      query: queryIncidentLabels,
      update: data => data.incidentLabels
    }
  },

  data () {
    const { lat, lng } = getCachedCurrentPosition()

    return {
      userLocation: { lat, lng },
      incidentLabels: [],
      loadingLocation: false,
      gmapZoom: 7,
      additionalInformation: '',
      loadingSubmit: false,
      inputImage: null
    }
  },

  computed: {
    incidentLabelId () {
      return parseInt(this.$route.params.labelId)
    },
    selectedIncident () {
      return this.incidentLabels.find(i => i.id === this.incidentLabelId) || {}
    }
  },

  async created () {
    await this.$nextTick()
    this.gmapZoom = 16
  },

  methods: {
    async submitIncident () {
      try {
        this.loadingSubmit = true
        await this.$apollo.mutate({
          mutation: mutationCreateIncident,
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
    },
    async loadUserLocation () {
      try {
        this.loadingLocation = true
        const { lat, lng } = await loadCurrentPosition()
        this.userLocation.lat = lat
        this.userLocation.lng = lng
        this.loadingLocation = false
      } catch (error) {
        console.error(error)
        this.loadingLocation = false
      }
    }
  }
}
</script>
