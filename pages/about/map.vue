<template>
    <main class="pb-4 bg-stone-200">
        <div class="relative flex items-center w-full border-b-2 font-playfair ">
            <img src="/images/cet_map.jpg" alt="" class="object-cover w-full h-44 md:h-128">
            <div class="absolute flex items-center top-28 md:top-40 left-6 md:left-[120px] h-10 w-40 md:h-28 md:w-96 bg-gray-700/90">
                <span class="pl-2 text-xl text-white md:pl-5 md:text-6xl">Map & Location</span>
            </div>
        </div>
        <div class="w-full h-auto mx-auto mt-10 mb-12 border-2 shadow-2xl md:mt-16 md:w-304 bg-neutral-50">
            <div class="pt-10 pb-5 ml-5 border-b-4 md:ml-10 md:pt-16 w-80 md:w-144">
                <span class="text-2xl font-bold text-red-900 md:text-5xl font-playfair">Map and Location</span>
            </div>
            <div class="pl-4 pr-4 mt-8 cursor-pointer md:mt-14">
                <a href="https://www.google.com/maps/place/College+of+Engineering+and+Technology/@10.746098,124.7950154,504m/data=!3m1!1e3!4m6!3m5!1s0x3307978c88e54c05:0xd80448008c3ab440!8m2!3d10.7470925!4d124.7950265!16s%2Fg%2F11jp1tg529!5m1!1e2?entry=ttu&g_ep=EgoyMDI0MTExMy4xIKXMDSoASAFQAw%3D%3D">
                    <img src="/images/map.png" alt="vsu map" class="object-cover w-full h-56 rounded-md md:h-128 md:w-288">
                </a>
            </div>
            <div class="m-6 md:m-10 font-roboto">
                <span class="text-3xl font-bold">Direction to VSU</span>
                <br>
                <br>
                <p class="text-lg font-medium">
                    The College of Engineering and Technology is located at the top of Visayas State University. Upon arriving at the main gate, it will take an estimated 10-minute walk.
                </p>
            </div>
        </div>
    </main>
</template>

<script>
    definePageMeta({
        layout: "custom",
    });
</script>
