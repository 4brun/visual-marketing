<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <AppHeader />
    <main class="flex-1 min-h-0 pt-14 lg:pt-16">
      <slot />
    </main>
  </div>
</template>
