<template>
    <div class="home">
      <div class="container">
        <aside class="winners-sidebar">
          <h2>Победители аукционов</h2>
          <div class="winners-list">
            <div v-for="winner in winners" :key="winner.lotId" class="winner-card card">
              <h3>{{ winner.userName }}</h3>
              <p><strong>Лот:</strong> {{ winner.lotTitle }}</p>
              <p><strong>Аукцион:</strong> {{ winner.auctionTitle }}</p>
              <p><strong>Сумма:</strong> {{ winner.amount }}₽</p>
              <p><strong>Дата:</strong> {{ formatDate(winner.date) }}</p>
            </div>
          </div>
        </aside>
  
        <main class="current-auctions">
          <h1>Текущие аукционы</h1>
          <div class="auctions-grid">
            <div v-for="auction in activeAuctions" :key="auction.id" class="auction-card card">
              <img :src="auction.image" :alt="auction.title" class="auction-image">
              <div class="auction-content">
                <h2>{{ auction.title }}</h2>
                <p>{{ auction.description }}</p>
                <p><strong>Организатор:</strong> {{ auction.charity }}</p>
                <p><strong>Окончание:</strong> {{ formatDate(auction.endDate) }}</p>
                <router-link :to="`/auction/${auction.id}`" class="btn">Подробнее</router-link>
              </div>
            </div>
          </div>
        </main>
  
        <aside class="vk-login-sidebar">
          <div class="vk-login-banner card">
            <h2>Вход через VK</h2>
            <p>Используйте свой аккаунт ВКонтакте для быстрой авторизации на нашем сайте!</p>
            <button class="btn vk-btn">
              <span>Войти через VK</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'Home',
    setup() {
      const store = useStore();
      
      const activeAuctions = computed(() => store.getters.activeAuctions);
      const winners = computed(() => store.state.winners);
      
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
      
      return {
        activeAuctions,
        winners,
        formatDate
      };
    }
  };
  </script>
  
  <style scoped>
  .home {
    margin: 0 auto;
  }
  
  .container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .winners-sidebar, .vk-login-sidebar {
    padding-top: 2rem;
  }
  
  h1 {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 1rem;
  }
  
  .auctions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .auction-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .auction-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
  }
  
  .auction-content {
    padding: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .auction-content h2 {
    margin-bottom: 0.5rem;
  }
  
  .auction-content p {
    margin-bottom: 0.5rem;
  }
  
  .auction-content .btn {
    margin-top: auto;
    align-self: flex-start;
  }
  
  .winner-card {
    margin-bottom: 1rem;
  }
  
  .winner-card h3 {
    margin-bottom: 0.5rem;
  }
  
  .winner-card p {
    margin-bottom: 0.3rem;
  }
  
  .vk-login-banner {
    background-color: #4a76a8;
    color: white;
    text-align: center;
    padding: 2rem;
  }
  
  .vk-btn {
    background-color: #fff;
    color: #4a76a8;
    font-weight: bold;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
  }
  
  @media (max-width: 1200px) {
    .container {
      grid-template-columns: 1fr 2fr;
    }
    .vk-login-sidebar {
      grid-column: span 2;
    }
  }
  
  @media (max-width: 768px) {
    .container {
      grid-template-columns: 1fr;
    }
    .winners-sidebar, .vk-login-sidebar {
      grid-column: 1;
    }
  }
  </style>