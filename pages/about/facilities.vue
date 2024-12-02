<template>
    <main class="pb-4 bg-stone-200">
        <div class="relative flex items-center w-full border-b-2 font-playfair ">
            <img src="/images/cet_facilities.jpg" alt="" class="object-cover w-full h-128">
            <div class="absolute flex items-center left-[120px] h-28 w-96 bg-gray-700 bg-opacity-90">
                <span class="pl-5 text-6xl text-white">Facilities</span>
            </div>
        </div>
        <div class="h-auto mx-auto border-2 shadow-2xl mt-14 mb-14 w-304 bg-neutral-50">
            <UiSkeleton class="mx-auto mt-16 shadow-lg h-96 w-288 bg-stone-600"></UiSkeleton>
            <UiSkeleton class="mx-auto mt-4 shadow-lg h-96 w-288 bg-stone-600"></UiSkeleton>
            <UiSkeleton class="mx-auto mt-4 shadow-lg h-96 w-288 bg-stone-600"></UiSkeleton>
            <UiSkeleton class="mx-auto mt-4 mb-16 shadow-lg h-96 w-288 bg-stone-600"></UiSkeleton>
        </div>
    </main>
</template>

<script>
    definePageMeta({
        layout: 'custom',
    });
</script>
