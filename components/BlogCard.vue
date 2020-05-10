<template>
  <div class="article-card backco">
    <div class="article-title one-line">
      <a :href="'/post/entry/' + article.id" v-html="article.title" />
    </div>
    <div class="article-info">
      <span><i class="fas fa-folder-open" />
        <a :href="'/archive/' + parseContent(article.archive_title)" v-html="article.archive_title" />
      </span>
      <span>
        <i class="fas fa-tags" />
        <span v-for="(tag, i) in article.tags" :key="i">
          <a :href="'/tag/' + parseContent(tag)" class="tag" v-html="tag" />
        </span>
      </span>
      <span>
        <i class="fas fa-calendar-alt" />
        <span>{{ article.last_update_date }}</span>
      </span>
    </div>
    <div class="article-content">
      <p v-if="article.pure_txt.trim() !== ''" v-html="article.pure_txt" />
      <p v-if="article.pure_txt.trim() === ''" class="empty-content">
        没有预览内容，请点击标题浏览详情
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  beforeMount () {
    this.handleDate()
  },
  methods: {
    parseContent (html) {
      return html.replace(/<\/?[^>]*>/g, '')
    },
    handleDate () {
      this.article.last_update_date = new Intl.DateTimeFormat('zh-CN',
        { year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date(this.article.last_update_date))
    }
  }
}
</script>

<style>
.keyword {
  color: deeppink;
}
</style>
<style lang="scss" scoped>
.article-card{
  margin-bottom: 10%;
  border-radius: 5px;
}
.article-card:hover {
  -webkit-box-shadow:  #ccc 0 0 10px;  /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow:  #ccc 0 0 10px;  /* Firefox 3.5 - 3.6 */
  box-shadow: #ccc 0 0 10px;  /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.article-title {
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  font-weight: bold;
}

.article-title a:hover {
  text-decoration: underline;
}

.article-info{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.article-info span:not(:last-child) {
  margin-right: 10px;
}
.tag:not(:last-child) {
  margin-right: 2px;
}
.article-info a:hover{
  text-decoration: underline;
}

.article-info > i {
  margin-right: 2px;
}

.article-content > p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient:vertical;
  margin-bottom: 0;
}

@media screen and(min-width: 680px) {
  .article-card {
    // width: 60%;
    // max-width: 600px;
    padding: 20px;
    font-size: 16px;
  }
  .article-title {
    margin-bottom: 20px;
    font-size: 20px;
  }
  .article-content > p {
    -webkit-line-clamp:10;
  }
}

@media screen and(max-width: 680px){
  .article-card {
    padding: 10px;
    font-size: 14px;
  }
  .article-title {
    margin-bottom: 10px;
    font-size: 16px;
  }
   .article-content > p {
    -webkit-line-clamp:5;
  }
}

.empty-content {
  font-style: italic;
  font-size: 12px;
}
</style>
