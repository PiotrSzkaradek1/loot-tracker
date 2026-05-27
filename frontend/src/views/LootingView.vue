<template>
  <main>
    <p v-if="error" class="error-msg">{{ error }}</p>
    <p v-else-if="loading" class="loading-msg">Ładowanie danych dropu...</p>

    <template v-else>
      <section id="looting-info">
        <h3 class="extra-title">Twój wybór:</h3>

        <div class="boss-select" v-if="boss">
          <img :src="getBossImg(boss.name)" :alt="boss.name" style="width: 120px;" />
          <p>{{ boss.name }}</p>
          <img :src="getDifficultyImg(boss.difficulty)" :alt="boss.difficulty" style="width: 24px;" />
        </div>

        <div class="card-select" v-if="character">
          <p><strong>{{ character.name }}</strong></p>
          <p>{{ character.profession }}</p>
          <p>{{ character.level }} Lvl</p>
          <p>[{{ character.server }}]</p>
        </div>
      </section>

      <aside>
        <form @submit.prevent="handleSubmit">
          
          <div>
            <label>
              Złoto:
              <input type="number" min="0" v-model.number="gold" />
            </label>
            <br />
            <label>
              Tropy:
              <input type="number" min="0" v-model.number="tracks" />
            </label>
          </div>

          <h3>Itemy:</h3>
          <p v-if="items.length === 0">Brak dedykowanych itemów</p>
          <div v-else class="items-inputs">
            <label v-for="item in items" :key="item.id">
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
              <option v-for="r in rars" :key="r.id" :value="r.id">
                {{ r.name }}
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
          <div class="add-row" v-if="bossData">
            <select v-model.number="syngQuality">
              <option v-for="q in syngRange" :key="q" :value="q">
                Jakość {{ q }}
              </option>
            </select>
            <button type="button" @click="addSyng">Dodaj Synergetyk</button>
          </div>

          <h3>Dodaj Drifa:</h3>
          <div class="add-row" v-if="bossData">
            <select v-model="selectedDrif">
              <option value="">-- wybierz --</option>
              <option v-for="d in drifs" :key="d.id" :value="d.id">
                {{ d.name }}
              </option>
            </select>

            <select v-model.number="drifTier">
              <option v-for="t in bossData.tier" :key="t" :value="t">
                Tier {{ t }}
              </option>
            </select>

            <button type="button" @click="addDrif">Dodaj Drifa</button>
          </div>

          <h4>Elementy ekwipunku:</h4>
          <ul id="loot-cart">
            <li v-for="(el, i) in cart" :key="i">
              <span v-if="el.type === 'rar'" class="loot-type">
                RAR: {{ el.name }} ({{ el.quality }})
              </span>
              <span v-else-if="el.type === 'syng'" class="loot-type">
                SYNG: {{ el.quality }}
              </span>
              <span v-else-if="el.type === 'drif'" class="loot-type">
                DRIF: {{ el.name }} (T{{ el.tier }})
              </span>
              <button type="button" @click="removeFromCart(i)">X</button>
            </li>
          </ul>

          <button type="submit" class="submit-btn">Zapisz loot</button>
        </form>
      </aside>

      <div class="extra"></div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const bossModules = import.meta.glob('@/assets/bosses/*.{png,jpg,jpeg,svg}', { eager: true });

import imgEasy from '@/assets/Easy.png';
import imgNormal from '@/assets/Normal.png';
import imgHard from '@/assets/Hard.png';

interface LocalSavedBoss {
  id: number;
  name: string;
  difficulty: string;
}

interface Character {
  id: number;
  name: string;
  profession: string;
  level: number;
  server: string;
}

interface DBItem { id: number; name: string; }
interface DBRar { id: number; name: string; }
interface DBDrif { id: number; name: string; }

interface BossData {
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

const boss = ref<LocalSavedBoss | null>(null);
const character = ref<Character | null>(null);
const bossData = ref<BossData | null>(null);

const gold = ref<number>(0);
const tracks = ref<number>(0);

const items = ref<DBItem[]>([]);
const rars = ref<DBRar[]>([]);
const drifs = ref<DBDrif[]>([]);


const itemAmounts = ref<Record<number, number>>({});

const selectedRar = ref<string>("");
const rarQuality = ref<number>(1);
const syngQuality = ref<number>(1);
const selectedDrif = ref<string>("");
const drifTier = ref<number>(1);

const cart = ref<CartElement[]>([]);

const error = ref<string>("");
const loading = ref<boolean>(true);


const syngRange = computed(() => {
  if (!bossData.value) return [];
  const range = [];
  for (let i = bossData.value.min_syng; i <= bossData.value.max_syng; i++) {
    range.push(i);
  }
  return range;
});


const getBossImg = (bossName: string) => {
  const path = `/src/assets/bosses/${bossName}.png`;
  const module = bossModules[path] as any;
  return module ? module.default : '';
};

const getDifficultyImg = (diff: string) => {
  if (diff === 'Easy') return imgEasy;
  if (diff === 'Normal') return imgNormal;
  return imgHard;
};

onMounted(async () => {
  try {
    const savedBoss = localStorage.getItem("selectedBoss");
    const savedChar = localStorage.getItem("selectedCharacter");

    if (!savedBoss || !savedChar) {
      error.value = "Brak wybranych danych. Wróć do wyboru postaci i bossa.";
      loading.value = false;
      return;
    }

    boss.value = JSON.parse(savedBoss);
    character.value = JSON.parse(savedChar);

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3000/api/loot/loot-data?bossId=${boss.value?.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!res.ok) {
      throw new Error("Błąd pobierania danych loota");
    }

    const data = await res.json();

    bossData.value = data.bossData;
    items.value = data.items;
    rars.value = data.rars;
    drifs.value = data.drifs;
    
    data.items.forEach((item: DBItem) => {
      itemAmounts.value[item.id] = 0;
    });

    if (data.bossData) {
      syngQuality.value = data.bossData.min_syng;
    }

  } catch (err) {
    console.error(err);
    error.value = "Nie udało się załadować danych dropu.";
  } finally {
    loading.value = false;
  }
});

const addRar = () => {
  if (!selectedRar.value) return;

  const rar = rars.value.find(r => r.id === Number(selectedRar.value));
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

  const drif = drifs.value.find(d => d.id === Number(selectedDrif.value));
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

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      boss: boss.value,
      character: character.value,
      gold: gold.value,
      tracks: tracks.value,
      items: itemAmounts.value,
      cart: cart.value
    };

    const res = await fetch("http://localhost:3000/api/loot/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Błąd zapisu loota");
    }

    const data = await res.json();
    alert("Loot zapisany w bazie danych! ID rekordu: " + data.recordId);
    
    gold.value = 0;
    tracks.value = 0;
    cart.value = [];
    Object.keys(itemAmounts.value).forEach(key => {
      itemAmounts.value[Number(key)] = 0;
    });

  } catch (err) {
    console.error(err);
    alert("Nie udało się zapisać loota.");
  }
};
</script>

<style>
@import '@/assets/looting.css';

.add-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.error-msg, .loading-msg {
  color: var(--color1);
  text-align: center;
  font-size: 20px;
  width: 100%;
  margin-top: 2rem;
}
.items-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.submit-btn {
  width: 100%;
  padding: 0.75rem !important;
  font-size: 1rem;
  margin-top: 1.5rem !important;
}
</style>