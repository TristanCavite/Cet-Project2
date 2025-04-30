<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-3xl">
      <div class="text-center relative">
        <img :src="profile?.photo || '/placeholder.png'" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover mx-auto shadow-lg" />
        <h2 class="mt-4 text-2xl font-bold text-maroon">{{ profile?.fullName || profile?.name || 'No Name Provided' }}</h2>
        <p class="text-gray-500 text-lg font-semibold">
  {{ profile?.role === 'Head Admin' && profile.departmentName
    ? `Department Head (${profile.departmentName})`
    : profile?.designation || 'No Designation' 
  }}
</p>

        <div
          class="absolute top-0 right-0 cursor-pointer text-red-500 hover:text-red-700"
          v-if="showDelete"
          @click="$emit('remove', profile)"
        >
          <Trash class="w-6 h-6" />
        </div>
      </div>

      <div class="mt-6 space-y-4 text-lg">
        <div class="grid grid-cols-2 gap-6">
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
          <p class="font-semibold text-maroon mt-4">Highest Educational Attainment:</p>
          <span class="prose text-black" v-html="profile?.educationHtml || profile?.education || 'N/A'"></span>
        </div>

        <div>
          <p class="font-semibold text-maroon mt-4">Websites:</p>
          <div>
            <span v-if="profile?.websites?.length">
              <span
                v-for="(website, index) in profile.websites"
                :key="index"
                class="block text-blue-500 underline"
              >
                <a :href="website" target="_blank">{{ website }}</a>
              </span>
            </span>
            <span v-else>No websites provided</span>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <button class="bg-maroon text-white px-6 py-2 rounded-lg shadow hover:bg-red-700" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Trash from '@/components/Icons/trash.vue';

defineProps({
  profile: Object,
  showDelete: Boolean,
});
</script>

<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>
