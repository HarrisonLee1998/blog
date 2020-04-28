<template>
  <div v-if="loading" id="loading">
    <!-- :class="$colorMode.value === 'light' ? 'light' : 'dark'" -->
    <ul>
      <li />
      <li />
      <li />
      <li />
      <li />
      <li />
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style lang="css" scoped>
#loading {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 9999;
}
.dark-mode #loading {
  background-color: #000;
}
.dark-mode li {
  background-color: #fff;
}

.light-mode #loading {
  background-color: #fff;
}

.light-mode li {
  background-color: #000;
}

ul {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  margin: 0;
  padding: 0;
}
ul li {
  list-style: none;
  width: 6px;
  height: 20px;
  margin: 0 4px;
  animation: animate 0.7s infinite alternate;
  color: inherit;
}

@keyframes animate {
  0% {
    transform: scaleY(1);
  }
  25% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1);
  }
  75% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(3);
  }
}

ul li:nth-child(1) {
  animation-delay: 0.1s;
}
ul li:nth-child(2) {
  animation-delay: 0.2s;
}
ul li:nth-child(3) {
  animation-delay: 0.3s;
}
ul li:nth-child(4) {
  animation-delay: 0.4s;
}
ul li:nth-child(5) {
  animation-delay: 0.5s;
}
ul li:nth-child(6) {
  animation-delay: 0.6s;
}
</style>
