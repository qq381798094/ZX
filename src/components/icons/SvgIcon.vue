<template>
  <div>
    <svg :style="{ width, height }">
      <use :xlink:href="'#icon-' + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    width: {
      type: String,
      default: '15px',
    },
    height: {
      type: String,
      default: '15px',
    },
    name: String,
    color: String,
  });
</script>

<style scoped></style>
