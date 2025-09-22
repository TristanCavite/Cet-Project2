<template>
  <main class="bg-white">
    <!-- Hero Slider -->
    <div class="relative w-full h-auto overflow-hidden">
      <button
        class="absolute z-10 flex items-center justify-center h-12 transition transform -translate-y-1/2 bg-red-900 left-1/2 top-1/2 rounded-xl md:left-10 md:h-28"
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
        class="absolute z-10 flex items-center justify-center h-12 transition transform -translate-y-1/2 bg-red-900 right-1 top-1/2 rounded-xl md:right-10 md:h-28"
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

      <!-- Viewport -->
      <div class="relative mx-auto w-[100%] md:w-[85%]">
        <div class="relative" :style="{ paddingBottom: ratioPadding }">
          <div class="absolute inset-0 overflow-hidden rounded-xl bg-neutral-200">
            <div
              class="flex h-full transition-transform duration-700 ease-in-out"
              :style="{
                width: `${slideCount * 100}%`,
                transform: `translateX(-${currentIndex * (100 / slideCount)}%)`,
              }"
            >
              <div
                v-for="(image, index) in images"
                :key="index"
                class="h-full shrink-0 grow-0"
                :style="{ flex: `0 0 ${100 / slideCount}%` }"
              >
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

    <!-- EVENTS -->
    <div class="py-5 mx-auto md:max-w-7xl md:px-4 md:py-10">
      <div class="text-center md:pt-4">
        <span
          class="text-xl font-extrabold tracking-wide uppercase font-playfair text-maroon md:text-5xl"
        >
          EVENTS
        </span>
      </div>

      <!-- Filter bar -->
      <div class="flex items-center gap-3 mt-6 md:px-10">
        <label class="text-sm font-medium text-gray-700">Filter by:</label>

        <DropdownMenu>
          <DropdownMenuTrigger
            class="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded-md shadow-sm hover:bg-gray-100"
          >
            <component :is="selectedIcon" class="w-4 h-4 text-maroon" />
            <span>{{ selectedLabel }}</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-44">
            <DropdownMenuItem
              v-for="opt in TYPE_OPTIONS"
              :key="opt.value"
              @click="setFilter(opt.value)"
            >
              <component :is="opt.icon" class="w-4 h-4 mr-2 text-gray-600" />
              {{ opt.label }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UiButton
          v-if="selectedDate"
          class="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          @click="selectedDate = null"
        >
          Clear date
        </UiButton>
      </div>

      <!-- SWAPPED SIZES: wide events (left), narrow calendar (right) -->
      <div
        id="events-list"
        class="mt-4 grid grid-cols-1 gap-10 md:grid-cols-[minmax(680px,1fr)_420px] md:px-10"
      >
        <!-- LEFT: Events (wide) -->
        <div class="flex flex-col w-full space-y-6">
          <template v-if="filteredEvents.length > 0">
            <div
              v-for="event in filteredEvents"
              :key="event.id"
              class="w-full p-5 bg-white rounded-lg shadow-2xl"
            >
              <span class="font-semibold text-red-800 text-md font-inter md:text-2xl">
                EVENT DATE: {{ formatEventDate(event.date, event.dateEnd) }}
              </span>

              <!-- Image slider -->
              <!-- Image slider (taller) -->
              <div class="relative mx-auto overflow-hidden">
                <div
                  class="flex flex-shrink-0 pt-4 pb-4 transition-transform duration-500"
                  :style="{ transform: `translateX(-${event.currentSlide || 0}00%)` }"
                >
                  <div v-for="(img, i) in event.coverImages" :key="i" class="flex-shrink-0 w-full">
                    <!-- taller image -->
                    <img :src="img" alt="" class="object-cover w-full h-64 md:h-80 lg:h-96" />
                  </div>
                </div>

                <!-- Arrows (vertically centered) -->
                <button
                  class="absolute z-10 text-red-900 -translate-y-1/2 rounded-full shadow-md right-3 top-1/2 size-9 bg-white/80 hover:scale-105 hover:bg-white md:size-10"
                  @click="event.currentSlide = (event.currentSlide + 1) % event.coverImages.length"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto size-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <button
                  class="absolute z-10 text-red-900 -translate-y-1/2 rounded-full shadow-md left-3 top-1/2 size-9 bg-white/80 hover:scale-105 hover:bg-white md:size-10"
                  @click="
                    event.currentSlide =
                      (event.currentSlide - 1 + event.coverImages.length) % event.coverImages.length
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mx-auto size-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <!-- Dots -->
                <div class="absolute z-10 flex space-x-2 -translate-x-1/2 bottom-4 left-1/2">
                  <span
                    v-for="(img, i) in event.coverImages"
                    :key="i"
                    class="w-2 h-2 bg-gray-400 rounded-full"
                    :class="{ 'bg-gray-800': (event.currentSlide || 0) === i }"
                    @click="event.currentSlide = i"
                  ></span>
                </div>
              </div>

              <div class="pb-2 md:pt-2">
                <span class="text-xl font-semibold font-roboto md:text-2xl">{{ event.title }}</span>
                <div class="text-sm italic text-gray-600">
                  Published: {{ formatPublishDate(event.createdAt) }}
                </div>
              </div>

              <div class="font-roboto"><p v-html="event.description"></p></div>
              <div class="flex justify-between">
                <UiButton
                  @click="readMore(event.id)"
                  class="inline-block px-2 py-1 text-xs font-semibold text-gray-800 transition bg-gray-200 rounded font-montserrat hover:scale-105 hover:bg-gray-300"
                >
                  Read more...
                </UiButton>
                <ShareButton :item="{ id:event.id, type:'event', slug:event.slug, title:event.title, excerpt:event.description }" />
              </div>
            </div>
          </template>

          <!-- Empty state (match calendar card height) -->
          <template v-else>
            <div
              class="flex h-[420px] w-full flex-col items-center justify-center rounded-xl border bg-white text-center text-gray-500 shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mb-4 text-red-700 h-14 w-14"
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
                class="px-4 py-2 mt-4 text-sm font-semibold text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
              >
                Show all events
              </UiButton>
            </div>
          </template>
        </div>

        <!-- RIGHT: Calendar (narrow) + More events -->
        <div class="hidden md:block md:w-[420px] md:justify-self-end">
          <div class="space-y-5">
            <!-- Calendar card (narrower) -->
            <div class="p-6 bg-white shadow-xl rounded-xl">
  <AutoFitCalendar
    :attributes="calendarAttributes"
    v-model:selectedDate="selectedDate"
    @date-click="handleDayClick"
  />
</div>


            <!-- More events -->
            <div
              v-if="oldEvents.length"
              class="p-6 bg-white border shadow-xl rounded-xl border-neutral-200"
            >
              <div class="flex items-center gap-2 pb-3 mb-3 border-b border-neutral-300">
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

              <ul class="space-y-2">
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
                  <span class="text-xs text-gray-500 shrink-0">{{
                    miniDate(ev.createdAt || ev.date)
                  }}</span>
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
  import AutoFitCalendar from "@/components/AutoFitCalendar.vue";
  import DropdownMenuContent from "@/components/Ui/DropdownMenu/Content.vue";
  import DropdownMenu from "@/components/Ui/DropdownMenu/DropdownMenu.vue";
  import DropdownMenuItem from "@/components/Ui/DropdownMenu/Item.vue";
  import DropdownMenuTrigger from "@/components/Ui/DropdownMenu/Trigger.vue";
  import { isSameDay, parseISO } from "date-fns";
  import { collection, getDocs, orderBy, query } from "firebase/firestore";
  import { Building2, Globe, GraduationCap, ListFilter, School, Users } from "lucide-vue-next";
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useFirestore } from "vuefire";

  // Which event type is selected (for the chip filter)
const typeFilter = ref<"all" | "university" | "faculty" | "students" | "department" | "general">("all");


  const selectedLabel = computed(() => {
    return TYPE_OPTIONS.find((opt) => opt.value === typeFilter.value)?.label || "All events";
  });

  const selectedIcon = computed(() => {
    return TYPE_OPTIONS.find((opt) => opt.value === typeFilter.value)?.icon || ListFilter;
  });

  function setFilter(val: (typeof TYPE_OPTIONS)[number]["value"]) {
    typeFilter.value = val;
    selectedDate.value = null;
  }

  // Options for the chip UI
// Filter dropdown options — uses canonical eventType values
const TYPE_OPTIONS = [
  { value: "all",        label: "All events",  icon: ListFilter },
  { value: "university", label: "University",  icon: GraduationCap },         // top-level / college-wide
  { value: "faculty",    label: "Faculty",     icon: School },        // department faculty
  { value: "students",   label: "Students",    icon: Users }, // student-facing
  { value: "department", label: "Department",  icon: Building2 },         // single-department events
  { value: "general",    label: "General",     icon: Globe },    // misc / public
] as const;

  const MAX_VISIBLE = 3;
  const MAX_OLD_EVENTS = 10;
  // 16:9 ratio (height/width = 9/16 = 56.25%)
  const ratioPadding = "42.857%"; // 21:9 (shorter than 16:9)

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

  // normalize helper (lowercase, convert spaces/underscores to hyphen, strip extra chars)
  const normalizeType = (v: any) =>
    String(v || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // replace spaces/underscores/multiple chars with single hyphen
      .replace(/(^-|-$)/g, ""); // trim leading/trailing hyphens

  const wanted = typeFilter.value; // already canonical (e.g. 'university' or 'department')
  return sortedByDateDesc.value.filter((e) => normalizeType(e.eventType) === wanted);
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

  const calendarAttributes = computed(() => {
    const attrs: any[] = [];

    for (const e of events.value) {
      const start = asDate(e.date);
      const end = asDate(e.dateEnd);

      if (!start) continue;

      if (end && end > start) {
        // multi-day: highlight the span
        attrs.push({
          key: `range-${e.id}`,
          highlight: true,
          dates: { start, end },
          popover: { label: e.title || "Event" },
        });
      } else {
        // single-day: dot
        attrs.push({
          key: `dot-${e.id}-${+start}`,
          dates: start,
          dot: true,
          popover: { label: e.title || "Event" },
        });
      }
    }

    return attrs;
  });

  /** skeleton visibility (template still uses it) */
  const isContentVisible = ref(false);

  const filteredEvents = computed(() => {
    const list = listByType.value;
    if (selectedDate.value) {
      const d = selectedDate.value as Date;
      return list.filter((e) => inDayRange(e, d));
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
      selectedDate.value = null;
    } else {
      selectedDate.value = d;
      // optional: ensure type filter doesn't hide the clicked date
      // typeFilter.value = 'all'
    }

    // smooth scroll to the events list
    nextTick(() => {
      document.getElementById("events-list")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
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

  function formatEventDate(start: any, end?: any): string {
    // add this
    if (!start) return "";

    const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
    const s = new Date(start).toLocaleDateString("en-US", opts);

    if (end) {
      const e = new Date(end).toLocaleDateString("en-US", opts);
      return `${s} - ${e}`;
    }

    return s;
  }

  function formatPublishDate(val: any): string {
    // add this
    if (!val) return "";
    const d = typeof val?.toDate === "function" ? val.toDate() : new Date(val);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function miniDate(val: any): string {
    const d = typeof val?.toDate === "function" ? val.toDate() : new Date(val);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function inDayRange(e: any, day: Date): boolean {
    const s = asDate(e.date);
    if (!s) return false;

    // normalize to whole-day comparisons
    const d0 = new Date(day);
    d0.setHours(0, 0, 0, 0);
    const s0 = new Date(s);
    s0.setHours(0, 0, 0, 0);

    const maybeEnd = asDate(e.dateEnd);
    if (maybeEnd) {
      const e0 = new Date(maybeEnd);
      e0.setHours(23, 59, 59, 999); // inclusive end
      return d0 >= s0 && d0 <= e0;
    }
    // single-day event
    return d0.getTime() === s0.getTime();
  }

  //calendar filter
  const asDate = (val: any): Date | null => {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (typeof val?.toDate === "function") return val.toDate(); // Firestore Timestamp
    if (typeof val === "string" || typeof val === "number") return new Date(val);
    return null;
  };

  // const DOT_RED = '#ef4444' // or simply 'red'
  /** Option A: one dot per event (VCalendar stacks dots for same day) */
  const dotEvents = computed(() => {
    return events.value
      .map((e: any) => {
        const d = asDate(e.date);
        if (!d) return null;
        return {
          date: d,
          // color: DOT_RED,                // 🔴 always red
          label: e.title || "Event",
        };
      })
      .filter(Boolean) as { date: Date; color: string; label?: string }[];
  });
</script>

<style>
  /* *{
    outline:red solid 1px;
  } */
</style>
