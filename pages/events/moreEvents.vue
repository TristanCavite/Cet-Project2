<template>
  <main class="bg-white py-10">
    <div class="max-w-6xl mx-auto px-4">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-maroon">All Events</h1>
        <p class="text-sm text-gray-600 mt-1">Browse all events — {{ events.length }} total</p>
      </div>

      <!-- Filter (reusable) -->
      <div class="mb-6 flex items-center justify-between">
        <EventFilter v-model="typeFilter" />
        <button
          v-if="typeFilter !== 'all'"
          @click="resetFilter"
          class="ml-4 rounded bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
          type="button"
        >
          Reset
        </button>
      </div>

      <!-- Events list -->
      <div class="space-y-4">
        <article
          v-for="ev in paginatedEvents"
          :key="ev.id"
          class="rounded-lg border bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="text-xs uppercase text-maroon font-semibold tracking-wide">
              {{ labelForType(ev.eventType) }}
            </div>

            <div class="text-xs italic text-gray-500">
              {{ formatPublishDate(ev.createdAt ?? ev.date) }}
            </div>
          </div>

          <h2 class="mt-2 text-lg font-bold text-gray-900 hover:text-maroon">
            <button @click="openEvent(ev.id)" class="text-left" type="button">
              {{ ev.title }}
            </button>
          </h2>

          <div class="mt-2 text-sm text-gray-700">
            <span class="font-semibold">Event Date:</span>
            {{ formatEventDate(ev.date, ev.dateEnd) }}
          </div>

          <div class="mt-2 text-sm text-gray-700">
            <span class="font-semibold">Type:</span> {{ labelForType(ev.eventType) }}
          </div>

          <div v-if="ev.description" class="mt-3 text-sm text-gray-600">
            <div v-html="truncateHtml(ev.description, 220)"></div>
          </div>

          <div class="mt-3">
            <button
              @click="openEvent(ev.id)"
              class="text-sm font-semibold text-gray-700 hover:text-maroon"
              type="button"
            >
              Read more →
            </button>
          </div>
        </article>
      </div>

      <!-- Pagination: Prev | page numbers | Next | End -->
      <div v-if="listByType.length > 0" class="mt-8 flex items-center justify-center gap-4">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="text-sm text-maroon disabled:opacity-30"
          type="button"
        >
          Prev
        </button>

        <div class="flex gap-2 items-center">
          <button
            v-for="p in pageRange"
            :key="p"
            @click="goToPage(p)"
            :class="[
              'px-3 py-1 rounded border text-sm',
              p === currentPage ? 'bg-gray-100' : 'bg-white'
            ]"
            type="button"
          >
            {{ p }}
          </button>
        </div>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="text-sm text-maroon disabled:opacity-30"
          type="button"
        >
          Next
        </button>

        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="text-sm text-maroon disabled:opacity-30"
          type="button"
        >
          End
        </button>
      </div>

      <div v-if="events.length === 0" class="mt-8 text-center text-gray-500">
        No events found.
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: "custom" });

import { ref, computed, onMounted, watch } from "vue";
import { useFirestore } from "vuefire";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useRouter } from "vue-router";
import EventFilter from "@/components/EventFilter.vue";

const PAGE_SIZE = 10;                 // EXACTLY 10 events per page
const currentPage = ref(1);
const events = ref<any[]>([]);
const db = useFirestore();
const router = useRouter();

// filter state bound to EventFilter
const typeFilter = ref<string>("all");

// load all events ordered by date desc (newest first)
onMounted(async () => {
  try {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const snap = await getDocs(q);
    events.value = snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
  } catch (err) {
    console.error("Failed to load events:", err);
  }
});

// safe conversion helper for Firestore Timestamp/string/date
function asDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val?.toDate === "function") return val.toDate();
  if (typeof val === "string" || typeof val === "number") return new Date(val);
  return null;
}

// normalize event type into canonical hyphenated form
function normalizeType(v: any) {
  return String(v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// list filtered by selected type (client-side)
const listByType = computed(() => {
  if (!events.value.length) return [];
  if (typeFilter.value === "all") return events.value;
  return events.value.filter((e) => normalizeType(e.eventType) === typeFilter.value);
});

// total pages for the filtered list
const totalPages = computed(() => Math.max(1, Math.ceil(listByType.value.length / PAGE_SIZE)));

// paginated slice for the current page
const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return listByType.value.slice(start, start + PAGE_SIZE);
});

// navigation helpers
function goToPage(page: number) {
  if (page < 1) page = 1;
  if (page > totalPages.value) page = totalPages.value;
  currentPage.value = page;
  if (process.client) window.scrollTo({ top: 0, behavior: "smooth" });
}
function openEvent(id: string) {
  router.push(`/events/${id}`);
}
function resetFilter() {
  typeFilter.value = "all";
  currentPage.value = 1;
}

// Formatting helpers
function formatEventDate(start: any, end?: any): string {
  const s = asDate(start);
  if (!s) return "";
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  const sStr = s.toLocaleDateString("en-US", opts);
  if (!end) return sStr;
  const e = asDate(end);
  return e ? `${sStr} - ${e.toLocaleDateString("en-US", opts)}` : sStr;
}
function formatPublishDate(val: any): string {
  const d = asDate(val);
  if (!d) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
function labelForType(t: any): string {
  if (!t) return "General";
  const norm = String(t).toLowerCase();
  if (norm.includes("univ") || norm.includes("university")) return "University";
  if (norm.includes("faculty")) return "Faculty";
  if (norm.includes("student")) return "Students";
  if (norm.includes("department")) return "Department";
  if (norm.includes("general")) return "General";
  return capitalize(String(t));
}
function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function truncateHtml(html: string, max = 200) {
  const text = String(html || "").replace(/<[^>]+>/g, "");
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}

// keep current page sane when filter or events change
watch(typeFilter, () => {
  currentPage.value = 1;
});
watch(events, () => {
  // if current page is now out of range, clamp to last page
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
});

// compute visible page numbers (compact window up to 7 pages)
const pageRange = computed(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  const maxShown = 7;
  let start = Math.max(1, cur - Math.floor(maxShown / 2));
  let end = Math.min(total, start + maxShown - 1);
  if (end - start + 1 < maxShown) {
    start = Math.max(1, end - maxShown + 1);
  }
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
});
</script>

<style scoped>
/* small tweak: ensure page number boxes look like your screenshot */
button[disabled] { cursor: default; }
/* optional: you can adjust the .bg-gray-100 background or border here if desired */
</style>
