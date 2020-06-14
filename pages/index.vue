<template>
  <div class="container">
    <div class="box">
      <img :src="avatarSrc">
      <p title="harrison1998lee@gmail.com">
        Contact Me:
        <a href="mailto:harrison1998lee@gmail.com">
          <i class="fas fa-envelope" />
        </a>
      </p>
      <!-- <p>患得患失、可有可无</p> -->
    </div>
  </div>
</template>

<script>
export default {
  async asyncData () {
    await function () {
      return { data: 123 }
    }
    console.log('首页')
  },
  data () {
    return {
      avatarSrc: 'https://cdn.harrisonlee.net/avatar20200509.png'
    }
  },
  head () {
    return {
      title: '首页'
    }
  }
}
</script>

<style lang="scss" scoped>
#main{
  margin: 0;
}
.container, .box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  min-width: 300px;
  flex-direction: column;
  font-size: 20px;
  img {
    width: 200px;
    height: auto;
  }
  i {
    cursor: pointer;
  }
}
</style>
