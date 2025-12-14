<script setup>
const props = defineProps({
  id: {
    type: String,
  },
  tableCode: {
    type: String,
  },
  haveNotification: {
    type: Boolean,
    default: false
  }
});

</script>
<template>
  <button
  @click="$emit('tableDetail')"
    class="aspect-square relative rounded-sm btn hover:scale-105 w-full h-full mb-1 flex items-center justify-center border text-xl font-bold"
  >
  <span v-if="haveNotification" class="absolute -right-1 -top-1 flex w-3 h-3">
          <span
            class="absolute inline-flex h-full w-full rounded-full bg-error opacity-75 animate-ping"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-error"
          ></span>
        </span>
    {{ tableCode }}
  </button>
</template>
<style scoped></style>
