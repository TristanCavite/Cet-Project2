<template>
    <footer class="border-maroon border-t bg-white py-4">
      <div class="container mx-auto grid grid-cols-3 items-center">
        <!-- Left Section: VSU Logo -->
        <div class="flex items-center justify-start space-x-2">
          <!-- VSU Brand Logo -->
          <img src="/VSU Brand Logo 1.png" alt="Visayas State University Logo" class="h-24 w-auto" />
          <!-- VSU Text Logo -->
          <img src="/VSU Text Logo 2.png" alt="Visayas State University text" class="h-16 w-auto" />
        </div>
  
        <!-- Center Section: CET Logo -->
        <div class="flex justify-center">
          <img
            src="/CET Logo.png"
            alt="College of Engineering and Technology Logo"
            class="h-24 w-auto"
          />
        </div>
  
        <!-- Right Section: Vision and Mission -->
        <div class="space-y-2 text-justify text-sm font-medium text-green">
          <p>
            <span class="font-bold">Vision:</span> A globally competitive university for science,
            technology, and environmental conservation.
          </p>
          <p>
            <span class="font-bold">Mission:</span> Development of a highly competitive human
            resource, cutting-edge scientific knowledge, and innovative technologies for sustainable
            communities and environment.
          </p>
        </div>
      </div>
    </footer>
  </template>
  
  <style scoped>
    footer {
      background-color: #fff;
      border-top: 2px solid #800000; /* Maroon border */
    }
  
  
    .text-green {
      color: #146939;
    }
    .container {
      max-width: 1200px;
    }
  </style>
  