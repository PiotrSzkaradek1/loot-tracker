<template>
  <main class="looting-layout">
    
    <section class="left-panel">
      <div class="info-box" v-if="character">
        <h3>Postać</h3>
        <p><strong>{{ character.name }}</strong></p>
        <p>{{ character.profession }}</p>
        <p>{{ character.level }} Lvl</p>
        <p>[{{ character.server }}]</p>
      </div>

      <div class="info-box dungeon-box" v-if="dungeon">
        <h3>Instancja</h3>
        <img :src="getDungeonImg(dungeon.name)" :alt="dungeon.name" class="dungeon-img" />
        <p><strong>{{ dungeon.name }}</strong></p>
        <div class="difficulty-wrapper">
            <img :src="getDifficultyImg(difficulty)" :alt="difficulty" class="difficulty-icon" />
            <span>{{ difficulty }}</span>
        </div>
      </div>
    </section>

    <div class="extra-boss-column">
      <h3>Bossowie</h3>
      <div 
        v-for="boss in bosses" 
        :key="boss.id"
        :class="['boss-mini-card', { active: activeBossId === boss.id }]"
        @click="activeBossId = boss.id"
      >
        <img :src="getBossImg(boss.name)" :alt="boss.name" class="boss-mini-img" />
        <p>{{ boss.name }}</p>
      </div>
    </div>

    <aside class="main-form-panel" v-if="activeBoss">

      <form @submit.prevent="handleSubmit">
        
        <div class="form-row">
          <label>
            Złoto:
            <input type="number" min="0" v-model.number="gold" />
          </label>
          <label>
            Tropy:
            <input type="number" min="0" v-model.number="tracks" />
          </label>
        </div>

        <h3>Itemy:</h3>
        <p v-if="currentItems.length === 0">Brak dedykowanych itemów</p>
        <div v-else class="items-inputs">
          <label v-for="item in currentItems" :key="item.id">
            {{ item.name }}:
            <input 
              type="number" 
              min="0" 
              v-model.number="itemAmounts[item.id]"
            />
          </label>
        </div>

        <h3>Dodaj Rara:</h3>
        <div class="add-row">
          <select v-model="selectedRar">
            <option value="">-- wybierz --</option>
            <option v-for="r in currentRars" :key="r.id" :value="r.id">
              {{ r.name }} (T{{ r.tier }})
            </option>
          </select>

          <select v-model.number="rarQuality">
            <option v-for="q in 9" :key="q" :value="q">
              Jakość {{ q }}
            </option>
          </select>

          <button type="button" @click="addRar">Dodaj Rara</button>
        </div>

        <h3>Dodaj Synergetyk:</h3>
        <div class="add-row">
          <select v-model.number="syngQuality">
            <option v-for="q in syngRange" :key="q" :value="q">
              Jakość {{ q }}
            </option>
          </select>
          <button type="button" @click="addSyng">Dodaj Synergetyk</button>
        </div>

        <h3>Dodaj Drifa:</h3>
        <div class="add-row">
          <select v-model="selectedDrif">
            <option value="">-- wybierz --</option>
            <option v-for="d in globalDrifs" :key="d.id" :value="d.id">
              {{ d.name }}
            </option>
          </select>

          <select v-model.number="drifTier">
            <option v-for="t in activeBoss.tier" :key="t" :value="t">
              Tier {{ t }}
            </option>
          </select>

          <button type="button" @click="addDrif">Dodaj Drifa</button>
        </div>

        <h4>Elementy ekwipunku w tym podejściu:</h4>
        <ul id="loot-cart">
          <li v-for="(el, i) in cart" :key="i">
            <span v-if="el.type === 'rar'" class="loot-type">
              RAR: {{ el.name }} (Jakość: {{ el.quality }})
            </span>
            <span v-else-if="el.type === 'syng'" class="loot-type">
              SYNG: Jakość {{ el.quality }}
            </span>
            <span v-else-if="el.type === 'drif'" class="loot-type">
              DRIF: {{ el.name }} (T{{ el.tier }})
            </span>
            <button type="button" class="btn-remove" @click="removeFromCart(i)">X</button>
          </li>
        </ul>

        <button type="submit" class="submit-btn">Zapisz loot</button>
      </form>
    </aside>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import imgEasy from '@/assets/Easy.png';
import imgNormal from '@/assets/Normal.png';
import imgHard from '@/assets/Hard.png';

// Interfejsy struktury danych
interface DBItem { id: number; name: string; }
interface DBRar { id: number; name: string; tier: string; }
interface DBDrif { id: number; name: string; }

interface Boss {
  id: number;
  name: string;
  tier: number;
  min_syng: number;
  max_syng: number;
}

interface CartElement {
  type: 'rar' | 'syng' | 'drif';
  id?: number;
  name?: string;
  quality?: number;
  tier?: number;
}

const bossModules = import.meta.glob('@/assets/bosses/*.{png,jpg,jpeg,svg}', { eager: true });

const route = useRoute();
const dungeonId = route.query.dungeonId;
const difficulty = ref(localStorage.getItem("selectedDifficulty") || 'Normal');

// Dane nadrzędne
const character = ref<any>(null);
const dungeon = ref<any>(null);
const bosses = ref<Boss[]>([]);

const getDifficultyImg = (diff: string) => {
  if (diff === 'Easy') return imgEasy;
  if (diff === 'Normal') return imgNormal;
  return imgHard;
};

// Mapy danych przypisane pod ID konkretnych bossów
const itemsMap = ref<Record<number, DBItem[]>>({});
const rarsMap = ref<Record<number, DBRar[]>>({});
const globalDrifs = ref<DBDrif[]>([]);

// Stan aktywnego wyboru w kafelkach
const activeBossId = ref<number | null>(null);

// Stan pól formularza
const gold = ref<number>(0);
const tracks = ref<number>(0);
const itemAmounts = ref<Record<number, number>>({});

// Stan dodawania do koszyka
const selectedRar = ref<string>("");
const rarQuality = ref<number>(1);
const syngQuality = ref<number>(1);
const selectedDrif = ref<string>("");
const drifTier = ref<number>(1);
const cart = ref<CartElement[]>([]);

// Reakcja na zmianę bossa – czyścimy formularz i ładujemy dla niego odpowiednie stany początkowe
watch(activeBossId, (newId) => {
  gold.value = 0;
  tracks.value = 0;
  cart.value = [];
  selectedRar.value = "";
  rarQuality.value = 1;
  selectedDrif.value = "";
  drifTier.value = 1;
  
  // Czyścimy i inicjalizujemy liczby przedmiotów dedykowanych dla nowego bossa
  itemAmounts.value = {};
  if (newId) {
    const activeItems = itemsMap.value[newId] || [];
    activeItems.forEach(item => {
      itemAmounts.value[item.id] = 0;
    });

    // Ustawiamy domyślny suwak syngów na wartość minimalną nowego bossa
    if (activeBoss.value) {
      syngQuality.value = activeBoss.value.min_syng;
    }
  }
});

// Pobieranie aktualnego obiektu bossa
const activeBoss = computed(() => {
  return bosses.value.find(b => b.id === activeBossId.value) || null;
});

// Dynamiczne filtrowanie podpięte pod widok formularza
const currentRars = computed(() => {
  return activeBossId.value ? rarsMap.value[activeBossId.value] || [] : [];
});

const currentItems = computed(() => {
  return activeBossId.value ? itemsMap.value[activeBossId.value] || [] : [];
});

// Zakres synergii wyliczany w locie dla aktywnego bossa
const syngRange = computed(() => {
  if (!activeBoss.value) return [];
  const range = [];
  for (let i = activeBoss.value.min_syng; i <= activeBoss.value.max_syng; i++) {
    range.push(i);
  }
  return range;
});

// Helperzy grafik
const getBossImg = (name: string) => {
  const path = `/src/assets/bosses/${name}.png`;
  const module = bossModules[path] as any;
  return module ? module.default : '';
};

const getDungeonImg = (name: string) => {
  const path = `/src/assets/bosses/${name}.png`;
  const module = bossModules[path] as any;
  return module ? module.default : '';
};

// Pobieranie pełnego pakietu danych o instancji z backendu
const loadLootData = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:3000/api/loot/loot-data?dungeonId=${dungeonId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      character.value = data.character;
      dungeon.value = data.dungeon;
      bosses.value = data.bosses;
      itemsMap.value = data.items;
      rarsMap.value = data.rars;
      globalDrifs.value = data.drifs;

      // Wybór pierwszego bossa na start
      if (data.bosses && data.bosses.length > 0) {
        activeBossId.value = data.bosses[0].id;
      }
    }
  } catch (err) {
    console.error("Błąd ładowania danych lootu:", err);
  }
};

// Logika koszyka
const addRar = () => {
  if (!selectedRar.value) return;
  const rar = currentRars.value.find(r => r.id === Number(selectedRar.value));
  if (!rar) return;

  cart.value.push({
    type: "rar",
    id: rar.id,
    name: rar.name,
    quality: rarQuality.value
  });
  selectedRar.value = "";
  rarQuality.value = 1;
};

const addSyng = () => {
  cart.value.push({
    type: "syng",
    quality: syngQuality.value
  });
};

const addDrif = () => {
  if (!selectedDrif.value) return;
  const drif = globalDrifs.value.find(d => d.id === Number(selectedDrif.value));
  if (!drif) return;

  cart.value.push({
    type: "drif",
    id: drif.id,
    name: drif.name,
    tier: drifTier.value
  });
  selectedDrif.value = "";
  drifTier.value = 1;
};

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1);
};

// Wysyłanie pełnego, starego typu payloadu kompatybilnego z bazą danych i Swaggerem
const handleSubmit = async () => {
  if (!activeBoss.value) return;
  const token = localStorage.getItem("token");

  const payload = {
    boss: {
      id: activeBoss.value.id,
      name: activeBoss.value.name,
      difficulty: difficulty.value
    },
    character: character.value,
    gold: gold.value,
    tracks: tracks.value,
    items: itemAmounts.value,
    cart: cart.value
  };

  try {
    const res = await fetch("http://localhost:3000/api/loot/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      alert(`Loot zapisany w bazie! ID rekordu: ${data.recordId}`);
      
      // Resetowanie pól formularza po udanym zapisie
      gold.value = 0;
      tracks.value = 0;
      cart.value = [];
      Object.keys(itemAmounts.value).forEach(key => {
        itemAmounts.value[Number(key)] = 0;
      });
    } else {
      alert("Błąd zapisu lootu na serwerze.");
    }
  } catch (err) {
    console.error("Error podczas zapisu:", err);
  }
};

onMounted(() => {
  loadLootData();
});
</script>

<style scoped>
@import '@/assets/looting.css';
</style>