<template>
  <div>
    <div class="content">
      <div>
        <div class="search-input">
          <input v-model="keyword" placeholder="输入关键词进行搜索" @keyup.enter="handleSearch" @focus="showError = false">
          <i class="fas fa-search" @click="handleSearch" />
          <!-- <i v-show="searchFinished" class="fas fa-times" @click="resetSearch" /> -->
        </div>
        <div class="search-result">
          <div v-show="showError" class="search-error">
            {{ searchError }}
          </div>
          <div v-show="searchFinished" class="search-reset" @click="resetSearch">
            RESET
          </div>
        </div>
      </div>
      <BlogCard v-for="article in pageUtil.list" :key="article.id" :article="article" />
      <div v-show="searchFinished && pageUtil.total === 0" class="empty-result">
        <span>当前并没有与关键词<strong>{{ keyword2 }}</strong>相关的文章</span>
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
      keyword2: '',
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
        this.handleSearchResult(res)
      })
    },
    handleSearchResult (res) {
      if (res.data.status === 'OK') {
        this.pageUtil = res.data.map.pageUtil
        this.keyword2 = this.keyword
        this.searchHistory.push(new Date())
      } else if (res.data.status === 'TOO_MANY_REQUESTS') {
        this.searchError = '搜索过于频繁，请稍后再试'
        this.showError = true
        this.pageUtil = { pageNo: 0, pages: 0 }
      }
      this.searchFinished = true
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    },
    validateSearch () {
      this.keyword = this.keyword.trim()
      if (this.keyword === '') {
        this.searchError = '关键词不能为空'
      } else if (this.keyword.includes('/')) {
        this.searchError = "关键词中不能包含字符'/'"
      } else if (this.keyword.includes('\\')) {
        this.searchError = "关键词中不能包含字符'\\'"
      }
      if (this.searchHistory.length > 2) {
        const last = this.searchHistory[this.searchHistory.length - 1]
        if (new Date().getTime() - last.getTime() < 1000 * 10) {
          this.searchError = '搜索过于频繁，请稍后再试'
        } else if (new Date().getTime() - last.getTime() > 1000 * 60) {
          this.searchHistory = []
        }
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
    font-size: 14px;
  }
  .search-reset {
    cursor: pointer;
    display: inline-block;
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
