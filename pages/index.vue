<template>
  <main class="bg-white">
    <!-- 🔼 Hero Slider -->
    <div class="relative h-auto w-full overflow-hidden">
      <!-- Arrows -->
      <button
        class="absolute right-4 top-1/2 z-10 flex h-16 -translate-y-1/2 transform items-center justify-center rounded-xl border bg-red-900 shadow-lg transition md:right-20 md:h-28"
        @click="nextSlide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="lucide lucide-chevron-right size-5 text-white md:size-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <button
        class="absolute left-4 top-1/2 z-10 flex h-16 -translate-y-1/2 transform items-center justify-center rounded-xl border bg-red-900 shadow-lg transition md:left-20 md:h-28"
        @click="prevSlide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="lucide lucide-chevron-left size-5 text-white md:size-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Dots -->
      <div
        class="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2 md:bottom-4"
      >
        <span
          v-for="(image, index) in images"
          :key="index"
          class="size-2 rounded-full bg-gray-400"
          :class="{ 'bg-gray-800': currentIndex === index }"
          @click="setCurrentSlide(index)"
        ></span>
      </div>

      <!-- view port -->
      <div class="relative mx-auto w-[100%] overflow-hidden rounded-xl md:w-[80%]">
        <!-- Slides Wrapper -->
        <div
          class="flex transition-transform duration-700 ease-in-out"
          :style="{
            transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
            width: `${images.length * 100}%`,
          }"
        >
          <!-- Each Slide -->
          <div
            v-for="(image, index) in images"
            :key="index"
            class="flex w-full flex-shrink-0 items-center justify-center md:h-128"
            :style="{ flex: `0 0 ${100 / images.length}%` }"
          >
            <img
              :src="image.src"
              :alt="image.alt || `Slide ${index + 1}`"
              class="h-full w-full rounded-xl object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 📰 Events -->
    <div class="mx-auto py-5 md:max-w-7xl md:px-4 md:py-10">
      <!-- 🏷 Section Title -->
      <div class="text-center md:pt-4">
        <span
          class="font-playfair text-xl font-extrabold uppercase tracking-wide text-maroon md:text-5xl"
          >EVENTS</span
        >
      </div>

      <div class="flex flex-col justify-center md:px-10 md:flex-row md:gap-10 lg:gap-16">
        <!-- 📅 left side -->
        <div class="flex w-full flex-col space-y-6 pt-5 md:w-3/4">
          <!-- Type Filter (dropdown) -->
          <div class="mb-4 flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700">Filter by:</label>

            <select v-model="typeFilter" class="select select-bordered select-sm md:select-md">
              <option value="all">All events</option>
              <option value="faculty">Faculty</option>
              <option value="students">Students</option>
              <option value="faculty-wide">Faculty Wide</option>
            </select>

            <!-- still useful if user filtered by date while 'All events' is selected -->
            <button
              v-if="selectedDate"
              type="button"
              class="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
              @click="selectedDate = null"
            >
              Clear date
            </button>
          </div>

          <template v-if="filteredEvents.length > 0">
            <div
              v-for="event in filteredEvents"
              :key="event.id"
              class="w-full rounded-lg bg-white p-5 shadow-2xl md:w-4/5"
            >
              <!-- Date -->
              <span class="text-md font-inter font-semibold text-red-800 md:text-2xl">
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
                  class="flex flex-shrink-0 pb-4 pt-4 transition-transform duration-500"
                  :style="{ transform: `translateX(-${event.currentSlide || 0}00%)` }"
                >
                  <div v-for="(img, i) in event.coverImages" :key="i" class="w-full flex-shrink-0">
                    <img :src="img" alt="" class="h-48 w-full object-cover md:h-60" />
                  </div>
                </div>


                <!-- Arrows -->
                <button
                  class="absolute right-3 top-36 z-10 size-8 -translate-y-1/2 transform rounded-full bg-white/80 text-red-900 shadow-md transition hover:scale-105 hover:bg-white md:size-10"
                  @click="event.currentSlide = (event.currentSlide + 1) % event.coverImages.length"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto size-7 font-bold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <button
                  class="absolute left-3 top-36 z-10 size-8 -translate-y-1/2 transform rounded-full bg-white/80 text-red-900 shadow-md transition hover:scale-105 hover:bg-white md:size-10"
                  @click="
                    event.currentSlide =
                      (event.currentSlide - 1 + event.coverImages.length) % event.coverImages.length
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto size-7 font-bold"
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
                  class="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2"
                >
                  <span
                    v-for="(img, i) in event.coverImages"
                    :key="i"
                    class="h-2 w-2 rounded-full bg-gray-400"
                    :class="{ 'bg-gray-800': (event.currentSlide || 0) === i }"
                    @click="event.currentSlide = i"
                  ></span>
                </div>
              </div>

              <!-- Title & Description -->
              <div class="pb-2 md:pt-2">
                <span class="font-roboto text-xl font-semibold md:text-2xl">{{ event.title }}</span>
              </div>
              <div class="font-roboto">
                <p v-html="event.description"></p>
              </div>
              <UiButton
                @click="readMore(event.id)"
                class="inline-block rounded bg-gray-200 px-2 py-1 font-montserrat text-xs font-semibold text-gray-800 transition hover:scale-105 hover:bg-gray-300"
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
                class="mb-5 h-16 w-16 text-red-700"
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

              <button
                v-if="selectedDate"
                @click="selectedDate = null"
                class="mt-4 w-fit self-center rounded bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
              >
                Show all events
              </button>
            </div>
          </template>
        </div>

        <!--  Right Side -->
        <div class="hidden md:flex md:w-[340px] md:shrink-0 md:flex-col md:items-center md:pt-5 md:space-y-5">
          <div class="flex flex-col items-center space-y-5 pt-5">
            <!-- Calendar -->
            <div class="">
              <div class="flex justify-center rounded-xl bg-white shadow-xl">
                <UiCalendar @dayclick="handleDayClick" class="bg-neutral-100" />
              </div>
            </div>

            <!-- More / older events (only visible on All events with no date selected) -->
            <div
              v-if="oldEvents.length"
              class="w-96 rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
            >
              <div class="flex items-center gap-2 border-b border-neutral-300 pb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-maroon"
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
                    class="text-left text-sm font-medium text-gray-800 hover:underline"
                    @click="readMore(ev.id)"
                  >
                    {{ ev.title }}
                  </button>
                  <span class="shrink-0 text-xs text-gray-500">
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
  import Item from "~/components/Ui/Accordion/Item.vue";
  import { isSameDay, parseISO } from "date-fns";
  import { collection, getDocs, orderBy, query } from "firebase/firestore";
  import { computed, onMounted, onUnmounted, ref, watch } from "vue";
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
        return { src: data?.imageUrl || "", alt: data?.caption || "Homepage slide" };
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

  function handleDayClick(day: any) {
    selectedDate.value = new Date(day.date);
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
</script>

<style>
  /* *{
    outline:red solid 1px;
  } */
</style>
