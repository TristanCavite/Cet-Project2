<template>
  <div
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4"
    @mousedown="handleOutsideClick"
  >
    <!-- Modal Container -->
    <div
      ref="modalRef"
      class="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden relative"
    >
      <!-- ✖ Close Icon -->
      <X
        class="absolute top-4 right-4 w-6 h-6 text-gray-500 cursor-pointer hover:text-red-600 transition"
        @click="$emit('close')"
      />

      <!-- Scrollable Content -->
      <div class="p-6 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="text-center">
          <img
            :src="profile?.photo || '/placeholder.png'"
            alt="Profile Picture"
            class="w-28 h-28 rounded-full object-cover mx-auto shadow-lg"
          />
          <h2 class="mt-4 text-2xl font-bold text-maroon">
            {{ profile?.fullName || profile?.name || 'No Name Provided' }}
          </h2>
          <p class="text-gray-500 text-lg font-semibold">
            {{
              profile?.role === 'Head Admin' && profile.departmentName
                ? `Department Head (${profile.departmentName})`
                : profile?.designation || 'No Designation'
            }}
          </p>

          <!-- Optional Delete Icon -->
          <div
            v-if="showDelete"
            class="absolute top-4 left-4 cursor-pointer text-red-500 hover:text-red-700"
            @click="$emit('remove', profile)"
          >
            <Trash class="w-6 h-6" />
          </div>
        </div>

        <!-- Info Section -->
        <div class="mt-6 space-y-4 text-base">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p class="font-semibold text-maroon">Full Name:</p>
              <p>{{ profile?.fullName || profile?.name || 'N/A' }}</p>
            </div>
            <div>
              <p class="font-semibold text-maroon">Specialization:</p>
              <p>{{ profile?.specialization || 'N/A' }}</p>
            </div>
            <div>
              <p class="font-semibold text-maroon">Contact:</p>
              <p>{{ profile?.contact || 'N/A' }}</p>
            </div>
            <div>
              <p class="font-semibold text-maroon">Personal Email:</p>
              <p>{{ profile?.personalEmail || 'N/A' }}</p>
            </div>
          </div>

          <div>
            <p class="font-semibold text-maroon">Highest Educational Attainment:</p>
            <div
              class="prose text-sm text-black"
              v-html="profile?.educationHtml || profile?.education || 'N/A'"
            ></div>
          </div>

          <div>
            <p class="font-semibold text-maroon">Websites:</p>
            <div class="text-sm">
              <template v-if="profile?.websites?.length">
                <ul class="list-disc ml-6 space-y-1">
                  <li v-for="(website, index) in profile.websites" :key="index">
                    <a :href="website" target="_blank" class="text-blue-600 underline">
                      {{ website }}
                    </a>
                  </li>
                </ul>
              </template>
              <p v-else>No websites provided</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import Trash from '@/components/Icons/trash.vue'

defineProps({
  profile: Object,
  showDelete: Boolean,
})

const emit = defineEmits(['close', 'remove'])
const modalRef = ref(null)

function handleOutsideClick(event) {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    emit('close')
  }
}
</script>

<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>
