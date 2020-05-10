<template>
  <div class="container">
    <div id="about">
      <div id="content" v-html="html" />
      <div id="gitalk-container" />
    </div>
  </div>
</template>

<script>
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
export default {
  async asyncData ({ $axios }) {
    const { data } = await $axios.get('/api/about')
    return { html: data.map.html }
  },
  mounted () {
    this.gitalk()
  },
  methods: {
    gitalk () {
      const gitalk = new Gitalk({
        clientID: '5b55e88d38cec0c96479',
        clientSecret: 'f70a6584c019df05f3328a5b10b6ee2df70d53ae',
        repo: 'blog-review',
        owner: 'HarrisonLee1998',
        admin: ['HarrisonLee1998'],
        id: 'about', // Ensure uniqueness and length less than 50
        distractionFreeMode: true // Facebook-like distraction free mode
      })
      gitalk.render('gitalk-container')
    }
  },
  head () {
    return {
      title: '关于博主'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
}

#content {
  margin-bottom: 50px;
  border-bottom: 1px solid #ccc;
}

@media screen and (min-width: 680px){
  #about {
    width: 50%;
    max-width: 600px;
  }
}
</style>
