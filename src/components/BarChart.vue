<template>
  <Bar :data="chartData" :options="finalOptions" :height="height" />
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Chart.js pluginlarini ro‘yxatdan o‘tkazish
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels)

// Propslarni olish
const props = defineProps({
  chartData: Object,
  chartOptions: Object,
  height: { type: Number, default: 350 }
})

// finalOptions ni hisoblash
const finalOptions = computed(() => ({
  ...props.chartOptions,
  plugins: {
    ...props.chartOptions?.plugins,
    datalabels: {
      color: '#fff',      // oq rang
      font: { weight: 'bold' }, // bold
      formatter(value) {
        if (value === 0) return null
        return value
      }
    }
  }
}))
</script>
