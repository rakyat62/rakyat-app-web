<template>
  <div>
    <v-navigation-drawer class="grey d-none d-md-flex d-lg-flex"
                         dark
                         permanent
                         fixed
                         app
                         clipped
                         width="40%"
    >
      <GmapMap ref="map"
               :center="mapCenter"
               :zoom="16"
               :options="{mapTypeControl: false, streetViewControl: false, zoomControl: false, fullscreenControl: false}"
               map-type-id="terrain"
               style="width: 100%; height: 100%"
      >
        <GmapMarker v-for="incident in incidents"
                    :key="`mapmar${incident.id}`"
                    :position="{lat: incident.locationLat, lng: incident.locationLng}"
        />
      </GmapMap>
    </v-navigation-drawer>
    <v-container>
      <v-skeleton-loader v-if="loadingOrganization"
                         type="list-item-avatar, actions"
                         class="mb-5"
      />
      <v-toolbar v-else
                 :extension-height="70"
                 class="mb-5"
                 flat
      >
        <v-avatar tile>
          <img :src="avatarUrl">
        </v-avatar>
        <div v-text="organization.name" class="title font-weight-regular ml-5" />

        <template #extension>
          <v-row>
            <v-col />
            <v-col>
              <v-select :items="filterStatusItems"
                        v-model="filterStatus"
                        @input="getDataIncidents"
                        label="Status"
                        dense
                        outlined
                        hide-details
                        prepend-icon="mdi-filter"
              />
            </v-col>
            <v-col>
              <v-select :items="filterLabelItems"
                        v-model="filterLabels"
                        @input="getDataIncidents"
                        item-text="name"
                        item-value="id"
                        label="Jenis kejadian"
                        dense
                        outlined
                        hide-details
                        multiple
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    @click="toggleSelectAllLabels"
                    ripple
                  >
                    <v-list-item-action>
                      <v-icon :color="filterLabels.length > 0 ? 'indigo darken-4' : ''">
                        {{ iconSelectAllLabels }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Semua Kejadian</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="my-1" />
                </template>
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0" small>
                    <span>{{ filterLabels.length === filterLabelItems.length ? 'Semua' : filterLabels.length }} jenis dipilih</span>
                  </v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </template>
      </v-toolbar>

      <template v-if="loadingIncidents">
        <v-skeleton-loader v-for="i in 4"
                           :key="`loadingcind${i}`"
                           type="list-item-avatar-three-line"
                           class="mb-5"
        />
      </template>
      <template v-else>
        <v-card v-for="incident in incidents"
                :key="`listinc${incident.id}`"
                class="mb-3"
                outlined
        >
          <v-list two-line>
            <v-list-item>
              <v-list-item-action>
                <v-list-item-action-text :style="{width: '100%'}">
                  <v-icon color="error">
                    mdi-close-circle
                  </v-icon>
                </v-list-item-action-text>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="subtitle-1">
                  {{ `#${incident.id}` }}
                  <span v-text="incident.label.name" class="font-weight-medium" />
                </v-list-item-title>
                <v-list-item-subtitle class="caption">
                  <span v-text="formatDate(incident.createdAt, 'relative')" class="font-weight-medium" />
                  oleh
                  <span v-text="incident.createdBy.username" class="font-weight-medium" />
                </v-list-item-subtitle>
                <v-list-item-subtitle v-text="incident.information" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </template>
    </v-container>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { getCachedCurrentPosition } from '../../utils/location'
import { formatDate } from '~/utils/date'

const queryOrganization = gql`query($id: Int!) {
  organization(id: $id) {
    id
    name
    description
    relatedLabels {
      id
      name

    }
    members {
      username
    }
  }
}`

const queryIncidents = gql`query($status: IncidentStatus!, $labels: [Int!]) {
  incidents(status: $status, labels: $labels) {
    id
    information
    locationLat
    locationLng
    status
    createdAt
    label {
      name
    }
    createdBy {
      username
    }
  }
}`

export default {
  data () {
    const { lat, lng } = getCachedCurrentPosition()

    return {
      avatarUrl: 'https://avatars0.githubusercontent.com/u/54971300?s=200&v=4', // FIXME: hardcode
      organization: {},
      incidents: [],
      filterStatusItems: ['OPEN', 'CLOSED'],
      filterStatus: 'OPEN',
      filterLabels: [],
      loadingOrganization: false,
      loadingIncidents: false,
      mapCenter: { lat, lng }
    }
  },

  computed: {
    organizationId () {
      return parseInt(this.$route.params.orgId)
    },
    filterLabelItems () {
      return this.organization.relatedLabels || []
    },
    selectedAllLabels () {
      return this.filterLabels.length === this.filterLabelItems.length
    },
    selectedSomeLabels () {
      return this.filterLabels.length > 0 && !this.selectedAllLabels
    },
    iconSelectAllLabels () {
      if (this.selectedAllLabels) { return 'mdi-close-box' }
      if (this.selectedSomeLabels) { return 'mdi-minus-box' }
      return 'mdi-checkbox-blank-outline'
    }
  },

  watch: {
    incidents (markers) {
      if (markers.length > 2) {
        const bounds = new google.maps.LatLngBounds() // eslint-disable-line no-undef
        for (const m of markers) {
          bounds.extend({ lat: m.locationLat, lng: m.locationLng })
        }
        this.$refs.map.fitBounds(bounds)
      }
    }
  },

  async created () {
    this.loadingOrganization = true
    this.loadingIncidents = true
    await this.getDataOrganization()
    await this.getDataIncidents()
  },

  methods: {
    formatDate,
    toggleSelectAllLabels () {
      this.$nextTick(() => {
        if (this.selectedAllLabels) {
          this.filterLabels = []
        } else {
          this.filterLabels = this.filterLabelItems.map(i => i.id)
        }
        this.getDataIncidents()
      })
    },
    async getDataOrganization () {
      try {
        this.loadingOrganization = true
        const { data } = await this.$apollo.query({
          query: queryOrganization,
          variables: {
            id: this.organizationId
          }
        })
        this.organization = data.organization
        this.toggleSelectAllLabels()
        this.loadingOrganization = false
      } catch (error) {
        this.loadingOrganization = false
        console.error(error)
      }
    },
    async getDataIncidents () {
      try {
        this.loadingIncidents = true
        const { data } = await this.$apollo.query({
          query: queryIncidents,
          variables: {
            status: this.filterStatus,
            labels: this.filterLabels
          }
        })
        this.incidents = data.incidents
        this.loadingIncidents = false
      } catch (error) {
        this.loadingIncidents = false
        console.error(error)
      }
    }
  }

}
</script>
