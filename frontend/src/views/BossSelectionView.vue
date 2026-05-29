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
        Wybierz instancję klikając w ikonkę poziomu trudności
      </h2>

      <div class="boss-card" v-for="dungeon in dungeons" :key="dungeon.id">
        <img :src="getDungeonImg(dungeon.name)" :alt="dungeon.name" />
        <p>{{ dungeon.name }}</p>

        <div class="difficulty-icons">
          <img
            v-for="diff in dungeon.difficulties"
            :key="diff"
            :src="getDifficultyImg(diff)"
            :alt="diff"
            @click="selectDungeon(dungeon, diff)"
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

      <div v-if="selectedDungeon && selectedDifficulty" class="boss-select">
        <img :src="getDungeonImg(selectedDungeon.name)" style="width: 80px;" />
        <p>{{ selectedDungeon.name }}</p>
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

const dungeonModules = import.meta.glob('@/assets/bosses/*.{png,jpg,jpeg,svg}', { eager: true });

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

interface DungeonFromDB {
  id: number;
  name: string;
  has_easy: boolean;
  has_normal: boolean;
  has_hard: boolean;
}

interface DisplayDungeon {
  id: number;
  name: string;
  difficulties: string[];
}

const router = useRouter();

const characters = ref<Character[]>([]);
const selectedCharacter = ref<Character | null>(null);

const selectedDungeon = ref<DisplayDungeon | null>(null);
const selectedDifficulty = ref<string | null>(null);
const isModalOpen = ref(false);

const dungeons = ref<DisplayDungeon[]>([]);

const getDungeonImg = (dungeonName: string) => {
  const path = `/src/assets/bosses/${dungeonName}.png`;
  const module = dungeonModules[path] as any;
  
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

const fetchDungeons = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:3000/api/bosses/dungeons", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (res.ok) {
      const dbData: DungeonFromDB[] = await res.json();
      
      dungeons.value = dbData.map(dungeon => {
        const diffs: string[] = [];
        if (dungeon.has_easy) diffs.push('Easy');
        if (dungeon.has_normal) diffs.push('Normal');
        if (dungeon.has_hard) diffs.push('Hard');
        
        return {
          id: dungeon.id,
          name: dungeon.name,
          difficulties: diffs
        };
      });
    }
  } catch (err) {
    console.error("Błąd pobierania dungeonów:", err);
  }
};

const selectDungeon = (dungeon: DisplayDungeon, difficulty: string) => {
  selectedDungeon.value = dungeon;
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
  if (!selectedCharacter.value || !selectedDungeon.value || !selectedDifficulty.value) {
    alert("Wybierz postać, instancję i poziom trudności!");
    return;
  }

  localStorage.setItem("selectedCharacter", JSON.stringify(selectedCharacter.value));
  localStorage.setItem("selectedDifficulty", selectedDifficulty.value);

  router.push({
    path: '/looting',
    query: { dungeonId: selectedDungeon.value.id }
  });
};

onMounted(() => {
  fetchCharacters();
  fetchDungeons();
});
</script>

<style>
@import '@/assets/boss_selection.css';
</style>