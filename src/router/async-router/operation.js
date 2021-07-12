// 运营管理
export default [
  {
    path: '/operation/integral/rankList',
    name: 'rankList',
    meta: {
      title: '积分资产排行'
    },
    component: () => import('@/views/operation/integral/rankList.vue')
  },
  {
    path: '/operation/integral/configRule',
    name: 'configRule',
    meta: {
      title: '积分规则配置'
    },
    component: () => import('@/views/operation/integral/configRule.vue')
  },
  {
    path: '/operation/integral/configRulePage',
    meta: {
      title: '积分规则配置页面'
    },
    component: () => import('@/views/operation/integral/configRulePage.vue')
  },
  {
    path: '/operation/monitor/abnormal',
    name: 'monitorAbnormal',
    meta: {
      title: '异常投递纪录'
    },
    component: () => import('@/views/operation/monitor/abnormal.vue')
  }
]
