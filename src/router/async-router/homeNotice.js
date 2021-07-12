export default [
  {
    path: '/homeNotice/list',
    name: 'homeNoticeList',
    meta: {
      title: '首页公告管理'
    },
    component: () =>
      import(/* webpackChunkName: "homeNoticeList" */ '@/views/homeNotice/list.vue')
  }
]
