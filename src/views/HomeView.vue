<template>
  <div class="home">
    <seller></seller>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import seller from '@/components/seller.vue'
</script>
<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
}
</style>
