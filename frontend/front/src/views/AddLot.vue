<template>
    <div class="add-lot">
      <h1>Добавить лот для аукциона</h1>
      
      <form @submit.prevent="submitLot" class="lot-form card">
        <div class="form-group">
          <label for="title">Название лота</label>
          <input type="text" id="title" v-model="lot.title" required>
        </div>
        
        <div class="form-group">
          <label for="description">Описание</label>
          <textarea id="description" v-model="lot.description" required></textarea>
        </div>
        
        <div class="form-group">
          <label for="startPrice">Стартовая цена (₽)</label>
          <input type="number" id="startPrice" v-model.number="lot.startPrice" min="100" step="100" required>
        </div>
        
        <div class="form-group">
        <label for="image">Изображение</label>
        <input type="file" id="image" accept="image/*" @change="handleFileUpload" />
        <div v-if="lot.image" class="image-preview">
            <p>Предпросмотр:</p>
            <img :src="lot.image" alt="Предпросмотр" class="lot-image" />
        </div>
        </div>
        
        <button type="submit" class="btn">Добавить лот</button>
      </form>
      
      <div class="my-lots section">
        <h2>Мои лоты</h2>
        <div v-if="myLots.length > 0" class="lots-grid">
          <div v-for="lot in myLots" :key="lot.id" class="lot-card card">
            <img :src="lot.image" :alt="lot.title" class="lot-image">
            <div class="lot-content">
              <h3>{{ lot.title }}</h3>
              <p>{{ lot.description }}</p>
              <p><strong>Стартовая цена:</strong> {{ lot.startPrice }}₽</p>
              <p v-if="lot.auctionId">
                <strong>Статус:</strong> 
                <span class="status-approved">Одобрен для аукциона</span>
              </p>
              <p v-else>
                <strong>Статус:</strong> 
                <span class="status-pending">Ожидает одобрения</span>
              </p>
            </div>
          </div>
        </div>
        <div v-else class="no-lots">
          <p>У вас пока нет добавленных лотов.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'AddLot',
    setup() {
      const store = useStore();
      const router = useRouter();
      const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            lot.value.image = reader.result;
            };
            reader.readAsDataURL(file);
        }
        };
      const lot = ref({
        title: '',
        description: '',
        startPrice: 1000,
        image: 'https://via.placeholder.com/300x200'
      });
      
      const userId = computed(() => store.state.user.id);
      
      const myLots = computed(() => {
        return store.state.lots.filter(lot => lot.donorId === userId.value);
      });
      
      const submitLot = async () => {
        try {
          await store.dispatch('createLot', { ...lot.value });
          
          lot.value = {
            title: '',
            description: '',
            startPrice: 1000,
            image: 'https://via.placeholder.com/300x200'
          };
          
          alert('Лот успешно добавлен! Ожидайте одобрения от благотворительной организации.');
        } catch (error) {
          alert('Ошибка при добавлении лота');
        }
      };
      
      return {
        lot,
        myLots,
        submitLot,
        handleFileUpload
      };
    }
  };
  </script>
  
  <style scoped>
  .add-lot {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .lot-form {
    max-width: 600px;
    margin: 0 auto 3rem;
    padding: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .form-group input, .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-group textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  .btn {
    width: 100%;
    padding: 0.75rem;
    font-size: 1.1rem;
  }
  
  .section {
    margin-top: 3rem;
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
  
  .status-approved {
    color: green;
  }
  
  .status-pending {
    color: orange;
  }
  
  .no-lots {
    text-align: center;
    padding: 2rem;
    background-color: #f5f5f5;
    border-radius: 8px;
  }
  .image-preview img {
  max-width: 100%;
  max-height: 200px;
  margin-top: 1rem;
  }
  </style>