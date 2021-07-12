export default [
  {
    path: '/member/memberList',
    name: 'memberList',
    meta: {
      keepAlive: true,
      title: '会员列表'
    },
    component: () =>
        import(/* webpackChunkName: "member" */ '@/views/member/memberList.vue')
  },
  {
    path: '/member/memberList/memberDetails',
    name: 'memberDetails',
    meta: {
      title: '会员详情'
    },
    component: () =>
        import(/* webpackChunkName: "member" */ '@/views/member/memberDetails.vue')
  },
  {
    path: '/member/cardRecord',
    name: 'cardRecord',
    meta: {
      title: '线下开卡'
    },
    component: () =>
        import(/* webpackChunkName: "member" */ '@/views/member/cardRecord.vue')
  },
  {
    path: '/member/memberImport/detail',
    name: 'detail',
    meta: {
      title: '已导入用户详情'
    },
    component: () =>
        import(/* webpackChunkName: "member" */ '@/views/member/importDetails.vue')
  },
  {
    path: '/member/memberImport',
    name: 'memberImport',
    meta: {
      keepAlive: true,
      title: '会员导入'
    },
    component: () =>
        import(/* webpackChunkName: "member" */ '@/views/member/memberImport.vue')
  },
  {
    path: '/member/familyList',
    name: 'familyList',
    meta: {
      title: '家庭列表'
    },
    component: () =>
        import(/* webpackChunkName: "member" */ '@/views/member/familyList.vue')
  },
  {
    path: '/member/memberList/diffDispose',
    name: 'diffDispose',
    meta: {
      title: '资金处置'
    },
    component: () =>
        import(/* webpackChunkName: "member" */ '@/views/member/diffDispose.vue')
  }
]

