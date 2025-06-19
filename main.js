// URL, откуда загружаем данные
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// const exampleGood = {
//   id_product: 123,
//   product_name: 'Название товара',
//   price: 999
// };

// Компонент: Поисковая строка
Vue.component('search-box', {
    props: ['value'],
    template: `
    <header>
      <input
        type="text"
        class="goods-search"
        :value="value"
        @input="$emit('input', $event.target.value)"
        placeholder="Поиск товара"
      />
      <button class="search-button" @click="$emit('do-search')">Искать</button>
    </header>
  `
});

// Компонент: Карточка товара
Vue.component('goods-item', {
    props: ['good'],
    template: `
    <div class="goods-item">
      <h3>{{ good.product_name }}</h3>
      <p>{{ good.price }}₽</p>
      <button @click="$emit('add-to-cart', good)">Купить</button>
    </div>
  `
});

// Компонент: Список товаров
Vue.component('goods-list', {
    props: ['goods'],
    template: `
    <div class="goods-list">
      <goods-item
        v-for="good in goods"
        v-bind:key="good.id_product"
        v-bind:good="good"
        @add-to-cart="$emit('add-to-cart', $event)">
      </goods-item>
    </div>
  `
});

// Компонент: Корзина
Vue.component('cart-block', {
    props: ['items'],
    template: `
    <div id="cart-block">
      <h2>Корзина</h2>
      <p v-if="items.length === 0">Корзина пуста</p>
      <div v-else>
        <p
          v-for="(item, index) in items"
          v-bind:key="index">
          {{ item.product_name }} — {{ item.price }}₽
          <button @click="$emit('remove-from-cart', index)">Удалить</button>
        </p>
        <p><strong>Итого: {{ total }}₽</strong></p>
      </div>
    </div>
  `,
    computed: {
        total() {
            return this.items.reduce((sum, item) => sum + item.price, 0);
        }
    }
});

// Компонент: Сообщение об ошибке
Vue.component('error-message', {
    template: `<p class="error">Ошибка загрузки данных. Попробуйте позже.</p>`
});

new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        cartItems: [],
        searchLine: '',
        loadError: false 
    },
    methods: {
        fetchGoods() {
            fetch(`${API_URL}/catalogData.json`)
                .then(response => {
                    if (!response.ok) throw new Error('Ошибка загрузки');
                    return response.json();
                })
                .then(data => {
                    this.goods = data;
                    this.filteredGoods = data;
                })
                .catch(error => {
                    console.error('Ошибка при получении товаров:', error);
                    this.loadError = true; // Показать сообщение об ошибке
                });
        },
        filterGoods() {
            const regexp = new RegExp(this.searchLine, 'i');
            this.filteredGoods = this.goods.filter(good =>
                regexp.test(good.product_name)
            );
        },
        addToCart(good) {
            this.cartItems.push(good);
        },
        removeFromCart(index) {
            this.cartItems.splice(index, 1);
        }
    },
    mounted() {
        this.fetchGoods();
    }
});
