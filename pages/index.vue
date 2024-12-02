<template>
  <main class="overflow-hidden"> 
   <div class="relative w-full overflow-hidden h-192"> 
     <!-- arrows-->
     <button class="absolute z-10 flex items-center justify-center transform -translate-y-1/2 bg-red-900 h-28 right-4 top-1/2" @click="nextSlide">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" lucide lucide-chevron-right size-12"><path d="m9 18 6-6-6-6"/></svg>
     </button>
     <button class="absolute z-10 flex items-center justify-center transform -translate-y-1/2 bg-red-900 left-4 top-1/2 h-28" @click="prevSlide">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left size-12"><path d="m15 18-6-6 6-6"/></svg>
     </button>
     
     <!-- dots indicator-->
     <div class="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
       <span
         v-for="(image, index) in images"
         :key="index"
         class="w-3 h-3 bg-gray-400 rounded-full"
         :class="{ 'bg-gray-800': currentIndex === index }"
         @click="setCurrentSlide(index)"
       ></span>
     </div>

     <!-- image container-->
     <div class="flex transition-transform ease-in-out duration-2000" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
       <!-- slides -->
       <div v-for="(image, index) in images" :key="index" class="flex-shrink-0 w-full">
         <img :src="image.src" alt="" class="object-cover w-full h-192" loading="lazy">
       </div>
     </div>
   </div>

    <!--EVENTS-->
   <div class="flex justify-center pt-6 pb-6 font-sans text-5xl font-bold text-red-800">
     <span>EVENTS</span>
   </div>
    <!-- background for event -->
   <div class="w-full bg-stone-200">
     <!--left side-->
     <div class="flex justify-center">
       <div class="items-center pt-4 pl-10 pr-10 m-10 border-2 border-t-2 shadow-xl pb-14 bg-neutral-50 w-224">
         <!--event report-->
           <span class="text-2xl font-semibold text-red-800 font-roboto">DAY 09 OCTOBER 2024</span>
           <div class="relative overflow-hidden">
             <!-- image container-->
             <div class="flex pt-4 pb-4 transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
             <!-- slides -->
               <div v-for="(image2, index) in images2" :key="index" class="flex-shrink-0 w-full">
                 <img :src="image2.src" alt="" class="object-cover w-208 h-128">
               </div>
             </div>
             <!-- arrows-->
             <button class="absolute z-10 flex items-center justify-center h-20 transform -translate-y-1/2 bg-red-900 right-4 top-1/2" @click="nextSlide2">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" lucide lucide-chevron-right size-12"><path d="m9 18 6-6-6-6"/></svg>
             </button>
             <button class="absolute z-10 flex items-center justify-center h-20 transform -translate-y-1/2 bg-red-900 left-4 top-1/2" @click="prevSlide2">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left size-12"><path d="m15 18-6-6 6-6"/></svg>
             </button>
             <!-- dots indicator-->
             <div class="absolute z-10 flex space-x-2 transform -translate-x-1/2 bottom-12 left-1/2">
               <span
                 v-for="(image2, index) in images2"
                 :key="index"
                 class="w-2 h-2 bg-gray-400 rounded-full"
                 :class="{ 'bg-gray-800': currentSlide === index }"
                 @click="setCurrentSlide(index)"
               ></span>
             </div>
           </div>
           <!-- information about the event-->
           <div class="pb-4">
             <span class="text-2xl font-semibold font-montserrat">1st General Assembly SY 2024-2025</span>
           </div>
           <div class="font-roboto">
             <p><b>HAPPPENING NOW:</b> The first General Assembly of the College of Engineering and Technology-Supreme Student Council is in full swing! Exciting discussions and groundbreaking ideas are shaping the future of our college.</p>
           </div>
             
       </div>
           <!--right side-->
         <div>
           <div class="mt-10 shadow-xl">
             <div class="flex justify-center">
               <UiCalendar :attributes="attributes"/>
             </div>
           </div>
           <div class="mt-10 shadow-xl bg-neutral-50 w-96 font-roboto">
             <div class="pt-4 pb-4 mt-3 ml-3 mr-3 border-b-2 border-neutral-400">
               <span class="text-3xl font-semibold">Facebook page</span>
             </div>
             <div class="mt-2 ml-3 mr-3">  
               <span>Visit out facebook page</span>
             </div>
             <div class="pb-1">
               <div class="flex items-center justify-center py-1 mt-3 mb-3 ml-3 rounded-lg cursor-pointer w-28 bg-neutral-300 hover:bg-neutral-500">
                 <a href="https://www.facebook.com/cetseb">Click here</a>
               </div>
             </div>
           </div>
         </div>
       </div>
       <div class="pt-10 pb-10 pr-100">
         <div class="flex justify-center w-full" v-if="isContentVisible">
           <div class="flex items-center space-x-4">
             <div class="space-y-24">
               <UiSkeleton class="shadow-xl w-224 h-144" />
               <UiSkeleton class="shadow-xl w-224 h-144" />
             </div>
           </div>
         </div>
         <button class="flex justify-center mx-auto text-lg text-red-800 shadow-lg hover:font-bold hover:text-xl font-roboto" 
         :class="{ 'pt-1': !isContentVisible, 'mt-10': isContentVisible }"
         @click="toggleContent"> {{ isContentVisible ? 'SEE LESS' : 'READ MORE' }} </button>
       </div>
     </div>
 </main>
</template>

<script lang="ts" setup>
 import { ref, onMounted, onUnmounted } from 'vue'
 import { addDays, endOfMonth, startOfMonth, startOfToday } from "date-fns";

 const images = [
   { src: '/images/cet.jpg', alt: 'Slide 1' },
   { src: '/images/cet1.jpg', alt: 'Slide 2' },
   { src: '/images/cet2.jpg', alt: 'Slide 3' },
   { src: '/images/cet3.jpg', alt: 'Slide 4' }
 ];

 //main slideshow
 const currentIndex = ref(0)
 let intervalId: ReturnType<typeof setInterval> | null = null;
   
   const nextSlide = () => {
     currentIndex.value = (currentIndex.value + 1) % images.length
   };
   
   const prevSlide = () => {
     currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
   };
   
   const setCurrentSlide = (index: number) => {
     currentIndex.value = index
   };
   
   onMounted(() => {
     Promise.all(
     images.map(image => {
       const img = new Image();
       img.src = image.src;
       return new Promise(resolve => {
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
     {src:'/images/cet_assembly.jpg', alt: 'Slide 1'},
     {src:'/images/cet_assembly1.jpg', alt: 'Slide 2'},
     {src:'/images/cet_assembly2.jpg', alt: 'Slide 3'},
     {src:'/images/cet_assembly3.jpg', alt: 'Slide 4'}
   ];
 
   const currentSlide = ref(0)
   
   const nextSlide2 = () => {
     currentSlide.value = (currentSlide.value +1) % images2.length
   };

   const prevSlide2 = () => {
     currentSlide.value = (currentSlide.value - 1 + images2.length) % images2.length
   };

   onMounted(() => {
     intervalId = setInterval(nextSlide2, 3000);
   });
   
   onUnmounted(() => {
     if (intervalId) {
       clearInterval(intervalId);
     }
   });

   //calendar
   const attributes = ref([
   {
     highlight: true,
     popover: {
       label: "Out of town bussiness trip",
     },
     dates: [{
       start: startOfMonth(startOfToday()).toString(),
       end: addDays(startOfMonth(startOfToday()), 3).toString(),
     }],
   },
   {
     popover: {
       label: "Take the dog to the vet",
     },
     dot: "red",
     dates: [{ start: addDays(startOfMonth(startOfToday()), 5).toString(), end: addDays(startOfMonth(startOfToday()), 5).toString() }],
   },
   {
     bar: "green",
     popover: {
       label: "Dinner with friends",
     },
     dates: [{ start: addDays(startOfMonth(startOfToday()), 8).toString(), end: addDays(startOfMonth(startOfToday()), 8).toString() }],
   },
   {
     dot: "purple",
     popover: {
       label: "Take the car to the mechanic",
     },
     dates: [{ start: addDays(startOfMonth(startOfToday()), 14).toString(), end: addDays(startOfMonth(startOfToday()), 14).toString() }],
   },
   {
     highlight: true,
     popover: {
       label: "Family vacation in Ibiza",
     },
     dates: [{
       start: addDays(startOfMonth(startOfToday()), 16).toString(),
       end: addDays(startOfMonth(startOfToday()), 24).toString(),
     }],
   },
   {
     dot: true,
     popover: {
       label: "Take Noah to the football game",
     },
     dates: [{ start: addDays(startOfMonth(startOfToday()), 22).toString(), end: addDays(startOfMonth(startOfToday()), 22).toString() }],
   },
   {
     highlight: true,
     popover: {
       label: "Visit the in-laws",
     },
     dates: [{ start: endOfMonth(startOfToday()).toString(), end: endOfMonth(startOfToday()).toString() }],
   },
   ]);

   //skeleton

   // State for toggling content visibility
   const isContentVisible = ref(false);

   // Toggle function for button click
   const toggleContent = () => {
     isContentVisible.value = !isContentVisible.value;
   };
</script>