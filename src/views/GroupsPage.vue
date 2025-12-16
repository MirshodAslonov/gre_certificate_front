<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold">Guruhlar</h3>
      <button @click="openAddModal" class="btn-primary">+ Yangi guruh</button>
    </div>

    <!-- Groups Table -->
    <table class="min-w-full bg-white/70 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden text-left">
      <thead class="bg-indigo-100/50">
        <tr>
          <th class="px-4 py-2">Nomi</th>
          <th class="px-4 py-2">Dars vaqti</th>
          <th class="px-4 py-2">Kunlar</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="group in groups"
          :key="group.id"
          class="border-b cursor-pointer hover:bg-indigo-50/40 transition"
          @click="goToGroup(group.id)"
        >
          <td class="px-4 py-2 font-semibold">{{ group.name }}</td>
          <td class="px-4 py-2">{{ group.start_time }} - {{ group.end_time }}</td>
          <td class="px-4 py-2">{{ formatWeekDays(group.week_days) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Add / Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl w-96 shadow-2xl">
        <h3 class="text-lg font-bold mb-4">{{ isEdit ? 'Guruhni tahrirlash' : 'Yangi guruh' }}</h3>

        <form @submit.prevent="submitForm">
          <input v-model="form.name" placeholder="Guruh nomi" class="input-field mb-2" required />
          <textarea v-model="form.description" placeholder="Tavsif (ixtiyoriy)" class="input-field mb-2"></textarea>

          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="closeModal" class="btn-cancel">Bekor qilish</button>
            <button type="submit" class="btn-primary">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'

const router = useRouter()

const groups = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ name: '', description: '' })
const editingId = ref(null)

const weekNames = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

function formatWeekDays(list) {
  if (!list || !Array.isArray(list)) return ''
  return list
    .slice()            // asl arrayni o'zgartirmaslik uchun
    .sort((a, b) => a - b)  // o'sish tartibi
    .map(i => weekNames[i - 1])
    .join(', ')
}

async function fetchGroups() {
  const token = localStorage.getItem('api_token')
  const { data } = await axios.post('/api/admin/group/list', {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  groups.value = data
}

function openAddModal() {
  isEdit.value = false
  form.value = { name: '', description: '' }
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function submitForm() {
  const token = localStorage.getItem('api_token')
  const body = { name: form.value.name, description: form.value.description }

  if (isEdit.value) body.id = editingId.value

  await axios.post(`/api/admin/group/${isEdit.value ? 'update' : 'add'}`, body, {
    headers: { Authorization: `Bearer ${token}` }
  })

  showModal.value = false
  fetchGroups()
}

function goToGroup(id) {
  router.push({
    name: 'groupusers',
    params: { id }
  })
}

onMounted(fetchGroups)
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.btn-primary {
  background: linear-gradient(90deg,#6366f1,#8b5cf6);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
}
.btn-cancel {
  background: #ccc;
  padding: 4px 8px;
  border-radius: 6px;
}
</style>
