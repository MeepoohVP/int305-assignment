<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <teleport to='#header'><Header></Header></teleport>
  <router-view></router-view>
  <teleport to='#footer' ><Footer></Footer></teleport>
</template>

<style scoped></style>
