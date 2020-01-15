<template>
  <v-container>
    <template v-if="loadingIncident">
      <v-row>
        <v-col>
          <v-skeleton-loader type="heading" />
        </v-col>
        <v-col cols="auto">
          <v-skeleton-loader type="button" />
        </v-col>
      </v-row>
      <v-skeleton-loader type="chip" />
      <v-skeleton-loader type="sentences" class="mt-4" />
      <v-skeleton-loader v-for="i in 4"
                         :key="`loadingcind${i}`"
                         type="list-item-avatar-three-line"
                         class="mt-5"
      />
    </template>
    <template v-else>
      <v-row>
        <v-col class="display-1">
          {{ incident.label ? incident.label.name : '-' }} <span class="grey--text">{{ `#${incident.id}` }}</span>
        </v-col>
        <v-col cols="auto">
          <v-btn :style="{textTransform:'capitalize'}"
                 v-if="userOrganizationsRelatedWithIncident.length > 0"
                 @click.stop="dialogFollowUp = true"
                 color="primary"
          >
            Update Tindak Lanjut
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

      <v-divider class="mt-5" />
      <v-timeline align-top dense>
        <template v-for="(history, index) in incidentHistories">
          <v-timeline-item v-if="history.type === 'COMMENT'"
                           :key="`tl_${index}`"
                           large
          >
            <template v-slot:icon>
              <v-avatar>
                <img :src="history.createdBy.avatarUrl">
              </v-avatar>
            </template>
            <v-card class="elevation-2">
              <v-card-title class="py-2">
                <span v-text="history.createdBy.username" class="body-1" />
                <span v-text="formatDate(history.createdAt, 'relative')" class="body-2 ml-4" />
              </v-card-title>
              <v-card-text>
                <p v-text="history.content" class="body-1" />
              </v-card-text>
            </v-card>
          </v-timeline-item>

          <v-card v-if="history.type === 'FOLLOW_UP'"
                  :key="`tl_${index}`"
                  class="elevation-2 mb-6"
          >
            <v-card-title class="py-2">
              <span class="body-1">Update dari {{ history.createdBy.username }}</span>
              <span v-text="formatDate(history.createdAt, 'relative')" class="body-2 ml-4" />
            </v-card-title>
            <v-card-text>
              <p v-text="history.content" class="body-1 mt-2" />
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
        <v-textarea v-model="comment"
                    auto-grow
                    outlined
                    hide-details
                    label="Tulis Komentar"
        />
        <v-btn v-text="'Kirim'"
               :loading="loadingUpdateHistory"
               @click="sendUpdateHistory('COMMENT')"
               :disabled="comment.length < 1"
               color="primary"
               class="mt-2"
        />
      </v-card>

      <v-dialog v-model="dialogFollowUp" max-width="500">
        <v-card>
          <v-card-title class="title grey lighten-2">
            Update Tindak Lanjut
          </v-card-title>

          <v-card-text class="mt-5">
            <v-textarea v-model="inputContentFollowUp"
                        :label="`Update Terkini ${incident.label.name} #${incident.id}`"
                        auto-grow
                        outlined
                        hide-details
            />
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn @click="sendUpdateHistory('FOLLOW_UP')"
                   :disabled="inputContentFollowUp.length < 1"
                   :loading="loadingUpdateHistory"
                   color="primary"
            >
              Kirim
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { formatDate } from '~/utils/date'
import { queryMe } from '~/apollo/gql'

const queryIncident = gql`query($id: Int!) {
  incident(id: $id) {
    id
    information
    status
    histories {
      id
      content
      type
      createdAt
      createdBy {
        id
        username
        avatarUrl
      }
    }
    label {
      id
      name
      relatedOrganizations {
        id
        name
        logoUrl
      }
    }
    createdBy {
      id
      username
      avatarUrl
    }
  }
}`

const mutationSendComment = gql`mutation($content: String, $incidentId: Int!, $type: IncidentHistoryType!) {
  addIncidentHistory(input: {
    content: $content
    type: $type
    incidentId: $incidentId
  }) {
    id
    content
  }
}`

const incidentChipStatus = {
  NEW: 'new',
  ON_PROGRESS: 'on_progress',
  DONE: 'done'
}

export default {
  apollo: {
    authUser: {
      query: queryMe,
      update: data => data.me
    }
  },
  data () {
    return {
      loadingIncident: false,
      incident: {},
      loadingUpdateHistory: false,
      comment: '',
      dialogFollowUp: false,
      inputContentFollowUp: ''
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
    },
    relatedOrganizations () {
      return this.incident.label.relatedOrganizations || []
    },
    userOrganizationsRelatedWithIncident () {
      return this.authUser.organizations.filter(iOrg => this.relatedOrganizations.some(uOrg => uOrg.id === iOrg.id))
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
          },
          fetchPolicy: 'network-only'
        })
        this.incident = data.incident
        this.loadingIncident = false
      } catch (error) {
        this.loadingIncident = false
        console.error(error)
      }
    },
    async sendUpdateHistory (type) {
      const variables = {
        content: type === 'COMMENT' ? this.comment : this.inputContentFollowUp,
        incidentId: this.incidentId,
        type
      }

      try {
        this.loadingUpdateHistory = true
        await this.$apollo.mutate({
          mutation: mutationSendComment,
          variables
        })
        this.comment = ''
        this.inputContentFollowUp = ''
        this.getDataIncident()
        this.dialogFollowUp = false
        this.loadingUpdateHistory = false
      } catch (error) {
        console.error(error)
        this.loadingUpdateHistory = false
      }
    }
  }
}
</script>
