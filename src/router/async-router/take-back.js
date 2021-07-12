export default [
  {
    path: '/takeBack/peopleAuditList',
    name: 'peopleAuditList',
    meta: {
      keepAlive: true,
      title: '人员入驻审核'
    },
    component: () =>
      import(/* webpackChunkName: "peopleAuditList" */ '@/views/take-back/peopleAuditList.vue')
  },
  {
    path: '/takeBack/peopleAuditList/peopleAuditDetails',
    name: 'peopleAuditDetails',
    meta: {
      title: '人员入驻审核详情'
    },
    component: () =>
      import(/* webpackChunkName: "peopleAuditDetails" */ '@/views/take-back/peopleAuditDetails.vue')
  },
  {
    path: '/takeBack/recyclerList',
    name: 'recyclerList',
    meta: {
      keepAlive: true,
      title: '回收人员列表'
    },
    component: () =>
      import(/* webpackChunkName: "recyclerList" */ '@/views/take-back/recyclerList.vue')
  },
  {
    path: '/takeBack/recyclerList/recyclerDetails',
    name: 'recyclerDetails',
    meta: {
      title: '回收人员详情'
    },
    component: () =>
      import(/* webpackChunkName: "recyclerDetails" */ '@/views/take-back/recyclerDetails.vue')
  },
  {
    path: '/takeBack/volunteer/signIn',
    name: 'volunteerSignIn',
    meta: {
      title: '签到记录'
    },
    component: () =>
      import(/* webpackChunkName: "volunteer" */ '@/views/take-back/volunteer/signIn.vue')
  }
]
