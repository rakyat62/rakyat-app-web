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
        <v-card :loading="loadingLineChart">
          <v-card-text>
            <v-row justify="center"
                   align="center"
                   class="text-center title mb-2"
            >
              <v-col v-text="'Kejadian'" cols="auto" />
              <v-col :style="{width: '80px'}" cols="auto">
                <v-select v-model="lastNDays"
                          :items="[7,30,60]"
                />
              </v-col>
              <v-col v-text="'Hari Terakhir'" cols="auto" />
            </v-row>
            <chart-bar :chart-data="incidentsPerMonthCollection" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="6">
        <v-card>
          <v-card-text>
            <div class="text-center title mb-2">
              Banyak Tiap Jenis Kejadian
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
import dayjs from 'dayjs'
import { formatDate } from '../../../utils/date'
import ChartBar from '~/components/ChartBar'
import ChartPie from '~/components/ChartPie'

const queryStats = gql`query ($id: Int!, $dateStart: DateTime) {
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
      incidents (dateStart: $dateStart) {
        stats(groupBy: "DATE(createdAt)") {
          count
          fieldGroup
        }
      }
    }
  }
}`

const queryUpdateLineChart = gql`query ($id: Int!, $dateStart: DateTime) {
  organization(id: $id) {
    id
    relatedLabels {
      id
      name
      incidents (dateStart: $dateStart) {
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
      loadingData: false,
      loadingLineChart: false,
      lastNDays: 30
    }
  },

  computed: {
    organizationId () {
      return parseInt(this.$route.params.orgId)
    },
    dateStartLineChart () {
      return dayjs().add(-this.lastNDays - 1, 'days').format('YYYY-MM-DD')
    }
  },

  watch: {
    dateStartLineChart () {
      this.fetchDataLineChart()
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
            id: this.organizationId,
            dateStart: this.dateStartLineChart

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
    },
    async fetchDataLineChart () {
      try {
        this.loadingLineChart = true
        const { data } = await this.$apollo.query({
          query: queryUpdateLineChart,
          variables: {
            id: this.organizationId,
            dateStart: this.dateStartLineChart
          },
          fetchPolicy: 'network-only'
        })

        const labels = data.organization.relatedLabels.reduce((acc, val) => ([...acc, ...val.incidents.stats.map(s => s.fieldGroup)]), [])
        const normalizedLabels = labels.reduce((acc, val) => acc.includes(val) ? acc : [...acc, val], []).sort()
        this.incidentsPerMonthCollection = {
          labels: normalizedLabels.map(l => formatDate(l, 'DD MMM YYYY')),
          datasets: data.organization.relatedLabels.map(label => ({
            label: label.name,
            fill: false,
            data: normalizedLabels.map((l) => {
              const findStat = label.incidents.stats.find(s => s.fieldGroup === l)
              return findStat ? findStat.count : 0
            })
          }))
        }

        this.loadingLineChart = false
      } catch (error) {
        console.error(error)
        this.loadingLineChart = false
      }
    }
  }
}
</script>
