export default [
  {
    path: '/areaManage/street',
    name: 'areaManageStreet',
    meta: {
      title: '商户列表'
    },
    component: () =>
      import(
        '@/views/areaManage/street.vue'
      )
  },
  {
    path: '/areaManage/community',
    name: 'areaManageCommunity',
    meta: {
      title: '小区列表'
    },
    component: () =>
      import(
        '@/views/areaManage/community.vue'
      )
  }
]
