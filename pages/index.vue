<template>
  <main class="bg-white">
    <!-- 🔼 Hero Slider -->
    <div class="relative w-full h-auto overflow-hidden">
      <!-- Arrows -->
      <button

        class="absolute z-10 flex items-center justify-center h-12 transition transform -translate-y-1/2 bg-red-900 left-1 top-1/2 rounded-xl md:left-10 md:h-28"
        @click="prevSlide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="text-white lucide lucide-chevron-left size-5 md:size-10"

          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      
      <button

        class="absolute z-10 flex items-center justify-center h-12 transition transform -translate-y-1/2 bg-red-900 right-1 top-1/2 rounded-xl md:h-28 md:right-10"
        @click="nextSlide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="text-white lucide lucide-chevron-right size-5 md:size-10"

          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>


      <!-- Dots -->
      <div
        class="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-2 left-1/2 md:bottom-4"
      >
        <span
          v-for="(image, index) in images"
          :key="index"

          class="bg-gray-400 rounded-full size-1 md:size-2"

          :class="{ 'bg-gray-800': currentIndex === index }"
          @click="setCurrentSlide(index)"
        ></span>
      </div>


      <!-- Viewport (centered; 90% wide on md+) -->
      <div class="relative mx-auto w-[100%] md:w-[85%]">
        <!-- 16:9 ratio box: 9/16 = 56.25% -->
        <div class="relative" :style="{ paddingBottom: ratioPadding }">
          <div class="absolute inset-0 overflow-hidden rounded-xl bg-neutral-200">
            <div
              class="flex h-full transition-transform duration-700 ease-in-out"
              :style="{
                width: `${slideCount * 100}%`,
                transform: `translateX(-${currentIndex * (100 / slideCount)}%)`,
              }"
            >
              <!-- Each Slide is exactly one frame wide -->
              <div v-for="(image, index) in images" :key="index" class="h-full shrink-0 grow-0" :style="{ flex: `0 0 ${100 / slideCount}%` }">
                <!-- Fill & center within the 16:9 frame -->
                <img
                  :src="image.src"
                  :alt="image.alt || `Slide ${index + 1}`"
                  class="object-cover object-center w-full h-full rounded-xl"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- 📰 Events -->
    <div class="py-5 mx-auto md:max-w-7xl md:px-4 md:py-10">
      <!-- 🏷 Section Title -->
      <div class="text-center md:pt-4">
        <span
          class="text-xl font-extrabold tracking-wide uppercase font-playfair text-maroon md:text-5xl"
          >EVENTS</span
        >
      </div>

      <div id="events-list" class="flex flex-col justify-center md:flex-row md:gap-10 md:px-10 lg:gap-16">
        <!-- 📅 left side -->
        <div class="flex flex-col w-full pt-5 space-y-6 md:w-3/4">
          <!-- Type Filter (dropdown) -->
          <div class="flex items-center gap-3 mb-4">
            <label class="text-sm font-medium text-gray-700">Filter by:</label>

            <select v-model="typeFilter" class="select select-bordered select-sm md:select-md">
              <option value="all">All events</option>
              <option value="faculty">Faculty</option>
              <option value="students">Students</option>
              <option value="faculty-wide">Faculty Wide</option>
            </select>

            <!-- still useful if user filtered by date while 'All events' is selected -->
            <UiButton
              v-if="selectedDate"
              class="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              @click="selectedDate = null"
            >
              Clear date
            </UiButton>
          </div>

          <template v-if="filteredEvents.length > 0">
            <div
              v-for="event in filteredEvents"
              :key="event.id"
              class="w-full p-5 bg-white rounded-lg shadow-2xl md:w-4/5"
            >
              <!-- Date -->
              <span class="font-semibold text-red-800 text-md font-inter md:text-2xl">
                DAY
                {{
                  new Date(event.date)
                    .toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
                    .toUpperCase()
                }}
              </span>

              <!-- Image slide -->
              <div class="relative mx-auto overflow-hidden">
                <div
                  class="flex flex-shrink-0 pt-4 pb-4 transition-transform duration-500"
                  :style="{ transform: `translateX(-${event.currentSlide || 0}00%)` }"
                >
                  <div v-for="(img, i) in event.coverImages" :key="i" class="flex-shrink-0 w-full">
                    <img :src="img" alt="" class="object-cover w-full h-48 md:h-60" />
                  </div>
                </div>

                <!-- Arrows -->
                <button
                  class="absolute z-10 text-red-900 transition transform -translate-y-1/2 rounded-full shadow-md right-3 top-36 size-8 bg-white/80 hover:scale-105 hover:bg-white md:size-10"
                  @click="event.currentSlide = (event.currentSlide + 1) % event.coverImages.length"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto font-bold size-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <button
                  class="absolute z-10 text-red-900 transition transform -translate-y-1/2 rounded-full shadow-md left-3 top-36 size-8 bg-white/80 hover:scale-105 hover:bg-white md:size-10"
                  @click="
                    event.currentSlide =
                      (event.currentSlide - 1 + event.coverImages.length) % event.coverImages.length
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto font-bold size-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <!-- Dots -->
                <div
                  class="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-7 left-1/2"
                >
                  <span
                    v-for="(img, i) in event.coverImages"
                    :key="i"
                    class="w-2 h-2 bg-gray-400 rounded-full"
                    :class="{ 'bg-gray-800': (event.currentSlide || 0) === i }"
                    @click="event.currentSlide = i"
                  ></span>
                </div>
              </div>

              <!-- Title & Description -->
              <div class="pb-2 md:pt-2">
                <span class="text-xl font-semibold font-roboto md:text-2xl">{{ event.title }}</span>
              </div>
              <div class="font-roboto">
                <p v-html="event.description"></p>
              </div>

              <UiButton
                @click="readMore(event.id)"
                class="inline-block px-2 py-1 text-xs font-semibold text-gray-800 transition bg-gray-200 rounded font-montserrat hover:scale-105 hover:bg-gray-300"
              >
                Read more...
              </UiButton>

            </div>
          </template>

          <template v-else>
            <!-- 🧼 Empty State -->
            <div
              class="flex min-h-[300px] w-224 flex-col items-center justify-center rounded border-2 bg-white text-center text-gray-500 shadow"
            >
              <!-- Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-16 h-16 mb-5 text-red-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 2v2m8-2v2M3 8h18M5 8h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12l-6 6m0-6l6 6" />
              </svg>
              <p class="text-lg font-semibold">No events on this day.</p>
              <p class="text-sm">Try selecting another date on the calendar.</p>

              <UiButton
                v-if="selectedDate"
                @click="selectedDate = null"
                class="self-center px-4 py-2 mt-4 text-sm font-semibold text-gray-700 bg-gray-300 rounded w-fit hover:bg-gray-400"
              >
                Show all events
              </UiButton>
            </div>
          </template>
        </div>

        <!--  Right Side -->

        <div
          class="hidden md:flex md:w-[340px] md:shrink-0 md:flex-col md:items-center md:space-y-5 md:pt-5"
        >

          <div class="flex flex-col items-center pt-5 space-y-5">
            <!-- Calendar -->
            <div class="">
              <div class="flex justify-center bg-white shadow-xl rounded-xl">
                <UiCalendar  class="bg-neutral-100" :dot-events="dotEvents" @date-click="handleDayClick" v-model:selectedDate="selectedDate" />
              </div>
            </div>

            <!-- More / older events (only visible on All events with no date selected) -->
            <div
              v-if="oldEvents.length"
              class="p-6 bg-white border shadow-xl w-96 rounded-xl border-neutral-200"
            >
              <div class="flex items-center gap-2 pb-3 border-b border-neutral-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-maroon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 8v5l3 3 1.5-1.5L14 12.75V8h-2z" />
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
                </svg>
                <h3 class="text-lg font-semibold text-maroon">More events</h3>
              </div>

              <ul class="mt-3 space-y-2">
                <li
                  v-for="ev in oldEvents"
                  :key="ev.id"
                  class="flex items-start justify-between gap-3"
                >
                  <button
                    class="text-sm font-medium text-left text-gray-800 hover:underline"
                    @click="readMore(ev.id)"
                  >
                    {{ ev.title }}
                  </button>
                  <span class="text-xs text-gray-500 shrink-0">
                    {{ miniDate(ev.createdAt || ev.date) }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
  import { isSameDay, parseISO } from "date-fns";
  import { collection, getDocs, orderBy, query } from "firebase/firestore";
  import { computed, onMounted, onUnmounted, ref, watch, nextTick } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useFirestore } from "vuefire";

  // Which event type is selected (for the chip filter)
  const typeFilter = ref<"all" | "faculty" | "students" | "faculty-wide">("all");

  // Options for the chip UI
  const TYPE_OPTIONS = [
    { value: "all", label: "All" },
    { value: "faculty", label: "Faculty" },
    { value: "students", label: "Students" },
    { value: "faculty-wide", label: "Faculty Wide" },
  ] as const;

  const MAX_VISIBLE = 3;
  const MAX_OLD_EVENTS = 10;
  // 16:9 ratio (height/width = 9/16 = 56.25%)
  const ratioPadding = '42.857%'; // 21:9 (shorter than 16:9)

  const slideCount = computed(() => Math.max(images.value.length, 1));


  const events = ref<any[]>([]);
  const selectedDate = ref<Date | null>(null);

  const db = useFirestore();

  /** Firestore-driven homepage images */
  const images = ref<Array<{ src: string; alt?: string }>>([]);

  /** main slideshow */
  const currentIndex = ref(0);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const nextSlide = () => {
    const len = images.value.length || 1;
    currentIndex.value = (currentIndex.value + 1) % len;
  };
  const prevSlide = () => {
    const len = images.value.length || 1;
    currentIndex.value = (currentIndex.value - 1 + len) % len;
  };
  const setCurrentSlide = (index: number) => {
    currentIndex.value = index;
  };

  const sortedByDateDesc = computed(() =>
    events.value.slice().sort((a, b) => msFrom(b.date) - msFrom(a.date))
  );

  const listByType = computed(() => {
    if (typeFilter.value === "all") return sortedByDateDesc.value;
    return sortedByDateDesc.value.filter(
      (e) => (e.eventType || "").toLowerCase().replace(/[_\s]+/g, "-") === typeFilter.value
    );
  });

  onMounted(async () => {
    // Load events
    const snap = await getDocs(collection(db, "events"));
    events.value = snap.docs.map((doc) => ({
      id: doc.id,
      currentSlide: 0,
      ...doc.data(),
    }));
  });

  onMounted(async () => {
    // Load homepage gallery
    const q = query(collection(db, "homepage_gallery"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    images.value = snap.docs
  .map((d) => {
    const data: any = d.data();
    const src = data?.heroUrl || data?.imageUrl || data?.originalUrl || "";
    return { src, alt: data?.caption || "Homepage slide" };
  })
  .filter((i) => !!i.src);


    if (images.value.length === 0) {
      images.value = [
        { src: "/images/cet.jpg", alt: "Slide 1" },
        { src: "/images/cet1.jpg", alt: "Slide 2" },
        { src: "/images/cet2.jpg", alt: "Slide 3" },
        { src: "/images/cet3.jpg", alt: "Slide 4" },
      ];
    }

    await Promise.all(
      images.value.map((image) => {
        const img = new Image();
        img.src = image.src;
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    intervalId = setInterval(nextSlide, 3000);
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  /** skeleton visibility (template still uses it) */
  const isContentVisible = ref(false);

  const filteredEvents = computed(() => {
    const list = listByType.value;
    if (selectedDate.value) {
      return list.filter((e) => isSameDay(parseISO(e.date), selectedDate.value as Date));
    }
    return list.slice(0, MAX_VISIBLE);
  });

  const oldEvents = computed(() => {
    return sortedByDateDesc.value // ALWAYS all events
      .slice(MAX_VISIBLE) // drop the first 3 newest
      .slice() // copy
      .sort(
        (
          a,
          b // newest by createdAt (fallback date)
        ) => msFrom(b.createdAt ?? b.date) - msFrom(a.createdAt ?? a.date)
      )
      .slice(0, MAX_OLD_EVENTS);
  });

  function handleDayClick(d: Date) {
  // toggle if the same day is clicked again
  if (selectedDate.value && isSameDay(selectedDate.value, d)) {
    selectedDate.value = null
  } else {
    selectedDate.value = d
    // optional: ensure type filter doesn't hide the clicked date
    // typeFilter.value = 'all'
  }

  // smooth scroll to the events list
  nextTick(() => {
    document.getElementById('events-list')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
}

  const router = useRouter();
  function readMore(id: string) {
    router.push(`/events/${id}`);
  }

  watch(typeFilter, (val) => {
    if (val !== "all") selectedDate.value = null;
  });

  function msFrom(val: any): number {
    if (!val) return 0;
    if (typeof val === "string") return +new Date(val);
    if (val instanceof Date) return +val;
    if (typeof val?.toMillis === "function") return val.toMillis();
    if (typeof val?.toDate === "function") return +val.toDate();
    return 0;
  }

  function miniDate(val: any): string {
    const d = typeof val?.toDate === "function" ? val.toDate() : new Date(val);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  //calendar filter
  const asDate = (val: any): Date | null => {
  if (!val) return null
  if (val instanceof Date) return val
  if (typeof val?.toDate === 'function') return val.toDate() // Firestore Timestamp
  if (typeof val === 'string' || typeof val === 'number') return new Date(val)
  return null
}

// const DOT_RED = '#ef4444' // or simply 'red'
/** Option A: one dot per event (VCalendar stacks dots for same day) */
const dotEvents = computed(() => {
  return events.value
    .map((e: any) => {
      const d = asDate(e.date)
      if (!d) return null
      return {
        date: d,
        // color: DOT_RED,                // 🔴 always red
        label: e.title || 'Event',
      }
    })
    .filter(Boolean) as { date: Date; color: string; label?: string }[]
})
</script>

<style>
  /* *{
    outline:red solid 1px;
  } */
</style>
