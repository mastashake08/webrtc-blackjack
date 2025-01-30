<template>
    <div class="min-h-screen bg-gradient-to-br from-green-900 to-green-700 text-white flex flex-col items-center py-10">
      <h1 class="text-4xl font-bold mb-6">♠♥ Let The Games Begin ♣♦</h1>
  
      <!-- Home Screen -->
      <div v-if="!store.peerId" class="flex flex-col items-center space-y-4">
        <button @click="initializePeer"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-md font-semibold text-lg shadow-md">
          Start Game (Host)
        </button>
      </div>
  
      <div v-else-if="!store.conn" class="flex flex-col items-center space-y-4">
        <p class="text-lg font-semibold">Your Peer ID: <span class="text-yellow-300">{{ store.peerId }}</span></p>
        <input v-model="joinId" placeholder="Enter Host ID"
          class="p-2 text-black rounded-md border border-gray-300 w-64 text-center" />
        <button @click="connectToHost"
          class="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 transition rounded-md font-semibold text-lg shadow-md">
          Join Game
        </button>
      </div>
  
      <!-- Game UI -->
      <div v-if="store.conn || store.isHost" class="w-full max-w-3xl mt-6">
        <!-- Start Game Button -->
        <div v-if="store.isHost" class="mb-6">
          <button @click="dealCards"
            class="px-6 py-3 bg-red-600 hover:bg-red-700 transition rounded-md font-semibold text-lg shadow-md">
            Start Game (Deal Cards)
          </button>
        </div>
  
        <!-- Dealer Section -->
        <h3 class="text-2xl font-bold mt-6">Dealer</h3>
        <div class="flex justify-center mt-2 space-x-2">
          <Card v-for="(card, index) in store.dealer.hand" 
                :key="card.value + card.suit"
                :card="card"
                :hiddenCard="index === 1 && !store.gameOver" />
        </div>
  
        <!-- Players Section -->
        <div v-for="(player, id) in store.players" :key="id" class="mt-6 text-center">
          <h3 class="text-lg font-semibold">Player {{ id }} - Score: {{ player.score }}</h3>
          <div class="flex justify-center space-x-2">
            <Card v-for="card in player.hand" :key="card.value + card.suit" :card="card"/>
          </div>
        </div>
  
        <!-- Player Controls -->
        <div v-if="store.currentTurn === store.peerId" class="mt-6 flex space-x-4 justify-center">
          <button @click="hit" class="px-6 py-3 bg-blue-500 hover:bg-blue-600 transition rounded-md font-semibold text-lg shadow-md">
            Hit
          </button>
          <button @click="stand" class="px-6 py-3 bg-gray-500 hover:bg-gray-600 transition rounded-md font-semibold text-lg shadow-md">
            Stand
          </button>
        </div>
  
        <!-- Game Over Section -->
        <div v-if="store.gameOver" class="mt-8 text-center">
          <h2 class="text-3xl font-bold">Game Over!</h2>
          <p class="text-xl">{{ winnerMessage }}</p>
          <button @click="restartGame"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded-md font-semibold text-lg shadow-md mt-4">
            Play Again
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  // @ts-ignore
  import { useGameStore } from "../store/gameStore";
  import Card from "./Card.vue";
  
  const store = useGameStore();
  const joinId = ref("");
  console.log(store)
  const initializePeer = () => store.initializePeer();
  const connectToHost = () => store.connectToPeer(joinId.value);
  const dealCards = () => {
  if (store.isHost) {
    store.dealCards();
  } else if (store.conn) {
    store.conn.send({ type: "dealCards" });
  }
};
  const hit = () => {
    if (store.isHost) {
      store.dealCardToPlayer(store.peerId);
    } else if (store.conn) {
      store.conn.send({ type: "hit", id: store.peerId });
    }
  };
  
  const stand = () => {
    if (store.isHost) {
      store.nextTurn();
    } else if (store.conn) {
      store.conn.send({ type: "stand", id: store.peerId });
    }
  };
  
  const restartGame = () => {
    if (store.isHost) {
      store.restartGame();
    } else if (store.conn) {
      store.conn.send({ type: "restart" });
    }
  };
  
  const winnerMessage = computed(() => {
    let dealerScore = store.dealer.score;
    let messages: any = [];
  
    Object.keys(store.players).forEach((playerId) => {
      const player = store.players[playerId];
      if (player.score > 21) {
        messages.push(`Player ${playerId} Busted!`);
      } else if (dealerScore > 21 || player.score > dealerScore) {
        messages.push(`Player ${playerId} Wins!`);
      } else if (player.score < dealerScore) {
        messages.push(`Player ${playerId} Lost!`);
      } else {
        messages.push(`Player ${playerId} Tied!`);
      }
    });
  
    return messages.join("\n");
  });
  </script>
  