<template>
  <div class="modal-backdrop">
    <div class="modal-content">
      <h2>Dodaj postać</h2>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <form @submit.prevent="handleSubmit">
        <input 
          v-model="name" 
          placeholder="Nick" 
          required 
        />
        
        <input 
          type="number" 
          placeholder="Level" 
          v-model.number="level" 
          min="1" 
          max="140" 
          required
        />
        
        <div class="form-control">
          <label for="profession">Profesja</label>
          <select id="profession" v-model="profession" required>
            <option value="">-- Wybierz profesję --</option>
            <option v-for="p in professions" :key="p" :value="p">
              {{ p }}
            </option>
          </select>
        </div>

        <div class="form-control">
          <label for="server">Serwer</label>
          <select id="server" v-model="server" required>
            <option value="">-- Wybierz serwer --</option>
            <option v-for="s in servers" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
        </div>

        <div class="modal-buttons">
          <button type="submit">Dodaj</button>
          <button type="button" @click="$emit('close')">Anuluj</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['close', 'success']);

const name = ref('');
const level = ref<number | ''>('');
const profession = ref('');
const server = ref('');
const errorMessage = ref('');

const professions = ["Rycerz", "Łucznik", "Sheed", "Barbarzyńca", "Druid", "Voodoo", "Mag Ognia"];
const servers = ["Thanar", "Veskara", "Vardis"];

const handleSubmit = async () => {
  if (Number(level.value) < 1 || Number(level.value) > 140) {
    errorMessage.value = "Level musi być w zakresie 1-140!";
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name.value,
        level: level.value,
        profession: profession.value,
        server: server.value,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      errorMessage.value = data.message || "Błąd dodawania postaci";
      return;
    }

    emit('success');
  } catch (err) {
    console.error(err);
    errorMessage.value = "Błąd połączenia z serwerem";
  }
};
</script>