<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
    @mousedown="handleOutsideClick"
  >
    <!-- Modal Container -->
    <div class="relative w-11/12 md:w-2/6">
      <div
        ref="modalRef"
        class="overflow-hidden overflow-y-auto break-words bg-white rounded-lg overscroll-contain h-128">
        <!-- ✖ Close Icon -->
        <X
          class="absolute text-gray-500 transition cursor-pointer size-6 top-4 right-4 hover:scale-125"
          @click="$emit('close')"
        />
  
        <!-- Scrollable Content -->
        <div class="px-4 py-8 md:px-8">
          <!-- Header -->
          <div class="text-center">
            <img
              :src="profile?.photo || '/placeholder.png'"
              alt="Profile Picture"
              class="absolute mx-auto rounded-full object-fit size-28 -top-16 md:right-52 right-28"
            />
            <h2 class="mt-4 text-2xl font-bold text-red-900">
              {{ profile?.fullName || profile?.name || 'No Name Provided' }}
            </h2>
            <p class="text-lg font-semibold text-gray-500">
              {{
                profile?.role === 'Head Admin' && profile.departmentName
                  ? `Department Head (${profile.departmentName})`
                  : profile?.designation || 'No Designation'
              }}
            </p>
  
            <!-- Optional Delete Icon -->
            <div
              v-if="showDelete"
              class="absolute text-red-500 cursor-pointer top-4 left-4 hover:text-red-700"
              @click="$emit('remove', profile)"
            >
              <Trash class="w-6 h-6" />
            </div>
          </div>
  
          <!-- Info Section -->
          <div class="mt-6 space-y-4 text-base">
            <div class="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
              <div>
                <p class="font-semibold text-red-900">Full Name:</p>
                <p>{{ profile?.fullName || profile?.name || 'N/A' }}</p>
              </div>
              <div>
                <p class="font-semibold text-red-900">Specialization:</p>
                <p>{{ profile?.specialization || 'N/A' }}</p>
              </div>
              <div>
                <p class="font-semibold text-red-900">Contact:</p>
                <p>{{ profile?.contact || 'N/A' }}</p>
              </div>
              <div>
                <p class="font-semibold text-red-900">Personal Email:</p>
                <p>{{ profile?.personalEmail || 'N/A' }}</p>
              </div>
            </div>
  
            <div>
              <p class="font-semibold text-red-900">Highest Educational Attainment:</p>
              <div
                class="text-sm prose text-black"
                v-html="profile?.educationHtml || profile?.education || 'N/A'"
              ></div>
            </div>
  
            <div>
              <p class="font-semibold text-red-900">Websites:</p>
              <div class="text-sm">
                <template v-if="profile?.websites?.length">
                  <ul class="ml-6 space-y-1 list-disc">
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
/* * {
  outline: 1px red solid;
} */
</style>
