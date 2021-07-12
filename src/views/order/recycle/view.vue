<template>
  <div class="reserveDetail">
    <a-form :form="form" layout="inline">
      <div class="member-info">
        <div class="title">
          订单信息
        </div>
        <div class="list">
          <div class="item">
            <a-form-item label="订单号">
              <a-input disabled :value="order.orderId" />
            </a-form-item>
            <a-form-item label="用户姓名">
              <a-input disabled :value="order.userName" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="手机号">
              <a-input
                v-decorator="[
                  'cellPhone',
                ]" disabled
              >
                <a-button
                  slot="suffix"
                  style="font-size:12px"
                  class="link-btn"
                  type="link"
                  @click="completeDisplay"
                >
                  {{ isShow?'部分隐藏':'完整展示' }}
                </a-button>
              </a-input>
            </a-form-item>
            <a-form-item label="IC卡号">
              <a-input disabled :value="order.cardNum" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="用户地址">
              <a-input disabled :value="order.address" />
            </a-form-item>
            <a-form-item label="回收小区">
              <a-input disabled :value="order.estateName" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="回收人员">
              <a-input disabled :value="order.recycleUser" />
            </a-form-item>
            <a-form-item label="回收完成时间">
              <a-input disabled :value="order.createTime" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="回收总量">
              <a-input disabled :value="order.recycleCount" />
            </a-form-item>
            <a-form-item label="回收总额">
              <a-input v-if="payType === 1" disabled :value="order.environment" />
              <a-input v-else disabled :value="order.amount" />
            </a-form-item>
          </div>
          <div class="item">
            <div class="text-label">
              差额处置：
            </div>
            <div class="text-info">
              <span v-if="order.handleDetail && order.handleDetail.length">
                <p v-for="(item,index) in order.handleDetail" :key="index">
                  {{ item }}
                </p>
              </span>
              <span v-else>
                无
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="member-info">
        <div class="title" style="margin-top: 50px;">
          回收清单
        </div>
        <div class="list">
          <div>
            <a-table
              style="margin:0;padding:0;"
              :columns="categoryInfosCol" :data-source="order.recycleList" :pagination="false"
              :row-key="record => record.id"
            >
              <span slot="recycleWeight" slot-scope="text,record">{{ text }}{{ record.unit }}</span>
              <span slot="unitPrice" slot-scope="text,record">
                {{ text }}
                <span v-if="payType === 1">积分</span>
                <span v-else>元</span>/
                {{ record.unit }}
              </span>
              <span slot="recycleAmount" slot-scope="text">
                {{ text }}
                <span v-if="payType === 1">积分</span>
                <span v-else>元</span>
              </span>
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
import { getRecycleInfo } from '@/api/order'
export default {
  data () {
    return {
      isShow: true,
      order: {},
      categoryInfosCol: [
        {
          title: '序号',
          dataIndex: '_index',
          key: '_index',
          align: 'left'
        },
        {
          title: '品类',
          dataIndex: 'recycleCategory',
          key: 'recycleCategory',
          align: 'left'
        },
        {
          title: '回收量',
          dataIndex: 'recycleWeight',
          key: 'recycleWeight',
          scopedSlots: { customRender: 'recycleWeight' },
          align: 'left'
        },
        {
          title: '单价',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' },
          align: 'left'
        },
        {
          title: '合计',
          dataIndex: 'recycleAmount',
          key: 'recycleAmount',
          scopedSlots: { customRender: 'recycleAmount' },
          align: 'left'
        }
      ],
      orderId: '',
      payType: 0
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'detail' })
  },
  created: function () {

  },
  mounted: function () {
    const { id, payType } = this.$route.query
    this.orderId = id
    this.payType = payType
    this.form.resetFields()
    this.getDetail()
  },
  methods: {
    getDetail () {
      getRecycleInfo(this.orderId).then(res => {
        const result = res.result
        this.order = {}
        if (result.recycleList.length) {
          result.recycleList.forEach((item, index) => {
            item['_index'] = index + 1
          })
        }
        result.amount += '元'
        result.environment += '积分'
        this.order = result
        this.completeDisplay()
      })
    },
    handleQuery () {

    },
    completeDisplay () {
      this.isShow = !this.isShow
      const defValue = {
        cellPhone: this.isShow
          ? this.order.cellPhone
          : this.handleMobileFl(this.order.cellPhone)
      }
      this.form.setFieldsValue(defValue)
    },
    handleMobileFl (str) {
      const start = str.slice(0, 3)
      const end = str.slice(7)
      return `${start}****${end}`
    },
    handleGoBack () {
      this.$router.replace({ path: '/order/recycle/index' })
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
  .text-label
      width 120px
      font-size 12px
      color rgba(0, 0, 0, 0.85)
      display inline-block
      overflow hidden
      line-height 40px
      white-space nowrap
      text-align right
      vertical-align middle
  .text-info
      flex 1
      border-radius 2px
      font-size 12px
      color #333
      background-color #f5f5f5
      cursor not-allowed
      padding 10px
</style>
