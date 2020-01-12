<template>
  <v-container>
    <v-row>
      <v-col class="display-1">
        {{ incident.label ? incident.label.name : '-' }} <span class="grey--text">{{ `#${incident.id}` }}</span>
      </v-col>
      <v-col cols="auto">
        <v-btn :style="{textTransform:'capitalize'}"
               color="primary"
        >
          Update Riwayat
        </v-btn>
      </v-col>
    </v-row>
    <v-chip :text-color="`${$vuetify.theme.dark ? 'white' : 'black'}`"
            :color="chipStatus.color"
            outlined
            label
            class="white"
            small
    >
      {{ chipStatus.text }}
      <v-icon v-text="chipStatus.icon"
              :color="chipStatus.color"
              right
              small
      />
    </v-chip>
    <p v-text="incident.information" />
    <v-row>
      <v-col v-for="i in 6"
             :key="`img_incident_${i}`"
             cols="4"
             md="2"
             lg="2"
             class="pa-1"
      >
        <v-img :class="`grey ${ $vuetify.theme.dark ? 'darken' : 'lighten'}-3`"
               class="align-end"
               contain
               height="100px"
               src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        />
      </v-col>
    </v-row>

    <v-timeline align-top dense>
      <template v-for="(history, index) in incidentHistories">
        <v-timeline-item v-if="history.type === 'COMMENT'"
                         :key="`tl_${index}`"
                         large
        >
          <template v-slot:icon>
            <v-avatar>
              <img :src="avaUrlUser">
            </v-avatar>
          </template>
          <template v-slot:opposite>
            <span>Tus eu perfecto</span>
          </template>
          <v-card class="elevation-2">
            <v-card-title class="py-2">
              <span v-text="history.createdBy.username" class="title" />
              <span v-text="formatDate(history.createdAt, 'relative')" class="body-2 ml-4" />
            </v-card-title>
            <v-card-text v-text="history.content" />
          </v-card>
        </v-timeline-item>

        <v-card v-if="history.type === 'FOLLOW_UP'"
                :key="`tl_${index}`"
                class="elevation-2 mb-6"
        >
          <v-card-title class="py-2">
            <span class="title">Update dari {{ history.createdBy.username }}</span>
            <span v-text="formatDate(history.createdAt, 'relative')" class="body-2 ml-4" />
          </v-card-title>
          <v-card-text>
            <p v-text="history.content" class="mt-2" />
            <v-row>
              <v-col v-for="i in 6"
                     :key="`img_incident_${i}`"
                     cols="4"
                     md="2"
                     lg="2"
                     class="pa-1"
              >
                <v-img class="grey lighten-4 align-end"
                       contain
                       height="120px"
                       src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
    </v-timeline>
    <v-divider />

    <v-card class="mt-6 pa-4" color="white">
      <v-textarea outlined
                  hide-details
                  label="Tulis Komentar"
      />
      <v-btn v-text="'Kirim'"
             color="primary"
             class="mt-2"
      />
    </v-card>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { formatDate } from '~/utils/date'

const queryIncident = gql`query($id: Int!) {
  incident(id: $id) {
    id
    information
    status
    histories {
      content
      type
      createdAt
      createdBy {
        username
      }
    }
    label {
      name
    }
    createdBy {
      username
    }
  }
}`

const incidentChipStatus = {
  NEW: 'new',
  ON_PROGRESS: 'on_progress',
  DONE: 'done'
}

export default {
  data () {
    return {
      avaUrlUser: 'https://avatars0.githubusercontent.com/u/21119252?s=460&v=4',
      avaUrlOrg: 'https://avatars0.githubusercontent.com/u/54971300?s=200&v=4',
      loadingIncident: false,
      incident: {}
    }
  },

  computed: {
    incidentId () {
      return parseInt(this.$route.params.incidentId)
    },
    incidentHistories () {
      return this.incident.histories || []
    },
    incidentHistoriesFollowUp () {
      return this.incidentHistories.filter(h => h.type === 'FOLLOW_UP')
    },
    calculatedStatus () {
      if (this.incident.status === 'CLOSED') {
        return incidentChipStatus.DONE
      } else if (this.incidentHistoriesFollowUp.length > 0) {
        return incidentChipStatus.ON_PROGRESS
      } else {
        return incidentChipStatus.NEW
      }
    },
    chipStatus () {
      switch (this.calculatedStatus) {
        case incidentChipStatus.DONE:
          return { color: 'success', icon: 'mdi-check-circle', text: 'Selesai' }
        case incidentChipStatus.ON_PROGRESS:
          return { color: 'orange', icon: 'mdi-clock', text: 'Sedang diproses' }
        case incidentChipStatus.NEW:
        default:
          return { color: 'error', icon: 'mdi-close-circle', text: 'Belum ditindak' }
      }
    }
  },

  created () {
    this.getDataIncident()
  },

  methods: {
    formatDate,
    async getDataIncident () {
      try {
        this.loadingIncident = true
        const { data } = await this.$apollo.query({
          query: queryIncident,
          variables: {
            id: this.incidentId
          }
        })
        this.incident = data.incident
        this.loadingIncident = false
      } catch (error) {
        this.loadingIncident = false
        console.error(error)
      }
    }
  }
}
</script>
