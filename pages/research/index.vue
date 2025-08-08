<template>
    <main  class="pb-4 bg-stone-200">
        <div class="relative flex items-center w-full border-b-2 font-playfair">
            <img src="/images/cet.jpg" alt="Graduate Cover" class="object-cover w-full h-44 md:h-128" />
            <div class="absolute flex items-center top-28 md:top-40 left-6 md:left-[120px] h-10 w-40 md:h-28 md:w-96 bg-gray-700/90">
                <span class="pl-2 text-xl text-white md:pl-5 md:text-6xl">Research</span>
            </div>
        </div>
        <div class="flex justify-end pt-4 space-x-4">
            <!-- year -->
            <div class="flex items-center justify-center w-16 h-6 space-x-1 text-center border-2 border-gray-900">
                <span class="text-base text-center text-gray-700 ">Year</span>
                <ChevronDown class="w-4 h-4 text-black" />
            </div>
            <!-- departments -->
            <div class="flex items-center justify-center h-6 space-x-1 text-center border-2 border-gray-900 w-28">
                <span class="text-base text-center text-gray-700 ">Department</span>
                <ChevronDown class="w-4 h-4 text-black" />
            </div>
        </div>
        <div>
            
        </div>
    </main>
</template>
<script setup lang="ts">
    import ChevronDown from "@/components/Icons/ChevronDown.vue";

    definePageMeta({ layout: 'custom' })

</script>