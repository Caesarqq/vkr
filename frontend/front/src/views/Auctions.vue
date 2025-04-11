<template>
    <div class="auctions-page">
      <h1>Все аукционы</h1>
      
      <div class="filter-controls">
        <input type="text" v-model="searchTerm" placeholder="Поиск по названию" class="search-input">
        <select v-model="statusFilter" class="filter-select">
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="finished">Завершенные</option>
        </select>
      </div>
      
      <div class="auctions-grid">
        <div v-for="auction in filteredAuctions" :key="auction.id" class="auction-card card">
          <img :src="auction.image" :alt="auction.title" class="auction-image">
          <div class="auction-content">
            <h2>{{ auction.title }}</h2>
            <p>{{ auction.description }}</p>
            <p><strong>Организатор:</strong> {{ auction.charity }}</p>
            <p><strong>Окончание:</strong> {{ formatDate(auction.endDate) }}</p>
            <p><strong>Статус:</strong> 
              <span :class="auction.status === 'active' ? 'status-active' : 'status-finished'">
                {{ auction.status === 'active' ? 'Активный' : 'Завершен' }}
              </span>
            </p>
            <router-link :to="`/auction/${auction.id}`" class="btn">Подробнее</router-link>
          </div>
        </div>
      </div>
      
      <div v-if="isCharity" class="create-auction-section">
        <h2>Создать новый аукцион</h2>
        <form @submit.prevent="createAuction" class="create-auction-form">
          <div class="form-group">
            <label for="title">Название аукциона</label>
            <input type="text" id="title" v-model="newAuction.title" required>
          </div>
          
          <div class="form-group">
            <label for="description">Описание</label>
            <textarea id="description" v-model="newAuction.description" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="endDate">Дата окончания</label>
            <input type="datetime-local" id="endDate" v-model="newAuction.endDate" required>
          </div>
          
          <div class="form-group">
            <label for="image">Изображение аукциона</label>
            <input type="file" id="image" accept="image/*" @change="handleImageUpload" />
            <div v-if="newAuction.image" class="image-preview">
            <p>Предпросмотр:</p>
            <img :src="newAuction.image" alt="Предпросмотр аукциона" class="preview-image" />
            </div>
          </div>

          
          <button type="submit" class="btn">Создать аукцион</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Auctions',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const searchTerm = ref('');
      const statusFilter = ref('');
      
      const auctions = computed(() => store.state.auctions);
      const userRole = computed(() => store.state.user.role);
      const isCharity = computed(() => userRole.value === 'charity');
      const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            newAuction.value.image = reader.result;
            };
            reader.readAsDataURL(file);
        }
        };

      const newAuction = ref({
        title: '',
        description: '',
        endDate: '',
        image: ''
      });
      
      const filteredAuctions = computed(() => {
        return auctions.value.filter(auction => {
          const matchesSearch = auction.title.toLowerCase().includes(searchTerm.value.toLowerCase());
          const matchesStatus = statusFilter.value === '' || auction.status === statusFilter.value;
          return matchesSearch && matchesStatus;
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
      
      const createAuction = async () => {
        try {
          await store.dispatch('createAuction', newAuction.value);
          newAuction.value = {
            title: '',
            description: '',
            endDate: '',
            image: 'https://via.placeholder.com/400x200'
          };
          alert('Аукцион успешно создан!');
        } catch (error) {
          alert('Ошибка при создании аукциона');
        }
      };
      
      return {
        searchTerm,
        statusFilter,
        auctions,
        filteredAuctions,
        formatDate,
        isCharity,
        newAuction,
        createAuction,
        handleImageUpload
      };
    }
  };
  </script>
  
  <style scoped>
  .auctions-page {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .filter-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .search-input, .filter-select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .search-input {
    flex-grow: 1;
  }
  
  .auctions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
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
  
  .status-active {
    color: green;
  }
  
  .status-finished {
    color: red;
  }
  
  .create-auction-section {
    margin-top: 3rem;
    padding: 2rem;
    background-color: #f0f8ff;
    border-radius: 8px;
  }
  
  .create-auction-form {
    display: grid;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    font-weight: bold;
  }
  
  .form-group input, .form-group textarea {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-group textarea {
    min-height: 100px;
    resize: vertical;
  }
  </style>
  