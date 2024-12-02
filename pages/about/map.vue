<template>
    <main class="pb-4 bg-stone-200">
        <div class="relative flex items-center w-full border-b-2 font-playfair ">
            <img src="/images/cet_map.jpg" alt="" class="object-cover w-full h-128">
            <div class="absolute flex items-center left-[120px] h-28 w-128 bg-gray-700 bg-opacity-90">
                <span class="pl-5 text-6xl text-white">Map & Location</span>
            </div>
        </div>
        <div class="h-auto mx-auto mt-16 mb-16 border-2 shadow-2xl w-304 bg-neutral-50">
            <div class="pb-5 mt-16 ml-10 border-b-4 w-144">
                <span class="text-5xl font-bold text-red-800 font-playfair">Map and Location</span>
            </div>
            <div class="pl-4 pr-4 mx-auto cursor-pointer mt-14 h-128 w-288">
                <a href="https://www.google.com/maps/place/College+of+Engineering+and+Technology/@10.746098,124.7950154,504m/data=!3m1!1e3!4m6!3m5!1s0x3307978c88e54c05:0xd80448008c3ab440!8m2!3d10.7470925!4d124.7950265!16s%2Fg%2F11jp1tg529!5m1!1e2?entry=ttu&g_ep=EgoyMDI0MTExMy4xIKXMDSoASAFQAw%3D%3D">
                    <img src="/images/map.png" alt="vsu map">
                </a>
            </div>
            <div class="mb-10 ml-10 mr-10 font-roboto">
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
