<template>
  <div>
    <div class="content">
      <div>
        <div class="search-input">
          <input v-model="keyword" placeholder="输入关键字进行搜索" :readonly="searchFinished" @focus="showError = false">
          <i v-show="!searchFinished" class="fas fa-search" @click="handleSearch" />
          <i v-show="searchFinished" class="fas fa-times" @click="resetSearch" />
        </div>
        <div class="search-result">
          <div v-show="showError" class="search-error">
            {{ searchError }}
          </div>
          <!-- <div v-show="searchFinished" class="search-reset" @click="resetSearch">
            RESET
          </div> -->
        </div>
      </div>
      <BlogCard v-for="article in pageUtil.list" :key="article.id" :article="article" />
      <div v-show="mode === 1 && pageUtil.total === 0" class="empty-result">
        <span>当前并没有与关键词<strong>{{ keyword }}</strong>相关的文章</span>
      </div>
      <Pagination
        v-show="pageUtil.pages > 1"
        :pages="pageUtil.pages"
        :page-no="pageUtil.pageNo"
        :pager-count="pagerCount"
        @changePageNo="changePageNo"
      />
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
      pagerCount: 3,
      searchFinished: false
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
      this.$axios.get('/api/article/search', {
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
          this.searchFinished = true
        }
      })
    },
    validateSearch () {
      this.keyword = this.keyword.trim()
      if (this.keyword === '') {
        this.searchError = '关键词不能为空'
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
        let strs = this.keyword.split('')
        strs = strs.filter(s => s.trim() > 0)
        strs.forEach((s) => {
          if (s.length === 1 && s.charCodeAt() < 128) {
            this.searchError = '关键词中不能存在分隔开的单个ascaii字符'
          }
        })
      }
      if (this.searchError.trim() !== '') {
        this.showError = true
      } else {
        this.showError = false
      }
    },
    handleSearch () {
      this.pageNo = 1
      this.mode = 1
      this.showError = false
      this.searchFinished = false
      this.validateSearch()
      if (!this.showError) {
        this.handleMode()
      }
    },
    resetSearch () {
      this.mode = 0
      this.pageNo = 1
      this.keyword = ''
      this.showError = false
      this.searchError = ''
      this.searchFinished = false
      this.handleMode()
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
.search-input {
  position: relative;
  display: flex;
  justify-content: flex-end;
}
.search-input > input {
  outline: 0;
  border: none;
  padding: 0;
  height: 30px;
  font-size: 16px;
  background:transparent;
  color: inherit;
  padding-right: 20px;
  width: calc(100%  - 20px);
}
.search-input > i {
  position: absolute;
  font-size: 20px;
  line-height: 30px;
  right: 0;
  cursor: pointer;
}
.light-mode .search-input > input{
  border-bottom: 1px solid #000;
}
.dark-mode .search-input > input{
  border-bottom: 1px solid #fff;
}
.search-input > input:focus {
  border-bottom:1px solid  #9980FA;
}
.search-input > input:focus ~ i {
  color: #9980FA;
}

.search-result {
  padding: 10px 0;
  margin-bottom: 10%;
  .search-error {
    font-size: 12px;
    font-style: italic;
    color: #9980FA;
  }
  .search-reset {
    cursor: pointer;
  }
  .search-reset:hover{
    text-decoration: underline;
  }
}
.empty-result {
  text-align: center;
}
@media screen and(min-width: 680px){
  .content{
    width: 60%;
    max-width: 600px;
  }
}
</style>
