<template>
  <main class="bg-white ">
      <!-- 🔼 Hero Slider -->
      <div class="relative w-full h-auto overflow-hidden">
        <!-- Arrows -->
        <button
          class="absolute z-10 flex items-center justify-center h-16 transition transform -translate-y-1/2 bg-red-900 border shadow-lg md:right-20 top-1/2 md:h-28 rounded-xl right-4"
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

        <button
          class="absolute z-10 flex items-center justify-center h-16 transition transform -translate-y-1/2 bg-red-900 border shadow-lg md:left-20 top-1/2 md:h-28 rounded-xl left-4"
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

        <!-- Dots -->
        <div class="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-2 md:bottom-4 left-1/2">
          <span
            v-for="(image, index) in images"
            :key="index"
            class="bg-gray-400 rounded-full size-2"
            :class="{ 'bg-gray-800': currentIndex === index }"
            @click="setCurrentSlide(index)"
          ></span>
        </div>

        <!-- view port -->
        <div class="relative mx-auto md:w-[80%] overflow-hidden rounded-xl w-[100%]">
          <!-- Slides Wrapper -->
          <div
            class="flex transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * (100 / images.length)}%)`, width: `${images.length * 100}%` }"
          >
            <!-- Each Slide -->
            <div
              v-for="(image, index) in images"
              :key="index"
              class="flex items-center justify-center flex-shrink-0 w-full md:h-128"
              :style="{ flex: `0 0 ${100 / images.length}%` }"
            >
              <img
                :src="image.src"
                :alt="image.alt || `Slide ${index + 1}`"
                class="object-cover w-full h-full rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 📰 Events -->
      <div class="py-5 mx-auto md:px-4 md:py-10 md:max-w-7xl">
        <!-- 🏷 Section Title -->
        <div class="text-center md:pt-4">
          <span class="text-xl font-extrabold tracking-wide uppercase md:text-5xl text-maroon font-playfair">EVENTS</span>
        </div>

        <div class="flex flex-col justify-center md:px-10 md:flex-row ">
          <!-- 📅 left side -->
          <div class="flex flex-col w-full pt-5 space-y-6 md:w-3/4">
            <template v-if="filteredEvents.length > 0">
              <div
                v-for="event in filteredEvents"
                :key="event.id"
                class="w-full p-5 bg-white rounded-lg shadow-2xl md:w-4/5"
              >
                <!-- Date -->
                <span class="font-semibold text-red-800 text-md md:text-2xl font-inter">
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
                    class="absolute z-10 text-red-900 transition transform -translate-y-1/2 rounded-full shadow-md md:size-10 size-8 right-3 bg-white/80 hover:scale-105 hover:bg-white top-36"
                    @click="event.currentSlide = (event.currentSlide + 1) % event.coverImages.length"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto font-bold size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                  <button
                    class="absolute z-10 text-red-900 transition transform -translate-y-1/2 rounded-full shadow-md md:size-10 size-8 left-3 top-36 bg-white/80 hover:scale-105 hover:bg-white"
                    @click="event.currentSlide = (event.currentSlide - 1 + event.coverImages.length) % event.coverImages.length"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto font-bold size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>

                  <!-- Dots -->
                  <div class="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-7 left-1/2">
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
                  <span class="text-xl font-semibold md:text-2xl font-roboto">{{ event.title }}</span>
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
              <div class="w-224 min-h-[300px] flex flex-col items-center justify-center rounded border-2 bg-white text-center text-gray-500 shadow">
                <!-- Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mb-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 2v2m8-2v2M3 8h18M5 8h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12l-6 6m0-6l6 6" />
                </svg>
                <p class="text-lg font-semibold">No events on this day.</p>
                <p class="text-sm">Try selecting another date on the calendar.</p>

                <button
                  v-if="selectedDate"
                  @click="selectedDate = null"
                  class="self-center px-4 py-2 mt-4 text-sm font-semibold text-gray-700 bg-gray-300 rounded w-fit hover:bg-gray-400"
                >
                  Show all events
                </button>
              </div>
            </template>
          </div>

          <!--  Right Side -->
          <div class="hidden md:block ">
            <div class="flex flex-col items-center pt-5 space-y-5">
              <!-- Calendar -->
              <div class="">
                <div class="flex justify-center bg-white shadow-xl rounded-xl">
                  <UiCalendar @dayclick="handleDayClick" class="bg-neutral-100"/>
                </div>
              </div>
  
              <!-- Facebook Card -->
              <div class="p-6 space-y-4 bg-white border shadow-xl w-96 rounded-xl border-neutral-200 font-roboto">
                <div class="flex items-center pb-3 space-x-3 border-b border-neutral-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-maroon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.9c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z" />
                  </svg>
                  <h3 class="text-lg font-semibold text-maroon">Follow us on Facebook</h3>
                </div>
                <p class="text-sm text-gray-700">Get the latest updates and announcements straight from our official page.</p>
                <a
                  href="https://www.facebook.com/cetseb"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-gray-800 transition bg-gray-200 rounded-sm font-montserrat hover:bg-gray-300 hover:scale-105"
                >
                  Visit Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  </main>
</template>

<script lang="ts" setup>
import { isSameDay, parseISO } from "date-fns";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useFirestore } from "vuefire";
import { useRoute } from "vue-router";
import Item from "~/components/Ui/Accordion/Item.vue";

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
  if (!selectedDate.value) return events.value;
  return events.value.filter((event) => isSameDay(parseISO(event.date), selectedDate.value as Date));
});

function handleDayClick(day: any) {
  selectedDate.value = new Date(day.date);
}

const router = useRouter()
function readMore(id: string) {
  router.push(`/events/${id}`)
}
</script>


<style>
  /* *{
    outline:red solid 1px;
  } */
</style>
