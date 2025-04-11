<template>
  <div class="app-container">
    <header>
      <nav>
        <router-link to="/" class="logo">Благо Аукцион</router-link>
        <div class="nav-links">
          <router-link to="/auctions">Все аукционы</router-link>
          <router-link to="/add-lot" v-if="isAuthenticated && (userRole === 'donor')">Добавить лот</router-link>
          <router-link to="/login" v-if="!isAuthenticated">Войти</router-link>
          <button @click="logout" v-else class="logout-btn">Выйти</button>
        </div>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>&copy; {{ new Date().getFullYear() }} Благотворительный онлайн аукцион</p>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const userRole = computed(() => store.state.user.role);

    const logout = () => {
      store.dispatch('logout');
    };

    return {
      isAuthenticated,
      userRole,
      logout
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #0056b3;
  color: white;
  padding: 1rem 2rem;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-btn {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

main {
  flex: 1;
  padding: 2rem;
}

footer {
  background-color: #0056b3;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #003d82;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>