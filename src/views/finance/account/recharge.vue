<template>
  <div class="member-import">
    <div class="card-container">
      <div class="card-title">
        数据筛选
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="充值时间"
              >
                <a-range-picker v-decorator="['createTime']" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="充值渠道"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-decorator="[
                    'type',
                    {
                      initialValue: ''
                    }
                  ]"
                  allow-clear
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option :value="1">
                    支付宝
                  </a-select-option>
                  <a-select-option :value="2">
                    对公转账
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="充值状态"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-decorator="[
                    'status',
                    {
                      initialValue: ''
                    }
                  ]"
                  allow-clear
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option :value="2">
                    支付成功
                  </a-select-option>
                  <a-select-option :value="3">
                    支付失败
                  </a-select-option>
                </a-select>
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
    <div class="card-container mrt16">
      <a-row>
        <a-col :span="12">
          <div class="card-title">
            充值记录
            <span
              style="font-size:12px;color:#999;margin-left:10px"
            ><a-icon type="info-circle" /> 成功充值笔数：{{
              result.count
            }}，充值总额：￥{{ result.amount }}</span>
          </div>
        </a-col>
        <a-col :span="12" align="right">
          <a-button class="mr8" icon="plus" @click="linkDetail">
            账户充值
          </a-button>
        </a-col>
      </a-row>
      <div class="card-content">
        <a-table
          class="table-content"
          :columns="columns"
          :data-source="result.list"
          :loading="loading"
          :pagination="pagination"
          :row-key="record => record.id"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { rechargeList } from '@/api/finance'
const columns = [
  {
    title: '充值订单号',
    dataIndex: 'outTradeNo',
    key: 'outTradeNo'
  },
  {
    title: '充值时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '充值渠道',
    key: 'type',
    dataIndex: 'type',
    customRender: (text) => {
      return text === 1 ? '支付宝' : '对公转账'
    }
  },
  {
    title: '充值金额（元）',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: '手续费（元）',
    dataIndex: 'serviceCharge',
    key: 'serviceCharge'
  },
  {
    title: '到账金额（元）',
    dataIndex: 'accountAmount',
    key: 'accountAmount'
  },
  {
    title: '充值状态',
    dataIndex: 'status',
    key: 'status',
    customRender: (text) => {
      return text === 2 ? '支付成功' : '支付失败'
    }
  }
]
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
export default {
  data () {
    return {
      loading: false,
      columns,
      formItemLayout,
      result: {
        amount: 0,
        count: 0,
        list: []
      },
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => '共' + total + '条记录',
        pageSizeOptions: ['10', '20', '30', '40'],
        defaultPageSize: 10,
        total: 0
      },
      form: this.$form.createForm(this, { name: 'filter_from' })
    }
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.getTableData()
    },
    getTableData () {
      const data = this.form.getFieldsValue()
      const params = {
        menuId: 'e446eee1ef764084bb2155cb1d8a2c41',
        type: data.type,
        status: data.status,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        startTime:
          (data.createTime &&
            data.createTime.length &&
            data.createTime[0].format('YYYY-MM-DD 00:00:00')) ||
          '',
        endTime:
          (data.createTime &&
            data.createTime.length &&
            data.createTime[1].format('YYYY-MM-DD 23:59:59')) ||
          ''
      }
      this.loading = true
      rechargeList(params).then(res => {
        this.loading = false
        const { list, amount, count, totalCount } = res.result
        this.result.list = list
        this.result.count = count
        this.result.amount = amount
        this.pagination.total = totalCount
      })
    },
    toSearch (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.pagination.current = 1
          this.getTableData()
        }
      })
    },
    resetForm () {
      this.form.resetFields()
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getTableData()
    },
    linkDetail () {
      this.$router.push('/finance/account/rechargePay')
    }
  }
}
</script>
<style lang="stylus">
.role-modal .ant-modal-footer
  text-align center
.siteModal
  .ant-modal-body
    padding-bottom 0
  .ant-modal-footer
    padding-top 0
    padding-bottom 24px
    text-align center
.ant-result-icon
  .anticon
    font-size 60px
.ant-result-title
  font-size 18px
</style>
<style lang="stylus" scoped>
@import '~@/assets/css/common.styl'
.modal-title
  font-size 14px
  color #000000
  font-weight 500
.modal-list
  width 100%
  margin 20px 0
  padding-left 20px
  box-sizing border-box
  .item
    width 100%
    font-size 12px
    color #000000
    margin-bottom 16px
</style>
