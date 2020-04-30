<template>
  <div>
    404 {{ $colorMode.value }} <nuxt-link to="/">
      首页
    </nuxt-link>
  </div>
</template>
<script>

export default {
  asyncData () {
    return new Promise((resolve) => {
      // eslint-disable-next-line nuxt/no-timing-in-fetch-data
      setTimeout(function () {
        resolve({ name: 'world' })
      }, 2000)
    })
  }
}
</script>
