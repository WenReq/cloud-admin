<template>
  <div class="reserveDetail">
    <a-form :form="form" layout="inline">
      <div class="member-info">
        <div class="title">
          用户信息
        </div>
        <div class="list">
          <div class="item">
            <a-form-item label="昵称">
              <a-input disabled :value="dataObj.nickName" />
            </a-form-item>
            <a-form-item label="姓名">
              <a-input disabled :value="dataObj.userRealName" />
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
              <a-input disabled :value="dataObj.cardNum" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="详细地址">
              <a-input disabled :value="dataObj.address" />
            </a-form-item>
            <a-form-item label="可用余额">
              <a-input disabled :value="dataObj.balance" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="可用环保值">
              <a-input disabled :value="dataObj.balanceEnviron" />
            </a-form-item>
            <a-form-item label="累计环保值">
              <a-input disabled :value="dataObj.environmental" />
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="member-info">
        <div class="title">
          回收信息
        </div>
        <div class="list">
          <div class="item">
            <a-form-item label="订单号">
              <a-input disabled :value="dataObj.orderId" />
            </a-form-item>
            <a-form-item label="回收时间">
              <a-input disabled :value="dataObj.deliveryTime" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="回收品类">
              <a-input disabled :value="dataObj.dataValue" />
            </a-form-item>
            <a-form-item label="称重重量">
              <a-input disabled :value="dataObj.total" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="品类单价">
              <a-input disabled :value="dataObj.price" />
            </a-form-item>
            <a-form-item label="回收总额">
              <a-input disabled :value="dataObj.totalNum" />
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="member-info">
        <div class="title">
          智能秤信息
        </div>
        <div class="list">
          <div class="item">
            <a-form-item label="智能秤名称">
              <a-input disabled :value="dataObj.name" />
            </a-form-item>
            <a-form-item label="智能秤型号">
              <a-input disabled :value="dataObj.markName" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="智能秤编号">
              <a-input disabled :value="dataObj.productId" />
            </a-form-item>
            <a-form-item label="安装时间">
              <a-input disabled :value="dataObj.finshTime" />
            </a-form-item>
          </div>
          <div class="item">
            <a-form-item label="区域">
              <a-input disabled :value="dataObj.address" />
            </a-form-item>
            <a-form-item label="运营人员">
              <a-input disabled :value="dataObj.deliveryUser" />
            </a-form-item>
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
// import { getRecycleInfo } from '@/api/smartScales'
export default {
  data () {
    return {
      isShow: true,
      smartScales: {},
      orderId: '',
      dataObj: {}
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'detail' })
  },
  created: function () {

  },
  mounted: function () {
    const { id, dataObj } = this.$route.query
    this.orderId = id
    this.dataObj = JSON.parse(dataObj)
    this.completeDisplay()
    // this.form.resetFields()
    // this.getDetail()
  },
  methods: {
    // getDetail () {
    //   getRecycleInfo(this.orderId).then(res => {
    //     const result = res.result
    //     this.smartScales = {}
    //     if (result.recycleList.length) {
    //       result.recycleList.forEach((item, index) => {
    //         item['_index'] = index + 1
    //       })
    //     }
    //     result.amount += '元'
    //     result.environment += '积分'
    //     this.smartScales = result
    //     this.completeDisplay()
    //   })
    // },
    // handleQuery () {

    // },
    completeDisplay () {
      this.isShow = !this.isShow
      const defValue = {
        cellPhone: this.isShow
          ? this.dataObj.cellPhone
          : this.handleMobileFl(this.dataObj.cellPhone)
      }
      this.form.setFieldsValue(defValue)
    },
    handleMobileFl (str) {
      const start = str.slice(0, 3)
      const end = str.slice(7)
      return `${start}****${end}`
    },
    handleGoBack () {
      this.$router.replace({ path: '/order/smartScales/index' })
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
