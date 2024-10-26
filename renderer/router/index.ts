import { RouteRecordRaw } from 'vue-router'

const Default = () => import('@/layouts/Default.vue')
const routes: RouteRecordRaw[] = [
  {
    path: '',
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
            path: ':threadId',
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
        children: [
          {
            path:'',
            name:'Setting',
            component:()=>import('@/pages/models/Setting.vue')
          },
          {
            path: 'model-connection',
            name: 'ModelConnection',
            component: () => import('@/pages/models/ModelConnection.vue'),
          },
          {
            path: 'preset-models',
            name: 'PresetModels',
            component: () => import('@/pages/models/PresetModels.vue'),
          },
          {
            path: 'ollama-models',
            name: 'OllamaModels',
            component: () => import('@/pages/models/OllamaModels.vue')
          },
          {
            path: 'model-list',
            name: 'ModelList',
            component: () => import('@/pages/models/ModelList.vue')
          },
        ]
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // linkActiveClass: 'border-indigo-500',
  // linkExactActiveClass: 'text-red'
})

// router.beforeRouteUpdate(async(to, from)=>{

// })


export default router