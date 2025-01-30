export const SoundManager = {
    sounds: {
      //shuffle: new Audio("/sounds/shuffle.mp3"),
    //   deal: new Audio("/sounds/deal.mp3"),
    //   hit: new Audio("/sounds/hit.mp3"),
    //   stand: new Audio("/sounds/stand.mp3"),
      win: new Audio("webrtc-blackjack/sounds/win.mp3"),
    //   lose: new Audio("/sounds/lose.mp3"),
    //   button: new Audio("/sounds/button.mp3"),
    },
  
    play(soundName) {
      if (this.sounds[soundName]) {
        this.sounds[soundName].currentTime = 0; // Restart sound if already playing
        this.sounds[soundName].play().catch((e) => console.warn(`Sound error: ${e}`));
      }
    },
  };
  