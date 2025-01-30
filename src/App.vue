<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-900 to-green-700 text-white px-4">
    <!-- Title with animation -->
    <h1 class="text-5xl sm:text-6xl font-extrabold mb-8 drop-shadow-lg animate-fade-in">
      ♠♥ WebRTC Blackjack ♣♦
    </h1>

    <!-- Game Table -->
    <div class="w-full max-w-5xl bg-green-800/90 border-4 border-yellow-500 rounded-lg shadow-2xl p-6 sm:p-10 animate-slide-up">
      <GameTable />
    </div>
  </div>
</template>

<script setup>
import GameTable from "./components/GameTable.vue";
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}
</style>
