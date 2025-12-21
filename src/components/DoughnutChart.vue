<template>
  <Doughnut :data="chartData" :options="finalOptions" :height="height"/>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const props = defineProps({
  chartData: Object,
  chartOptions: Object,
  height: { type: Number, default: 300 }
})

/**
 * 0 bo‘lgan qiymatlar:
 * - label chiqmaydi
 * - foiz chiqmaydi
 */
const finalOptions = computed(() => ({
  ...props.chartOptions,
  plugins: {
    ...props.chartOptions?.plugins,
    datalabels: {
      color: '#fff',
      font: { weight: 'bold' },
      formatter(value) {
        if (value === 0) return null // 👈 ASOSIY JOY
        return value
      }
    }
  }
}))
</script>
