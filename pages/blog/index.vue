<template>
  <div>
    <div class="content">
      <BlogCard v-for="article in pageUtil.list" :key="article.id" :article="article" />
      <Pagination :pages="pageUtil.pages" :page-no="pageUtil.pageNo" :pager-count="pagerCount" @changePageNo="changePageNo" />
    </div>
  </div>
</template>

<script>
import BlogCard from '~/components/BlogCard'
import Pagination from '~/components/Pagination'
export default {
  components: {
    BlogCard,
    Pagination
  },
  data () {
    return {
      pageUtil: {
        pageNo: 0,
        pages: 0
      },
      pageNo: 1,
      pageSize: 5,
      mode: 0,
      keyword: '',
      searchHistory: [],
      searchError: '',
      showError: false,
      pagerCount: 3
    }
  },
  beforeMount () {
    this.handleMode()
  },
  mounted () {
    const sh = localStorage.getItem('searchHistory')
    if (Array.isArray(sh)) {
      this.searchHistory = sh
    }
  },
  beforeDestroy () {
    localStorage.setItem('searchHistory', this.searchHistory)
  },
  methods: {
    handleMode () {
      if (this.mode === 0) {
        this.getArticle()
      } else {
        this.searchArticle()
      }
    },
    changePageNo (newVal) {
      if (newVal !== this.pageUtil.pageNo) {
        this.pageNo = newVal
        this.handleMode()
      }
    },
    getArticle () {
      if (this.mode === 1) {
        this.pageNo = 1
      }
      this.$axios.get(`/api/article/${this.pageNo}/${this.pageSize}`)
        .then((res) => {
          if (res.data.status === 'OK') {
            this.pageUtil = res.data.map.pageUtil
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          }
        })
    },
    searchArticle () {
      this.validateSearch()
      if (this.showError) {
        return
      }
      this.$axios.get('/api/article', {
        params: {
          keyword: this.keyword,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      }).then((res) => {
        if (res.data.status === 'OK') {
          this.pageUtil = res.data.map.pageUtil
          this.searchHistory.push({ keyword: this.keyword, date: new Date() })
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        }
      })
    },
    validateSearch () {
      this.keyword = this.keyword.trim()
      if (this.keyword === '') {
        this.searchHistory = '关键词不能为空'
      } else if (this.keyword.includes('/')) {
        this.searchError = "关键词中不能包含字符'/'"
      } else if (this.keyword.includes('\\')) {
        this.searchError = "关键词中不能包含字符'\\'"
      } else if (this.searchHistory.length > 2) {
        const lastSearch = this.searchHistory[this.searchHistory.length - 1]
        const date = Date.parse(lastSearch.date)
        if (!isNaN(date)) {
          if (new Date(date - new Date().getTime() > 1000 * 60)) {
            // 超过一个小时没有搜索，恢复
            this.searchHistory = []
          } else if (date - new Date().getTime() < 1000 * 10) {
            // 搜索记录超过三次以后，搜索间隔为10分钟
            this.searchError = '搜索过于频繁，请稍后再试~'
          } else {
            this.searchHistory.pop()
          }
        } else {
          // 说明localStorage已经被篡改了，此时前端判断就没必要了，直接交给后台判断
          this.searchHistory = []
        }
      } else {
        const strs = this.keyword.split('')
        strs.filter(s => s.trim() > 0)
        strs.forEach((s) => {
          if (s.length === 1 && s.charCodeAt() < 128) {
            this.searchError = '关键词中不能存在单个ascaii字符'
          }
        })
      }
      if (this.searchError === '') {
        this.showError = true
      } else {
        this.showError = false
      }
    }
  },
  head () {
    return {
      title: '文章列表'
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and(min-width: 680px){
  .content{
    width: 60%;
    max-width: 600px;
  }
}
</style>
