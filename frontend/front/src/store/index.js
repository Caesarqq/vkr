import { createStore } from 'vuex';

export default createStore({
  state: {
    user: {
      id: null,
      name: null,
      email: null,
      role: null
    },
    isAuthenticated: false,
    auctions: [
      {
        id: 1,
        title: 'Помощь детскому дому №5',
        description: 'Средства от аукциона пойдут на покупку нового оборудования для детского дома',
        charity: 'Фонд "Детские улыбки"',
        endDate: '2025-05-15T23:59:59',
        image: 'https://via.placeholder.com/400x200',
        status: 'active',
        lots: [1, 2]
      },
      {
        id: 2,
        title: 'Поддержка приюта для животных',
        description: 'Все средства будут направлены на обеспечение питомцев едой и медикаментами',
        charity: 'Общество защиты животных',
        endDate: '2025-05-20T23:59:59',
        image: 'https://via.placeholder.com/400x200',
        status: 'active',
        lots: [3]
      }
    ],
    lots: [
      {
        id: 1,
        title: 'Картина "Закат"',
        description: 'Оригинальная картина маслом',
        donorId: 1,
        donorName: 'Иван Иванов',
        startPrice: 5000,
        currentPrice: 7500,
        auctionId: 1,
        image: 'https://via.placeholder.com/300x200',
        bids: [
          { userId: 3, userName: 'Иван Иванов', amount: 5500, date: '2025-04-05T14:30:00' },
          { userId: 4, userName: 'Иван Иванов', amount: 7500, date: '2025-04-06T10:15:00' }
        ]
      },
      {
        id: 2,
        title: 'Антикварная ваза',
        description: 'Китайская ваза 19 века',
        donorId: 2,
        donorName: 'Биба',
        startPrice: 15000,
        currentPrice: 18000,
        auctionId: 1,
        image: 'https://via.placeholder.com/300x200',
        bids: [
          { userId: 5, userName: 'Иван Иванов', amount: 16000, date: '2025-04-04T12:10:00' },
          { userId: 3, userName: 'Иван Иванов', amount: 18000, date: '2025-04-07T20:45:00' }
        ]
      },
      {
        id: 3,
        title: 'Коллекционная монета',
        description: 'Серебряная монета 1900 года',
        donorId: 1,
        donorName: 'Алекс',
        startPrice: 8000,
        currentPrice: 8000,
        auctionId: 2,
        image: '',
        bids: []
      }
    ],
    winners: [
      {
        userId: 4,
        userName: 'Артём С',
        lotId: 5,
        lotTitle: 'Lamborgini Aventador S',
        auctionId: 3,
        auctionTitle: 'Помощь пострадавшим от наводнения',
        amount: 5000,
        date: '2025-03-25T23:59:59'
      },
      {
        userId: 3,
        userName: 'Кадавр',
        lotId: 6,
        lotTitle: 'Ручка МВД',
        auctionId: 4,
        auctionTitle: 'Поддержка онкологического центра',
        amount: 100000,
        date: '2025-03-20T23:59:59'
      }
    ]
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = {
        id: null,
        name: null,
        email: null,
        role: null
      };
      state.isAuthenticated = false;
    },
    addLot(state, lot) {
      lot.id = state.lots.length + 1;
      state.lots.push(lot);
    },
    addAuction(state, auction) {
      auction.id = state.auctions.length + 1;
      auction.lots = [];
      state.auctions.push(auction);
    },
    approveLot(state, { lotId, auctionId }) {
      const lot = state.lots.find(lot => lot.id === lotId);
      if (lot) {
        lot.auctionId = auctionId;
        const auction = state.auctions.find(auction => auction.id === auctionId);
        if (auction && !auction.lots.includes(lotId)) {
          auction.lots.push(lotId);
        }
      }
    },
    addBid(state, { lotId, bid }) {
      const lot = state.lots.find(lot => lot.id === lotId);
      if (lot && bid.amount > lot.currentPrice) {
        lot.bids.push(bid);
        lot.currentPrice = bid.amount;
      }
    }
  },
  actions: {
    login({ commit }, credentials) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            id: 1,
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: credentials.role || 'buyer'
          };
          commit('setUser', user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        }, 1000);
      });
    },
    register({ commit }, userData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            role: userData.role
          };
          commit('setUser', user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        }, 1000);
      });
    },
    logout({ commit }) {
      commit('clearUser');
      localStorage.removeItem('user');
    },
    checkAuth({ commit }) {
      const user = localStorage.getItem('user');
      if (user) {
        commit('setUser', JSON.parse(user));
      }
    },
    createLot({ commit, state }, lotData) {
      const lot = {
        ...lotData,
        donorId: state.user.id,
        donorName: state.user.name,
        currentPrice: lotData.startPrice,
        bids: []
      };
      commit('addLot', lot);
      return lot;
    },
    createAuction({ commit, state }, auctionData) {
      const auction = {
        ...auctionData,
        charityId: state.user.id,
        status: 'active'
      };
      commit('addAuction', auction);
      return auction;
    },
    approveForAuction({ commit }, { lotId, auctionId }) {
      commit('approveLot', { lotId, auctionId });
    },
    placeBid({ commit, state }, { lotId, amount }) {
      const bid = {
        userId: state.user.id,
        userName: state.user.name,
        amount,
        date: new Date().toISOString()
      };
      commit('addBid', { lotId, bid });
    }
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    activeAuctions(state) {
      return state.auctions.filter(auction => auction.status === 'active');
    },
    getAuctionById: (state) => (id) => {
      return state.auctions.find(auction => auction.id === Number(id));
    },
    getLotsByAuctionId: (state) => (auctionId) => {
      return state.lots.filter(lot => lot.auctionId === Number(auctionId));
    },
    getLotById: (state) => (id) => {
      return state.lots.find(lot => lot.id === Number(id));
    }
  }
});