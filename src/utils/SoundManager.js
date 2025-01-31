export const SoundManager = {
    sounds: {
      shuffle: new Audio("/webrtc-blackjack/sounds/shuffle.mp3"),
    //   deal: new Audio("/sounds/deal.mp3"),
       hit: new Audio("/webrtc-blackjack/sounds/hit.mp3"),
    //   stand: new Audio("/sounds/stand.mp3"),
      win: new Audio("/webrtc-blackjack/sounds/win.mp3"),
      lose: new Audio("/webrtc-blackjack/sounds/lose.mp3"),
      bgMusic: new Audio("/webrtc-blackjack/sounds/bg.mp3"),
    },
    soundEnabled: true,
    musicEnabled: true,
  
    init() {
      this.sounds.bgMusic.loop = true; // Make background music loop
      this.loadSettings();
    },
  
    play(soundName) {
      if (this.soundEnabled && this.sounds[soundName]) {
        this.sounds[soundName].currentTime = 0;
        this.sounds[soundName].play().catch((e) => console.warn(`Sound error: ${e}`));
      }
    },
  
    playMusic() {
      if (this.musicEnabled) {
        this.sounds.bgMusic.volume = 0.5;
        this.sounds.bgMusic.play().catch(() => console.warn("Background music autoplay blocked"));
      }
    },
  
    stopMusic() {
      this.sounds.bgMusic.pause();
      this.sounds.bgMusic.currentTime = 0;
    },
  
    toggleSoundEffects() {
      this.soundEnabled = !this.soundEnabled;
      this.saveSettings();
    },
  
    toggleMusic() {
      this.musicEnabled = !this.musicEnabled;
      if (this.musicEnabled) {
        this.playMusic();
      } else {
        this.stopMusic();
      }
      this.saveSettings();
    },
  
    saveSettings() {
      localStorage.setItem("soundSettings", JSON.stringify({
        bgMusic: this.musicEnabled,
        soundEffects: this.soundEnabled,
      }));
    },
  
    loadSettings() {
      const settings = JSON.parse(localStorage.getItem("soundSettings"));
      if (settings) {
        this.musicEnabled = settings.bgMusic;
        this.soundEnabled = settings.soundEffects;
      }
      if (this.musicEnabled) this.playMusic();
    },
  };  