<template>
   <main class="pb-4 bg-stone-200">
        <div class="relative flex items-end w-full border-b-2 font-playfair ">
            <img src="/images/cs.jpg" alt="" class="object-cover mx-auto w-432 h-160">
            <div class="absolute flex items-center left-[120px] h-28 w-288 bg-gray-700 bg-opacity-60">
                <span class="pl-5 text-6xl text-white">Bachelor of Science in Computer Science</span>
            </div>
        </div>
        <!-- mini navigator -->
        <nav class="flex justify-center h-16 mx-auto mt-4 text-xl font-semibold bg-neutral-400 w-432" >
            <div class="flex items-center justify-center w-48 cursor-pointer hover:bg-neutral-50" :class="{'bg-neutral-50': activeTab === 'news'}" @click="switchTab('news')">
                <button >News</button>
            </div>
            <div class="flex items-center justify-center w-48 cursor-pointer hover:bg-neutral-50" :class="{ 'bg-neutral-50': activeTab === 'department'}" @click="switchTab('department')">
                <button>Department</button>
            </div>
            <div class="flex items-center justify-center w-48 cursor-pointer hover:bg-neutral-50" :class="{ 'bg-neutral-50': activeTab === 'facStaf'}" @click="switchTab('facStaf')">
                <button >Faculty and Staff</button>
            </div>
            <div class="flex items-center justify-center w-48 cursor-pointer hover:bg-neutral-50" :class="{ 'bg-neutral-50': activeTab === 'prospectus'}" @click="switchTab('prospectus')">
                <button >Prospectus</button>
            </div>
        </nav>
        <!-- main content -->
         <div class="flex justify-center gap-8 mx-auto">
            <!-- left -->
            <div class="flex flex-col gap-5">
                <div class="h-48 pt-4 pl-4 pr-4 shadow-xl w-72 bg-neutral-50 font-roboto">
                    <div class="pb-4 mb-3 border-b-4">
                        <span class="text-2xl font-bold">Vission</span>
                    </div>
                    <p class="text-lg font-base">
                        Center of execellence in commputer science and technololy in the Visayas.
                    </p>
                </div>
                <div class="h-56 pt-4 pl-4 pr-4 shadow-xl w-72 bg-neutral-50 font-roboto">
                    <div class="pb-4 mb-3 border-b-4">
                        <span class="text-2xl font-bold">Mission</span>
                    </div>
                    <p class="text-lg font-base">
                        Attainment of the highest human capital and scientific knowledge in the field of Computer Science.
                    </p>
                </div>
                <div class="h-40 pt-4 pl-4 pr-4 shadow-xl w-72 bg-neutral-50 font-roboto">
                    <div class="pb-4 mb-2 border-b-4 ">
                        <span class="text-2xl font-bold">Facebook Page</span>
                    </div>
                    <span class="text-lg font-base">
                        Visit out Facebook Page
                    </span>
                    <div class="flex justify-center w-24 mt-2 rounded-lg shadow-xl bg-stone-500">
                        <span class="text-lg">Click here</span>
                    </div>
                </div>
            </div>
            <!-- middle -->
            <div  class="flex justify-center mb-16 shadow-xl bg-neutral-50 w-304">
                <!-- news -->
                <div class="relative" v-if="activeTab === 'news'">
                    <!-- first slide -->
                     <div class="grid grid-cols-2 gap-16 mt-10 mb-10" v-if="currentSlide === 0">
                         <div class="shadow-xl h-72 w-128 bg-neutral-300"  >
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                        </div>
                    </div>
                    <!-- second slide -->
                     <div class="grid grid-cols-2 gap-16 mt-10 mb-10" v-if="currentSlide === 1">
                         <div class="shadow-xl h-72 w-128 bg-neutral-300"  >
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                        </div>
                    </div>
                    <!-- third slide -->
                     <div class="grid grid-cols-2 gap-16 mt-10 mb-10" v-if="currentSlide === 2">
                         <div class="shadow-xl h-72 w-128 bg-neutral-300"  >
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                         </div>
                         <div class="shadow-xl h-72 w-128 bg-neutral-300">
                             <UiSkeleton class="h-48 w-128 bg-stone-500"></UiSkeleton>
                             <div class="pl-5 pr-5 mt-5 mb-5">
                                 <span class="text-lg font-roboto">Sample: The Departmen of Computer Science and Technology (DCST) was established on March 2002</span>
                             </div>
                        </div>
                    </div>
                    <!-- slider -->
                    <div class="flex items-center justify-center w-full transform translate-x-42 left-1/2">
                        <!-- botton -->
                        <div class="flex items-center justify-center gap-56">
                            <button class="w-12 h-14 bg-stone-400 hover:bg-stone-600" @click="prevSlide">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left size-12"><path d="m15 18-6-6 6-6"/></svg>
                            </button>
                            <button class="w-12 h-14 bg-stone-400 hover:bg-stone-600" @click="nextSlide">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" lucide lucide-chevron-right size-12"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                        </div>
                        <!-- index indicator -->
                        <div class="absolute flex items-center justify-center space-x-4 ">
                            <span
                            v-for="index in totalSlides"
                            :key="index"
                            class="flex items-center justify-center w-4 h-4 font-semibold transition-colors rounded-full shadow-xl cursor-pointer"
                            :class="currentSlide === index -1 ? ' bg-red-800 w-6 h-6' : 'bg-stone-300'"
                            >
                            </span>
                        </div>
                    </div>
                </div>
                <!-- department -->
                <div v-show="activeTab === 'department'" class="font-playfair">
                    <div class="pt-10 pb-10">
                        <div class="mb-10 ml-10 mr-10">
                            <img src="/images/cs_dcst.jpg" alt="" class="object-cover">
                        </div>
                        <div class="flex justify-center ">
                            <span class="text-5xl font-bold ">Department of Computer Science and Technology</span>
                        </div>
                        <div class="m-16">
                            <p class="text-lg">
                                The <b>Department of Computer Science and Technology (DCST) </b>was established on March 2002. With the conversion of the Visayas State College of Agriculture (ViSCA) into VSU, the section was developed into an academic department and is now one of the five departments under the College of Engineering. The Bachelor of Science in Computer Science program was approved by the VSU Board of Regents on February 8, 2002 under Resolution No. 17 series of 2002 and was formally offered by DCST in the first semester of SY 2002 - 2003.
                                <br><br>
                                <b>Goals</b>
                                <br>
                                Excellent and relevant education in computer science and technology.
                                Generate appropriate knowledge in Information and Communications Technology relevant to agricultural production, processing, utilization, technology generation and disseminations.
                                Sustainable linkages and cooperation with public and private institutions in instruction, research and developments and extension.
                                Dynamic linkages with other agencies and institutions for the promotion of instruction, research, extension programs in computer science and allied fields.
                                Sustained linkages among the various units within the university to support developmental programs.
                            </p>     
                        </div>
        
                    </div>

                </div>
                <!-- faculty and staff -->
                <div v-show="activeTab === 'facStaf'">
                    <div class="w-full pt-5 text-center bg-red-800 h-36">
                        <span class="text-5xl">DEPARTMENT OF COMPUTER SCIENCE AND TECHNOLOGY ORGANIZATION CHART</span>
                    </div>
                    <div class="grid grid-cols-3 gap-10 m-10">
                        <div class="flex flex-col items-center justify-center shadow-xl">
                            <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                            <span class="text-xl">Jannet C. Bencure</span>
                            <span class="text-lg">College Dean</span>
                        </div>
                        <div class="flex flex-col items-center justify-center shadow-xl">
                            <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                            <span class="text-xl">Jannet C. Bencure</span>
                            <span class="text-lg">College Dean</span>
                        </div>
                        <div class="flex flex-col items-center justify-center shadow-xl">
                            <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                            <span class="text-xl">Jannet C. Bencure</span>
                            <span class="text-lg">College Dean</span>
                        </div>
                        <div class="flex flex-col items-center justify-center shadow-xl">
                            <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                            <span class="text-xl">Jannet C. Bencure</span>
                            <span class="text-lg">College Dean</span>
                        </div>
                        <div class="flex flex-col items-center justify-center shadow-xl">
                            <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                            <span class="text-xl">Jannet C. Bencure</span>
                            <span class="text-lg">College Dean</span>
                        </div>
                        <div class="flex flex-col items-center justify-center shadow-xl">
                            <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                            <span class="text-xl">Jannet C. Bencure</span>
                            <span class="text-lg">College Dean</span>
                        </div>
                        <div class="flex flex-col items-center justify-center shadow-xl">
                            <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                            <span class="text-xl">Jannet C. Bencure</span>
                            <span class="text-lg">College Dean</span>
                        </div>
                        <div class="flex flex-col items-center justify-center shadow-xl">
                            <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                            <span class="text-xl">Jannet C. Bencure</span>
                            <span class="text-lg">College Dean</span>
                        </div>
                        <div class="flex flex-col items-center justify-center shadow-xl">
                            <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                            <span class="text-xl">Jannet C. Bencure</span>
                            <span class="text-lg">College Dean</span>
                        </div>
                    </div>
                </div>
                <!-- prospectus -->
                <div v-show="activeTab === 'prospectus'">
                <div class="m-10">
                    <UiSkeleton class="h-272 w-272 rounded-xl bg-stone-400"></UiSkeleton>
                </div>
                </div>
            </div>
            <!-- right -->
            <div class="border-t-8 border-yellow-500 shadow-xl h-192 bg-neutral-50 font-playfair w-72">
                <div class="flex justify-center h-16 border-b-4 ">
                    <span class="text-3xl italic font-bold text-red-800 font-roboto">Upcoming Events</span>
                </div>
                <div class="flex flex-col gap-3 m-5 text-lg shadow-xl">
                    <span class="italic ">Septemver 09, 2024</span>
                    <span class="text-2xl">Acaquaintance Party</span>
                    <div class="pb-3 mt-3 border-b-4 ">
                        <span class="text-red-800">Read More ▶</span>
                    </div>
                </div>
                <div class="flex flex-col gap-3 m-5 text-lg shadow-xl">
                    <span class="italic ">Septemver 09, 2024</span>
                    <span class="text-2xl">Acaquaintance Party</span>
                    <div class="pb-3 mt-3 border-b-4 ">
                        <span class="text-red-800">Read More ▶</span>
                    </div>
                </div>
                <div class="flex flex-col gap-3 m-5 text-lg shadow-xl">
                    <span class="italic ">Septemver 09, 2024</span>
                    <span class="text-2xl">Acaquaintance Party</span>
                    <div class="pb-3 mt-3 border-b-4 ">
                        <span class="text-red-800">Read More ▶</span>
                    </div>
                </div>
                <div class="flex flex-col gap-3 m-5 text-lg shadow-xl">
                    <span class="italic ">Septemver 09, 2024</span>
                    <span class="text-2xl">Acaquaintance Party</span>
                    <div class="pb-3 mt-3 border-b-4 ">
                        <span class="text-red-800">Read More ▶</span>
                    </div>
                </div>
            </div>
         </div>

   </main>

</template>

<script lang="ts" setup>
    definePageMeta({
        layout: "custom",
    });

    //for mini navigator
    const activeTab = ref('news')

    const switchTab = (tab: string) => {
        activeTab.value = tab
    }
    // for the news navigation
    import { ref } from 'vue'    
    const currentSlide = ref(0);
    const totalSlides = 3;

    const nextSlide = () => {
        currentSlide.value = (currentSlide.value + 1) % totalSlides
    };

    const prevSlide = () => {
        currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
    };           
</script>

<style>
/* *  {
    outline: 1px solid red;
} */
</style>
