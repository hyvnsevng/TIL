import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import NewCafePage from '@/views/NewCafePage.vue'
import EditCafePage from '@/views/EditCafePage.vue'
import SignInPage from '@/views/SignInPage.vue'
import { createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  // createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/new',
      name: 'new',
      component: NewCafePage,
    },
    {
      path: '/cafe/:id',
      name: 'edit',
      component: EditCafePage,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInPage,
    },
  ],
})

export default router
