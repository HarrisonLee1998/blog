<template>
  <div class="container">
    <header>
      <div id="nav" class="backco" :class="checked ? 'menu-show' : 'menu-hidden'">
        <div class="hide-layer" @click="checked = false" />
        <nuxt-link id="logo" to="/">
          harrison's blog
        </nuxt-link>
        <input id="check" type="checkbox" @change="checked=!checked">
        <label id="checkbtn" for="check">
          <!-- <i v-if="!checked" class="fa fa-bars" enter-active-class="zoomIn" leave-active-class="zoomOut" />
          <i v-else class="fa fa-times" enter-active-class="zoomIn" leave-active-class="zoomOut" /> -->
          <i v-show="!checked" class="fa fa-bars" />
          <i v-show="checked" class="fas fa-times" />
        </label>
        <div id="menu" class="backco">
          <div v-for="item in items" :key="item.title" class="menu-item">
            <nuxt-link :to="item.link">
              {{ item.title }}
            </nuxt-link>
          </div>
          <div id="toggle-theme" class="menu-item">
            <i
              :class="['fas', isDark ? 'fa-moon' : 'fa-sun']"
              @click="isDark = !isDark"
            />
          </div>
        </div>
      </div>
    </header>
    <nuxt id="main" />
    <footer>
      <span class="footer-field">
        <i class="far fa-copyright" />{{ startYear }}
        <span v-show="startYear!== nowYear">- {{ nowYear }}</span>
        harrisonlee
      </span>
      <!--ICP备案、公安备案-->
      <span class="footer-field"><a href="http://www.beian.gov.cn/" target="_blank">蜀ICP备20009821号</a></span>
      <!-- <span>
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=公安备案号" target="_blank">公安备案号</a>
      </span> -->
    </footer>
    <i v-show="showUp" class="fas fa-arrow-up" @click="scrollToTop" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          title: '文章',
          no: 2,
          link: '/post'
        },
        {
          title: '归档',
          no: 3,
          link: '/archive'
        },
        {
          title: '标签',
          no: 4,
          link: '/tag'
        },
        {
          title: '关于',
          no: 5,
          link: '/about'
        }
      ],
      isDark: undefined,
      checked: false,
      showUp: false,
      startYear: 2020,
      nowYear: 2020
    }
  },
  watch: {
    isDark () {
      if (this.isDark) {
        this.$colorMode.value = 'dark'
      } else {
        this.$colorMode.value = 'light'
      }
    },
    $route: {
      handler () {
        this.checked = false
      },
      deep: true
    }
  },
  created () {
    const h = new Date().getHours()
    if (h <= 7 || h >= 19) {
      this.isDark = true
    } else {
      this.isDark = false
    }
    this.nowYear = new Date().getFullYear()
  },
  mounted () {
    window.addEventListener('scroll', this.scroll)
  },
  methods: {
    scroll () {
      const height =
        document.body.scrollTop || document.documentElement.scrollTop
      if (height > 0) {
        this.showUp = true
      } else {
        this.showUp = false
      }
    },
    scrollToTop () {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 64px;
.light-mode .container {
  // background-image: url('https://cdn.harrisonlee.net/palm-leaf.png');
  background-image: url('https://cdn.harrisonlee.net/bananas.png');
  background-attachment: fixed;
}
.dark-mode .container {
  background-image: url('https://cdn.harrisonlee.net/dark-grey-terrazzo.png');
  background-attachment: fixed;
}
header{
  min-height: $height;
}
#main{
  min-height: calc(100vh - 100px);
  min-height: -webkit-calc(100vh - 100px);
  min-height: -moz-calc(100vh - 100px);
  overflow-x: hidden;
}
footer{
  height: 36px;
  font-size: 14px;
  // padding-right: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.footer-field:not(:first-child){
  margin-left: 20px;
}
#nav{
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: $height;
  font-family: 'DengXian';
  font-size: 18px;
  font-weight: bold;
  position: fixed;
  margin: 0;
  padding: 0;
  z-index: 99;
  font-size: 24px;
}

 #toggle-theme > i{
  cursor: pointer;
}

#check{
  display: none;
}
.fa-arrow-up {
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 16px;
  position: fixed;
  bottom: 20px;
  right: 0;
  cursor: pointer;
}

#menu {
  font-size: 18px;
}

@media screen and(min-width: 680px){
  #main{
    margin: 5%;
    // padding: 0 1%;
    // width: 80%;
  }
  #logo {
    width: 30%;
    padding-left: 5%;
  }
  #menu {
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .menu-item {
    max-width: 20%;
    min-width: 80px;
    text-align: center;
  }
  .menu-item > a {
    padding: 10px 20px;
  }
  #checkbtn {
    display: none;
  }
}

@media screen and(max-width: 680px){
  #main {
    margin: 5%;
  }
  #nav {
    display: flex;
    flex-direction: row-reverse;
  }
  #logo {
    width: 80%;
    text-align: right;
  }
  #checkbtn {
    width: 10%;
  }
  #menu {
    position: fixed;
    min-width: 200px;
    // height: calc(100vh, -$height);
    width: 100%;
    // height: calc($height * 5);
    top: $height;
    left: -100%;
    // bottom: 0;
    // top: calc(-100% + 64px);
    transition: all 0.2s linear;
    border-top: 1px solid #ccc;
  }
  .menu-item {
    height: $height;
    line-height: $height;
    text-align: center;
  }
  .menu-item > a {
    display: block;
    width: 100%;
  }
  .menu-show > #menu {
    left: 0;
    // top: $height;
    z-index: 10;
  }
  .hide-layer {
    display: none;
  }
  .menu-show > .hide-layer {
    display: block;
    position: fixed;
    top: $height;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }
}
</style>
