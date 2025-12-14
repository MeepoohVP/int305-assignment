<template>
  <div @click="$emit('showDetail')" class="card card-xs bg-base-100 shadow-sm cursor-pointer">
    <figure>
      <img
        class="aspect-square object-cover"
        :src="imageSrc"
        :alt="menu.name"
      />
    </figure>

    <div class="card-body">
      <h2 class="card-title">
        {{ menu.name }}
      </h2>

      <p class="card-title text-primary">
        {{ menu.price }}.-
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
});


const imageSrc = computed(() =>
  `https://meepoohvp.github.io/int305-assignment-image/menus/${props.menu.name}.png`
);
</script>
