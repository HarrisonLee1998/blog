<template>
  <div>
    <div id="pagination">
      <!-- <span v-show="ps[0] !== 1" class="page-btn" @click="pageNum = 1">F</span> -->
      <span v-show="ps[0] !== 1" @click="pageNum = ps[0] - 1"><i class="fas fa-long-arrow-alt-left" /></span>
      <span v-for="page in ps" :key="page" :class="['page-btn', pageNum === page ? 'active' : '']" @click="pageNum = page"> {{ page }}</span>
      <span v-show="ps[ps.length - 1] !== pages" @click="pageNum = ps[ps.length - 1] + 1"><i class="fas fa-long-arrow-alt-right" /></span>
      <!-- <span v-show="ps[ps.length - 1] !== pages" class="page-btn" @click="pageNum = pages">L</span> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pages: {
      // 总页数
      type: Number,
      required: true
    },
    pageNo: {
      // 当前页码
      type: Number,
      required: true
    },
    pagerCount: {
      // 显示的页数
      type: Number,
      required: true
    }
  },
  data () {
    return {
      ps: [],
      pageNum: 0
    }
  },
  watch: {
    pages () {
      this.handlePage()
    },
    pageNo () {
      if (this.pageNum !== this.pageNo) {
        this.pageNum = this.pageNo
      }
      this.handlePage()
    },
    pageNum (newVal) {
      if (this.pageNum !== this.pageNo) {
        this.$emit('changePageNo', newVal)
      }
    }
  },
  methods: {
    handlePage () {
      const array = []
      if (this.pages > this.pagerCount) {
        let i = this.pageNo
        let j = this.pageNo + 1
        while (array.length < this.pagerCount) {
          if (array.length < this.pagerCount && i > 0) {
            array.unshift(i--)
          }
          if (array.length < this.pagerCount && j <= this.pages) {
            array.push(j++)
          }
        }
      } else {
        for (let i = 1; i <= this.pages; ++i) {
          array.push(i)
        }
      }
      this.ps = array
    }
  }
}
</script>

<style scoped>
#pagination {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
span {
  display: inline-block;
  width: 24px;
  height: 26px;
  line-height: 26px;
  text-align: center;
}
span:not(:last-child) {
  margin-right: 20px;
}
span:hover {
  cursor: pointer;
  color: inherit;
}
.active {
  border-bottom: 3px solid;
  border-bottom-color: inherit;
  color: inherit;
}
</style>
