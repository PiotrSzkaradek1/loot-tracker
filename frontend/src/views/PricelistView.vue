<template>
  <main class="looting-layout" style="grid-template-columns: 1fr 2fr;">
    
    <section class="left-panel">
      <div class="info-box">
        <h3>Menedżer Cen</h3>
        <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 15px;">
          Wybierz serwer i wprowadź własne stawki rynkowe dla przedmiotów.
        </p>

        <label style="color: #fff; font-weight: bold; display: block; margin-bottom: 5px;">Serwer:</label>
        <select v-model="selectedServer" @change="loadServerPrices" class="submit-btn" style="background: #2d3748; color: #fff; border: 1px solid #4a5568; margin-bottom: 20px; width: 100%;">
          <option value="Thanar">Thanar</option>
          <option value="Veskara">Veskara</option>
          <option value="Vardis">Vardis</option>
        </select>

        <router-link to="/stash" class="submit-btn" style="text-align: center; text-decoration: none; display: block; background: #4a5568; color: #fff;">
          ← Powrót do Skrytki
        </router-link>
      </div>
    </section>

    <aside class="main-form-panel" style="display: block;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="color: var(--color1); margin: 0;">Cennik — Serwer {{ selectedServer }}</h2>
        <button type="button" @click="saveAllPrices" :disabled="loading" class="submit-btn" style="margin: 0; width: auto; padding: 0.5rem 1.5rem;">
          Zapisz dla {{ selectedServer }}
        </button>
      </div>

      <div v-if="loading" style="color: var(--color1); text-align: center; padding: 20px;">
        Ładowanie bazy przedmiotów i cen serwera...
      </div>

      <div v-else>
        <div class="items-inputs">
          <label v-for="item in allItems" :key="item.id" style="padding: 0.6rem 0.8rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2d3748;">
            <span>{{ item.name }}</span>
            <div style="display: flex; align-items: center; gap: 10px;">
              <input 
                type="number" 
                min="0" 
                v-model.number="itemPrices[item.id]" 
                style="width: 120px; text-align: right; background: #1a202c; color: #fff; border: 1px solid #4a5568; padding: 4px 8px; border-radius: 4px;"
              />
              <span style="color: #ffd700; font-size: 0.85rem;">złota</span>
            </div>
          </label>
        </div>
      </div>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface DBItem { id: number; name: string; }

const selectedServer = ref<string>("Thanar"); // Domyślny serwer
const allItems = ref<DBItem[]>([]);
const itemPrices = ref<Record<number, number>>({});
const loading = ref<boolean>(false);

// Pobiera globalny spis przedmiotów z tabeli items
const loadGlobalItems = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:3000/api/pricelist/items", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      allItems.value = await res.json();
    }
  } catch (err) {
    console.error("Błąd ładowania spisu przedmiotów:", err);
  }
};

// Pobiera ceny użytkownika dla aktualnie wybranego serwera
const loadServerPrices = async () => {
  loading.value = true;
  const token = localStorage.getItem("token");
  
  // Resetujemy najpierw formularz do zer
  allItems.value.forEach(item => {
    itemPrices.value[item.id] = 0;
  });

  try {
    const res = await fetch(`http://localhost:3000/api/pricelist/my-prices?server=${selectedServer.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const savedPrices = await res.json(); // Zwraca tablicę [{ item_id, price }, ...]
      savedPrices.forEach((p: { item_id: number; price: number }) => {
        itemPrices.value[p.item_id] = p.price;
      });
    }
  } catch (err) {
    console.error("Błąd podczas pobierania cen serwera:", err);
  } finally {
    loading.value = false;
  }
};

// Masowy zapis stanów pól input na backend
const saveAllPrices = async () => {
  const token = localStorage.getItem("token");
  loading.value = true;

  const pricesPayload = Object.entries(itemPrices.value).map(([id, price]) => ({
    item_id: Number(id),
    price: price
  }));

  try {
    const response = await fetch("http://localhost:3000/api/pricelist/save-bulk", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        server: selectedServer.value, 
        prices: pricesPayload 
      })
    });

    if (response.ok) {
      alert(`Cennik dla serwera ${selectedServer.value} został zaktualizowany!`);
    } else {
      alert("Wystąpił błąd podczas zapisywania cennika.");
    }
  } catch (err) {
    console.error("Błąd zapisu:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadGlobalItems(); // Najpierw słownik nazw przedmiotów
  await loadServerPrices(); // Potem załadowanie cen dla domyślnego serwera
});
</script>

<style scoped>
@import '@/assets/looting.css';
</style>