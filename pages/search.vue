<template>
  <div class="mx-auto max-w-5xl space-y-6 px-4 py-10">
    <h1 class="text-3xl font-bold text-maroon">
      Search Results for: <span class="italic">"{{ route.query.q }}"</span>
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500">Searching...</div>

    <!-- No Results -->
    <div v-else-if="filteredResults.length === 0" class="text-gray-600">
      No results found.
    </div>

    <!-- Results List -->
    <div v-else class="space-y-6">
      <!-- 📰 Paginated Results -->
      <div
        v-for="item in paginatedResults"
        :key="`${item.source}_${item.id}`"
        class="rounded border bg-white p-4 shadow transition hover:shadow-lg"
      >
        <NuxtLink
          :to="`/${item.source}/${item.id}`"
          class="mb-1 inline-block text-xl font-bold text-maroon transition hover:underline"
        >
          {{ item.title }}
        </NuxtLink>

        <p class="mb-2 text-sm text-gray-500">{{ item.displayDate }}</p>
        <p class="line-clamp-3 text-gray-700" v-html="truncateHTML(item.content, 250)" />

        <NuxtLink
          :to="`/${item.source}/${item.id}`"
          class="mt-2 inline-block text-sm text-red-800 hover:underline"
        >
          Read more →
        </NuxtLink>
      </div>

      <!-- 📄 Pagination Controls -->
      <div class="flex justify-center items-center flex-wrap gap-2 pt-6 text-sm font-medium text-maroon">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-2 py-1 hover:underline disabled:opacity-40"
        >
          Prev
        </button>

        <button
          v-for="n in totalPages"
          :key="n"
          @click="goToPage(n)"
          :class="[
            'w-8 h-8 border text-maroon  transition',
            n === currentPage ? 'bg-gray-200' : 'hover:underline'
          ]"
        >
          {{ n }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-2 py-1 hover:underline disabled:opacity-40"
        >
          Next
        </button>
        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="px-2 py-1 hover:underline disabled:opacity-40"
        >
          End
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
  import { collection, getDocs } from "firebase/firestore";
  import { ref, watchEffect } from "vue";
  import { useRoute } from "vue-router";
  import { useFirestore } from "vuefire";

  definePageMeta({
    layout: "default",
  });

  const db = useFirestore();
  const route = useRoute();
  const filteredResults = ref<any[]>([]);
  const currentPage = ref(1)
const itemsPerPage = 5

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredResults.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() =>
  Math.ceil(filteredResults.value.length / itemsPerPage)
)

  const loading = ref(true);

  watchEffect(async () => {
    const q = ((route.query.q as string) || "").toLowerCase();
    if (!q) return;

    loading.value = true;
    const results: any[] = [];

    const sources = ["news", "events"];

    for (const source of sources) {
      const snapshot = await getDocs(collection(db, source));
      snapshot.forEach((doc) => {
        const data = doc.data();
        const title = data.title?.toLowerCase() || "";
        const content = data.content?.toLowerCase() || "";

        if (title.includes(q) || content.includes(q)) {
          const rawDate = source === "news" ? data.createdAt : data.date;
          const parsedDate = parseToDate(rawDate);

          results.push({
            ...data,
            id: doc.id,
            source,
            parsedDate, // used for sorting
            displayDate: parsedDate ? formatDate(parsedDate) : "Invalid Date",
          });
        }
      });
    }

    // Sort by parsed date descending
    filteredResults.value = results.sort(
      (a, b) => new Date(b.parsedDate).getTime() - new Date(a.parsedDate).getTime()
    );
    loading.value = false;
  });

  // Format final display date
  function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Parse either ISO date string or Firebase createdAt string
  function parseToDate(raw: any): Date | null {
    if (!raw) return null;

    // Firebase Timestamp object (if stored that way)
    if (raw.toDate) {
      return raw.toDate();
    }

    // ISO string (events)
    if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}/.test(raw)) {
      return new Date(raw);
    }

    // CreatedAt string like "June 8, 2025 at 3:28:44 PM UTC+8"
    if (typeof raw === "string") {
      const dateOnly = raw.split(" at ")[0]; // remove time portion
      const parsed = Date.parse(dateOnly);
      if (!isNaN(parsed)) return new Date(parsed);
    }

    return null;
  }

  function truncateHTML(html: string, maxLength: number): string {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    scrollToTop()
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
