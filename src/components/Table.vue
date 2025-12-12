<script setup>
const props = defineProps({
  tableCode: {
    type: String,
  },
});
</script>
<template>
  <button
    class="aspect-square rounded-sm btn hover:scale-105 w-full h-full mb-1 flex items-center justify-center border text-xl font-bold"
  >
    {{ tableCode }}
  </button>
</template>
<style scoped></style>
