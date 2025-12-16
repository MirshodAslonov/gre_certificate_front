<template>
  <div>
    <div class="flex justify-between items-center mb-4">
  <!-- O'rtada qidiruv -->
  <div class="flex-1 flex justify-center">
    <div class="relative w-full max-w-lg">
      <input
        v-model="search"
        @input="fetchUsers"
        type="text"
        placeholder="🔍Telegram ID orqali qidirish..."
        class="w-full rounded-2xl border border-gray-300 bg-white/70 backdrop-blur-sm shadow-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
      />
      
    </div>
  </div>

  <!-- Yangi foydalanuvchi tugmasi -->
  <button @click="openAddModal" class="btn-primary ml-4">Yangi foydalanuvchi</button>
</div>



    <!-- Users table -->
    <table class="min-w-full bg-white/70 backdrop-blur-3xl rounded-xl shadow-lg overflow-hidden text-left">
  <thead class="bg-indigo-100/50">
    <tr>
      <th class="px-4 py-2 text-left w-12">ID</th>
      <th class="px-4 py-2 text-left w-16">Foto</th>
      <th class="px-4 py-2 text-left">Ism</th>
      <th class="px-4 py-2 text-left">Familiya</th>
      <th class="px-4 py-2 text-left">Telefon</th>
      <th class="px-4 py-2 text-left">Status</th>
      <th class="px-4 py-2 text-left">Harakatlar</th>
    </tr>
  </thead>
  <tbody>
    <tr
  v-for="user in users"
  :key="user.id"
  class="border-b cursor-pointer hover:bg-gray-100 transition"
  @click="goToUser(user.id)"
>
  <td class="px-4 py-2 text-left">{{ user.id }}</td>
  <td class="px-4 py-2 text-left">
    <img
      v-if="user.photo"
      :src="getUserPhoto(user)"
      class="w-10 h-10 rounded-full object-cover cursor-pointer"
      @click.stop="openImageModal(getUserPhoto(user))"
    />
    <div v-else class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">N/A</div>
  </td>
  <td class="px-4 py-2 text-left">{{ user.first_name }}</td>
  <td class="px-4 py-2 text-left">{{ user.last_name }}</td>
  <td class="px-4 py-2 text-left">{{ user.phone }}</td>
  <td class="px-4 py-2 text-left">{{ user.status.name }}</td>

  <td class="px-4 py-2 text-left">
    <div class="flex items-center gap-2">

      <!-- <button @click.stop="openPhotoModal(user)" class="btn-photo flex items-center gap-1">
        <PhotoIcon class="w-5 h-5" />
      </button> -->

      <button @click.stop="editUser(user)" class="btn-edit flex items-center gap-1">
        <PencilSquareIcon class="w-5 h-5" />
      </button>

      <button @click.stop="deleteUser(user.id)" class="btn-delete flex items-center gap-1">
        <TrashIcon class="w-5 h-5" />
      </button>

    </div>
  </td>
</tr>

  </tbody>
</table>
 <!-- Image Modal -->
<div 
  v-if="showImageModal" 
  class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" 
  @click="closeImageModal"
>
  <!-- Rasmga ham bosilganda modal yopilsin -->
  <img 
    :src="selectedImage" 
    class="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
  >
</div>
    <!-- Add / Edit Modal -->
   <!-- Add / Edit Modal -->
<div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded-xl w-96 shadow-2xl relative">
    <h3 class="text-lg font-bold mb-4">{{ isEdit ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi' }}</h3>
    <form @submit.prevent="submitForm">
      <input v-model="form.first_name" placeholder="Ism" class="input-field mb-2" required />
      <input v-model="form.last_name" placeholder="Familiya" class="input-field mb-2" required />
      <input v-model="form.phone" placeholder="Telefon" class="input-field mb-2" required />
      <input v-if="!isEdit" v-model="form.password" type="password" placeholder="Parol" class="input-field mb-2" required />

      <div class="flex justify-end space-x-2 mt-4">
        <button type="button" @click="closeModal" class="btn-cancel">Bekor qilish</button>
        <button type="submit" class="btn-primary">{{ isEdit ? 'Saqlash' : 'Qo\'shish' }}</button>
      </div>
    </form>
  </div>
</div>

  </div>
  <!-- Photo Upload Modal -->
<div v-if="showPhotoModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded-xl w-96 shadow-2xl relative">
    <h3 class="text-lg font-bold mb-4">Rasm yuklash</h3>

    <input type="file" accept="image/*" @change="handlePhotoSelect" class="mb-3" />

    <div class="flex justify-end space-x-2 mt-4">
      <button type="button" @click="closePhotoModal" class="btn-cancel">Bekor qilish</button>
      <button @click="uploadPhoto" class="btn-primary">Yuklash</button>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue'
import { useRouter } from 'vue-router'

import axios from '@/plugins/axios'
import { PhotoIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'

const users = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const search = ref("");
const form = ref({ first_name:'', last_name:'', phone:'', password:'' })
const editingId = ref(null)
// Image Modal
const showImageModal = ref(false)
const selectedImage = ref('')

// Groups
const groups = ref([])
const selectedGroupId = ref('')
// Fetch users, edit, add, delete functions shu yerda
// Image click
function openImageModal(url) {
  selectedImage.value = url
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
  selectedImage.value = ''
}
async function fetchUsers() {
  const token = localStorage.getItem('api_token')
  if (!token) return

  try {
    const { data } = await axios.post('/api/admin/user/list',
    {
      search: search.value || ''  
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
    users.value = data
  } catch (err) {
    console.error(err)
  }
}
// ==================== FETCH GROUPS ====================
async function fetchGroups() {
  const token = localStorage.getItem('api_token')
  if (!token) return
  try {
    const { data } = await axios.post('/api/admin/group/list',{}, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
    groups.value = data
  } catch (err) {
    console.error(err)
  }
}
function openAddModal() {
  isEdit.value = false
  form.value = { first_name:'', last_name:'', phone:'', password:'' }
  selectedGroupId.value = ''
  showModal.value = true
}

function editUser(user) {
  isEdit.value = true
  editingId.value = user.id
  form.value = { first_name: user.first_name, last_name: user.last_name, phone: user.phone, password:'' }
  selectedGroupId.value = user.group_id || ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

// Qo'shish / update
async function submitForm() {
  const token = localStorage.getItem('api_token')
  if (!token) return
  try {
    if (isEdit.value) {
      const body = { id: editingId.value, ...form.value }
      if (!form.value.password) delete body.password
      await axios.put('/api/admin/user/update', body, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }})
    } else {
      await axios.post('/api/admin/user/add', form.value, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }})
    }
    showModal.value = false
    fetchUsers()
  } catch (err) {
    console.error(err)
  }
}

async function bindUserGroup() {
  if (!editingId.value || !selectedGroupId.value) return
  const token = localStorage.getItem('api_token')
  try {
    await axios.post('/api/admin/group_user/bind/group', {
      user_id: editingId.value,
      group_id: selectedGroupId.value
    }, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
    console.log('User group binded successfully!')
  } catch (err) {
    console.error(err)
  }
}
// Delete
async function deleteUser(id) {
  const token = localStorage.getItem('api_token')
  if (!token) return
  try {
    await axios.post(`api/admin/user/delete/${id}`,{},
      {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
      }
    )
    fetchUsers()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchUsers()
  fetchGroups()
})
const getUserPhoto = (user) => {
  return user.photo
    ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.photo}`
    : '/default_person.png'
}
// Photo modal
const showPhotoModal = ref(false)
const selectedUserId = ref(null)
const selectedPhoto = ref(null)

function openPhotoModal(user) {
  selectedUserId.value = user.id
  selectedPhoto.value = null
  showPhotoModal.value = true
}

function closePhotoModal() {
  showPhotoModal.value = false
  selectedUserId.value = null
  selectedPhoto.value = null
}

// File tanlash
function handlePhotoSelect(event) {
  selectedPhoto.value = event.target.files[0]
}

// Upload
async function uploadPhoto() {
  if (!selectedPhoto.value) {
    alert("Rasm tanlanmadi!")
    return
  }

  const token = localStorage.getItem("api_token")

  const formData = new FormData()
  formData.append("id", selectedUserId.value)
  formData.append("photo", selectedPhoto.value)

  try {
    await axios.post('/api/admin/user/bind/photo', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
    })

    showPhotoModal.value = false
    fetchUsers() // rasmni yangilash
  } catch (e) {
    console.error(e)
  }
}
const router = useRouter()

function goToUser(id) {
  router.push({ name: 'user_page', params: { id } })
}

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
.btn-edit,
.btn-photo,
.btn-delete {
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: 600;
  color: #fff;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* EDIT button – Gold Premium */
.btn-edit {
  background: linear-gradient(135deg, #facc15, #eab308);
}

.btn-edit:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 6px 18px rgba(250, 204, 21, 0.5);
}

/* PHOTO button – Cyan/Teal Neon */
.btn-photo {
  background: linear-gradient(135deg, #06b6d4, #0ea5e9);
}

.btn-photo:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 6px 18px rgba(14, 165, 233, 0.45);
}

/* DELETE button – Red Premium */
.btn-delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.btn-delete:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.45);
}

.btn-cancel {
  background: #ccc;
  padding: 4px 8px;
  border-radius: 6px;
}
</style>
