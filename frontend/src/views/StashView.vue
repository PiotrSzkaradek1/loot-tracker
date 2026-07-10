<template>
  <main class="looting-layout">
    
    <section class="left-panel">
      <div class="info-box">
        <h3>Wybierz Postać</h3>
        <select v-model="selectedCharacterId" @change="handleFilterChange" style="width: 100%; margin-bottom: 10px;">
          <option v-for="char in characters" :key="char.id" :value="char.id">
            {{ char.name }} ({{ char.level }} Lvl - {{ char.profession }})
          </option>
        </select>
        
        <div v-if="activeCharacter" class="difficulty-wrapper" style="width: 100%;">
          <p style="font-size: 14px; margin: 0; color: #fff;">
            Serwer: <strong>{{ activeCharacter.server }}</strong>
          </p>
        </div>
      </div>

      <div class="info-box dungeon-box">
        <h3>Wybierz Instancję</h3>
        <select v-model="selectedDungeonId" @change="handleDungeonChange" style="width: 100%; margin-bottom: 10px;">
          <option v-for="dung in dungeons" :key="dung.id" :value="dung.id">
            {{ dung.name }}
          </option>
        </select>

        <img v-if="activeDungeon" :src="getDungeonImg(activeDungeon.name)" :alt="activeDungeon.name" class="dungeon-img" />

        <h4 style="color: var(--color1); margin: 10px 0 5px 0; font-size: 0.9rem;">Poziom trudności:</h4>
        <div class="difficulty-icon-select" v-if="activeDungeon">
          <img 
            v-if="activeDungeon.has_easy"
            :src="imgEasy" 
            alt="Easy" 
            class="difficulty-icon"
            :style="{ opacity: difficulty === 'Easy' ? '1' : '0.4', transform: difficulty === 'Easy' ? 'scale(1.1)' : 'none' }"
            @click="setDifficulty('Easy')"
          />
          <img 
            v-if="activeDungeon.has_normal"
            :src="imgNormal" 
            alt="Normal" 
            class="difficulty-icon"
            :style="{ opacity: difficulty === 'Normal' ? '1' : '0.4', transform: difficulty === 'Normal' ? 'scale(1.1)' : 'none' }"
            @click="setDifficulty('Normal')"
          />
          <img 
            v-if="activeDungeon.has_hard"
            :src="imgHard" 
            alt="Hard" 
            class="difficulty-icon"
            :style="{ opacity: difficulty === 'Hard' ? '1' : '0.4', transform: difficulty === 'Hard' ? 'scale(1.1)' : 'none' }"
            @click="setDifficulty('Hard')"
          />
        </div>
        
        <div class="difficulty-wrapper" style="margin-top: 10px;">
          <span>Aktywny: {{ difficulty }}</span>
        </div>
      </div>
    </section>

    <div class="extra-boss-column">
      <h3>Filtruj obszar</h3>
      
      <div 
        :class="['boss-mini-card', { active: isWholeDungeonSelected }]"
        @click="selectWholeDungeon"
        style="border-left: 4px solid #4fcd8d;"
      >
        <div class="boss-mini-img" style="background: var(--color1); display: flex; align-items: center; justify-content: center; color: #1a1f29; font-weight: bold; font-size: 18px;">
          Σ
        </div>
        <p><strong>Cała instancja</strong></p>
      </div>

      <div 
        v-for="boss in availableBosses" 
        :key="boss.id"
        :class="['boss-mini-card', { active: !isWholeDungeonSelected && activeBossId === boss.id }]"
        @click="selectBoss(boss.id)"
      >
        <img :src="getBossImg(boss.name)" :alt="boss.name" class="boss-mini-img" />
        <p>{{ boss.name }}</p>
      </div>
    </div>

    <aside class="main-form-panel" style="display: block;">
      <h2 style="color: var(--color1); margin-top: 0;">
        Podsumowanie Skrytki: 
        <span style="color: #4fcd8d;">{{ isWholeDungeonSelected ? 'Cała instancja' : activeBossName }}</span>
      </h2>
      <p style="color: #888; font-size: 0.9rem; margin-bottom: 1.5rem;">
        Statystyki postaci dla poziomu trudności <span style="text-transform: uppercase; font-weight: bold; color: #fff;">{{ difficulty }}</span>
      </p>

      <div v-if="loading" style="color: var(--color1); padding: 20px; text-align: center;">
        Ładowanie statystyk...
      </div>

      <div v-else-if="stats && stats.general.total_kills === 0" style="color: var(--color1); padding: 20px; text-align: center; background: #252c3a; border-radius: 6px;">
        Brak zarejestrowanych zabójstw dla tych kryteriów.
      </div>

      <div v-else-if="stats">
        <div class="form-row" style="background: #252c3a; padding: 15px; border-radius: 6px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
          <label style="background: transparent; margin: 0;">
            Ukończone podejścia:
            <span style="font-size: 1.5rem; color: #4fcd8d; display: block; margin-top: 5px;">{{ stats.general.total_kills }}</span>
          </label>
          <label style="background: transparent; margin: 0;">
            Zebrane złoto:
            <span style="font-size: 1.3rem; color: #ffd700; display: block; margin-top: 5px;">{{ stats.general.total_gold.toLocaleString() }}</span>
            <small style="color: #aaa; font-weight: normal; font-size: 0.75rem;">Śr. pod.: {{ calcAvg(stats.general.total_gold) }}</small>
          </label>
          <label style="background: transparent; margin: 0;">
            Zdobyte tropy:
            <span style="font-size: 1.3rem; color: #b7791f; display: block; margin-top: 5px;">{{ stats.general.total_tracks }}</span>
            <small style="color: #aaa; font-weight: normal; font-size: 0.75rem;">Śr. pod.: {{ calcAvg(stats.general.total_tracks) }}</small>
          </label>
        </div>

        <h3>Suma dropu zwykłych przedmiotów:</h3>
        <p v-if="stats.items.length === 0" style="color: #888; font-size: 0.9rem; padding-left: 5px;">Brak odnotowanych dropów zwykłych przedmiotów</p>
        <div v-else class="items-inputs">
          <label v-for="item in stats.items" :key="item.item_id" style="cursor: default; padding: 0.6rem 0.8rem;">
            <div>
              <span>{{ item.name }}</span>
              <span v-if="item.price > 0" style="color: #ffd700; font-size: 0.8rem; margin-left: 10px; font-weight: bold;">
                ({{ formatGoldValue(item.total_amount, item.price) }})
              </span>
            </div>
            <div style="text-align: right;">
              <span class="loot-type" style="display: block; font-size: 0.95rem;">x{{ item.total_amount }}</span>
              <small style="color: #aaa; font-size: 0.75rem; font-weight: normal;">
                Śr. pod.: {{ calcAvg(item.total_amount) }}
                <span v-if="item.price > 0" style="color: #ffd700; font-weight: bold;"> ({{ formatGoldAvg(item.total_amount, item.price) }}/inst.)</span>
              </small>
            </div>
          </label>
        </div>

        <h3>Zdobyte Rary:</h3>
        <p v-if="stats.rars.length === 0" style="color: #888; font-size: 0.9rem; padding-left: 5px;">Brak odnotowanych rzadkich przedmiotów</p>
        <ul id="loot-cart" v-else>
          <li v-for="(rar, idx) in stats.rars" :key="idx" style="border-left: 4px solid #ffd700; padding: 0.6rem 0.8rem;">
            <div>
              <span class="loot-type" style="display: block;">
                {{ rar.name }} (Jakość: {{ rar.quality }})
                <span v-if="rar.price > 0" style="color: #ffd700; font-size: 0.85rem; font-weight: bold; margin-left: 8px;">
                  ({{ formatGoldValue(rar.count, rar.price) }})
                </span>
              </span>
              <small style="color: #aaa; font-size: 0.75rem;">
                Szansa na podejście: {{ calcChance(rar.count) }}%
                <span v-if="rar.price > 0" style="color: #ffd700; font-weight: bold;"> ({{ formatGoldAvg(rar.count, rar.price) }}/inst.)</span>
              </small>
            </div>
            <span style="background: #1a1f29; padding: 4px 10px; border-radius: 4px; font-weight: bold;">
              x{{ rar.count }}
            </span>
          </li>
        </ul>

        <h3>Zdobyte Synergetyki:</h3>
        <p v-if="stats.synergetics.length === 0" style="color: #888; font-size: 0.9rem; padding-left: 5px;">Brak odnotowanych synergetyków</p>
        <ul id="loot-cart" v-else>
          <li v-for="(syng, idx) in stats.synergetics" :key="idx" style="border-left: 4px solid #a855f7; padding: 0.6rem 0.8rem;">
            <div>
              <span class="loot-type" style="display: block;">
                Synergetyk Klasowy (Jakość {{ syng.tier }})
                <span v-if="syng.price > 0" style="color: #ffd700; font-size: 0.85rem; font-weight: bold; margin-left: 8px;">
                  ({{ formatGoldValue(syng.count, syng.price) }})
                </span>
              </span>
              <small style="color: #aaa; font-size: 0.75rem;">
                Szansa na podejście: {{ calcChance(syng.count) }}%
                <span v-if="syng.price > 0" style="color: #ffd700; font-weight: bold;"> ({{ formatGoldAvg(syng.count, syng.price) }}/inst.)</span>
              </small>
            </div>
            <span style="background: #1a1f29; padding: 4px 10px; border-radius: 4px; font-weight: bold;">
              x{{ syng.count }}
            </span>
          </li>
        </ul>

        <h3>Zdobyte Drify:</h3>
        <p v-if="stats.drifs.length === 0" style="color: #888; font-size: 0.9rem; padding-left: 5px;">Brak odnotowanych drifów</p>
        <ul id="loot-cart" v-else>
          <li v-for="(drif, idx) in stats.drifs" :key="idx" style="border-left: 4px solid #3182ce; padding: 0.6rem 0.8rem;">
            <div>
              <span class="loot-type" style="display: block;">
                Drif: {{ drif.name }} (Tier {{ drif.tier }})
                <span v-if="drif.price > 0" style="color: #ffd700; font-size: 0.85rem; font-weight: bold; margin-left: 8px;">
                  ({{ formatGoldValue(drif.count, drif.price) }})
                </span>
              </span>
              <small style="color: #aaa; font-size: 0.75rem;">
                Szansa na podejście: {{ calcChance(drif.count) }}%
                <span v-if="drif.price > 0" style="color: #ffd700; font-weight: bold;"> ({{ formatGoldAvg(drif.count, drif.price) }}/inst.)</span>
              </small>
            </div>
            <span style="background: #1a1f29; padding: 4px 10px; border-radius: 4px; font-weight: bold;">
              x{{ drif.count }}
            </span>
          </li>
        </ul>
      </div>
    </aside>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import imgEasy from '@/assets/Easy.png';
import imgNormal from '@/assets/Normal.png';
import imgHard from '@/assets/Hard.png';

const bossModules = import.meta.glob('@/assets/bosses/*.{png,jpg,jpeg,svg}', { eager: true });

interface Character { id: number; name: string; level: number; profession: string; server: string; }
interface Boss { id: number; name: string; dungeon_id: number; tier: number; }
interface Dungeon { id: number; name: string; has_easy: boolean; has_normal: boolean; has_hard: boolean; bosses: Boss[]; }

interface StashStats {
  general: { total_kills: number; total_gold: number; total_tracks: number; };
  items: Array<{ item_id: number; name: string; total_amount: number; price: number; }>;
  rars: Array<{ rar_id: number; name: string; quality: number; count: number; price: number; }>;
  synergetics: Array<{ tier: number; count: number; price: number; }>;
  drifs: Array<{ drif_id: number; name: string; tier: number; count: number; price: number; }>;
}

const characters = ref<Character[]>([]);
const dungeons = ref<Dungeon[]>([]);
const selectedCharacterId = ref<number | null>(null);
const selectedDungeonId = ref<number | null>(null);
const difficulty = ref<string>('Normal');

const activeBossId = ref<number | null>(null);
const isWholeDungeonSelected = ref<boolean>(true);

const stats = ref<StashStats | null>(null);
const loading = ref<boolean>(false);

// Funkcje pomocnicze do obliczeń
const calcAvg = (totalValue: number): string => {
  if (!stats.value || stats.value.general.total_kills === 0) return '0.00';
  return (totalValue / stats.value.general.total_kills).toFixed(2);
};

const calcChance = (count: number): string => {
  if (!stats.value || stats.value.general.total_kills === 0) return '0.00';
  return ((count / stats.value.general.total_kills) * 100).toFixed(2);
};

// Nowe funkcje formatujące przelicznik na złoto
const formatGoldValue = (amount: number, price: number): string => {
  const total = amount * price;
  return total.toLocaleString() + ' gold';
};

const formatGoldAvg = (amount: number, price: number): string => {
  if (!stats.value || stats.value.general.total_kills === 0) return '0';
  const avgGold = (amount * price) / stats.value.general.total_kills;
  return Math.round(avgGold).toLocaleString();
};

const activeCharacter = computed(() => characters.value.find(c => c.id === selectedCharacterId.value) || null);
const activeDungeon = computed(() => dungeons.value.find(d => d.id === selectedDungeonId.value) || null);
const availableBosses = computed(() => activeDungeon.value ? activeDungeon.value.bosses : []);
const activeBossName = computed(() => {
  if (isWholeDungeonSelected.value) return 'Cała instancja';
  const boss = availableBosses.value.find(b => b.id === activeBossId.value);
  return boss ? boss.name : '';
});

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

const setDifficulty = (diff: string) => {
  difficulty.value = diff;
  fetchStats();
};

const handleDungeonChange = () => {
  isWholeDungeonSelected.value = true;
  activeBossId.value = null;
  if (activeDungeon.value) {
    if (difficulty.value === 'Easy' && !activeDungeon.value.has_easy) difficulty.value = 'Normal';
    if (difficulty.value === 'Hard' && !activeDungeon.value.has_hard) difficulty.value = 'Normal';
  }
  fetchStats();
};

const handleFilterChange = () => {
  fetchStats();
};

const selectWholeDungeon = () => {
  isWholeDungeonSelected.value = true;
  activeBossId.value = null;
  fetchStats();
};

const selectBoss = (bossId: number) => {
  isWholeDungeonSelected.value = false;
  activeBossId.value = bossId;
  fetchStats();
};

const loadInitData = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:3000/api/stash/init", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      characters.value = data.characters;
      dungeons.value = data.dungeons;
      if (data.characters.length > 0) selectedCharacterId.value = data.characters[0].id;
      if (data.dungeons.length > 0) selectedDungeonId.value = data.dungeons[0].id;
      fetchStats();
    }
  } catch (err) {
    console.error("Błąd ładowania danych:", err);
  }
};

const fetchStats = async () => {
  if (!selectedCharacterId.value || !selectedDungeonId.value) return;
  const token = localStorage.getItem("token");
  loading.value = true;

  let url = `http://localhost:3000/api/stash/stats?characterId=${selectedCharacterId.value}&difficulty=${difficulty.value}`;
  if (isWholeDungeonSelected.value) {
    url += `&dungeonId=${selectedDungeonId.value}`;
  } else if (activeBossId.value) {
    url += `&bossId=${activeBossId.value}`;
  }

  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) stats.value = await res.json();
  } catch (err) {
    console.error("Błąd pobierania statystyk:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadInitData();
});
</script>

<style scoped>
@import '@/assets/looting.css';

aside input, aside select {
  width: 100%;
}
#loot-cart li {
  cursor: default;
}
</style>