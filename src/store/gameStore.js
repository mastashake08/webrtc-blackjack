import { defineStore } from "pinia";
import { Peer } from "peerjs";

const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Example: "A1B2C3"
  };
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
    restartGame() {
        if (this.isHost) {
          // Reset game state
          this.deck = this.shuffleDeck();
          this.gameOver = false;
  
          // Reset players
          Object.keys(this.players).forEach((playerId) => {
            this.players[playerId].hand = [];
            this.players[playerId].score = 0;
            this.players[playerId].bet = 0;
          });
  
          // Reset dealer
          this.dealer = { hand: [], score: 0 };
  
          // Set first player's turn
          this.currentTurn = Object.keys(this.players)[0];
  
          // Send update to players
          this.sendGameState();
        }
      },
    initializePeer(customPeerId = null) {
      this.peerId = customPeerId || generateRandomId(); // Use custom ID or generate one
      this.peer = new Peer(this.peerId);
      
      this.peer.on("open", (id) => {
        this.peerId = id;
        console.log("My PeerJS ID:", id);
      });

      this.peer.on("connection", (connection) => {
        this.conn = connection;
        this.isHost = true;

        connection.on("data", (data) => {
          if (data.type === "join") {
            this.players[data.id] = { hand: [], score: 0, balance: 1000, bet: 0 };
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
          }
        });
      });
    },

    connectToPeer(hostId) {
      this.conn = this.peer.connect(hostId);

      this.conn.on("open", () => {
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
    },

    sendGameState() {
      if (this.conn) {
        this.conn.send({
          type: "update",
          players: this.players,
          dealer: this.dealer,
          currentTurn: this.currentTurn,
          gameOver: this.gameOver,
        });
      }
    },

    // ✅ FIX: This function was missing
    dealCards() {
      if (this.isHost) {
        this.deck = this.shuffleDeck();

        // Deal 2 cards to each player
        Object.keys(this.players).forEach((playerId) => {
          this.players[playerId].hand = [this.deck.pop(), this.deck.pop()];
          this.players[playerId].score = this.calculateScore(this.players[playerId].hand);
        });

        // Deal 2 cards to the dealer
        this.dealer.hand = [this.deck.pop(), this.deck.pop()];
        this.dealer.score = this.calculateScore(this.dealer.hand);

        this.currentTurn = Object.keys(this.players)[0]; // First player's turn
        this.gameOver = false;
        this.sendGameState();
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
        } else if (player.score < dealerScore) {
          player.balance -= player.bet;
        }
        player.bet = 0;
      });

      this.gameOver = true;
      this.sendGameState();
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
  },
});
