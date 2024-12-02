 <template>
    <main class="justify-center gird place-items-center bg-stone-200 pt-14 pb-14">
        <div class="relative flex flex-col items-center border-2 shadow-xl w-416 h-288 mb-14 bg-neutral-50">
            <!-- title-->
            <div class="flex justify-center pt-6 pb-6 text-5xl font-bold border-b-8 w-288 font-playfair border-amber-200">
                <span>GENERAL NEWS</span>
            </div>
            <!--slide 1-->
            <div class="grid grid-cols-2 gap-20 mt-10 "  v-if="currentSlide === 0">
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>

            </div>
            <!--slide 2-->
            <div class="grid grid-cols-2 gap-20 mt-10"  v-if="currentSlide === 1">
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
            </div>
            <!--slide 3-->
            <div class="grid grid-cols-2 gap-20 mt-10"  v-if="currentSlide === 2">
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
                <NuxtLink to="/news/news_page" class="block">
                    <UiSkeleton class="border-2 shadow-lg cursor-pointer w-128 h-96">
                    </UiSkeleton>
                    <span class="text-2xl font-semibold font-playfair">College of Engineering News # 6</span>
                </NuxtLink>
            </div>
            <!--navigation-->
            <div class="relative flex items-center justify-center pt-16 border-t-8 mt-14 w-288 border-amber-200">
                <div class="flex items-center justify-center gap-56">
                    <button class="w-12 h-14 bg-stone-400 hover:bg-stone-600" @click="prevSlide">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left size-12"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button class="w-12 h-14 bg-stone-400 hover:bg-stone-600" @click="nextSlide">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class=" lucide lucide-chevron-right size-12"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
                <!-- index indicator-->
                <div class="absolute flex items-center justify-center space-x-4 transform -translate-x-1/2 bottom-3 left-1/2 ">
                    <span
                    v-for="index in totalSlides"
                    :key="index"
                    class="flex items-center justify-center w-8 h-8 font-semibold transition-colors rounded-full shadow-xl cursor-pointer"
                    :class="currentSlide === index -1 ? 'text-3xl bg-red-800' : 'text-xl'"
                    @click="setCurrentSlide(index - 1)"
                    >
                    {{ index }}
                    </span>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    
    const currentSlide = ref(0);
    const totalSlides = 3;

    const nextSlide = () => {
        currentSlide.value = (currentSlide.value + 1) % totalSlides
    };

    const prevSlide = () => {
        currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
    };

    const setCurrentSlide = (index: number) => {
        currentSlide.value = index
    };
            
    // for secondary footer      
    definePageMeta({
    layout: 'custom',
    });
</script>
