<template>
  <div>
    <ul>
      <li v-for="article in articles" :key="article.id">
        <nuxt-link :to="'/post/entry/' + article.id">
          {{ article.title }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  async asyncData ({ $axios }) {
    const { data } = await $axios.get('/api/article/seo')
    return { articles: data.map.articles }
  }
}
</script>
