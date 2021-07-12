<template>
  <div class="onlineMallDetails">
    <div class="commonTitle">
      用户信息
    </div>
    <a-row class="basicInfo">
      <a-col :span="12" class="commonCol">
        <a-row
          v-for="(item, index) in leftInfos"
          :key="index"
          :gutter="8"
          class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index | titleFilter }}:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ item }}
              <span
                v-if="index === 'cellPhone' && showpn && item"
                class="showComplete"
                @click="showAllPhoneNum()"
              >完整展示</span>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12" class="commonCol">
        <a-row
          v-for="(item, index) in rightInfos"
          :key="index"
          :gutter="8"
          class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index | titFilter }}:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ item }}
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="commonTitle">
      兑换信息
    </div>
    <a-row class="basicInfo">
      <a-col :span="12" class="commonCol">
        <a-row
          v-for="(item, index) in leftTwoInfos"
          :key="index"
          :gutter="8"
          class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index | titleTwoFilter }}:
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
          v-for="(item, index) in rightTwoInfos"
          :key="index"
          :gutter="8"
          class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index | titTwoFilter }}:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ item }}
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="commonTitle">
      购买商品清单
    </div>
    <div class="basicInfo">
      <a-table
        class="table-content"
        :pagination="false"
        :row-key="record => record.id"
        :columns="shopColumns"
        :data-source="shopData"
        :scroll="{ y: 300 }"
      />
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
import { getExchangeInfo } from '@/api/order'
export default {
  name: 'OnlineMallDetails',
  filters: {
    titleFilter: function (value) {
      switch (value) {
        case 'userName':
          return '昵称'
        case 'cellPhone':
          return '手机号'
        case 'address':
          return '详细地址'
        case 'environment':
          return '可用环保值'
        default:
          return '字段值异常，请检查后台数据'
      }
    },
    titFilter: function (value) {
      switch (value) {
        case 'realName':
          return '姓名'
        case 'cardNum':
          return 'IC卡号'
        case 'catCoin':
          return '可用余额'
        case 'environmental':
          return '累计环保值'
        default:
          return '字段值异常，请检查后台数据'
      }
    },
    titleTwoFilter: function (value) {
      switch (value) {
        case 'exchangeTime':
          return '兑换时间'
        case 'amount':
          return '兑换数量'
        default:
          return '字段值异常，请检查后台数据'
      }
    },
    titTwoFilter: function (value) {
      switch (value) {
        case 'estateName':
          return '兑换小区'
        case 'usedEnviron':
          return '使用环保值'
        default:
          return '字段值异常，请检查后台数据'
      }
    }
  },
  data () {
    return {
      leftInfos: {
        userName: '',
        cellPhone: '',
        address: '',
        environment: ''
      },
      rightInfos: {
        realName: '',
        cardNum: '',
        catCoin: '',
        environmental: ''
      },
      showpn: true,
      trueNum: '',
      leftTwoInfos: {
        exchangeTime: '',
        amount: ''
      },
      rightTwoInfos: {
        estateName: '',
        usedEnviron: ''
      },
      oId: '',
      shopData: [],
      shopColumns: [
        {
          title: '商品名称',
          key: 'giftName',
          dataIndex: 'giftName'
        },
        {
          title: '商品单价',
          key: 'giftPrice',
          dataIndex: 'giftPrice',
          customRender: (text, record) => {
            text = `${text}积分`
            return text
          }
        },
        {
          title: '兑换数量',
          key: 'giftAmount',
          dataIndex: 'giftAmount'
        },
        {
          title: '价格小计',
          key: 'totalPrice',
          dataIndex: 'totalPrice',
          customRender: (text, record) => {
            text = `${text}积分`
            return text
          }
        }
      ]
    }
  },
  created () {
    this.oId = this.$route.query.id
  },
  mounted () {
    this.getInfo(this.oId)
  },
  methods: {
    getInfo (params) {
      getExchangeInfo(params).then(res => {
        this.leftInfos.userName = res.result.userName
        this.leftInfos.cellPhone = this.formatPhone(res.result.cellPhone)
        this.trueNum = res.result.cellPhone
        this.leftInfos.address = res.result.address
        this.leftInfos.environment = res.result.environment
        this.rightInfos.realName = res.result.realName
        this.rightInfos.cardNum = res.result.cardNum
        this.rightInfos.catCoin = res.result.catCoin
        this.rightInfos.environmental = res.result.environmental
        this.leftTwoInfos.exchangeTime = res.result.exchangeTime
        this.leftTwoInfos.amount = res.result.amount

        this.rightTwoInfos.estateName = res.result.estateName
        this.rightTwoInfos.usedEnviron = res.result.usedEnviron
        this.shopData = res.result.exchangeGiftInfos
      })
    },
    formatPhone (val) {
      return val && val.length > 7
        ? val.substr(0, 3) + '****' + val.substr(val.length - 4, 4)
        : val
    },
    showAllPhoneNum () {
      this.leftInfos.cellPhone = this.trueNum
      this.showpn = false
    },
    backPage () {
      this.$router.push({ path: '/order/exchange/offline' })
    }
  }
}
</script>
<style lang="stylus" scoped>
.onlineMallDetails
  background-color #fff
  padding 16px 20px
  margin-bottom 20px
  font-size 12px
  color #000
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
    margin 8px 0 24px 0
    text-align center
</style>
