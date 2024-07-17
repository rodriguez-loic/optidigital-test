<script setup lang="ts">
defineProps<{ msg: string }>()
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="adblock_container">
    <div id="adblock" class="adblock">
      <script type='text/javascript'>
        googletag.cmd.push(function() {
          googletag.display('adblock');
        });
      </script>
    </div>

    <div id="adblock_2" class="adblock">
      <script type='text/javascript'>
        googletag.cmd.push(function() {
          googletag.display('adblock_2');
        });
      </script>
    </div>
  </div>
</template>

<style scoped>
.adblock_container {
  margin: 0 auto;
  .adblock {
    float: left;
  }

}
</style>
