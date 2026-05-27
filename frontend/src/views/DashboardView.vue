<template>
  <main>
    <section>
      <div class="card">
        <RouterLink to="/boss-selection" class="card-link" />
        <img src="@/assets/keyarttlo.jpg" alt="Rozpocznij zbieranie" />
        <p>Rozpocznij zbieranie</p>
      </div>

      <div class="card">
        <RouterLink to="/loot-history-selection" class="card-link" />
        <img src="@/assets/horseshoe.jpg" alt="Twój loot" />
        <p>Twój loot</p>
      </div>
    </section>
    <!-- <aside></aside> -->
  </main>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style>
@import '@/assets/dashboard.css';

</style>