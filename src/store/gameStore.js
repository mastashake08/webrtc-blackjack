import { defineStore } from "pinia";
import { Peer } from "peerjs";
import { SoundManager } from "../utils/SoundManager";
export const useGameStore = defineStore("game", {
  state: () => ({
    peer: null,
    conn: null,
    peerId: "",
    players: {},
    dealer: { hand: [], score: 0 },
    deck: [],
    isHost: false,
    currentTurn: null,
    gameOver: false,
  }),

  actions: {
    initializePeer(customPeerId = null) {
      this.peerId = customPeerId || this.generateRandomId();
      this.peer = new Peer(this.peerId);

      this.peer.on("open", (id) => {
        console.log("My PeerJS ID:", id);
      });

      this.peer.on("connection", (connection) => {
        this.isHost = true;
        this.handleNewConnection(connection);
      });
    },
    dealCards() {
        if (!this.isHost) return; // Ensure only the host can start the game
        
        this.deck = this.shuffleDeck();
        this.gameOver = false;
  
        // Reset hands for all players
        Object.keys(this.players).forEach((playerId) => {
          this.players[playerId].hand = [this.deck.pop(), this.deck.pop()];
          this.players[playerId].score = this.calculateScore(this.players[playerId].hand);
        });
  
        // Give two cards to the dealer
        this.dealer.hand = [this.deck.pop(), this.deck.pop()];
        this.dealer.score = this.calculateScore(this.dealer.hand);
  
        // Set first player's turn
        this.currentTurn = Object.keys(this.players)[0];
  
        this.sendGameState();
      },
    handleNewConnection(connection) {
      console.log(`Player connected: ${connection.peer}`);
      this.players[connection.peer] = { hand: [], score: 0, balance: 1000, bet: 0 };

      connection.on("data", (data) => {
        if (data.type === "join") {
          console.log(`Player ${data.id} joined the game.`);
          this.sendGameState();
        } else if (data.type === "bet") {
          this.players[data.id].bet = data.amount;
          this.sendGameState();
        } else if (data.type === "hit") {
          this.dealCardToPlayer(data.id);
        } else if (data.type === "stand") {
          this.nextTurn();
        } else if (data.type === "restart") {
          this.restartGame();
        } else if (data.type === "dealCards" && this.isHost) {
            this.dealCards();
          }
      });

      connection.on("close", () => {
        console.log(`Player disconnected: ${connection.peer}`);
        delete this.players[connection.peer];
        this.sendGameState();
      });

      this.sendGameState(); // Send full game state to new player
    },

    connectToPeer(hostId) {
      this.conn = this.peer.connect(hostId);

      this.conn.on("open", () => {
        console.log("Connected to host!");
        this.conn.send({ type: "join", id: this.peerId });
      });

      this.conn.on("data", (data) => {
        if (data.type === "update") {
          this.players = data.players;
          this.dealer = data.dealer;
          this.currentTurn = data.currentTurn;
          this.gameOver = data.gameOver;
        }
      });

      this.conn.on("close", () => {
        console.log("Connection lost! Reconnecting...");
        setTimeout(() => this.connectToPeer(hostId), 2000);
      });
    },

    sendGameState() {
      if (this.isHost) {
        Object.values(this.peer.connections).forEach((connections) => {
          connections.forEach((conn) => {
            conn.send({
              type: "update",
              players: this.players,
              dealer: this.dealer,
              currentTurn: this.currentTurn,
              gameOver: this.gameOver,
            });
          });
        });
      }
    },

    dealCardToPlayer(playerId) {
      if (this.isHost && this.currentTurn === playerId) {
        this.players[playerId].hand.push(this.deck.pop());
        this.players[playerId].score = this.calculateScore(this.players[playerId].hand);

        if (this.players[playerId].score > 21) {
          this.nextTurn();
        } else {
          this.sendGameState();
        }
      }
    },

    nextTurn() {
      const playerIds = Object.keys(this.players);
      const currentIndex = playerIds.indexOf(this.currentTurn);

      if (currentIndex < playerIds.length - 1) {
        this.currentTurn = playerIds[currentIndex + 1];
      } else {
        this.currentTurn = "dealer";
        this.dealerPlays();
      }

      this.sendGameState();
    },

    dealerPlays() {
      if (this.isHost) {
        while (this.dealer.score < 17) {
          this.dealer.hand.push(this.deck.pop());
          this.dealer.score = this.calculateScore(this.dealer.hand);
        }
        this.calculateWinners();
      }
    },

    calculateWinners() {
      const dealerScore = this.dealer.score;

      Object.keys(this.players).forEach((playerId) => {
        const player = this.players[playerId];
        if (player.score > 21) {
          player.balance -= player.bet;
        } else if (dealerScore > 21 || player.score > dealerScore) {
          player.balance += player.bet;
          SoundManager.playSound("win");
        } else if (player.score < dealerScore) {
          player.balance -= player.bet;
        }
        player.bet = 0;
      });

      this.gameOver = true;
      this.sendGameState();
    },

    restartGame() {
      if (this.isHost) {
        this.deck = this.shuffleDeck();
        this.gameOver = false;

        Object.keys(this.players).forEach((playerId) => {
          this.players[playerId].hand = [];
          this.players[playerId].score = 0;
          this.players[playerId].bet = 0;
        });

        this.dealer = { hand: [], score: 0 };
        this.currentTurn = Object.keys(this.players)[0];
        this.sendGameState();
      }
    },

    shuffleDeck() {
      const suits = ["♠", "♥", "♦", "♣"];
      const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
      let deck = suits.flatMap((suit) =>
        values.map((value) => ({ suit, value }))
      );
      return deck.sort(() => Math.random() - 0.5);
    },

    calculateScore(hand) {
      let score = 0;
      let aces = 0;
      hand.forEach((card) => {
        if (typeof card.value === "number") {
          score += card.value;
        } else if (["J", "Q", "K"].includes(card.value)) {
          score += 10;
        } else {
          aces += 1;
          score += 11;
        }
      });

      while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
      }
      return score;
    },

    generateRandomId() {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  },
});
