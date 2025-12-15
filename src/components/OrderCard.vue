<script setup>
const props = defineProps({
    order: {
        type: Object,
        require: true
    }
})
</script>
<template>
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <div class="flex justify-between">
        <h2 class="card-title">#{{ order?.id || '1234343asas' }}</h2>
        <span class="badge">{{ order?.status || 'status' }}</span>
      </div>
      <hr class="opacity-20" />
      <p class="flex gap-1.5 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-clock"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
          />
          <path
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"
          />
        </svg>
        time
      </p>
      <p class="flex gap-1.5 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-diamond" viewBox="0 0 16 16">
  <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>
</svg>
        Table A01
      </p>
      <hr class="opacity-20" />
      <div class="flex justify-between">
        <p>3 items</p>
        <p class="text-right">22.50.-</p>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
