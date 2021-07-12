<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="10">
            订单看板
          </a-col>
          <a-col :span="14" align="right">
            <a-radio-group
              v-model="type" class="group-radio"
              @change="changeType"
            >
              <a-radio-button value="3">
                今日
              </a-radio-button>
              <a-radio-button value="2">
                最近7天
              </a-radio-button>
              <a-radio-button value="1">
                最近30天
              </a-radio-button>
            </a-radio-group>
            <a-range-picker
              v-model="showtime"
              class="mrl12"
              @change="changeTime"
            />
          </a-col>
        </a-row>
      </div>
      <div class="card-content">
        <a-row class="panel-container" type="flex" justify="center">
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconbianzu5" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  余额支付（元）: {{ boardData.catCoinPay | numberFl1 }}
                </div>
                <div class="type-name">
                  微信支付（元）: {{ boardData.weChatPay | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconbianzu6" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  环保值兑换
                </div>
                <div class="type-num">
                  {{ boardData.environmentExchange | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconbianzubeifen2" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  待发货
                </div>
                <div class="type-num">
                  {{ boardData.readyToDelivery | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconbianzubeifen" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  已发货
                </div>
                <div class="type-num">
                  {{ boardData.delivered | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconbianzubeifen1" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  已完成
                </div>
                <div class="type-num">
                  {{ boardData.finished | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        数据筛选
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="订单号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['orderId']"
                  allow-clear placeholder="请输入订单号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="订单状态"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['orderStatus']"
                  allow-clear
                  placeholder="全部"
                >
                  <a-select-option value="1">
                    待发货
                  </a-select-option>
                  <a-select-option value="2">
                    已发货
                  </a-select-option>
                  <a-select-option value="4">
                    待付款
                  </a-select-option>
                  <a-select-option value="5">
                    已退款
                  </a-select-option>
                  <a-select-option value="6">
                    已完成
                  </a-select-option>
                  <a-select-option value="7">
                    已取消
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="商品名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['itemName']"
                  allow-clear placeholder="请输入商品名称"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="下单手机号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['phone']"
                  allow-clear placeholder="请输入下单人订单号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="收货人"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['receiver']"
                  allow-clear placeholder="请输入收货人姓名"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="收货人手机号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['receiverPhone']"
                  allow-clear placeholder="请输入收货人手机号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="下单时间"
                v-bind="formItemLayout"
              >
                <a-range-picker
                  v-model="timeRange"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6" align="right">
              <a-button type="primary" class="mr8" @click="toSearch">
                查询
              </a-button>
              <a-button @click="resetForm">
                重置
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        实物商品订单列表
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :row-key="record => Math.random() * 10"
          :columns="columns"
          :data-source="data"
          :loading="loading"
          :pagination="pagination"
          :scroll="{x: 1500}"
          @change="handleTableChange"
        >
          <template slot="placeOrderName" slot-scope="text, record">
            {{ text }} {{ record.placeOrderPhone }}
          </template>
          <template slot="receiver" slot-scope="text, record">
            {{ text }} {{ record.phone }}
          </template>
          <template slot="operate" slot-scope="record">
            <a-button
              v-if="record.orderStatus == '1' || record.orderStatus == '2'"
              class="table-btn-link" type="link" size="small"
              @click="orderMan(record)"
            >
              订单管理
            </a-button>
            <a-button
              v-else
              class="table-btn-link" type="link" size="small"
              @click="toView(record)"
            >
              查看详情
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { iconFontComponent } from '@/components/mixins/mixins.js'
export default {
  mixins: [iconFontComponent],
  data () {
    return {
      timeRange: [],
      showtime: [moment(), moment()],
      type: '3',
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      boardData: {},
      form: this.$form.createForm(this, {}),
      loading: false,
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderId',
          width: 170
        },
        {
          title: '商品名称',
          width: 320,
          dataIndex: 'itemName'
        },
        {
          title: '商户名称',
          dataIndex: 'merchant'
        },
        {
          title: '订单金额',
          dataIndex: 'orderAmount'
        },
        {
          title: '购买数量',
          dataIndex: 'orderCount'
        },
        {
          title: '下单人信息',
          dataIndex: 'placeOrderName',
          scopedSlots: { customRender: 'placeOrderName' }
        },
        {
          title: '收货人信息',
          dataIndex: 'receiver',
          scopedSlots: { customRender: 'receiver' }
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatus',
          customRender (val, row, index) {
            if (val === '1') {
              return '待发货'
            }
            if (val === '2') {
              return '已发货'
            }
            if (val === '4') {
              return '待付款'
            }
            if (val === '5') {
              return '已退款'
            }
            if (val === '6') {
              return '已完成'
            }
            if (val === '7') {
              return '已取消'
            }
          }
        },
        {
          title: '下单时间',
          dataIndex: 'orderCreateTime'
        },
        {
          title: '操作',
          width: 100,
          fixed: 'right',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      pagination: {
        current: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => '共' + total + '条记录',
        pageSizeOptions: ['10', '20', '30', '40'],
        defaultPageSize: 10,
        pageSize: 10,
        total: 0
      },
      data: []
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'phyGoodsOrderEdit') {
      next(vm => {
        vm.load()
      })
    } else {
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'phyGoodsOrderEdit') {
      from.meta.keepAlive = true
      next()
    } else {
      from.meta.keepAlive = false
      next()
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.getBoardData()
      this.getTableData()
    },
    changeType () {
      if (this.type === '3') {
        this.showtime = [moment(), moment()]
      }
      if (this.type === '2') {
        const begin = new Date(new Date().getTime() - 86400000 * 6).setHours(0, 0, 0, 0)
        const end = new Date().getTime()
        this.showtime = [moment(begin), moment(end)]
      }
      if (this.type === '1') {
        const startDate = new Date(new Date().getTime() - 86400000 * 29).setHours(0, 0, 0, 0)
        const endDate = new Date().getTime()
        this.showtime = [moment(startDate), moment(endDate)]
      }
      this.getBoardData()
    },
    changeTime (value, dateString) {
      this.type = ''
      this.getBoardData()
    },
    getBoardData () {
      var param = {}
      if (this.showtime.length) {
        param.startTime = this.showtime[0].format('YYYY-MM-DD') + ' 00:00:00'
        param.endTime = this.showtime[1].format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.$httpPost(this.$basePath.getDashBoardMarket, param)
        .then(res => {
          this.boardData = res.result
        })
    },
    toSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    getTableData () {
      var param = this.form.getFieldsValue()
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      if (this.timeRange.length > 0) {
        param.startTime = this.timeRange[0].format('YYYY-MM-DD') + ' 00:00:00'
        param.endTime = this.timeRange[1].format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.loading = true
      this.$httpPost(this.$basePath.getMarketOrderList, param)
        .then(res => {
          this.loading = false
          this.data = res.result.list
          this.pagination.total = res.result.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    resetForm () {
      this.form.resetFields()
      this.timeRange = []
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      var param = this.form.getFieldsValue()
      param.menuId = ''
      param.pageNo = pagination.current
      param.pageSize = this.pagination.pageSize
      this.getTableData()
    },
    orderMan (record) {
      this.$router.push({
        path: '/order/shoppingmall/phyGoodsOrderEdit',
        query: { orderId: record.orderId }
      })
    },
    toView (record) {
      this.$router.push({
        path: '/order/shoppingmall/phyGoodsOrderView',
        query: { orderId: record.orderId }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.panel-container
  margin-top 8px
  margin-bottom 25px
.height-90
  height 90px
  position relative
  &.large
    width 18%
  &:not(:last-child)::after
    position absolute
    right 0
    top 50%
    transform translateY(-50%)
    content ''
    display block
    width 1px
    height 58px
    background-color #F2F2F2
  &.data
    background-color #F4F5F7
    border-radius 4px
    &::after
      width 0
      height 0
  .type-name
    color #666666
    font-size 12px
    margin-top 16px
    display flex
    align-items center
    justify-content center
    text-align center
    .type-icon
      width 8px
      height 8px
      border-radius 4px
      margin-right 5px
  .type-num
    font-size 24px
    color #333333
    margin-top 8px
    text-align center
</style>
