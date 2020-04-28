<template>
  <div class="container">
    <header>
      <div id="nav">
        <div id="logo">
          harrison's blog
        </div>
        <input id="check" type="checkbox" @change="checked=!checked">
        <label id="checkbtn" for="check">
          <i v-if="!checked" class="fa fa-bars" enter-active-class="zoomIn" leave-active-class="zoomOut" />
          <i v-else class="fa fa-times" enter-active-class="zoomIn" leave-active-class="zoomOut" />
        </label>
        <div id="menu">
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
      <span><i class="far fa-copyright" /> designed and developed by harrison lee</span>
      <!--ICP备案、公安备案-->
      <span><a href="http://www.beian.gov.cn/">蜀ICP备20009821号</a></span>
      <span>
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=公安备案号">公安备案号</a>
      </span>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          title: '首页',
          no: 1,
          link: '/'
        },
        {
          title: '归档',
          no: 2,
          link: '/archive'
        },
        {
          title: '标签',
          no: 3,
          link: '/tag'
        },
        {
          title: '关于',
          no: 4,
          link: '/about'
        }
      ],
      isDark: false,
      checked: false
    }
  },
  watch: {
    isDark () {
      if (this.isDark) {
        this.$colorMode.value = 'dark'
      } else {
        this.$colorMode.value = 'light'
      }
    }
  },
  created () {
    const h = new Date().getHours()
    if (h <= 7 || h >= 19) {
      this.isDark = true
    } else {
      this.isDark = false
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 64px;
.container{
  background-repeat: no-repeat;
  background-size:cover;
  background-attachment:fixed;
}
header{
  min-height: $height;
}
#main{
  min-height: calc(100vh - 100px);
  min-height: -webkit-calc(100vh - 100px);
  min-height: -moz-calc(100vh - 100px);
}
footer{
  height: 36px;
  font-size: 10px;
  padding-right: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-end;
}
footer span{
  margin-left: 20px;
}
#nav{
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  width: 100%;
  height: $height;
  font-family: 'DengXian';
  font-size: 18px;
  font-weight: bold;
  position: fixed;
  margin: 0;
  padding: 0;
  z-index: 9999;
}
.dark-mode #nav{
  background-color: rgba(0,0,0,0.5);
}
.light-mode #nav{
  background-color: rgba(255,255,255,0.5);;
}
 #logo {
   font-size: 20px;
 }
 #toggle-theme > i{
  cursor: pointer;
}

#check{
  display: none;
}

@media screen and(min-width: 680px){
  .container {
    background-image: url('https://cdn.harrisonlee.net/lifeisshort.png');
  }
  #logo {
    width: 30%;
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
    width: auto;
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
  .container{
    background-image: url('https://cdn.harrisonlee.net/1585768671682.jpg');
  }
  #logo {
    width: 80%;
    text-align: left;
    padding-left: 20px;
  }
  #checkbtn {
    width: 20%;
    text-align: right;
    padding-right: 20px;
  }
  #menu {
    position: fixed;
    min-width: 200px;
    height: calc(100vh, -$height);
    top: $height;
    right: -100%;
    bottom: 0;
    transition: all 0.3s linear;
  }
  .dark-mode #menu {
    background-color: rgba(0,0,0,0.7);
  }
  .light-mode #menu{
    background-color: rgba(255,255,255,0.7);;
  }
  .menu-item{
    height: $height;
    line-height: $height;
  }
  #check:checked ~ #menu{
    right: 0;
  }
}
</style>
