<template>
  <div class="container">
    <div class="archive-container">
      <ArchiveCard v-for="archive in archives" :key="archive.title" :archive="archive" />
    </div>
  </div>
</template>

<script>
import ArchiveCard from '~/components/ArchiveCard'
export default {
  components: {
    ArchiveCard
  },
  async asyncData ({ $axios }) {
    const { data } = await $axios.get('/api/archive')
    return { archives: data.map.archives }
  }
}
</script>

<style lang="scss" scoped>
.archive-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
