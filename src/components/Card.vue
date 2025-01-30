<template>
    <div class="card" :class="{ hidden: hiddenCard }">
      <span class="card-text" v-if="!hiddenCard">{{ card.value }}</span>
      <span class="card-text" v-if="!hiddenCard">{{ card.suit }}</span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    card: Object,
    hiddenCard: Boolean,
  });
  </script>
  
  <style scoped>
  .card {
    width: 80px;
    height: 120px;
    background: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    margin: 5px;
    border: 2px solid black;
    color: black; /* Make text readable */
  }
  
  .card.hidden {
    background: linear-gradient(45deg, #333, #111);
    color: transparent;
  }
  
  .card-text {
    font-size: 30px;
    font-weight: bold;
  }
  </style>
  