<template>
  <div class="p-6">

    <!-- Header + Year Select -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-3xl font-bold text-indigo-600">
        Dashboard — {{ selectedYear }}
      </h1>

      <select
        v-model="selectedYear"
        @change="loadDashboard"
        class="mt-3 sm:mt-0 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
      >
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      <div v-for="i in 3" :key="i" class="h-28 bg-gray-200 rounded-2xl animate-pulse"></div>
    </div>

    <!-- CONTENT -->
    <template v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <StatCard title="Talabalar soni" :value="stats.students" color="indigo"/>
        <StatCard title="Guruhlar soni" :value="stats.groups" color="purple"/>
        <StatCard title="Oylik daromad" :value="moneyFormat(stats.revenue)" color="green"/>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div class="bg-white/80 p-6 rounded-2xl shadow lg:col-span-2">
          <h2 class="text-xl font-semibold mb-4">To‘lov statistikasi</h2>
          <div class="chart-wrapper-doughnut">
            <DoughnutChart
              :chartData="chartDataDoughnut"
              :chartOptions="doughnutOptions"
            />
          </div>
        </div>

        <div class="bg-white/80 p-6 rounded-2xl shadow">
          <h2 class="text-xl font-semibold mb-4">Daromad</h2>
          <div class="chart-wrapper">
            <BarChart :chartData="chartIncome" :chartOptions="chartOptions"/>
          </div>
        </div>

        <div class="bg-white/80 p-6 rounded-2xl shadow">
          <h2 class="text-xl font-semibold mb-4">Talabalar</h2>
          <div class="chart-wrapper">
            <BarChart :chartData="chartStudents" :chartOptions="chartOptions"/>
          </div>
        </div>

      </div>
    </template>

  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import BarChart from '@/components/BarChart.vue'
import DoughnutChart from '@/components/DoughnutChart.vue'
import StatCard from '@/components/StatCard.vue'

const token = localStorage.getItem('api_token')

const loading = ref(true)
const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)

const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

const labels = ['Yan','Fev','Mar','Apr','May','Iyun','Iyul','Avg','Sen','Okt','Noy','Dek']

const stats = ref({
  students: 0,
  groups: 0,
  revenue: 0
})

const chartIncome = ref({
  labels,
  datasets: [{ label: 'Daromad', data: [], backgroundColor: 'rgba(16,185,129,0.8)', borderRadius: 6 }]
})

const chartStudents = ref({
  labels,
  datasets: [{ label: 'Talabalar', data: [], backgroundColor: 'rgba(99,102,241,0.8)', borderRadius: 6 }]
})

const chartDataDoughnut = ref({
  labels: ['Paid', 'Pre-paid', 'Unpaid'],
  datasets: [{ data: [], backgroundColor: ['#22c55e','#facc15','#f43f5e'] }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true } }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } }
}

const loadDashboard = async () => {
  loading.value = true

  const res = await axios.post(
    'api/admin/statistics/dashboard',
    { year: selectedYear.value },
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
  )

  const d = res.data

  stats.value.students = d.users_count
  stats.value.groups = d.group_count
  stats.value.revenue = Number(d.active_month_paid_amount)

  chartIncome.value.datasets[0].data = Object.values(d.yearly_month_paid_amount).map(Number)
  chartStudents.value.datasets[0].data = Object.values(d.yearly_month_users_count)

  chartDataDoughnut.value.datasets[0].data = [
    d.subscription_stats.paid,
    d.subscription_stats.pre_paid,
    d.subscription_stats.unpaid
  ]

  loading.value = false
}

onMounted(loadDashboard)

function moneyFormat(v) {
  return new Intl.NumberFormat('uz-UZ').format(v) + ' UZS'
}
</script>
