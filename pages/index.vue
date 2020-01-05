<template>
  <v-container>
    <div v-if="loadingIncidentLabels" class="text-center">
      <v-progress-circular indeterminate size="70" />
    </div>
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

    <div v-if="loadingIncidents" class="text-center">
      <v-progress-circular indeterminate size="70" />
    </div>
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
          <div>
            <v-icon>
              mdi-arrow-up-bold
            </v-icon>
            16
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'

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
    async getIncidentLabels () {
      try {
        this.loadingIncidentLabels = true
        this.loadingIncidents = true
        const { data } = await this.$apollo.query({
          query: gql`{
            incidentLabels {
              id
              name
              icon
            }
            incidents {
              id
              information
              status
              label {
                name
              }
              createdBy {
                username
              }
            }
          }`
        })
        this.incidentLabels = data.incidentLabels
        this.incidents = data.incidents
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
