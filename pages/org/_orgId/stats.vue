<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-card-text>
            <chart-line :chart-data="datacollection" />
            <div class="text-center body-1 mt-2">
              Laporan Kejadian 3 Bulan Terakhir
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="6">
        <v-card>
          <v-card-text>
            <chart-pie :chart-data="dataCountLabel" />
            <div class="text-center body-1 mt-2">
              Jumlah Kejadian
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <button @click="fillData()">
      Randomize
    </button>
  </v-container>
</template>

<script>
import ChartLine from '~/components/ChartLine'
import ChartPie from '~/components/ChartPie'

export default {
  components: {
    ChartLine,
    ChartPie
  },
  data () {
    return {
      datacollection: { labels: [], datasets: [] },
      dataCountLabel: { labels: [1, 2, 3], datasets: [{ data: [51, 95, 45] }] }
    }
  },
  mounted () {
    this.fillData()
  },
  methods: {
    fillData () {
      this.datacollection = {
        labels: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            fill: false,
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
          }, {
            label: 'Data One',
            fill: false,
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>
