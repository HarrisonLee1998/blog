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
    const archives = data.map.archives
    return { archives }
  },
  head () {
    return {
      title: '归档列表'
    }
  }
}
</script>

<style lang="scss" scoped>
.archive-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
