<template>
    <main class="pb-4 bg-stone-200">
        <div class="relative flex items-center w-full border-b-2 font-playfair ">
            <img src="/images/cet_administration.jpg" alt="" class="object-cover w-full h-128">
            <div class="absolute flex items-center left-[120px] h-28 w-224 bg-gray-700 bg-opacity-90">
                <span class="pl-5 text-6xl text-white">Facilities And Administration</span>
            </div>
        </div>
        <div class="flex flex-col items-center justify-center h-auto mx-auto mt-16 mb-16 border-2 shadow-2xl w-384 bg-neutral-50 pb-14">
            <div class="pb-5 mt-16 ml-10 border-b-4 w-224">
                <span class="text-5xl font-bold text-red-800 font-playfair">CET Management Committee and Staff</span>
            </div>   
            <div class="flex flex-col items-center justify-center mt-40 space-y-4">
                <span class="text-lg font-semibold font-montserrat">College Dean</span>
                <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
            </div>
            <div class="flex flex-col items-center justify-center mt-16 space-y-4">
                <span class="text-lg font-semibold font-montserrat">College Secretary</span>
                <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
            </div>
            <div class="grid grid-cols-3 gap-16 mt-16">
                <div class="flex justify-center col-span-3">
                    <span class="text-lg font-semibold font-montserrat">Department Heads</span>
                </div>
                <div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div>
                <div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div>
                <div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div>
                <div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div>
                <div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div>
                <div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div>

                <div class="flex justify-center col-span-3">
                    <span class="text-lg font-semibold font-montserrat">Administrative Staff</span>
                </div>
                <div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div><div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div><div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div><div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div><div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div><div class="">
                    <UiSkeleton class="h-56 w-72 rounded-xl bg-stone-400 hover:size-96"></UiSkeleton>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    definePageMeta({
        layout: "custom",
    });
</script>

<style>
/* * {
    outline: 1px solid red;
} */
</style>
