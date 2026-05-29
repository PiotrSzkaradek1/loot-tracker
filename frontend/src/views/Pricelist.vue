<template>
  <main class="looting-layout" style="grid-template-columns: 1fr 2fr;">
    
    <section class="left-panel">
      <div class="info-box">
        <h3>Menedżer Cen</h3>
        <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 10px;">
          Wprowadź aktualne ceny rynkowe ze swojego serwera. Wartość Twojego stasha zostanie automatycznie przeliczona.
        </p>
        <router-link to="/stash" class="submit-btn" style="text-align: center; text-decoration: none; display: block; background: #3182ce; color: #fff;">
          ← Powrót do Skrytki
        </router-link>
      </div>
    </section>

    <aside class="main-form-panel" style="display: block;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="color: var(--color1); margin: 0;">Twój Cennik</h2>
        <button type="button" @click="saveAllPrices" class="submit-btn" style="margin: 0; width: auto; padding: 0.5rem 1.5rem;">
          Zapisz zmiany
        </button>
      </div>

      <div v-if="loading" style="color: var(--color1); text-align: center; padding: 20px;">
        Ładowanie bazy przedmiotów i cen...
      </div>

      <div v-else>
        <h3>Waluty i Tropy</h3>
        <div class="items-inputs">
          <label style="padding: 0.6rem 0.8rem;">
            <span>Tropy (Tracks):</span>
            <div style="display: flex; align-items: center; gap: 10px;">
              <input 
                type="number" 
                min="0" 
                v-model.number="tracksPrice" 
                style="width: 120px; text-align: right;"
              />
              <span style="color: #ffd700; font-size: 0.85rem;">złota / szt</span>
            </div>
          </label>
        </div>

        <h3>Zwykłe przedmioty dedykowane (Items)</h3>
        <div class="items-inputs">
          <label v-for="item in allItems" :key="item.id" style="padding: 0.6rem 0.8rem;">
            <span>{{ item.name }}</span>
            <div style="display: flex; align-items: center; gap: 10px;">
              <input 
                type="number" 
                min="0" 
                v-model.number="itemPrices[item.id]" 
                style="width: 120px; text-align: right;"
              />
              <span style="color: #ffd700; font-size: 0.85rem;">złota / szt</span>
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

const allItems = ref<DBItem[]>([]);
const itemPrices = ref<Record<number, number>>({});
const tracksPrice = ref<number>(0);
const loading = ref<boolean>(false);

// Ładowanie listy przedmiotów oraz aktualnych cen użytkownika
const loadPricelistData = async () => {
  loading.value = true;
  const token = localStorage.getItem("token");
  
  try {
    // 1. Pobieramy słownik wszystkich przedmiotów (wykorzystujemy Twój istniejący endpoint lub podobny)
    const resLoot = await fetch("http://localhost:3000/api/loot/loot-data", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // 2. Pobieramy zapisane ceny użytkownika
    const resPrices = await fetch("http://localhost:3000/api/pricelist", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (resLoot.ok && resPrices.ok) {
      const lootData = await resLoot.json();
      const pricesData = await resPrices.json();

      // Wyciągamy unikalną listę wszystkich przedmiotów z map bazy danych lootu
      const itemsSet = new Map<number, string>();
      if (lootData.items) {
        Object.values(lootData.items).forEach((list: any) => {
          list.forEach((item: DBItem) => itemsSet.set(item.id, item.name));
        });
      }
      allItems.value = Array.from(itemsSet.entries()).map(([id, name]) => ({ id, name }));

      // Inicjalizacja domyślnych cen na 0
      allItems.value.forEach(item => {
        itemPrices.value[item.id] = 0;
      });

      // Przypisywanie pobranych cen z bazy danych do pól formularza
      pricesData.forEach((p: { item_type: string; item_id: number; price: number }) => {
        if (p.item_type === 'tracks') {
          tracksPrice.value = p.price;
        } else if (p.item_type === 'item') {
          itemPrices.value[p.item_id] = p.price;
        }
      });
    }
  } catch (err) {
    console.error("Błąd podczas ładowania cennika:", err);
  } finally {
    loading.value = false;
  }
};

// Zapisywanie całego formularza cen (wysyła sekwencyjnie lub zbiorczo)
const saveAllPrices = async () => {
  const token = localStorage.getItem("token");
  try {
    // Zapis ceny tropów
    await fetch("http://localhost:3000/api/pricelist/save", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ item_type: 'tracks', item_id: 0, price: tracksPrice.value })
    });

    // Zapis cen poszczególnych przedmiotów
    for (const [id, price] of Object.entries(itemPrices.value)) {
      await fetch("http://localhost:3000/api/pricelist/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ item_type: 'item', item_id: Number(id), price: price })
      });
    }

    alert("Cennik został pomyślnie zapisany w Twoim profilu!");
  } catch (err) {
    console.error("Błąd zapisu cennika:", err);
    alert("Wystąpił błąd podczas zapisu cen.");
  }
};

onMounted(() => {
  loadPricelistData();
});
</script>

<style scoped>
@import '@/assets/looting.css';
</style>