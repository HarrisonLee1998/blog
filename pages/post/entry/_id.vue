<template>
  <div>
    <div :class="['container-wrapper', titles.length === 0 ? 'pos-center' : '']">
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
        <div v-show="!stared" class="article-footer" @click="addStar">
          <div><i class="fas fa-thumbs-up" title="如果有收获，就点赞一下吧" /></div>
        </div>
        <div id="gitalk-container" />
      </div>
      <!-- <div :class="['catalogue', catalogue ? 'catalogue-show' : '']">
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
      </div> -->
      <div v-if="titles.length > 0" class="sticky-box">
        <div :class="['titles-wrapper', 'backco', fixed?'fixed':'']">
          <div class="sticky-box-title">
            <span>Catalogue</span>
          </div>
          <div v-for="(title, i) in titles" :id="'title' + i" :key="i" class="content-title">
            <span :class="active === i ? 'active' : ''" @click="handleScroll(i)">{{ title }}</span>
          </div>
        </div>
      </div>
      <!-- <i class="fas fa-hand-point-left content-title-icon" @click="catalogue = true" /> -->
    </div>
    <div class="hidden-link">
      <a href="/post/list" />
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
        article.last_update_date = new Intl.DateTimeFormat('zh-CN',
          { year: 'numeric', month: '2-digit', day: '2-digit' })
          .format(new Date(article.last_update_date))
        return { article }
      } else {
        return { article: {} }
      }
    }
  },
  data () {
    return {
      titles: [],
      thumbed: false,
      fixed: false,
      active: -1,
      clicked: false,
      stared: false,
      starIds: [],
      viewIds: []
    }
  },
  mounted () {
    this.handleTitle()
    window.addEventListener('scroll', this.scroll)
    this.gitalk()
    this.handleLocalStorage()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scroll)
  },
  methods: {
    handleTitle () {
      const content = document.querySelector('.article-content')
      const h = /h|H[1-6]/g
      let i = 0
      content.childNodes.forEach((ele) => {
        if (h.test(ele.nodeName)) {
          const aTag = ele.childNodes[0]
          const titleText = ele.childNodes[1].data
          ele.setAttribute('id', 'heading' + i)
          // const titleText = ele.innerHTML.replace(/<\/?[^>]*>/g, '')
          const titleId = 'heading' + i
          ele.setAttribute('id', titleId)
          ele.setAttribute('class', 'heading')
          ele.removeChild(aTag)
          this.titles.push(titleText)
          ++i
        }
      })
    },
    scroll () {
      const height =
        document.body.scrollTop || document.documentElement.scrollTop
      if (height > 64) {
        this.fixed = true
      } else {
        this.fixed = false
      }
      if (this.titles.length === 0) {
        return
      }
      if (this.clicked) {
        this.clicked = false
        return
      }
      let item
      let n = -1
      for (let i = 0; i < this.titles.length; ++i) {
        item = document.querySelector('#heading' + i)
        if (height >= item.offsetTop) {
          n = i
        } else {
          break
        }
      }
      this.active = n
      if (n > 0) {
        document.getElementById('title' + n).scrollIntoView()
      } else if (n === 0) {
        document.querySelector('.sticky-box-title').scrollIntoView()
      }
    },
    handleScroll (i) {
      this.clicked = true
      this.active = i
      document.querySelector('#heading' + i).scrollIntoView()
    },
    gitalk () {
      const gitalk = new Gitalk({
        clientID: '5b55e88d38cec0c96479',
        clientSecret: 'f70a6584c019df05f3328a5b10b6ee2df70d53ae',
        repo: 'blog-review',
        owner: 'HarrisonLee1998',
        admin: ['HarrisonLee1998'],
        id: this.article.id, // Ensure uniqueness and length less than 50
        distractionFreeMode: true // Facebook-like distraction free mode
      })
      gitalk.render('gitalk-container')
    },
    addStar () {
      if (!this.stared) {
        const data = {
          id: this.article.id,
          star: this.article.star + 1
        }
        this.partiUpdate(data)
        this.stared = true
        this.starIds.push(this.article.id)
        localStorage.setItem('starIds', JSON.stringify(this.starIds))
      }
    },
    handleLocalStorage () {
      let ids = localStorage.getItem('starIds')
      if (ids) {
        this.starIds = JSON.parse(ids)
      }
      this.starIds.forEach((id) => {
        if (id === this.article.id) {
          this.stared = true
        }
      })
      ids = localStorage.getItem('viewIds')
      if (ids) {
        this.viewIds = JSON.parse(ids)
      }
      let flag = false
      this.viewIds.forEach((id) => {
        if (id === this.article.id) {
          flag = true
        }
      })
      if (!flag) {
        this.addView()
      }
    },
    addView () {
      const data = {
        id: this.article.id,
        view_times: this.article.view_times + 1
      }
      this.partiUpdate(data)
      this.viewIds.push(this.article.id)
      localStorage.setItem('viewIds', JSON.stringify(this.viewIds))
    },
    partiUpdate (data) {
      this.$axios({
        url: '/api/article',
        method: 'patch',
        data
      })
    }
  },
  head () {
    return {
      title: this.article.title
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 64px;

.container-wrapper {
  display: flex;
  justify-content: center;
}

.article-info {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
  a {
    cursor: pointer;
  }
  a:hover{
    text-decoration: underline;
  }
}

.article-title {
  font-size: 24px;
  font-weight: bolder;
  padding-bottom: 20px;
}
.field {
  display: inline-block;
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
  margin-top: 10%;
}

.article-footer > div {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  color: #fff;
  background-color: deeppink;
  font-size: 20px;
  cursor: pointer;
}

@media screen and (min-width: 680px){
  #main {
    margin: $height 0;
  }
  .container-wrapper {
    justify-content: flex-end;
  }
  .pos-center {
    justify-content: center;
  }
  .article-container {
    width: 50%;
    padding: 3%;
    margin-right: 5%;
  }
  .sticky-box {
    width: 20%;
    margin-right: 5%;
    // max-height: calc(100vh - $height);
  }
  .titles-wrapper {
    position: fixed;
    top: $height * 2;
    width: inherit;
    max-height: calc(100vh - 128px);
    overflow-y: auto;
    transition: top 0.2s ease;
    padding: 1%;
  }
  .fixed {
    top: $height;
    max-height: calc(100vh - 64px);
  }
  .sticky-box-title {
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    margin-bottom: 10px;
  }
  .content-title {
    padding: 5px;
    span {
      position: relative;
      cursor: pointer;
    }
    span::before {
      content: '|';
      font-weight: bolder;
      position: absolute;
      left: -10px;
      color: deeppink;
    }
    span:hover::before,
    .active::before {
      color: deepskyblue;
    }
  }
}

@media screen and (max-width: 680px){
  .article-container {
    padding: 3%;
    overflow: auto;
  }
}

@media screen and (max-width: 1080px){
  .container-wrapper{
    justify-content: center;
  }
  .sticky-box {
    display: none;
  }
}

</style>

<style>
.article-content a{
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

<style>
h1,
h2,h3,h4,h5,h6{
  position: relative;
  margin-top: -64px;
  padding-top: 64px;
}
h1 {
  font-size: 20px;
}

h2 {
  font-size: 18px;
}

h3, h4, h5, h6 {
  font-size: 16px;
}

h1:hover::before,
h2:hover::before,
h3:hover::before,
h4:hover::before,
h5:hover::before,
h6:hover::before {
  content: '#';
  position: absolute;
  left: -20px;
  margin-right: 10px;
  color: deeppink;
  font-family: 'Brush Script MT';
}
pre, code {
  font-size: 16px;
  font-family: consolas;
}
.hidden-link {
  display: none;
}
</style>
