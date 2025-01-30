<template>
    <div class="game-table">
      <h2>Multiplayer Blackjack ♠♥♣♦</h2>
  
      <!-- Show this if the player hasn't started or joined -->
      <div v-if="!store.peerId">
        <button @click="initializePeer">Start Game (Host)</button>
      </div>
  
      <div v-else-if="!store.conn">
        <p>Your Peer ID: <strong>{{ store.peerId }}</strong></p>
        <input v-model="joinId" placeholder="Enter Host ID">
        <button @click="connectToHost">Join Game</button>
      </div>
  
      <!-- Game UI -->
      <div v-if="store.conn || store.isHost">
        <div v-if="store.isHost">
          <button @click="dealCards">Start Game (Deal Cards)</button>
        </div>
  
        <h3>Dealer</h3>
        <div class="hand">
          <Card v-for="(card, index) in store.dealer.hand" 
                :key="card.value + card.suit"
                :card="card"
                :hiddenCard="index === 1 && !store.gameOver" />
        </div>
  
        <div v-for="(player, id) in store.players" :key="id">
          <h3>Player {{ id }} - Score: {{ player.score }}</h3>
          <div class="hand">
            <Card v-for="card in player.hand" :key="card.value + card.suit" :card="card"/>
          </div>
        </div>
  
        <div v-if="store.currentTurn === store.peerId">
            <button @click="hit">Hit</button>
            <button @click="stand">Stand</button>
        </div>

  
        <div v-if="store.gameOver">
          <h2>Game Over!</h2>
          <p>{{ winnerMessage }}</p>
          <button @click="restartGame">Play Again</button>

        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useGameStore } from "../store/gameStore";
  import Card from "./Card.vue";
  
  const store = useGameStore();
  const joinId = ref("");
  
  const initializePeer = () => store.initializePeer();
  const connectToHost = () => store.connectToPeer(joinId.value);
  const dealCards = () => store.dealCards();
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
    let messages = [];
  
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
  
  <style scoped>
  .game-table {
    text-align: center;
    margin: 20px;
  }
  
  .hand {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  </style>
  