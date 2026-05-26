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
        <img :src="boss.image" :alt="boss.name" />
        <p>{{ boss.name }}</p>

        <div class="difficulty-icons">
          <img
            v-for="diff in boss.difficulties"
            :key="diff"
            :src="`/images/${diff}.png`"
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
        <img :src="selectedBoss.image" style="width: 80px;" />
        <p>{{ selectedBoss.name }}</p>
        <img :src="`/images/${selectedDifficulty}.png`" style="width: 24px;" />
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

interface Character {
  id: number;
  name: string;
  profession: string;
  level: number;
  server: string;
}

interface Boss {
  id: number;
  name: string;
  image: string;
  difficulties: string[];
}

const router = useRouter();

const characters = ref<Character[]>([]);
const selectedCharacter = ref<Character | null>(null);
const selectedBoss = ref<Boss | null>(null);
const selectedDifficulty = ref<string | null>(null);
const isModalOpen = ref(false);

const bosses: Boss[] = [
  { id: 1, name: "Ivravul", image: "/images/Ivravul.png", difficulties: ["Normal", "Hard"] },
  { id: 2, name: "Jaskółka", image: "/images/Jaska.png", difficulties: ["Easy", "Normal", "Hard"] },
  { id: 3, name: "Konstrukt", image: "/images/V2.png", difficulties: ["Easy", "Normal", "Hard"] },
  { id: 4, name: "Admirał Utoru", image: "/images/Admiral.png", difficulties: ["Normal", "Hard"] },
];

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

const selectBoss = (boss: Boss, difficulty: string) => {
  selectedBoss.value = boss;
  selectedDifficulty.value = difficulty;
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
    ...selectedBoss.value,
    difficulty: selectedDifficulty.value,
  }));

  router.push("/looting");
};

onMounted(() => {
  fetchCharacters();
});
</script>

<style>
@import '@/assets/boss_selection.css';
</style>