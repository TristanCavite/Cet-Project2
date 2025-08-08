<template>
    <main class="flex items-center justify-center bg-stone-200">
        <div class="relative m-5 md:m-20 w-384 bg-neutral-50">
            <div class="absolute z-10 -top-4 left-56 md:top-4 md:left-52">    
                <div class="flex items-center justify-center w-24 h-6 mt-10 mr-40 rounded-lg cursor-pointer md:w-32 md:h-8 bg-stone-400 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" md:width="24" md:height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    <button  @click="downloadImage" class="text-sm md:text-base">Download</button>
                </div>
            </div>
            <div class="flex justify-center pt-10 shadow-xl">
                <img src="/public/images/vsu_calendar.jpg" alt="">
            </div>

        </div>
    </main>
</template>

<script lang="ts" setup>
    definePageMeta({
        layout: 'custom',
    });
    const downloadImage = async () => {
        try {
            const response = await fetch('/images/vsu_calendar.jpg')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'vsu_calendar.jpg'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }
</script>

<style>
/* *  {
    outline: 1px solid red;
} */
</style>