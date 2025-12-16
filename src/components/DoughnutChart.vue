<template>
  <Doughnut :data="chartData" :options="chartOptions" :height="height"/>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels)

defineProps({
  chartData: Object,
  chartOptions: Object,
  height: { type: Number, default: 300 }
})
</script>
