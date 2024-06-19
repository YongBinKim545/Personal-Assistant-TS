import { RouteRecordRaw } from 'vue-router'

const Default = () => import('@/layouts/Default.vue')
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/Entry.vue'),
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('@/pages/Index.vue'),
      },
    ]
  },
  {
    path: '/',
    component: Default,
    children: [
      {
        path: 'chat',
        component: () => import('@/pages/Chat.vue'),
        children: [
          {
            path: '',
            name: 'NewChat',
            component: () => import('@/pages/chat/NewChat.vue'),
          },
          {
            path: ':titleCode',
            name: 'ChatContent',
            component: () => import('@/pages/chat/ChatContent.vue')
          },
        ]
      },
      {
        path: 'documents',
        name: 'Documents',
        component: () => import('@/pages/Documents.vue'),
      },
      {
        path: 'models',
        name: 'Models',
        component: () => import('@/pages/Models.vue'),
      }
    ]
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
  // linkActiveClass: 'border-indigo-500',
  // linkExactActiveClass: 'text-red'
})

export default router