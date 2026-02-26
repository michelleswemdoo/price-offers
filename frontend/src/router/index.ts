import { createRouter, createWebHistory } from 'vue-router';
import PriceOffers from '../views/PriceOffers.vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'price-offers',
      component: PriceOffers,
    },
  ],
});
