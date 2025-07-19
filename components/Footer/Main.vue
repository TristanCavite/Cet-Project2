<template>
    <footer class="w-full pl-32 pr-32 border-t bg-green-950">
      <div class="grid items-center grid-cols-3 pt-8 pb-8 mx-auto border-b-2 border-gray-500">
        <!-- Left Section: VSU Logo -->
        <div class="relative flex items-center justify-start ">
          <!-- VSU Brand Logo -->
           <div class="absolute z-10 left-32">
             <img src="/vsu_brand_logo_wbg.png" alt="Visayas State University Logo" class=" size-32" />
           </div>
          <!-- VSU Text Logo -->
           <div class="absolute z-10 right-20">
             <img src="/vsu_text_logo_wbg.png" alt="Visayas State University text" class="h-32 w-36" />
           </div>
        </div>
  
        <!-- Center Section: CET Logo -->
        <div class="flex justify-center">
          <img
            src="/FE_logo_wbg.png"
            alt="Faculty of Engineering Logo"
            class="w-auto h-24"
          />
        </div>
  
        <!-- Right Section: Vision and Mission -->
        <div class="pl-4 space-y-2 font-sans font-medium text-justify text-green-200 border-l-2 border-gray-500">
          <p class="text-xs">
            <span class="font-bold text-white">Vision:</span> A globally competitive university for science,
            technology, and environmental conservation.
          </p>
          <p class="text-xs">
            <span class="font-bold text-white">Mission:</span> Development of a highly competitive human
            resource, cutting-edge scientific knowledge, and innovative technologies for sustainable
            communities and environment.
          </p>
        </div>
      </div>
      <div class="flex flex-row items-center justify-center pt-4 pb-4 space-x-2 text-xs"> 
        <span class="font-bold text-white">© 2025</span>
        <span class="text-green-200 font-base">Visayas State University - Faculty of Engineering.</span>
        <span class="text-green-200 font-base">All rights reserved.</span>
      </div>
    </footer>
  </template>
  
  <style scoped>
    /* *{
      outline: red solid 1px;
    } */
  </style>
  