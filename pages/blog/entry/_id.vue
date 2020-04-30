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
      </div>
      <div :class="['catalogue', catalogue ? 'catalogue-show' : '']">
        <p class="catalogue-title">
          <span>Catalogue</span>
          <i class="fas fa-times content-cancel-icon" @click="catalogue = false" />
        </p>
        <p v-for="(title, i) in titles" :key="i" class="content-title">
          <a :href="'#heading' + i">{{ title }}</a>
        </p>
        <p v-if="titles.length === 0">
          该文章没有标题~
        </p>
      </div>
      <i class="fas fa-hand-point-right content-title-icon" @click="catalogue = true" />
    </div>
  </div>
</template>

<script>
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
      fixed: false,
      catalogue: false
    }
  },
  mounted () {
    this.handleTitle()
    this.initEvent()
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
        const height =
          document.body.scrollTop || document.documentElement.scrollTop
        if (height > 64) {
          this.fixed = true
        } else {
          this.fixed = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 64px;

.catalogue {
  position: fixed;
  width: 300px;
  top: $height;
  left: -100%;
  bottom: 0;
  transition: all 0.3s linear;
  border-right: 1px solid #ccc;
  padding: 10px;
  z-index: 2;
  overflow: auto;
}
.light-mode .catalogue {
  background-color: #fff;
}

.dark-mode .catalogue {
  background-color: #000;
}

.catalogue-show {
  left: 0;
}

.catalogue-title {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 10px;
}
.content-cancel-icon,
.content-title-icon {
  cursor: pointer;
}

.content-title-icon {
  position: fixed;
  bottom: 20px;
  left: 0;
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

@media screen and (min-width: 680px){
  .article-container {
    width: 50%;
    padding: 3%;
  }
  .right {
    justify-content: flex-end;
    .article-container {
      margin-right: 10%;
    }
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
</style>
