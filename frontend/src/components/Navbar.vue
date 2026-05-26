<template>
  <nav class="flex-row-center-center">
    <ul class="desktop-icons">
      <li class="brand-li">
        <div class="brand-column">
          <img src="@/assets/logo_wht.png" alt="Loot Tracker logo" class="nav-logo" />
          <span class="brand-text">LOOT TRACKER</span>
        </div>
      </li>

      <li>
        <a @click="handleLogout" class="logout-btn">
          <i class="fa-solid fa-right-from-bracket"></i> Wyloguj
        </a>
      </li>
    </ul>

    <ul class="mobile-icons">
      <li id="hamburger-menu">
        <span>☰</span>
        <span>MENU</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>