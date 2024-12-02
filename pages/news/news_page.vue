<template>
    <main class="flex items-center justify-center pt-16 pb-16 bg-stone-200">
        <div class="h-auto w-400 bg-neutral-50">
            <div>
                <UiSkeleton class="w-full h-128 bg-stone-500"></UiSkeleton>
            </div>
            <div class="flex items-center justify-center pb-8 mx-auto mt-2 border-b-8 w-288 border-stone-300">
                <span class="text-4xl font-semibold font-playfair"> College of Engineering and Technology Logo Making Contest</span>
            </div>
            <div class="mx-auto mt-16 mb-14 w-304">
                <p class="font-inter">
                    Hello CET Students! Ready to showcase your designing skills?
                    <br><br>
                    The College of Engineering and Technology (CET) is organizing a CET Logo Making Contest from August 17, 2022, to August 26, 2022, which envisions selecting the most meaningful symbol that will embody the true essence of the college’s existence. Best of luck to the contestants!
                    <br><br>
                    MECHANICS:
                    1.The competition is open to all bona fide undergraduate students of the CET, Visayas State University-Main Campus. A single entry per student is only allowed. No group submission. <br>
                    2.The elements and colors of the logo must embody and exhibit the university’s mission, vision, and college goals. Not too detailed but simple enough. <br>
                    3.The logo design must be aligned to the VSU logo, circular in shape. It must also be adaptable for use on both print and electronic media. <br>
                    4.The logo color must be in plain and no gradient. Color composition of the logo must consist the following: Maroon: (RGB: 128,0,0; Hex: #800000) White: (RGB: 255,255,255; Hex: #ffffff) Black: (RGB: 0,0,0; Hex: #000000) <br>
                    5.The logo must contain the full name of the college, COLLEGE OF ENGINEERING AND TECHNOLOGY, all in upper case and the year established (2009). <br>
                    6.In addition to the colored version of the logo, a monochrome version must be also submitted. Format of the images includes: JPEG, PNG, and PDF. <br>
                    7.Dimension of the logo: DPI: 300 3 x 3 inches. <br>
                    8.The logo design must be recognizable even it its smallest view. <br>
                    9.Each submission must include a brief rationale and description of the elements used and what they stand for with a minimum of 100 words and a maximum of 500 words. <br>
                    10.The winner will be asked to provide the raw files used to create the logo. <br>
                    11.Following the logo selection, the college, CET, reserve the right to further develop the winning logo design. The winning entry will be considered property of CET. <br>
                    12.All submitted entries will be under the property of the college, CET, which may exercise all rights of ownership over them. <br>
                    13.The decision of the judges selected by CET shall be final. The entries will be judged according to these criteria: Concept/Relevance                        – 30% Originality/Distinctiveness            – 25% Creativity/Innovation                      – 25% Total Impact                                     – 20% A total of                                            – 100%. <br>
                    14.The winner shall receive cash prize of ONE THOUSAND PESOS (PHP 1,000.00), token, and certificate of recognition. The second and third place will receive  PHP 300.00 and PHP 200.00 worth of mobile load, respectively. <br>
                    15.You can submit your entry using this link: <a href="https://bit.ly/3CcFaXU.">https://bit.ly/3CcFaXU.</a> 
                </p>
            </div>
            <div class="flex items-center justify-center w-24 ml-48 text-lg font-semibold border-2 rounded-md h-9 mb-14 bg-stone-300 hover:text-2xl hover:bg-stone-400 hover:w-28">
                <NuxtLink to="/news/"> Back</NuxtLink>
            </div>
            <div class="mx-auto mb-16 border-t-8 w-288 border-stone-300">
            </div>
        </div>
    </main>
</template>

<script>
    definePageMeta({
    layout: 'custom',
    });
</script>