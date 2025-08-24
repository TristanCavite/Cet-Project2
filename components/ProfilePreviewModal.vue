<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    role="dialog"
    aria-modal="true"
    @mousedown="handleOutsideClick"
  >
    <!-- Modal shell (keeps the card centered) -->
    <div class="relative w-full max-w-xl">
      <!-- Card -->
      <div
        ref="modalRef"
        class="relative w-full rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        <!-- Avatar (perfectly centered) -->
        <div class="absolute -top-12 left-1/2 -translate-x-1/2">
          <img
            :src="profile?.photo || '/placeholder.png'"
            alt="Profile Picture"
            class="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white"
          />
        </div>

        <!-- Close + optional delete -->
        <button
          type="button"
          aria-label="Close"
          class="absolute right-3 top-3 inline-flex items-center justify-center rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          @click="$emit('close')"
        >
          <X class="h-5 w-5" />
        </button>

        <button
          v-if="showDelete"
          type="button"
          aria-label="Remove"
          class="absolute left-3 top-3 inline-flex items-center justify-center rounded-full p-1 text-red-500 transition hover:bg-red-50"
          @click="$emit('remove', profile)"
        >
          <Trash class="h-5 w-5" />
        </button>

        <!-- Scrollable content area -->
        <div class="max-h-[82vh] overflow-y-auto px-6 pb-8 pt-16 md:px-10">
          <!-- Header -->
          <div class="text-center">
            <h2 class="text-2xl font-bold text-red-900">
              {{ profile?.fullName || profile?.name || "No Name Provided" }}
            </h2>
            <p class="mt-1 text-lg font-semibold text-gray-500">
              {{
                profile?.role === "Head Admin" && profile?.departmentName
                  ? `Department Head (${profile.departmentName})`
                  : profile?.designation || "No Designation"
              }}
            </p>
          </div>

          <!-- Info Section -->
          <div class="mt-6 space-y-6 text-base">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p class="font-semibold text-red-900">Full Name:</p>
                <p class="mt-1">{{ profile?.fullName || profile?.name || "N/A" }}</p>
              </div>
              <div>
                <p class="font-semibold text-red-900">Specialization:</p>
                <p class="mt-1">{{ profile?.specialization || "N/A" }}</p>
              </div>
              <div>
                <p class="font-semibold text-red-900">Contact:</p>
                <p class="mt-1">{{ profile?.contact || "N/A" }}</p>
              </div>
              <div>
                <p class="font-semibold text-red-900">Personal Email:</p>
                <p class="mt-1 break-words">{{ profile?.personalEmail || "N/A" }}</p>
              </div>
            </div>

            <!-- Faculty Type + Home Department (only if memberType exists) -->
            <div v-if="profile?.memberType" class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p class="font-semibold text-red-900">Faculty Type:</p>
                <p class="mt-1">{{ profile.memberType }}</p>
              </div>
              <div v-if="profile.memberType === 'Affiliate'">
                <p class="font-semibold text-red-900">Home Department:</p>
                <p class="mt-1">{{ profile.homeDepartment || "N/A" }}</p>
              </div>
            </div>

            <div>
              <p class="font-semibold text-red-900">Highest Educational Attainment:</p>
              <div
                class="prose max-w-none whitespace-pre-wrap break-words text-sm text-black"
                v-html="profile?.educationHtml || profile?.education || 'N/A'"
              />
            </div>

            <div>
              <p class="font-semibold text-red-900">Websites:</p>
              <div class="mt-1 text-sm">
                <template v-if="profile?.websites?.length">
                  <ul class="ml-6 list-disc space-y-1">
                    <li v-for="(website, index) in profile.websites" :key="index">
                      <a
                        :href="website"
                        target="_blank"
                        class="break-words text-blue-600 underline"
                      >
                        {{ website }}
                      </a>
                    </li>
                  </ul>
                </template>
                <p v-else>No websites provided</p>
              </div>
            </div>
          </div>
          <!-- /Info Section -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Trash from "@/components/Icons/trash.vue";
  import { X } from "lucide-vue-next";
  import { ref } from "vue";

  defineProps({
    profile: Object,
    showDelete: Boolean,
  });

  const emit = defineEmits(["close", "remove"]);
  const modalRef = ref(null);

  function handleOutsideClick(event) {
    if (modalRef.value && !modalRef.value.contains(event.target)) {
      emit("close");
    }
  }
</script>

<style scoped>
  /* Optional: smoothen native scrollbar on WebKit */
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 9999px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
</style>
