<template>
  <div>
    <div class="archive-header">
      <span><i class="fas fa-folder-open" />{{ title }}</span>
    </div>
    <div class="archive-article-list">
      <div v-for="article in pageInfo.list" :key="article.id" class="article-box">
        <div class="article-title one-line">
          <a :href="'/blog/entry/' + article.id">{{ article.title }}</a>
        </div>
        <div class="article-date">
          {{ article.lastUpdateDate }}
        </div>
      </div>
      <div v-if="pageInfo.total === 0" class="archive-nothing">
        当前归档下还没有文章~
      </div>
    </div>
    <Pagination v-if="pageInfo.pages > 1" :pages="pageInfo.pages" :page-no="pageInfo.pageNum" :pager-count="pagerCount" @changePageNo="changePageNo" />
  </div>
</template>

<script>
import Pagination from '~/components/Pagination'
export default {
  components: {
    Pagination
  },
  async asyncData ({ route, $axios, redirect }) {
    const title = route.params.title
    await $axios.get('/api/archive/' + encodeURI(title))
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
      this.$axios.get(`/api/article/archive/${encodeURI(this.title)}/${this.pageNo}/${this.pageSize}`)
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
      title: '归档：' + this.title
    }
  }
}
</script>

<style lang="scss" scoped>
.archive-header {
  display: flex;
  justify-content: flex-end;
  font-size: 18px;
  i {
    margin-right: 5px;
  }
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
}

.archive-article-list {
  font-size: 16px;
}

.article-box {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  height: 30px;
  line-height: 30px;
}
.archive-nothing {
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
