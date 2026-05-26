<template>
  <div class="flex-column-center-center" id="login-page">
    <form class="flex-column-center-center" @submit.prevent="handleSubmit">
      <h1>REGISTER</h1>

      <p v-for="(msg, i) in messages" :key="i" class="error">{{ msg }}</p>

      <div class="form-control">
        <i class="fa-solid fa-envelope" style="color: #272b35"></i>
        <input type="email" placeholder="email" v-model="email" required />
      </div>

      <div class="form-control">
        <i class="fa-solid fa-lock" style="color: #272b35"></i>
        <input type="password" placeholder="password" v-model="password" required />
      </div>

      <div class="form-control">
        <i class="fa-solid fa-lock" style="color: #272b35"></i>
        <input type="password" placeholder="confirm password" v-model="confirmPassword" required />
      </div>

      <button type="submit">
        <i class="fa-solid fa-user-plus" style="color: #e5e9f0"></i>
        REGISTER
      </button>

      <RouterLink to="/login" class="register-button">
        <i class="fa-solid fa-arrow-left" style="color: #e5e9f0"></i> BACK TO LOGIN
      </RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const messages = ref<string[]>([]);

const handleSubmit = async () => {
  messages.value = [];

  if (password.value !== confirmPassword.value) {
    messages.value = ['Hasła nie są takie same'];
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        role: 'user',
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      messages.value = [data.message || 'Błąd rejestracji'];
    } else {
      messages.value = ['Użytkownik zarejestrowany pomyślnie!'];
      email.value = '';
      password.value = '';
      confirmPassword.value = '';
    }
  } catch (err) {
    console.error(err);
    messages.value = ['Błąd sieci'];
  }
};
</script>

<style>
@import '@/assets/login.css';

.error {
  color: #bf616a;
  font-weight: bold;
  text-align: center;
  margin: 0;
}
</style>