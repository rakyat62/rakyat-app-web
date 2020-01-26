<template>
  <v-container>
    <v-row justify="center">
      <v-col md="6">
        <v-row v-if="loadingIncidentLabels" class="mt-1">
          <v-col v-for="i in 3"
                 :key="`loadinglabel${i}`"
                 cols="4"
                 class="py-5"
          >
            <v-skeleton-loader type="avatar" tile />
          </v-col>
        </v-row>
        <template v-else>
          <v-subheader>laporkan Kejadian</v-subheader>
          <v-row class="mt-1">
            <v-col v-for="label in incidentLabels"
                   :key="label.id"
                   cols="4"
                   class="text-center my-0 py-0"
            >
              <v-btn :style="{ borderWidth: '2px', borderRadius: '25%' }"
                     :to="`/incidents/new/${label.id}`"
                     large
                     depressed
                     color="primary"
                     fab
              >
                <v-icon v-text="label.icon" large />
              </v-btn>
              <p>{{ label.name }}</p>
            </v-col>
          </v-row>
        </template>

        <v-divider class="mt-6" />

        <template v-if="loadingIncidents">
          <v-skeleton-loader v-for="i in 4"
                             :key="`loadinginc${i}`"
                             type="card-heading, card"
                             class="mt-4"
          />
        </template>
        <template v-else>
          <v-subheader>
            Akhir-akhir ini dilaporkan
          </v-subheader>

          <v-card v-for="incident in incidents"
                  :key="incident.id"
                  class="mb-4"
          >
            <div class="caption px-4 py-2">
              {{ formatDate(incident.createdAt, 'relative') }}
            </div>
            <v-carousel :show-arrows="false"
                        v-if="incident.images.length > 0"
                        height="200px"
                        hide-delimiter-background
            >
              <v-carousel-item v-for="(img,i) in incident.images"
                               :key="i"
                               :src="img"
              />
            </v-carousel>
            <v-img v-else
                   class="white--text align-end"
                   height="200px"
                   src="https://user-images.githubusercontent.com/21119252/73139764-eab81180-40a3-11ea-969f-2d03dacef24b.png"
            />
            <v-row class="px-4">
              <v-col :style="{cursor: 'pointer'}"
                     @click="$router.push(`/incidents/${incident.id}`)"
                     class="title pb-0"
              >
                <v-icon v-text="incident.label.icon" />
                {{ incident.label.name }}
              </v-col>
              <v-col cols="auto">
                <!-- <v-chip color="white"
                        text-color="error"
                        small
                >
                  belum disakljsd
                  <v-icon right
                          color="error"
                          small
                  >
                    mdi-account
                  </v-icon>
                </v-chip> -->
              </v-col>
            </v-row>

            <v-card-text class="text--primary pt-0">
              <div class="caption">
                dilaporkan oleh
                <span v-text="incident.createdBy.username" class="font-weight-medium" />
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { formatDate } from '~/utils/date'

const queryIncidents = gql`{
  incidents {
    nodes (
      limit: 20
      orderBy: { field: createdAt, direction: DESC }
    ) {
      id
      status
      images
      label {
        id
        name
        icon
      }
      createdBy {
        id
        username
      }
      createdAt
    }
  }
  incidentLabels {
    id
    name
    icon
  }
}`

export default {
  data () {
    return {
      incidentLabels: [],
      loadingIncidentLabels: false,
      incidents: [],
      loadingIncidents: false
    }
  },

  created () {
    this.getIncidentLabels()
  },

  methods: {
    formatDate,
    async getIncidentLabels () {
      try {
        this.loadingIncidentLabels = true
        this.loadingIncidents = true
        const { data } = await this.$apollo.query({
          query: queryIncidents,
          fetchPolicy: 'network-only'
        })
        this.incidentLabels = data.incidentLabels
        this.incidents = data.incidents.nodes.sort((first, second) => (first.createdAt > second.createdAt) ? -1 : ((second.createdAt > first.createdAt) ? 1 : 0))
        this.loadingIncidentLabels = false
        this.loadingIncidents = false
      } catch (error) {
        console.error(error)
        this.loadingIncidentLabels = false
        this.loadingIncidents = false
      }
    }
  }
}
</script>
