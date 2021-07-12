export default [
  {
    path: '/infrastructure/recyclingSite/recyclingSiteList',
    name: 'recyclingSiteList',
    meta: {
      title: '回收站点管理'
    },
    component: () =>
      import(
        /* webpackChunkName: "recyclingSiteList" */ '@/views/infrastructure/recyclingSite/recyclingSiteList.vue'
      )
  },
  {
    path: '/infrastructure/recyclingSite/siteDetails',
    name: 'siteDetails',
    meta: {
      title: '回收站点详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "siteDetails" */ '@/views/infrastructure/recyclingSite/siteDetails.vue'
      )
  }
]
