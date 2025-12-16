<template>
  <Bar :data="chartData" :options="chartOptions" :height="height" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels)

defineProps({
  chartData: Object,
  chartOptions: Object,
  height: { type: Number, default: 350 }
})
</script>
