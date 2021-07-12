<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        兑换机信息
      </div>
      <div class="card-content">
        <a-form ref="detailForm" :form="form" class="detail-form">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="兑换机名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['name']" disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="兑换机编号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['deviceNumber']" disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="兑换机型号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['markName']" disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="绑定回收设备编号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productId']" disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="区域"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['areas']" disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="详细地址"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['address']" disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="小区"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['estateName']" disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="安装时间"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['updateTime']" disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div v-if="supplier === 3" class="card-title">
        货道配置
      </div>
      <div v-if="supplier === 3" class="card-content">
        <a-table
          class="table-content"
          :row-key="record => record.storey"
          :columns="columns_2"
          :data-source="tableData"
          :loading="loading"
          :scroll="{ y: 500 }"
          :pagination="false"
        >
          <template slot="racks" slot-scope="record">
            <div class="list">
              <div v-for="item in record.racks" :key="item.id">
                <div class="item">
                  <span>货道{{ item.serialNum }}:</span><a-input-number
                    v-model="item.numCapacity"
                    disabled
                  />
                </div>
                <span>现有商品{{ item.num || 0 }}件</span>
              </div>
            </div>
          </template>
        </a-table>
      </div>
      <div class="card-title mt16">
        兑换机交易记录
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :row-key="record => record.id"
          :columns="columns"
          :data-source="dataList"
          :loading="loading"
          :pagination="pagination"
          :scroll="{x: 1500}"
          @change="handleTableChange"
        >
          <template slot="giftName" slot-scope="text">
            <span v-if="text" :title="text">{{ text.length > 10 ? text.slice(0, 10) + "..." : text }}</span>
          </template>
          <template slot="fullPayment" slot-scope="fullPayment">
            <span>{{ fullPayment == 0?"否":"" }}</span>
            <span>{{ fullPayment == 1?"是":"" }}</span>
          </template>
          <template slot="usedCatCoin" slot-scope="text, record">
            <span>{{ record.payType == 1 || record.payType == 3 || record.payType == 4 ? record.usedCatCoin + "元" : "" }}</span>
            <span>{{ record.payType == 2 ? record.usedEnviron + "积分" : "" }}</span>
          </template>
          <template slot="payType" slot-scope="pType">
            <span>{{ pType == 1?"猫先生余额":"" }}</span>
            <span>{{ pType == 2?"猫先生积分(环保值)":"" }}</span>
            <span>{{ pType == 3?"支付宝":"" }}</span>
            <span>{{ pType == 4?"微信":"" }}</span>
          </template>
        </a-table>
      </div>
      <div class="card-content mb40 mt40">
        <a-row>
          <a-col :span="23" style="text-align:center;">
            <a-button class="mr8" type="primary" @click="back">
              返回
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { toExportExcel } from '@/components/mixins/mixins.js'
import { getMachineList } from '@/api/order'
import { exchangeConfig } from '@/api/deviceOrder'
const columns = [
  {
    title: '货道层数',
    dataIndex: 'storey',
    width: 130
  },
  {
    title: '每层货道数量',
    dataIndex: 'rackAmount',
    width: 130
  },
  {
    title: '每层每个货道放置商品容量',
    scopedSlots: { customRender: 'racks' }
  }
]
export default {
  components: {

  },
  mixins: [toExportExcel],
  data () {
    return {
      imgSrc: '',
      supplier: '',
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, { name: 'detailForm' }),
      loading: false,
      columns: [ // 兑换机交易记录
        {
          title: '订单号',
          dataIndex: 'orderNum'
        },
        {
          title: '外部单号',
          dataIndex: 'originOrderId'
        },
        {
          title: '商品名称',
          dataIndex: 'giftName',
          scopedSlots: { customRender: 'giftName' }
        },
        {
          title: '付款总额',
          scopedSlots: { customRender: 'usedCatCoin' }
        },
        {
          title: '支付方式',
          dataIndex: 'payType',
          scopedSlots: { customRender: 'payType' }
        },
        {
          title: '是否足额付款',
          dataIndex: 'fullPayment',
          scopedSlots: { customRender: 'fullPayment' }
        },
        {
          title: '欠款金额（元）',
          dataIndex: 'debts'
        },
        {
          title: '用户昵称',
          dataIndex: 'userName'
        },
        {
          title: '兑换手机号',
          dataIndex: 'phone'
        },
        {
          title: '兑换时间',
          dataIndex: 'exchangeTime'
        }
      ],
      columns_2: columns,
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
      dataList: [],
      tableData: []
    }
  },
  mounted () {
    const data = JSON.parse(this.$route.query.info)
    this.getDetail(data)
    this.getTableData()
    this.getExchangeConfig()
  },
  methods: {
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    getDetail (data) {
      this.form.setFieldsValue({
        address: data.address || '',
        name: data.name || '',
        estateName: data.estateName || '',
        areas: data.provinceName + data.cityName + data.areaName,
        productId: data.productId || '',
        deviceNumber: data.deviceNumber || '',
        markName: data.markName || '',
        updateTime: data.updateTime || ''
      })
      this.supplier = data.supplier
    },
    getTableData () {
      const params = {}
      params.deviceId = this.$route.query.id
      params.pageNo = this.pagination.current
      params.pageSize = this.pagination.pageSize
      this.loading = true
      getMachineList(params)
        .then(res => {
          this.loading = false
          this.dataList = res.result.list
          this.pagination.total = res.result.total
        }).catch(error => {
          this.loading = false
          console.error(error)
        })
    },
    getExchangeConfig () {
      const { id } = JSON.parse(this.$route.query.info)
      exchangeConfig(id).then(res => {
        this.tableData = res.result
      })
    },
    back () {
      this.$router.push({
        path: '/device/conversion/list'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/common.styl'
.ysOpenDevice
  margin-bottom 18px
.health-contain
  margin 20px 0 30px 0
  .health-item
    display flex
    margin-bottom 20px
    .health-title
      width 121px
.td-image
  width 48px
  height 48px
  margin 6px 0
.no-photo
  border-bottom 1px solid #e8e8e8
.table-pagination
  >>>.ant-pagination-total-text
    height 28px
    line-height 28px
  >>>.ant-pagination
    font-size $font12
    color #333
    float right
  >>>.ant-pagination-item, >>>.ant-pagination-prev, >>>.ant-pagination-next, >>>.ant-pagination-jump-prev, >>>.ant-pagination-jump-next
    min-width 28px
    height 28px
    line-height 28px
    border-radius 2px
  >>>.ant-pagination-item a
    color #333
  >>>.ant-pagination-prev .ant-pagination-item-link, >>>.ant-pagination-next .ant-pagination-item-link
    border-radius 2px
  >>>.ant-pagination-options-quick-jumper
    height 28px
    line-height 28px
    input
      width 48px
      height 28px
      max-width 80px
      border-radius 2px
      font-size $font12
      text-align center
      padding 4px 6px
.img-container
  width 90%
  margin-bottom 20px
  padding 8px
  border 1px solid #e8e8e8
  border-radius 2px
  .table-img
    position relative
    width 100%
    height 0
    padding-bottom 95%
    img
      position absolute
      width 100%
      height 100%
  .photo-time
    font-size 12px
    color #333333
    margin-top 5px
.process-step
  margin-top 10px
  max-height 580px
  overflow-y auto
  >>>.ant-steps-item-finish > .ant-steps-item-tail::after
    background #e8e8e8
  >>>.ant-steps-vertical > .ant-steps-item > .ant-steps-item-tail
    padding 22px 0 0 0
    height 119%
  >>>.ant-steps-icon
    line-height 16px
  .content-left
    display inline-block
    width 112px
    margin-right 80px
    &.time
      font-size 12px
      color #999999
    &.state
      font-size 14px
      color #333333
  .content-right
    display inline-block
    &.people
      font-size 12px
      color #333333
    &.remark
      font-size 12px
      color #999999
.list
  display flex
  flex-wrap wrap
  .item
    width 160px
    display flex
    align-items center
    margin-top 8px
    margin-bottom 4px
    span
      margin-right 10px
</style>
