<script setup lang="ts">
useHead({
  title: "College of Engineering and technology | Visayas State University",
  link: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",  // Explicit size declaration
      href: "/logoTab.png",
    },
    
  ],
  meta: [
    {
      name: "description",
      content: "College of Engineering and Technology website",
    },
  ],
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>