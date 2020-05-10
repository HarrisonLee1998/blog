<template>
  <div>
    <div class="error-wrapper">
      <h1>Something is wrong here...</h1>
      <h3>possible reasons:</h3>
      <ul>
        <li>The page doesn't exist on this website</li>
        <li>The resource you're looking for has been deleted</li>
        <li>You have no privilege to access the resource</li>
      </ul>
    </div>
    <!-- <div>
      <span> <a href="/">GO BACK HOME</a></span>
    </div> -->
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: 'some errors occured...'
    }
  }
}
</script>

<style lang="scss" scoped>
#main {
  margin: 0;
}
.error-wrapper {
  width: 50%;
  max-width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
ul {
  margin-bottom: 5%;
}
</style>
