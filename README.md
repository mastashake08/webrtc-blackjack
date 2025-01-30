# **♠♥ Multiplayer Blackjack ♣♦**  

🎰 A **real-time multiplayer Blackjack game** built with **Vue 3, Pinia, PeerJS, and Tailwind CSS**! Play online with friends using **WebRTC peer-to-peer connections**. 🃏  

## **🚀 Features**
✔ **🎮 Multiplayer Support** – Host or join a game with a unique PeerJS ID.  
✔ **💰 Betting System** – Players can place bets before the game starts.  
✔ **🃏 Dealer AI** – The dealer follows **Blackjack rules** (hits below 17, stands on 17+).  
✔ **🎨 Beautiful Tailwind UI** – Sleek casino-inspired design with animations.  
✔ **💨 Smooth Card Animations** – Cards **fade, slide, and flip** for a polished experience.  
✔ **🔄 Auto-Reconnect** – Players can **rejoin if they disconnect**.  

---

## **📦 Installation**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/multiplayer-blackjack.git
cd multiplayer-blackjack
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Run the Development Server**
```sh
npm run dev
```
- Open your browser and go to **`http://localhost:5173/`**.

---

## **🎮 How to Play**
### **🌟 Start a Game**
1. **Click "Host Game"** to generate a PeerJS ID.
2. **Share your Peer ID** with friends who want to join.

### **🌍 Join a Game**
1. **Enter the Host's Peer ID** and click **"Join Game"**.
2. Wait for the host to start dealing cards.

### **💰 Place Your Bets**
- Each player enters **a bet amount** before the round begins.

### **🎲 Gameplay**
- **Hit** = Draw another card.  
- **Stand** = Keep your current hand.  
- **Dealer automatically plays** after all players finish.

### **🏆 Winning Conditions**
- Closest to **21** without busting wins!
- **Dealer busts?** All remaining players **win**.
- **Ties result in a push** (bet is returned).

### **♻ Restarting**
- Click **"Play Again"** to start a new round.

---

## **📸 Screenshots**
### 🎨 **Sexy UI with Tailwind**
| Home Screen | In-Game Table |
|------------|--------------|
| ![Home](https://via.placeholder.com/400x200?text=Home+Screen) | ![Game](https://via.placeholder.com/400x200?text=Game+Table) |

---

## **🔧 Tech Stack**
- **🖥 Frontend:** Vue 3, Pinia, Tailwind CSS  
- **📡 Networking:** PeerJS (WebRTC)  
- **🎨 Animations:** CSS Keyframes, Tailwind  

---

## **📌 To-Do List**
🔹 **🗣️ Add Sound Effects** – Shuffle, deal, win sounds.  
🔹 **🎨 Neon Glow UI** – Add casino-style glow effects.  
🔹 **📲 Mobile-Friendly Enhancements**.  

---

## **👨‍💻 Contributing**
**Want to improve this project?** Contributions are welcome! 🚀  
1. Fork the repo  
2. Create a new branch: `git checkout -b feature-name`  
3. Commit changes: `git commit -m "Added feature XYZ"`  
4. Push branch: `git push origin feature-name`  
5. Submit a Pull Request 🎉  

---

## **📜 License**
**MIT License** – Free to use and modify!  

---

## **⭐ Support**
If you love this project, **star it on GitHub!** ⭐  
Got issues? Open a ticket or suggest features. 🃏♠♣♦🚀