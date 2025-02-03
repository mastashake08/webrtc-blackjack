<template>
    <div class="fixed top-5 right-5 bg-gray-900 text-white p-3 rounded-lg shadow-lg">
      <h3 class="text-lg font-bold mb-2">🎵 Sound Settings</h3>
  
      <div class="flex items-center space-x-3">
        <button @click="toggleMusic" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition">
          {{ store.musicEnabled ? "🎵 Mute Music" : "🎶 Unmute Music" }}
        </button>
  
        <button @click="toggleSoundEffects" class="px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition">
          {{ store.soundEnabled ? "🔊 Mute SFX" : "🔇 Unmute SFX" }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from "vue";
// @ts-ignore
  import { SoundManager } from "../utils/SoundManager";
    import { onMounted } from "vue";
  onMounted(() => {
    SoundManager.init();
  })
  const store = reactive({
    musicEnabled: SoundManager.musicEnabled,
    soundEnabled: SoundManager.soundEnabled,
  });
  
  const toggleMusic = () => {
    SoundManager.toggleMusic();
    store.musicEnabled = SoundManager.musicEnabled;
  };
  
  const toggleSoundEffects = () => {
    SoundManager.toggleSoundEffects();
    store.soundEnabled = SoundManager.soundEnabled;
  };

 
  </script>
  