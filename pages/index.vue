<template>
  <v-container>
    <v-row v-if="loadingIncidentLabels" class="mt-1">
      <v-col v-for="i in 3"
             :key="`loadinglabel${i}`"
             cols="4"
             class="py-5"
      >
        <v-skeleton-loader type="avatar" tile />
      </v-col>
    </v-row>
    <v-row v-else class="mt-1">
      <v-col v-for="label in incidentLabels"
             :key="label.id"
             cols="4"
             class="text-center my-0 py-0"
      >
        <v-btn :style="{ borderWidth: '2px', borderRadius: '25%' }"
               :to="`/new/incident/${label.id}`"
               icon
               large
               fab
        >
          <v-icon v-text="label.icon" large />
        </v-btn>
        <p>{{ label.name }}</p>
      </v-col>
    </v-row>

    <template v-if="loadingIncidents">
      <v-skeleton-loader v-for="i in 4"
                         :key="`loadinginc${i}`"
                         type="card-heading, card"
                         class="mt-4"
      />
    </template>
    <template v-else>
      <v-card v-for="incident in incidents"
              :key="incident.id"
              class="mt-4"
      >
        <div class="body-1 px-4 py-2">
          {{ incident.createdBy.username }}
        </div>
        <v-img class="white--text align-end"
               height="200px"
               src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        >
          <v-row class="px-4">
            <v-col class="title">
              {{ incident.label.name }}
            </v-col>
            <v-col cols="auto">
              <v-chip color="white"
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
              </v-chip>
            </v-col>
          </v-row>
        </v-img>

        <v-card-text class="text--primary">
          <div class="caption">
            <!-- <v-icon>
              mdi-arrow-up-bold
            </v-icon>
            16 -->
            {{ formatDate(incident.createdAt, 'relative') }}
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { formatDate } from '~/utils/date'

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
          query: gql`{
            incidents {
              id
              status
              label {
                name
              }
              createdBy {
                username
              }
              createdAt
            }
            incidentLabels {
              id
              name
              icon
            }
          }`,
          fetchPolicy: 'network-only'
        })
        this.incidentLabels = data.incidentLabels
        this.incidents = data.incidents.sort((first, second) => (first.createdAt > second.createdAt) ? -1 : ((second.createdAt > first.createdAt) ? 1 : 0))
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
