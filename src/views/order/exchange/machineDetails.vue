<template>
  <div class="machineDetails">
    <span v-if="leftTwoInfos.payType!=='支付宝'&&leftTwoInfos.payType!=='微信'">
      <div class="commonTitle">
        用户信息
      </div>
      <a-row class="basicInfo">
        <a-col :span="12" class="commonCol">
          <a-row
            v-for="(item, index) in leftInfos" :key="index"
            :gutter="8" class="commonHeight"
          >
            <a-col :span="6" align="right">
              {{ index|titleFilter }}:
            </a-col>
            <a-col :span="18">
              <div class="commonLine">
                {{ item }}
                <span v-if="index==='phone'&&showpn&&item" class="showComplete" @click="showAllPhoneNum()">完整展示</span>
              </div>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="12" class="commonCol">
          <a-row
            v-for="(item, index) in rightInfos" :key="index"
            :gutter="8" class="commonHeight"
          >
            <a-col :span="6" align="right">
              {{ index|titFilter }}:
            </a-col>
            <a-col :span="18">
              <div class="commonLine">
                {{ item }}
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </span>
    <div class="commonTitle">
      兑换信息
    </div>
    <a-row class="basicInfo">
      <a-col :span="12" class="commonCol">
        <a-row
          v-for="(item, index) in leftTwoInfos" :key="index"
          :gutter="8" class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index|titleTwoFilter }}:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ item }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12" class="commonCol">
        <a-row
          v-for="(item, index) in rightTwoInfos" :key="index"
          :gutter="8" class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index|titTwoFilter }}:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ item }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-row>
        <a-col :span="3" align="right" class="text-label">
          差额处置：
        </a-col>
        <a-col :span="21" class="text-info">
          <span v-if="handleDetail.length">
            <p v-for="(item,index) in handleDetail" :key="index">
              {{ item }}
            </p>
          </span>
          <span v-else>
            无
          </span>
        </a-col>
      </a-row>
    </a-row>
    <div class="commonTitle">
      购买商品清单
    </div>
    <div class="basicInfo">
      <a-table
        :pagination="false"
        :row-key="record => record.id"
        :columns="shopColumns"
        :data-source="shopData"
        :scroll="{ x: 1300, y: 300 }"
      >
        <template slot="giftPrice" slot-scope="text">
          {{ text.giftPrice }}
          <span>{{ leftTwoInfos.payType === '猫先生余额' || leftTwoInfos.payType === '支付宝' || leftTwoInfos.payType === '微信' ? "元" : "" }}</span>
          <span>{{ leftTwoInfos.payType === '猫先生环保值' ? "积分" : "" }}</span>
        </template>
        <template slot="totalPrice" slot-scope="text">
          {{ text.totalPrice }}
          <span>{{ leftTwoInfos.payType === '猫先生余额' || leftTwoInfos.payType === '支付宝' || leftTwoInfos.payType === '微信' ? "元" : "" }}</span>
          <span>{{ leftTwoInfos.payType === '猫先生环保值' ? "积分" : "" }}</span>
        </template>
      </a-table>
    </div>
    <a-row>
      <a-col :span="24" class="bottomBtn">
        <a-button type="primary" @click="backPage()">
          返回
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { viewMachine } from '@/api/order'
const shopColumns = [{
  title: '商品名称',
  key: 'giftName',
  dataIndex: 'giftName',
  width: 400
}, {
  title: '商品单价',
  key: 'giftPrice',
  // dataIndex: 'giftPrice',
  width: 400,
  scopedSlots: { customRender: 'giftPrice' }
}, {
  title: '购买数量',
  key: 'giftAmount',
  dataIndex: 'giftAmount',
  width: 400
}, {
  title: '价格小计',
  key: 'totalPrice',
  // dataIndex: 'totalPrice',
  fixed: 'right',
  width: 500,
  scopedSlots: { customRender: 'totalPrice' }
}]
export default {
  name: 'MachineDetails',
  filters: {
    titleFilter: function (value) {
      switch (value) {
        case 'userName':
          return '昵称'
        case 'phone':
          return '手机号'
        case 'address':
          return '详细地址'
        case 'canUseEnviron':
          return '可用环保值'
        default:
          return '字段值异常，请检查后台数据'
      }
    },
    titFilter: function (value) {
      switch (value) {
        case 'userRealName':
          return '姓名'
        case 'cardNumber':
          return 'IC卡号'
        case 'canUseCatCoin':
          return '可用余额'
        case 'allEnviron':
          return '累计环保值'
        default:
          return '字段值异常，请检查后台数据'
      }
    },
    titleTwoFilter: function (value) {
      switch (value) {
        case 'orderNum':
          return '订单号'
        case 'deviceName':
          return '兑换机名称'
        case 'payType':
          return '支付方式'
        case 'deviceId':
          return '兑换机编号'
        case 'usedCatCoin':
          return '付款总额'
        case 'fullPayment':
          return '是否足额付款'
        default:
          return '字段值异常，请检查后台数据'
      }
    },
    titTwoFilter: function (value) {
      switch (value) {
        case 'exchangeTime':
          return '兑换时间'
        case 'exAddress':
          return '兑换地址'
        case 'originOrderId':
          return '外部单号'
        case 'businessName':
          return '商户名称'
        case 'buyNum':
          return '购买总数量'
        case 'debts':
          return '欠款金额（元）'
        default:
          return '字段值异常，请检查后台数据'
      }
    }
  },
  data () {
    return {
      handleDetail: [],
      leftInfos: {
        userName: '',
        phone: '',
        address: '',
        canUseEnviron: ''
      },
      rightInfos: {
        userRealName: '',
        cardNumber: '',
        canUseCatCoin: '',
        allEnviron: ''
      },
      showpn: true,
      trueNum: '',
      leftTwoInfos: {
        orderNum: '',
        deviceName: '',
        payType: '',
        deviceId: '',
        usedCatCoin: '',
        fullPayment: ''
      },
      rightTwoInfos: {
        exchangeTime: '',
        exAddress: '',
        originOrderId: '',
        businessName: '',
        buyNum: '',
        debts: ''
      },
      mId: '',
      shopColumns,
      shopData: []
    }
  },
  created () {
    this.mId = this.$route.query.id
  },
  mounted () {
    const params = {}
    params.menuId = 'de065c73e8ed455c985f479d7d452257'
    params.id = this.mId
    this.getInfo(params)
  },
  methods: {
    getInfo (params) {
      viewMachine(params)
        .then(res => {
          this.leftInfos.userName = res.result.userName
          this.leftInfos.phone = this.formatPhone(res.result.phone)
          this.trueNum = res.result.phone
          this.leftInfos.address = res.result.address
          this.leftInfos.canUseEnviron = res.result.canUseEnviron
          this.rightInfos.userRealName = res.result.userRealName
          this.rightInfos.cardNumber = res.result.cardNumber
          this.rightInfos.canUseCatCoin = res.result.canUseCatCoin
          this.rightInfos.allEnviron = res.result.allEnviron
          this.leftTwoInfos.orderNum = res.result.orderNum
          this.leftTwoInfos.deviceName = res.result.deviceName || ''
          this.leftTwoInfos.payType = this.formatType(res.result.payType)
          this.leftTwoInfos.deviceId = res.result.deviceId
          const unit = (this.leftTwoInfos.payType === '猫先生余额' || this.leftTwoInfos.payType === '支付宝' || this.leftTwoInfos.payType === '微信') ? '元' : (this.leftTwoInfos.payType === '猫先生环保值' ? '积分' : '')
          this.leftTwoInfos.usedCatCoin = res.result.usedCatCoin ? res.result.usedCatCoin + unit : ''
          this.leftTwoInfos.fullPayment = Number(res.result.fullPayment) === 0 ? '否' : Number(res.result.fullPayment) === 1 ? '是' : ''
          this.rightTwoInfos.exchangeTime = res.result.exchangeTime
          this.rightTwoInfos.exAddress = res.result.exAddress || ''
          this.rightTwoInfos.originOrderId = res.result.originOrderId// Number(res.result.payType) === 1 || Number(res.result.payType) === 2 ? '无' :
          // this.rightTwoInfos.businessName = '猫先生自营'
          this.rightTwoInfos.buyNum = res.result.buyNum
          this.rightTwoInfos.debts = res.result.debts
          this.shopData = res.result.gifts
          this.handleDetail = res.result.handleDetail || []
        })
    },
    formatType (value) {
      switch (value) {
        case '1':
          return '猫先生余额'
        case '2':
          return '猫先生环保值'
        case '3':
          return '支付宝'
        case '4':
          return '微信'
        default:
          return ''
      }
    },
    formatPhone (val) {
      return val && val.length > 7 ? val.substr(0, 3) + '****' + val.substr(val.length - 4, 4) : val
    },
    showAllPhoneNum () {
      this.leftInfos.phone = this.trueNum
      this.showpn = false
    },
    backPage () {
      this.$router.push({ path: '/order/exchange/machineList' })
    }
  }
}
</script>
<style lang="stylus" scoped>
.machineDetails
  background-color #fff
  padding 16px 20px
  margin-bottom 20px
  font-size 12px
  color #000
  .mt16
    margin-top 16px
  .commonTitle
    font-size 16px
    font-weight 600
    color #333
  .basicInfo
    margin 16px 0
    .commonCol
      .commonHeight
        height 32px
        line-height 32px
        margin 16px 0
        .commonLine
          background-color #f2f2f2
          height 32px
          line-height 32px
          padding 0 11px
          color #333
  .showComplete
    color #2F90FF
    font-size 12px
    float right
    cursor pointer
  .bottomBtn
    margin 40px 0 24px 0
    text-align center
  .text
    width 100%
    display flex
    .text-label
      font-size 12px
      display inline-block
      overflow hidden
      line-height 32px
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
      padding 6px 14px
</style>
