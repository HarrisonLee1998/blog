<template>
  <div>
    <div class="tag-container">
      <span v-for="tag in tags" :key="tag.title" class="tag">
        <a :href="'/tag/' + tag.title">{{ tag.title }}<small>({{ tag.articleNums }})</small></a>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ $axios }) {
    const { data } = await $axios.get('/api/tag')
    return { tags: data.map.tags }
  },
  head () {
    return {
      title: '标签'
    }
  }
}
</script>

<style lang="css" scoped>
.tag-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.tag {
  display: inline-block;
  margin: 20px;
  cursor: pointer;
}

.tag:hover {
  transform: scale(1.2);
  transition: all 0.3s linear;
  text-decoration: underline;
}
</style>
