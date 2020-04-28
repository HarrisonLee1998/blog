<template>
  <div class="container">
    <!-- <h1>Color mode: {{ $colorMode.value }}</h1>
    <select v-model="$colorMode.preference">
      <option value="system">
        System
      </option>
      <option value="light">
        Light
      </option>
      <option value="dark">
        Dark
      </option>
      <option value="sepia">
        Sepia
      </option>
    </select>
    -->
    博客卡片列表
  </div>
</template>

<script>
export default {
  asyncData () {
    return new Promise((resolve) => {
      // eslint-disable-next-line nuxt/no-timing-in-fetch-data
      setTimeout(function () {
        resolve({ name: 'world' })
      }, 2000)
    })
  }
}
</script>

<style lang="scss" scoped>
.container{
  height: 1000px;
}
</style>
