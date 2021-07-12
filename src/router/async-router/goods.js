export default [
  {
    path: '/goods/phyGoodsManage/addGoods',
    name: 'addGoods',
    meta: {
      title: '添加商品'
    },
    component: () =>
      import(/* webpackChunkName: "addGoods" */ '@/views/goods/phyGoodsManage/addGoods.vue')
  },
  {
    path: '/goods/phyGoodsManage/houseGoods',
    name: 'houseGoods',
    meta: {
      title: '未上架商品'
    },
    component: () =>
      import(/* webpackChunkName: "houseGoods" */ '@/views/goods/phyGoodsManage/houseGoods.vue')
  },
  {
    path: '/goods/phyGoodsManage/houseGoods/houseEdit',
    name: 'houseEdit',
    meta: {
      title: '编辑商品'
    },
    component: () =>
      import(/* webpackChunkName: "houseEdit" */ '@/views/goods/phyGoodsManage/addGoods.vue')
  },
  {
    path: '/goods/phyGoodsManage/groundGoods',
    name: 'groundGoods',
    meta: {
      title: '已上架商品'
    },
    component: () =>
      import(/* webpackChunkName: "groundGoods" */ '@/views/goods/phyGoodsManage/groundGoods.vue')
  },
  {
    path: '/goods/phyGoodsManage/groundGoods/groundEdit',
    name: 'groundEdit',
    meta: {
      title: '编辑商品'
    },
    component: () =>
      import(/* webpackChunkName: "groundEdit" */ '@/views/goods/phyGoodsManage/addGoods.vue')
  },
  {
    path: '/goods/machineManage/list',
    name: 'machineManageList',
    meta: {
      title: '兑换机商品列表'
    },
    component: () =>
      import(/* webpackChunkName: "machineManageList" */ '@/views/goods/machineManage/list.vue')
  },
  {
    path: '/goods/machineManage/price',
    name: 'machineManagePrice',
    meta: {
      title: '兑换机商品价格'
    },
    component: () =>
      import(/* webpackChunkName: "machineManagePrice" */ '@/views/goods/machineManage/price.vue')
  },
  {
    path: '/goods/machineManage/priceAdd',
    name: 'machineManagePriceAdd',
    meta: {
      title: '兑换机商品价格配置'
    },
    component: () =>
      import(/* webpackChunkName: "machineManagePriceAdd" */ '@/views/goods/machineManage/priceAdd.vue')
  },
  {
    path: '/goods/activePrice/activityPrice',
    name: 'activityPrice',
    meta: {
      title: '兑换机商品价格'
    },
    component: () =>
      import(/* webpackChunkName: "activityPrice" */ '@/views/goods/activePrice/activityPrice.vue')
  },
  {
    path: '/goods/activePrice/activityPriceAdd',
    name: 'activityPriceAdd',
    meta: {
      title: '兑换机商品价格配置'
    },
    component: () =>
      import(/* webpackChunkName: "activityPriceAdd" */ '@/views/goods/activePrice/activityPriceAdd.vue')
  }
]
