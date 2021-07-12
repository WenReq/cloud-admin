<template>
  <div class="reserveDetail">
    <a-form :form="form" layout="inline">
      <div class="member-info">
        <div class="title">
          补货详情
        </div>
        <div class="list">
          <div class="item">
            <a-form-item label="小区">
              <a-input disabled :value="replenishment.estateName" />
            </a-form-item>
            <a-form-item label="兑换机名称">
              <a-input disabled :value="replenishment.name" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="兑换机编号">
              <a-input disabled :value="replenishment.deviceCode" />
            </a-form-item>
            <a-form-item label="补货人员">
              <a-input disabled :value="replenishment.userName" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="补货时间">
              <a-input disabled :value="replenishment.createTime" />
            </a-form-item>
            <a-form-item label="变动类型">
              <a-input v-if="type === 1" disabled value="补货" />
              <a-input v-else-if="type === 2" disabled value="下架" />
              <a-input v-else-if="type === 3" disabled value="更换商品" />
              <a-input v-else-if="type === 4" disabled value="减货" />
              <a-input v-else disabled value="" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="本次变动总数量">
              <a-input disabled :value="replenishment.replenishmentCount" />
            </a-form-item>
            <a-form-item label="变动后现有商品总数">
              <a-input disabled :value="replenishment.afterNum" />
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="member-info">
        <div class="title" style="margin-top: 50px;">
          操作明细
        </div>
        <div class="list">
          <div>
            <a-table
              style="margin:0;padding:0;"
              :columns="categoryInfosCol" :data-source="replenishment.list" :pagination="false"
              :row-key="record => record.id"
            >
            </a-table>
          </div>
        </div>
      </div>
      <div class="btn-list">
        <a-button type="primary" @click="handleGoBack">
          返回
        </a-button>
      </div>
    </a-form>
  </div>
</template>
<script>
import { detail } from '@/api/deviceOrder'
export default {
  data () {
    return {
      isShow: true,
      replenishment: {},
      categoryInfosCol: [
        {
          title: '货道',
          dataIndex: 'serialNum',
          key: 'serialNum',
          align: 'left'
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          align: 'left'
        },
        {
          title: '变动数量',
          dataIndex: 'replenishmentNum',
          key: 'replenishmentNum',
          align: 'left'
        },
        {
          title: '变动后货道商品数',
          dataIndex: 'afterNum',
          key: 'afterNum',
          align: 'left'
        }
      ],
      rowId: '',
      type: 0
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'replenishment' })
  },
  created: function () {

  },
  mounted: function () {
    const { id, type } = this.$route.query
    this.rowId = id
    this.type = type
    this.form.resetFields()
    this.getDetail()
  },
  methods: {
    getDetail () {
      detail({ id: this.rowId }).then(res => {
        const result = res.result
        this.replenishment = {}
        this.replenishment = result
      })
    },
    handleQuery () {

    },
    handleGoBack () {
      this.$router.replace({ path: '/device/replenishment/list' })
    }
  }
}
</script>
<style lang="stylus">
.reserveDetail
  .list
    width 100%
    padding 0 12px
    .item
      width 100%
      display flex
      justify-content space-between
      margin-top 16px
      .ant-form-item
        width 42%
        display flex
        .ant-form-item-label
          width 120px
          font-size 12px
          color #000
        .ant-form-item-control-wrapper
          flex 1
          .item-img_list
            width 100%
            display flex
            flex-wrap wrap
            .item-img
              width 108px
              height 80px
              border-radius 2px
              overflow hidden
              margin-right 8px
              margin-top 8px
            div.item-img:last-child
                margin-right 0
          .ant-input-disabled
            border none
            border-radius 2px
            font-size 12px
            color #333
</style>
<style lang="stylus" scoped>
.reserveDetail
  width 100%
  background-color #fff
  padding 16px 20px
  .member-info
    width 100%
  .exchange-info
    width 100%
    margin-top 30px
  .btn-list
      width 100%
      text-align center
      margin-top 30px
      margin-bottom 20px
</style>
