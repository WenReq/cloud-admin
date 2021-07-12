export default [
  {
    path: '/community/dynamicList',
    name: 'dynamicList',
    meta: {
      title: '动态列表'
    },
    component: () =>
      import(/* webpackChunkName: "dynamicList" */ '@/views/community/dynamicList.vue')
  },
  {
    path: '/community/operationAccount',
    name: 'operationAccount',
    meta: {
      title: '运营账号'
    },
    component: () =>
      import(/* webpackChunkName: "operationAccount" */ '@/views/community/operationAccount.vue')
  }
]
