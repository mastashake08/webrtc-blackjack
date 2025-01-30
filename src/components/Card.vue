<template>
    <div class="card-container" :class="{ 'flip-card': hiddenCard }">
      <div class="card animate-deal" :class="{ 'hidden-card': hiddenCard }">
        <span class="card-text">{{ card?.value }}</span>
        <span class="card-suit">{{ card?.suit }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    card: Object,
    hiddenCard: Boolean,
  });
  </script>
  
  <style scoped>
  /* Card Styling */
  .card-container {
    width: 80px;
    height: 120px;
    perspective: 1000px; /* Enables 3D effect for flipping */
  }
  
  .card {
    width: 100%;
    height: 100%;
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
    color: black;
    transform-style: preserve-3d;
    transition: transform 0.8s ease-in-out;
  }
  
  /* Flip Effect */
  .flip-card {
    transform: rotateY(180deg);
  }
  
  .hidden-card {
    background: linear-gradient(45deg, #333, #111);
    color: transparent;
  }
  
  /* Fade-in and Slide Animation */
  @keyframes deal-card {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .animate-deal {
    animation: deal-card 0.5s ease-out;
  }
  
  /* Improved Card Text */
  .card-text {
    font-size: 30px;
    font-weight: bold;
  }
  
  .card-suit {
    font-size: 24px;
  }
  </style>
  