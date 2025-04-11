<template>
    <div class="register-page">
      <h1>Регистрация</h1>
      <form @submit.prevent="register" class="register-form card">
        <div class="form-group">
          <label for="name">Имя</label>
          <input type="text" id="name" v-model="form.name" required>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required>
        </div>
        
        <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" v-model="form.password" required>
        </div>
        
        <div class="form-group">
          <label for="confirm-password">Подтверждение пароля</label>
          <input type="password" id="confirm-password" v-model="form.confirmPassword" required>
        </div>
        
        <div class="form-group">
          <label>Тип пользователя</label>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="form.role" value="buyer">
              Покупатель
            </label>
            <label>
              <input type="radio" v-model="form.role" value="donor">
              Донор
            </label>
            <label>
              <input type="radio" v-model="form.role" value="charity">
              Благотворительная организация
            </label>
          </div>
        </div>
        
        <button type="submit" class="btn">Зарегистрироваться</button>
      </form>
      
      <div class="auth-links">
        <router-link to="/login">Уже есть аккаунт? Войти</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Register',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const form = ref({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer'
      });
      
      const register = async () => {
        if (form.value.password !== form.value.confirmPassword) {
          alert('Пароли не совпадают');
          return;
        }
        
        try {
          await store.dispatch('register', form.value);
          router.push('/');
        } catch (error) {
          alert('Ошибка при регистрации. Попробуйте другой email.');
        }
      };
      
      return {
        form,
        register
      };
    }
  };
  </script>
  
  <style scoped>
  .register-page {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem 0;
  }
  
  h1 {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .register-form {
    padding: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
    font-size: 1.1rem;
  }
  
  .auth-links {
    text-align: center;
  }
  
  .auth-links a {
    color: #0056b3;
    text-decoration: none;
  }
  
  .auth-links a:hover {
    text-decoration: underline;
  }
  </style>