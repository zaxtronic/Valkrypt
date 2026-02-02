<template>
  <div class="story-box">
    <h1 class="scene-title">{{ title }}</h1>
    <div class="scene-description" v-html="description"></div>
  </div>
</template>

<script setup>
defineProps(['title', 'description']);
</script>

<style scoped lang="scss">
.story-box {
  margin-bottom: 3rem;
  animation: fadeIn 1s ease-in;
}

.scene-title {
  color: var(--color-gold);
  font-family: var(--font-title);
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 5px rgba(0,0,0,1);
  border-bottom: 1px solid #333;
  padding-bottom: 1rem;
}

.scene-description {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #ddd;
  text-align: justify;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>