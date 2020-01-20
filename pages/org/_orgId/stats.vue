<template>
  <v-container>
    <v-toolbar color="transparent" flat>
      <v-avatar tile>
        <img :src="organization.logoUrl">
      </v-avatar>
      <div v-text="organization.name" class="title font-weight-regular ml-5" />
    </v-toolbar>
    <v-row v-if="loadingData">
      <v-col v-for="i in 2"
             :key="`loading${i}`"
             md="6"
      >
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col md="12">
        <v-card>
          <v-card-text>
            <div class="text-center title mb-2">
              Jumlah Kejadian Tiap Hari
            </div>
            <chart-bar :chart-data="incidentsPerMonthCollection" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="6">
        <v-card>
          <v-card-text>
            <div class="text-center title mb-2">
              Jumlah Tiap Jenis Kejadian
            </div>
            <chart-pie :chart-data="totalIncidentsCollection" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { formatDate } from '../../../utils/date'
import ChartBar from '~/components/ChartBar'
import ChartPie from '~/components/ChartPie'

const queryStats = gql`query ($id: Int!) {
  organization(id: $id) {
    id
    name
    logoUrl
  }
  pieChart: organization(id: $id){
    id
    relatedLabels {
      id
      name
      incidents {
        totalCount
      }
    }
  }

  lineChart: organization(id: $id) {
    id
    relatedLabels {
      id
      name
      incidents {
        stats(groupBy: "DATE(createdAt)") {
          count
          fieldGroup
        }
      }
    }
  }
}`

export default {
  components: {
    ChartBar,
    ChartPie
  },

  data () {
    return {
      organization: {},
      incidentsPerMonthCollection: { labels: [], datasets: [] },
      totalIncidentsCollection: { labels: [], datasets: [{ data: [] }] },
      loadingData: false
    }
  },

  computed: {
    organizationId () {
      return parseInt(this.$route.params.orgId)
    }
  },

  created () {
    this.getDataStats()
  },

  methods: {
    async getDataStats () {
      try {
        this.loadingData = true
        const { data } = await this.$apollo.query({
          query: queryStats,
          variables: {
            id: this.organizationId
          },
          fetchPolicy: 'network-only'
        })
        this.organization = data.organization
        this.totalIncidentsCollection = {
          labels: data.pieChart.relatedLabels.map(l => l.name),
          datasets: [{ data: data.pieChart.relatedLabels.map(l => l.incidents.totalCount) }]
        }
        const lineLabels = data.lineChart.relatedLabels.reduce((acc, val) => ([...acc, ...val.incidents.stats.map(s => s.fieldGroup)]), [])
        const normalizedLabels = lineLabels.reduce((acc, val) => acc.includes(val) ? acc : [...acc, val], []).sort()
        this.incidentsPerMonthCollection = {
          labels: normalizedLabels.map(l => formatDate(l, 'DD MMM YYYY')),
          datasets: data.lineChart.relatedLabels.map(label => ({
            label: label.name,
            fill: false,
            data: normalizedLabels.map((l) => {
              const findStat = label.incidents.stats.find(s => s.fieldGroup === l)
              return findStat ? findStat.count : 0
            })
          }))
        }
        this.loadingData = false
      } catch (error) {
        console.error(error)
        this.loadingData = false
      }
    }
  }
}
</script>
