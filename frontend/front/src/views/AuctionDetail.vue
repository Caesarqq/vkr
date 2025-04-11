<template>
    <div class="auction-detail">
      <div v-if="auction" class="auction-header">
        <h1>{{ auction.title }}</h1>
        <p class="auction-description">{{ auction.description }}</p>
        <div class="auction-info">
          <p><strong>Организатор:</strong> {{ auction.charity }}</p>
          <p><strong>Окончание:</strong> {{ formatDate(auction.endDate) }}</p>
          <p><strong>Статус:</strong> 
            <span :class="auction.status === 'active' ? 'status-active' : 'status-finished'">
              {{ auction.status === 'active' ? 'Активный' : 'Завершен' }}
            </span>
          </p>
        </div>
      </div>
      
      <div v-if="isCharity && pendingLots.length > 0" class="pending-lots section card">
        <h2>Лоты, ожидающие одобрения</h2>
        <div class="lots-grid">
          <div v-for="lot in pendingLots" :key="lot.id" class="lot-card">
            <img :src="lot.image" :alt="lot.title" class="lot-image">
            <div class="lot-content">
              <h3>{{ lot.title }}</h3>
              <p>{{ lot.description }}</p>
              <p><strong>Донор:</strong> {{ lot.donorName }}</p>
              <p><strong>Стартовая цена:</strong> {{ lot.startPrice }}₽</p>
              <button @click="approveLot(lot.id)" class="btn">Одобрить для аукциона</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="auction-lots section">
        <h2>Лоты данного аукциона</h2>
        <div v-if="lots.length > 0" class="lots-grid">
          <div v-for="lot in lots" :key="lot.id" class="lot-card card">
            <img :src="lot.image" :alt="lot.title" class="lot-image">
            <div class="lot-content">
              <h3>{{ lot.title }}</h3>
              <p>{{ lot.description }}</p>
              <p><strong>Донор:</strong> {{ lot.donorName }}</p>
              <p><strong>Стартовая цена:</strong> {{ lot.startPrice }}₽</p>
              <p><strong>Текущая цена:</strong> {{ lot.currentPrice }}₽</p>
              <p><strong>Количество ставок:</strong> {{ lot.bids.length }}</p>
              
              <div v-if="auction.status === 'active' && isAuthenticated && userRole === 'buyer'" class="bid-form">
                <div class="form-group">
                  <label :for="'bid-' + lot.id">Ваша ставка:</label>
                  <input type="number" :id="'bid-' + lot.id" v-model.number="bidAmounts[lot.id]" 
                         :min="lot.currentPrice + 100" step="100">
                </div>
                <button @click="placeBid(lot.id)" class="btn">Сделать ставку</button>
              </div>
              
              <div v-if="lot.bids.length > 0" class="bids-list">
                <h4>История ставок:</h4>
                <div v-for="(bid, index) in lot.bids" :key="index" class="bid-item">
                  <p>{{ bid.userName }} - {{ bid.amount }}₽ ({{ formatDate(bid.date) }})</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-lots">
          <p>В данном аукционе пока нет лотов.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  
  export default {
    name: 'AuctionDetail',
    setup() {
      const store = useStore();
      const route = useRoute();
      
      const auctionId = computed(() => Number(route.params.id));
      const auction = computed(() => store.getters.getAuctionById(auctionId.value));
      const lots = computed(() => store.getters.getLotsByAuctionId(auctionId.value));
      const allLots = computed(() => store.state.lots);
      
      const pendingLots = computed(() => {
        return allLots.value.filter(lot => !lot.auctionId);
      });
      
      const isAuthenticated = computed(() => store.getters.isAuthenticated);
      const userRole = computed(() => store.state.user.role);
      const isCharity = computed(() => userRole.value === 'charity');
      
      const bidAmounts = ref({});
      
      onMounted(() => {
        lots.value.forEach(lot => {
          bidAmounts.value[lot.id] = lot.currentPrice + 100;
        });
      });
      
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
      
      const approveLot = (lotId) => {
        store.dispatch('approveForAuction', { lotId, auctionId: auctionId.value });
        alert('Лот одобрен для аукциона!');
      };
      
      const placeBid = (lotId) => {
        const amount = bidAmounts.value[lotId];
        const lot = store.getters.getLotById(lotId);
        
        if (amount <= lot.currentPrice) {
          alert('Ставка должна быть выше текущей цены!');
          return;
        }
        
        store.dispatch('placeBid', { lotId, amount });
        alert('Ваша ставка принята!');
      };
      
      return {
        auction,
        lots,
        pendingLots,
        isAuthenticated,
        userRole,
        isCharity,
        bidAmounts,
        formatDate,
        approveLot,
        placeBid
      };
    }
  };
  </script>
  
  <style scoped>
  .auction-detail {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .auction-header {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .auction-description {
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  
  .auction-info {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
  
  .section {
    margin-bottom: 3rem;
  }
  
  .section h2 {
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .lots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .lot-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .lot-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
  }
  
  .lot-content {
    padding: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .lot-content h3 {
    margin-bottom: 0.5rem;
  }
  
  .lot-content p {
    margin-bottom: 0.5rem;
  }
  
  .bid-form {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  
  .bids-list {
    margin-top: 1rem;
  }
  
  .bid-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .bid-item:last-child {
    border-bottom: none;
  }
  
  .status-active {
    color: green;
  }
  
  .status-finished {
    color: red;
  }
  
  .no-lots {
    text-align: center;
    padding: 2rem;
    background-color: #f5f5f5;
    border-radius: 8px;
  }
  </style>