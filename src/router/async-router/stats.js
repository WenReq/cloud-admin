export default [
  {
    path: '/stats/familyStats/lifeRubbish',
    name: 'lifeRubbish',
    meta: {
      title: '家庭生活垃圾'
    },
    component: () =>
      import(/* webpackChunkName: "addlifeRubbishGoods" */ '@/views/stats/familyStats/lifeRubbish.vue')
  }
]
