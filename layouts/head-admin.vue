<template>
  <div class="h-screen flex flex-col">
    <HeaderMain />
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <SidebarHeadAdminMain />

      <!-- Page Content -->
      <div class="flex-1 p-6 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>