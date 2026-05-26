<template>
  <div class="flex-column-center-center" id="login-page">
    <form class="flex-column-center-center" @submit.prevent="handleSubmit">
      <h1>LOGIN</h1>

      <p v-for="(msg, i) in messages" :key="i" class="error">{{ msg }}</p>

      <div class="form-control">
        <i class="fa-solid fa-envelope" style="color: #272b35"></i>
        <input type="email" placeholder="email" v-model="email" required />
      </div>

      <div class="form-control">
        <i class="fa-solid fa-lock" style="color: #272b35"></i>
        <input type="password" placeholder="password" v-model="password" required />
      </div>

      <button type="submit">
        <i class="fa-solid fa-arrow-right-to-bracket" style="color: #e5e9f0"></i>
        SIGN IN
      </button>

      <RouterLink to="/register" class="register-button">
        <i class="fa-solid fa-user-plus" style="color: #e5e9f0"></i> REGISTER
      </RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

// Stan (zastępuje useState)
const email = ref('');
const password = ref('');
const messages = ref<string[]>([]);

const router = useRouter();

const handleSubmit = async () => {
  messages.value = [];

  try {
    const res = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await res.json();

    if (!res.ok) {
      messages.value = [data.message || 'Błąd logowania'];
      return;
    }

    localStorage.setItem('token', data.token);
    router.push('/dashboard');
  } catch (err) {
    console.error(err);
    messages.value = ['Błąd połączenia z serwerem'];
  }
};
</script>

<style scoped>
@import '@/assets/login.css';
</style>