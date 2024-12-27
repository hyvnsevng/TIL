<script setup>
import { computed } from 'vue'

const cafeImage = computed(() => {
  const images = ['americano', 'latte', 'macchiato', 'tea']
  const randomIndex = Math.floor(Math.random() * images.length)

  return `/images/${images[randomIndex]}.jpg`
})
</script>

<template>
  <v-img :src="cafeImage" cover height="150" />
</template>

<style></style>
