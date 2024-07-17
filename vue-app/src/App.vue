<script setup lang="ts">
import Home from './components/Home.vue'
</script>

<template>
  <div id="adblock_banner">
    <script type='text/javascript'>
      googletag.cmd.push(function() {
        googletag.display('adblock_banner');
      });
    </script>
  </div>
  <div>
    <a href="//vitejs.dev" target="_blank">
      <img src="/assets/img/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="//www.optidigital.com/" target="_blank">
      <img src="/assets/img/logo-opti-2.png" class="logo opti" alt="OptiDigital logo" />
    </a>
    <a href="//vuejs.org/" target="_blank">
      <img src="/assets/img/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <Home msg="OptiDigital Test" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;

  &:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
    transform: scale(1.5);
  }

  &.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
    transform: scale(1.5);
  }

  &.opti:hover {
    filter: drop-shadow(0 0 2em #1066cfaa);
    transform: scale(1.5);
  }
}
</style>
