<template>
  <div>
    <div :class="['container-wrapper', catalogue ? 'right' : '']">
      <div class="article-container backco">
        <div class="article-title">
          {{ article.title }}
        </div>
        <div class="article-info">
          <span class="field"> <i class="fas fa-calendar-alt" /> {{ article.last_update_date }}</span>
          <span class="field"> <i class="fas fa-folder-open" />
            <nuxt-link :to="'/archive/' + article.archive_title">{{ article.archive_title }}</nuxt-link>
          </span>
          <span class="field"> <i class="fas fa-tags" />
            <span v-for="tag in article.tags" :key="tag" class="tag">
              <nuxt-link :to="'/tag/' + tag">{{ tag }}</nuxt-link>
            </span>
          </span>
        </div>
        <div class="article-content" v-html="article.html" />
        <div class="article-footer">
          <div><i class="fas fa-thumbs-up" title="如果有收获，就点赞一下吧" /></div>
        </div>
        <div id="gitalk-container" />
      </div>
      <div :class="['catalogue', catalogue ? 'catalogue-show' : '']">
        <p class="catalogue-title">
          <span>Catalogue</span>
          <i class="fas fa-times content-cancel-icon" @click="catalogue = false" />
        </p>
        <p v-for="(title, i) in titles" :key="i" class="content-title">
          <a
            :href="'#heading' + i"
          >{{ title }}</a>
        </p>
        <p v-if="titles.length === 0">
          该文章内容没有标题~
        </p>
      </div>
      <i class="fas fa-hand-point-left content-title-icon" @click="catalogue = true" />
    </div>
  </div>
</template>

<script>
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
export default {
  async asyncData ({ route, $axios, redirect, $moment }) {
    const id = route.params.id
    if (id.trim().length !== 12) {
      redirect('/404')
    } else {
      const { data } = await $axios.get('/api/article/entry/' + encodeURI(id))
      const article = data.map.article
      if (article !== null) {
        const d = $moment(new Date(article.last_update_date), 'Asia/ShangHai').utc()
        article.last_update_date = $moment(d)
          .local()
          .format('YYYY/MM/DD')
        return { article }
      } else {
        return { article: {} }
      }
    }
  },
  data () {
    return {
      titles: [],
      catalogue: false,
      thumbed: false
    }
  },
  mounted () {
    this.handleTitle()
    this.initEvent()
    this.gitalk()
  },
  methods: {
    handleTitle () {
      const content = document.querySelector('.article-content')
      const h = /h|H[1-6]/g
      let i = 0
      content.childNodes.forEach((ele) => {
        if (h.test(ele.nodeName)) {
          ele.setAttribute('id', 'heading' + i)
          const titleText = ele.innerHTML.replace(/<\/?[^>]*>/g, '')
          const titleId = 'heading' + i
          ele.setAttribute('id', titleId)
          this.titles.push(titleText)
          ++i
        }
      })
    },
    initEvent () {
      window.addEventListener('scroll', () => {
        // const height =
        //   document.body.scrollTop || document.documentElement.scrollTop
      })
    },
    gitalk () {
      const gitalk = new Gitalk({
        clientID: '5b55e88d38cec0c96479',
        clientSecret: 'f70a6584c019df05f3328a5b10b6ee2df70d53ae',
        repo: 'blog-review',
        owner: 'HarrisonLee1998',
        admin: ['HarrisonLee1998'],
        id: location.pathname, // Ensure uniqueness and length less than 50
        distractionFreeMode: true // Facebook-like distraction free mode
      })
      gitalk.render('gitalk-container')
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 64px;

.catalogue {
  position: fixed;
  width: 240px;
  top: $height;
  right: -100%;
  bottom: 0;
  transition: all 0.3s linear;
  border-right: 1px solid #ccc;
  padding: 10px;
  z-index: 9999;
  overflow: auto;
}
.light-mode .catalogue {
  background-color: #fff;
}

.dark-mode .catalogue {
  background-color: #000;
}

.catalogue-show {
  right: 0;
}

.catalogue-title {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 10px;
}

.content-title {
  a {
    display: block;
    position: relative;
    margin-left: 5px;
  }
  a::before {
    content: '|';
    font-weight: bolder;
    color: deeppink;
    margin-right: 0.5rem;
    position: absolute;
    left: -10px;
  }
  a:hover::before {
    color: deepskyblue;
  }
}

.content-cancel-icon,
.content-title-icon {
  cursor: pointer;
}

.content-title-icon {
  position: fixed;
  bottom: 40px;
  right: 0;
  cursor: pointer;
  font-size: 20px;
}

.container-wrapper {
  display: flex;
  justify-content: center;
}

.article-info {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
}

.article-title {
  font-size: 24px;
  font-weight: bolder;
  padding-bottom: 20px;
}
.field:not(:last-child){
  margin-right: 20px;
  i {
    margin-right: 5px;
  }
}
.tag:not(:last-child) {
  margin-right: 5px;
}

.article-footer {
  display: flex;
  justify-content: center;
}

.article-footer > div {
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border-radius: 50%;
  color: #fff;
  background-color: deeppink;
  font-size: 30px;
  cursor: pointer;
}

@media screen and (min-width: 680px){
  .article-container {
    width: 50%;
    padding: 3%;
  }
}

@media screen and (max-width: 680px){
  .article-container {
    padding: 3%;
    overflow: auto;
  }
}

</style>

<style>
.article-container a{
  color: deeppink;
}
.article-container a:hover {
  text-decoration: underline;
}
.dark-mode .gt-svg {
  background-color: #fff;
  color: #000;
}
mark {
  background-color: deeppink;
  color: #fff;
}
</style>
