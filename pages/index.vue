<template>
  <main class="overflow-hidden">
    <!-- 🔼 Hero Slider -->
    <div class="relative w-full overflow-hidden my-7 h-128">
      <!-- Arrows -->
      <button
        class="absolute z-10 flex items-center justify-center transition transform -translate-y-1/2 border shadow-lg right-4 top-1/2 h-28 rounded-xl border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20"
        @click="nextSlide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="text-black lucide lucide-chevron-right size-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <button
        class="absolute z-10 flex items-center justify-center transition transform -translate-y-1/2 border shadow-lg left-4 top-1/2 h-28 rounded-xl border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20"
        @click="prevSlide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="text-black lucide lucide-chevron-left size-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Dots -->
      <div class="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
        <span
          v-for="(image, index) in images"
          :key="index"
          class="w-3 h-3 bg-gray-400 rounded-full"
          :class="{ 'bg-gray-800': currentIndex === index }"
          @click="setCurrentSlide(index)"
        ></span>
      </div>

      <!-- Slides -->
      <div
        class="flex transition-transform ease-in-out duration-2000"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div v-for="(image, index) in images" :key="index" class="flex-shrink-0 w-full h-full">
          <img
            :src="image.src"
            alt=""
            class="object-contain w-full h-full mx-auto bg-black"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- 📰 Events + Right Panel -->
  <div class="w-full bg-stone-200">
  <!-- 🏷 Section Title -->
  <div class="pt-8 text-center">
    <h2 class="text-5xl font-extrabold tracking-wide uppercase text-maroon">EVENTS</h2>
  </div>

  <div class="flex justify-center gap-8 px-6 lg:px-12">
    <!-- 📅 Events or Empty State -->
    <div class="flex flex-col items-center w-full max-w-screen-lg gap-10 pt-10">
      <template v-if="filteredEvents.length > 0">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="p-10 border-2 border-t-2 shadow-xl w-224 bg-neutral-50"
        >
          <!-- Date -->
          <span class="text-2xl font-semibold text-red-800 font-roboto">
            DAY
            {{
              new Date(event.date)
                .toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
                .toUpperCase()
            }}
          </span>

          <!-- Carousel -->
          <div class="relative overflow-hidden">
            <div
              class="flex pt-4 pb-4 transition-transform duration-500"
              :style="{ transform: `translateX(-${event.currentSlide || 0}00%)` }"
            >
              <div v-for="(img, i) in event.coverImages" :key="i" class="flex-shrink-0 w-full">
                <img :src="img" alt="" class="object-cover h-128 w-208" />
              </div>
            </div>

            <!-- Arrows -->
            <button
              class="absolute z-10 w-10 h-10 text-gray-800 transition transform -translate-y-1/2 rounded-full shadow-md right-3 top-1/2 bg-white/80 hover:scale-105 hover:bg-white"
              @click="event.currentSlide = (event.currentSlide + 1) % event.coverImages.length"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button
              class="absolute z-10 w-10 h-10 text-gray-800 transition transform -translate-y-1/2 rounded-full shadow-md left-3 top-1/2 bg-white/80 hover:scale-105 hover:bg-white"
              @click="event.currentSlide = (event.currentSlide - 1 + event.coverImages.length) % event.coverImages.length"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <!-- Dots -->
            <div class="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-12 left-1/2">
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
          <div class="pt-2 pb-4">
            <span class="text-2xl font-semibold font-montserrat">{{ event.title }}</span>
          </div>
          <div class="font-roboto">
            <p v-html="event.description"></p>
          </div>
          <router-link
            :to="`/events/${event.id}`"
            class="inline-block px-5 py-2 mt-4 text-sm font-semibold text-white transition bg-red-800 rounded shadow hover:bg-red-900"
          >
            Read more
          </router-link>
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

    <!-- 📅 Right Side -->
    <div class="flex flex-col gap-10 pt-10">
      <div class="shadow-xl">
        <div class="flex justify-center">
          <UiCalendar @dayclick="handleDayClick" />
        </div>
      </div>

      <!-- Facebook Card -->
      <div class="p-6 space-y-4 bg-white border shadow-md w-96 rounded-xl border-neutral-200 font-roboto">
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
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition rounded-md shadow bg-maroon hover:bg-red-900"
        >
          Visit Page
        </a>
      </div>
    </div>
    </div>

    <!-- Skeleton & Toggle -->
    <div class="pt-10  pr-100">
      <div class="flex justify-center w-full" v-if="isContentVisible">
        <div class="flex items-center space-x-4">
          <div class="space-y-24">
            <UiSkeleton class="shadow-xl h-144 w-224" />
            <UiSkeleton class="shadow-xl h-144 w-224" />
          </div>
        </div>
      </div>
    </div>
  </div>

  </main>
</template>

<script lang="ts" setup>
  import { addDays, endOfMonth, isSameDay, parseISO, startOfMonth, startOfToday } from "date-fns";
  import { collection, getDocs } from "firebase/firestore";
  import { computed, onMounted, onUnmounted, ref } from "vue";
  import { useFirestore } from "vuefire";

  const events = ref<any[]>([]);
  // Filter selected date
  const selectedDate = ref<Date | null>(null);

  const loading = ref(true);
  const slideIndices = ref<{ [eventId: string]: number }>({});
  const db = useFirestore();
  const images = [
    { src: "/images/cet.jpg", alt: "Slide 1" },
    { src: "/images/cet1.jpg", alt: "Slide 2" },
    { src: "/images/cet2.jpg", alt: "Slide 3" },
    { src: "/images/cet3.jpg", alt: "Slide 4" },
  ];

  //main slideshow
  const currentIndex = ref(0);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
  };

  const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
  };

  const setCurrentSlide = (index: number) => {
    currentIndex.value = index;
  };

  onMounted(async () => {
    const snap = await getDocs(collection(db, "events"));
    events.value = snap.docs.map((doc) => ({
      id: doc.id,
      currentSlide: 0, // ✅ initialize currentSlide here
      ...doc.data(),
    }));

    loading.value = false;
  });

  // Carousel controls
  function nextImage(eventId: string) {
    const event = events.value.find((e) => e.id === eventId);
    if (!event || !event.coverImages) return;
    slideIndices.value[eventId] = (slideIndices.value[eventId] + 1) % event.coverImages.length;
  }

  function prevImage(eventId: string) {
    const event = events.value.find((e) => e.id === eventId);
    if (!event || !event.coverImages) return;
    slideIndices.value[eventId] =
      (slideIndices.value[eventId] - 1 + event.coverImages.length) % event.coverImages.length;
  }
  onMounted(() => {
    Promise.all(
      images.map((image) => {
        const img = new Image();
        img.src = image.src;
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Resolve on error to avoid blocking
        });
      })
    ).then(() => {
      intervalId = setInterval(nextSlide, 3000);
    });
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  //event slideshow
  const images2 = [
    { src: "/images/cet_assembly.jpg", alt: "Slide 1" },
    { src: "/images/cet_assembly1.jpg", alt: "Slide 2" },
    { src: "/images/cet_assembly2.jpg", alt: "Slide 3" },
    { src: "/images/cet_assembly3.jpg", alt: "Slide 4" },
  ];

  const currentSlide = ref(0);

  const nextSlide2 = () => {
    currentSlide.value = (currentSlide.value + 1) % images2.length;
  };

  const prevSlide2 = () => {
    currentSlide.value = (currentSlide.value - 1 + images2.length) % images2.length;
  };

  onMounted(() => {
    intervalId = setInterval(nextSlide2, 3000);
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  // State for toggling content visibility
  const isContentVisible = ref(false);

  // Toggle function for button click
  const toggleContent = () => {
    isContentVisible.value = !isContentVisible.value;
  };

  const filteredEvents = computed(() => {
    if (!selectedDate.value) return events.value;

    return events.value.filter((event) => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, selectedDate.value as Date);
    });
  });

  function handleDayClick(day: any) {
    selectedDate.value = new Date(day.date);
  }
</script>
