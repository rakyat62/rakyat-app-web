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
                  hide-details
                  label="Informasi Tambahan"
      />
      <v-row class="mt-2">
        <v-col v-for="(img, i) in imagePreviews"
               :key="`img${i}`"
               cols="4"
               md="2"
               lg="2"
               class="pa-1"
        >
          <v-img :src="img"
                 class="grey lighten-4 align-end"
                 contain
                 height="80px"
          />
        </v-col>
        <v-col cols="4"
               md="2"
               lg="2"
               class="pa-1 text-center"
        >
          <div @click="$refs.inputImage.click()"
               :style="{
                 border: '2px dashed #1976d2',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 height: '80px'
               }"
          >
            <v-icon v-text="'mdi-image-plus'"
                    x-large
                    color="primary"
            />
            <input ref="inputImage"
                   @change="onInputImage"
                   :style="{display: 'none'}"
                   type="file"
                   accept="image/*;capture=camera"
                   label="Tambahkan Gambar"
            >
          </div>
        </v-col>
      </v-row>
      <v-btn :loading="loadingSubmit"
             @click="submitIncident"
             color="primary"
             class="mt-8"
             block
      >
        Kirim
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import {
  mutationCreateIncident,
  queryIncidentLabels
} from '../../../apollo/gql'
import { loadCurrentPosition, getCachedCurrentPosition } from '~/utils/location'
import { uploadFiels } from '~/utils/cloudinary'

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
      imagePreviews: [],
      inputImages: []
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
        const images = await uploadFiels(this.inputImages)
        const { data } = await this.$apollo.mutate({
          mutation: mutationCreateIncident,
          variables: {
            information: this.additionalInformation,
            lat: this.userLocation.lat,
            lng: this.userLocation.lng,
            label: this.incidentLabelId,
            images
          }
        })
        const id = data.createIncident.id
        this.$router.push(`/incidents/${id}`)
        this.loadingSubmit = false
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
    },
    onInputImage (e) {
      const files = e.target.files
      const file = files[0]

      if (file) {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.addEventListener('load', () => {
          this.imagePreviews.push(fileReader.result)
        })
        this.inputImages.push(file)
      }
    }
  }
}
</script>
