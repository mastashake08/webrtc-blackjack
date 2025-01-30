<template>
  <div class="app">
    <GameTable />
  </div>
</template>

<script setup>
import GameTable from "./components/GameTable.vue";
</script>

<style scoped>
.app {
  text-align: center;
  font-family: "Arial", sans-serif;
  background: linear-gradient(45deg, #0288d1, #026aa7);
  min-height: 100vh;
  color: white;
  padding: 20px;
}
</style>
