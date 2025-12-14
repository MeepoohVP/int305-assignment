import TableOrderView from '@/views/TableOrderView.vue'
import TableView from '@/views/TableView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: TableView
    },
    {
      path: '/t/:tableCode',
      name: 'Table',
      component: TableOrderView
    },
    {}
  ],
})

export default router
