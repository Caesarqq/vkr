<template>
    <div class="login-page">
      <div class="auth-container">
        <div class="tabs">
          <button 
            @click="activeTab = 'login'" 
            :class="{ active: activeTab === 'login' }"
            class="tab-btn"
          >
            Вход
          </button>
          <button 
            @click="activeTab = 'register'" 
            :class="{ active: activeTab === 'register' }"
            class="tab-btn"
          >
            Регистрация
          </button>
        </div>
        
        <div v-if="activeTab === 'login'" class="login-form">
          <h1>Вход в систему</h1>
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" v-model="loginForm.email" required>
            </div>
            
            <div class="form-group">
              <label for="login-password">Пароль</label>
              <input type="password" id="login-password" v-model="loginForm.password" required>
            </div>
            
            <div class="form-group">
              <label for="login-role">Тип пользователя</label>
              <select id="login-role" v-model="loginForm.role" required>
                <option value="buyer">Покупатель</option>
                <option value="donor">Донор</option>
                <option value="charity">Благотворительная организация</option>
              </select>
            </div>
            
            <button type="submit" class="btn">Войти</button>
          </form>
          
          <div class="social-login">
            <p>Или войдите через:</p>
            <button class="btn vk-btn">
              <span>ВКонтакте</span>
            </button>
          </div>
        </div>
        
        <div v-if="activeTab === 'register'" class="register-form">
          <h1>Регистрация</h1>
          <form @submit.prevent="register">
            <div class="form-group">
              <label for="register-name">Имя</label>
              <input type="text" id="register-name" v-model="registerForm.name" required>
            </div>
            
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" v-model="registerForm.email" required>
            </div>
            
            <div class="form-group">
              <label for="register-password">Пароль</label>
              <input type="password" id="register-password" v-model="registerForm.password" required>
            </div>
            
            <div class="form-group">
              <label for="register-confirm-password">Подтверждение пароля</label>
              <input type="password" id="register-confirm-password" v-model="registerForm.confirmPassword" required>
            </div>
            
            <div class="form-group">
              <label>Тип пользователя</label>
              <div class="radio-group">
                <label>
                  <input type="radio" v-model="registerForm.role" value="buyer">
                  Покупатель
                </label>
                <label>
                  <input type="radio" v-model="registerForm.role" value="donor">
                  Донор
                </label>
                <label>
                  <input type="radio" v-model="registerForm.role" value="charity">
                  Благотворительная организация
                </label>
              </div>
            </div>
            
            <button type="submit" class="btn">Зарегистрироваться</button>
          </form>
          
          <div class="social-login">
            <p>Или зарегистрируйтесь через:</p>
            <button class="btn vk-btn">
              <span>ВКонтакте</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Login',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const activeTab = ref('login');
      
      const loginForm = ref({
        email: '',
        password: '',
        role: 'buyer'
      });
      
      const registerForm = ref({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer'
      });
      
      const login = async () => {
        try {
          await store.dispatch('login', loginForm.value);
          router.push('/');
        } catch (error) {
          alert('Ошибка при входе. Проверьте ваши данные.');
        }
      };
      
      const register = async () => {
        if (registerForm.value.password !== registerForm.value.confirmPassword) {
          alert('Пароли не совпадают');
          return;
        }
        
        try {
          await store.dispatch('register', registerForm.value);
          router.push('/');
        } catch (error) {
          alert('Ошибка при регистрации. Попробуйте другой email.');
        }
      };
      
      return {
        activeTab,
        loginForm,
        registerForm,
        login,
        register
      };
    }
  };
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  
  .auth-container {
    width: 100%;
    max-width: 500px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
  }
  
  .tab-btn {
    flex: 1;
    padding: 1rem;
    font-size: 1.1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .tab-btn.active {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  .login-form, .register-form {
    padding: 2rem;
  }
  
  h1 {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .form-group input, .form-group select {
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
    margin-bottom: 1.5rem;
  }
  
  .social-login {
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #ddd;
  }
  
  .social-login p {
    margin-bottom: 1rem;
  }
  
  .vk-btn {
    background-color: #4a76a8;
    color: white;
  }
  
  .vk-btn:hover {
    background-color: #3d6293;
  }
  </style>
  