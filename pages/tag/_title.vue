<template>
  <div>
    <div class="tag-header">
      <span><i class="fas fa-tag" />{{ title }}</span>
    </div>
    <div class="tag-article-list">
      <div v-for="article in pageInfo.list" :key="article.id" class="article-box">
        <div class="article-title one-line">
          <a :href="'/post/entry/' + article.id">{{ article.title }}</a>
        </div>
        <div class="article-date">
          {{ article.lastUpdateDate }}
        </div>
      </div>
      <div v-if="pageInfo.total === 0" class="tag-nothing">
        当前标签下还没有文章~
      </div>
    </div>
    <Pagination v-if="pageInfo.pages > 1" :pages="pageInfo.pages" :page-no="pageInfo.pageNum" :pager-count="pagerCount" @changePageNo="changePageNo" />
  </div>
</template>

<script>
export default {
  async asyncData ({ route, $axios }) {
    const title = route.params.title
    await $axios.get('/api/tag/test/' + encodeURI(title))
    return { title }
  },
  data () {
    return {
      pageInfo: {
        pageNum: 0,
        pages: 0
      },
      pageNo: 1,
      pageSize: 8,
      pagerCount: 3
    }
  },
  beforeMount () {
    this.getArticle()
  },
  methods: {
    getArticle () {
      this.$axios.get(`/api/article/tag/${encodeURI(this.title)}/${this.pageNo}/${this.pageSize}`)
        .then((res) => {
          if (res.data.status === 'OK') {
            this.pageInfo = res.data.map.pageInfo
            this.handleDate()
          }
        })
    },
    changePageNo (newVal) {
      if (newVal !== this.pageNo) {
        this.pageNo = newVal
        this.getArticle()
      }
    },
    handleDate () {
      this.pageInfo.list.forEach((article) => {
        const d = this.$moment(new Date(article.lastUpdateDate), 'Asia/ShangHai').utc()
        article.lastUpdateDate = this.$moment(d)
          .local()
          .format('YYYY/MM/DD')
      })
    }
  },
  head () {
    return {
      title: '标签：' + this.title
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-header {
  display: flex;
  justify-content: flex-end;
  font-size: 18px;
  i {
    margin-right: 5px;
  }
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
}

.tag-article-list {
  font-size: 16px;
}

.article-box {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  height: 30px;
  line-height: 30px;
}
.tag-nothing {
  height: 100px;
  line-height: 100px;
  text-align: center;
}

@media screen and (min-width: 680px){
  #main {
    margin: 5% 10%;
  }
  .article-title {
    width: 80%;
  }
  .article-date {
    width: 20%;
    text-align: right;
  }
}

@media screen and (max-width: 680px){
  .article-title {
    width: 100%;
  }
  .article-date {
    display: none;
  }
}

</style>
