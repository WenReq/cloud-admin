<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        数据筛选
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="区域"
                v-bind="formItemLayout"
              >
                <a-cascader
                  v-model="areas"
                  :options="options"
                  :load-data="loadData"
                  change-on-select
                  :field-names="{
                    label: 'name',
                    value: 'id',
                    children: 'children'
                  }"
                  placeholder="省市区"
                  @change="onAreaChange"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="小区"
                v-bind="formItemLayout"
              >
                <a-select
                  v-model="estate"
                  allow-clear
                  placeholder="全部"
                  show-search
                  option-filter-prop="children"
                >
                  <a-select-option v-for="(item,index) in estateList" :key="index" :value="item.id">
                    {{ item.housingEstate }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="姓名"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['realName']"
                  allow-clear placeholder="请输入用户姓名"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="昵称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['nickname']"
                  allow-clear placeholder="请输入会员昵称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="手机号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['phone']"
                  allow-clear placeholder="请输入手机号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="到账渠道"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['channel']"
                  allow-clear
                  placeholder="全部"
                >
                  <a-select-option value="支付宝">
                    支付宝
                  </a-select-option>
                  <a-select-option value="微信">
                    微信
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="订单号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['orderId']"
                  allow-clear placeholder="请输入提现订单号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="提现完成时间"
                v-bind="formItemLayout"
              >
                <a-range-picker
                  v-model="timeArr"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="24" align="right">
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
    <div class="delivery-data">
      <div class="list">
        <div v-for="(item,index) in descList" :key="index" class="item">
          <IconFont :type="item.typeIcon" class="iconfont" style="font-size: 40px;" />
          <div class="item-r">
            <p>
              {{ item.title }}
            </p>
            <p v-if="item.type === 1">
              {{ userNum }}
            </p>
            <p v-else-if="item.type === 2">
              {{ pagination.total }}
            </p>
            <p v-else>
              {{ totalMoney }}
            </p>
          </div>
          <div v-if="index < descList.length - 1" class="solid"></div>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="12">
            提现列表
          </a-col>
          <a-col :span="12" align="right">
            <a-button :loading="exportLoading" @click="toExport">
              导出
            </a-button>
          </a-col>
        </a-row>
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :columns="columns"
          :data-source="data"
          :row-key="record => record.phone + Math.random() * 100"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
        >
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { toExportExcel, getArea, getEstate, iconFontComponent } from '@/components/mixins/mixins.js'
export default {
  components: {},
  mixins: [toExportExcel, getArea, getEstate, iconFontComponent],
  data () {
    return {
      areas: [],
      estate: undefined,
      totalMoney: 0,
      userNum: 0,
      descList: [
        { title: '提现人数总计', type: 1, typeIcon: 'icontixianrenshuzongji' },
        { title: '提现次数总计', type: 2, typeIcon: 'icontixiancishuzongji' },
        { title: '提现金额总计（元）', type: 3, typeIcon: 'icontixianjinezongji' }
      ],
      timeArr: [],
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, {}),
      options: [],
      columns: [
        {
          title: '提现订单号',
          dataIndex: 'orderId'
        },
        {
          title: '区域',
          dataIndex: 'area'
        },
        {
          title: '小区',
          dataIndex: 'estateName'
        },
        {
          title: '提现完成时间',
          dataIndex: 'updateTime',
          customRender (val, row, index) {
            if (val) {
              return moment(val).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        },
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '会员昵称',
          dataIndex: 'nickname'
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          customRender (val, row, index) {
            if (val) {
              return val.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
            }
          }
        },
        {
          title: '提现到账渠道',
          dataIndex: 'channel'
        },
        // {
        //   title: '提现到账账号',
        //   dataIndex: 'account'
        // },
        {
          title: '提现金额（元）',
          dataIndex: 'amount'
        },
        {
          title: '服务费（元）',
          dataIndex: 'serviceFee'
        }
      ],
      data: [],
      loading: false,
      pagination: {
        current: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => '共' + total + '条记录',
        pageSizeOptions: ['10', '20', '30', '40'],
        defaultPageSize: 10,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
  },
  mounted () {
    this.getArea('', 2)
    this.getEstate()
    this.toSearch()
  },
  methods: {
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    onAreaChange (value, obj) {
      this.province = obj[0] ? obj[0].name : ''
      this.city = obj[1] ? obj[1].name : ''
      this.area = obj[2] ? obj[2].name : ''
      this.estateList = []
      this.estate = undefined
      if (value.length < 4) {
        this.getEstate(value)
      } else if (value.length === 4) {
        this.getEstate(null, value[3])
      }
    },
    toSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    getTableData () {
      this.loading = true
      var param = this.form.getFieldsValue()
      param.menuId = '02a7eddbf6dd40baa38615dd7d5151be'
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      param.pageSize = this.pagination.pageSize
      param.province = this.province
      param.city = this.city
      param.country = this.area
      if (this.estate) {
        param.estateId = this.estate
      }
      if (this.timeArr.length > 0) {
        param.startTime = new Date(this.timeArr[0].format('YYYY/MM/DD') + ' 00:00:00').getTime()
        param.endTime = new Date(this.timeArr[1].format('YYYY/MM/DD') + ' 23:59:59').getTime()
      }
      this.$httpPost(this.$basePath.withdrawList, param)
        .then(res => {
          this.loading = false
          this.data = res.result.list
          this.totalMoney = res.result.totalMoney || 0
          this.userNum = res.result.userNum || 0
          this.pagination.total = res.result.totalCount
        })
        .catch(() => {
          this.loading = false
        })
    },
    resetForm () {
      this.form.resetFields()
      this.province = ''
      this.city = ''
      this.area = ''
      this.timeArr = []
      this.estate = undefined
      this.areas = []
    },
    toExport () {
      var param = this.form.getFieldsValue()
      param.menuId = '02a7eddbf6dd40baa38615dd7d5151be'
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      param.pageSize = this.pagination.pageSize
      param.province = this.province
      param.city = this.city
      param.country = this.area
      if (this.estate) {
        param.estateId = this.estate
      }
      if (this.timeArr.length > 0) {
        param.startTime = new Date(this.timeArr[0].format('YYYY/MM/DD') + ' 00:00:00').getTime()
        param.endTime = new Date(this.timeArr[1].format('YYYY/MM/DD') + ' 23:59:59').getTime()
      }
      this.toExportExcel(this.$basePath.withdrawExport, param, '提现记录.xlsx')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/common.styl'
.delivery-data
  width 100%
  padding 16px 20px
  box-sizing border-box
  background-color #fff
  margin 16px 0
  .list
    width 100%
    display flex
    padding 0 54px
    box-sizing border-box
    justify-content space-between
    .item
      width 24%
      display flex
      // cursor pointer
      height 90px
      align-items center
      .item-r
        padding-top 20px
        line-height 16px
        margin-left 16px
        font-size 12px
        color #666666
        width 60%
        p:last-child
          font-size 22px
          color #000
          font-weight 600
    .solid
      width 1px
      height 58px
      background-color #F2F2F2
</style>
