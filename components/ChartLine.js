import { Line, mixins } from 'vue-chartjs'
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes'
import { Tableau10 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau'

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    colorschemes: {
      scheme: Tableau10
    }
  }
}

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  data () {
    return {
      options
    }
  },
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
