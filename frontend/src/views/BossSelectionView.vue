<template>
  <main class="boss-selection">
    
    <section>
      <p>Wybierz lub dodaj postać:</p>

      <div class="card" @click="isModalOpen = true">
        <i class="fa-solid fa-plus"></i>
        <p>Dodaj postać</p>
      </div>

      <div
        v-for="char in characters"
        :key="char.id"
        :class="['card2', { active: selectedCharacter?.id === char.id }]"
        @click="selectedCharacter = char"
      >
        <p><strong>{{ char.name }}</strong></p>
        <p>{{ char.profession }}</p>
        <p>{{ char.level }} Lvl</p>
        <p>[{{ char.server }}]</p>
      </div>
    </section>

    <aside>
      <h2 class="aside-title">
        Wybierz bossa klikając w ikonkę poziomu trudności
      </h2>

      <div class="boss-card" v-for="boss in bosses" :key="boss.id">
        <img :src="getBossImg(boss.name)" :alt="boss.name" />
        <p>{{ boss.name }}</p>

        <div class="difficulty-icons">
          <img
            v-for="diff in boss.difficulties"
            :key="diff"
            :src="getDifficultyImg(diff)"
            :alt="diff"
            @click="selectBoss(boss, diff)"
          />
        </div>
      </div>
    </aside>

    <div class="extra">
      <h3 class="extra-title">Twój wybór:</h3>

      <div v-if="selectedCharacter" class="card-select">
        <p><strong>{{ selectedCharacter.name }}</strong></p>
        <p>{{ selectedCharacter.profession }}</p>
        <p>{{ selectedCharacter.level }} Lvl</p>
        <p>{{ selectedCharacter.server }}</p>
      </div>

      <div v-if="selectedBoss && selectedDifficulty" class="boss-select">
        <img :src="getBossImg(selectedBoss.name)" style="width: 80px;" />
        <p>{{ selectedBoss.name }}</p>
        <img :src="getDifficultyImg(selectedDifficulty)" style="width: 24px;" />
      </div>

      <div class="card-continue" @click="handleContinue">
        <p>Przejdź do zbierania</p>
      </div>
    </div>

    <AddCharacterModal
      v-if="isModalOpen"
      @close="isModalOpen = false"
      @success="handleModalSuccess"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AddCharacterModal from '@/components/AddCharacterModal.vue';

const bossModules = import.meta.glob('@/assets/bosses/*.{png,jpg,jpeg,svg}', { eager: true });

import imgEasy from '@/assets/Easy.png';
import imgNormal from '@/assets/Normal.png';
import imgHard from '@/assets/Hard.png';

interface Character {
  id: number;
  name: string;
  profession: string;
  level: number;
  server: string;
}

interface BossFromDB {
  id: number;
  name: string;
  tier: number;
  min_syng: number;
  max_syng: number;
  has_easy: boolean;
  has_normal: boolean;
  has_hard: boolean;
}

interface DisplayBoss {
  id: number;
  name: string;
  difficulties: string[];
}

const router = useRouter();

const characters = ref<Character[]>([]);
const selectedCharacter = ref<Character | null>(null);
const selectedBoss = ref<DisplayBoss | null>(null);
const selectedDifficulty = ref<string | null>(null);
const isModalOpen = ref(false);

const bosses = ref<DisplayBoss[]>([]);

const getBossImg = (bossName: string) => {
  const path = `/src/assets/bosses/${bossName}.png`;
  const module = bossModules[path] as any;
  
  return module ? module.default : '';
};

const fetchCharacters = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:3000/api/characters/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      characters.value = await res.json();
    }
  } catch (err) {
    console.error("Błąd pobierania postaci:", err);
  }
};

const fetchBosses = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:3000/api/bosses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (res.ok) {
      const dbData: BossFromDB[] = await res.json();
      
      bosses.value = dbData.map(boss => {
        const diffs: string[] = [];
        if (boss.has_easy) diffs.push('Easy');
        if (boss.has_normal) diffs.push('Normal');
        if (boss.has_hard) diffs.push('Hard');
        
        return {
          id: boss.id,
          name: boss.name,
          difficulties: diffs
        };
      });
    }
  } catch (err) {
    console.error("Błąd pobierania bossów:", err);
  }
};

const selectBoss = (boss: DisplayBoss, difficulty: string) => {
  selectedBoss.value = boss;
  selectedDifficulty.value = difficulty;
};

const getDifficultyImg = (diff: string) => {
  if (diff === 'Easy') return imgEasy;
  if (diff === 'Normal') return imgNormal;
  return imgHard;
};

const handleModalSuccess = () => {
  fetchCharacters();
  isModalOpen.value = false;
};

const handleContinue = () => {
  if (!selectedCharacter.value || !selectedBoss.value || !selectedDifficulty.value) {
    alert("Wybierz postać, bossa i poziom trudności!");
    return;
  }

  localStorage.setItem("selectedCharacter", JSON.stringify(selectedCharacter.value));
  localStorage.setItem("selectedBoss", JSON.stringify({
    id: selectedBoss.value.id,
    name: selectedBoss.value.name,
    difficulty: selectedDifficulty.value,
  }));

  router.push("/looting");
};

onMounted(() => {
  fetchCharacters();
  fetchBosses();
});
</script>

<style>
@import '@/assets/boss_selection.css';
</style>