<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        数据筛选
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
            <!-- 区域 -->
            <a-col class="search-item" :span="6">
              <a-form-item label="区域" v-bind="formItemLayout">
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
                  placeholder="省市区、街道"
                  @change="changeArea"
                />
              </a-form-item>
            </a-col>
            <!-- 小区 -->
            <a-col class="search-item" :span="6">
              <a-form-item
                label="小区"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['housingEstate']"
                  allow-clear
                  placeholder="请选择兑换小区"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="(item,index) in estateList" :key="index" :value="item.id">
                    {{ item.housingEstate }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 手机号 -->
            <a-col class="search-item" :span="6">
              <a-form-item label="手机号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['phone']"
                  allow-clear
                  placeholder="请输入用户手机号"
                />
              </a-form-item>
            </a-col>
            <!-- ic卡号 -->
            <a-col class="search-item" :span="6">
              <a-form-item label="IC卡号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['cardNum']"
                  allow-clear
                  placeholder="请输入用户IC卡号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <!-- 用户昵称 -->
            <a-col class="search-item" :span="6">
              <a-form-item label="姓名" v-bind="formItemLayout">
                <a-input
                  v-decorator="['userName']"
                  allow-clear
                  placeholder="请输入姓名"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="订单号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['orderNum']"
                  allow-clear
                  placeholder="请输入订单号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="兑换商品" v-bind="formItemLayout">
                <a-input
                  v-decorator="['giftName']"
                  allow-clear
                  placeholder="请输入兑换商品"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="兑换工作人员" v-bind="formItemLayout">
                <a-input
                  v-decorator="['businessName']"
                  allow-clear
                  placeholder="请输入兑换工作人员"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item v-bind="formItemLayout" label="订单时间">
                <a-range-picker
                  v-decorator="['createTime', rangeConfig]"
                  @change="handleLimitTime"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="18" align="right">
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
        <a-row>
          <a-col :span="12">
            兑换列表
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
          :row-key="record => record.orderNum"
          :columns="columns"
          :data-source="data.list"
          :loading="loading"
          :pagination="pagination"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <template slot="operate" slot-scope="text">
            <a-button type="link" size="small" @click="view(text)">
              查看
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArea,
  getEstate,
  toExportExcel,
  iconFontComponent
} from '@/components/mixins/mixins.js'
import { getExchangeList } from '@/api/order'
import moment from 'moment'
export default {
  components: {},
  mixins: [getArea, getEstate, toExportExcel, iconFontComponent],
  data () {
    return {
      confirmLoading: false,
      exportDate: '',
      rangeConfig: {},
      areas: [],
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this),
      categoryInfosCol: [
        {
          title: '品类',
          dataIndex: 'recycleCategory',
          key: 'recycleCategory',
          align: 'center',
          style: 'paddong:0'
        },
        {
          title: '回收量',
          dataIndex: 'recycleWeight',
          key: 'recycleWeight',
          scopedSlots: { customRender: 'recycleWeight' },
          align: 'center'
        },
        {
          title: '回收金额',
          dataIndex: 'recycleAmount',
          key: 'recycleAmount',
          scopedSlots: { customRender: 'recycleAmount' },
          align: 'center'
        }
      ],
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderNum',
          width: '250px'
        },
        {
          title: '用户姓名',
          dataIndex: 'userName'
        },
        {
          title: '兑换手机号',
          dataIndex: 'phone'
        },
        {
          title: 'IC卡号',
          dataIndex: 'cardNumber'
        },
        {
          title: '兑换商品',
          dataIndex: 'giftName'
        },
        {
          title: '兑换数量',
          dataIndex: 'amount'
        },
        {
          title: '使用环保值',
          dataIndex: 'usedEnviron'
        },
        {
          title: '兑换工作人员',
          dataIndex: 'businessName'
        },
        {
          title: '回收时间',
          dataIndex: 'exchangeTime'
        },
        {
          title: '操作',
          key: 'operate',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      data: {
        page: {
          list: []
        }
      },
      loading: false,
      totalPage: 50,
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
      provinceName: '',
      cityName: '',
      areaName: '',
      street: '',
      estateList: []
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'offlineDetails') {
      from.meta.keepAlive = true
      next()
    } else {
      from.meta.keepAlive = false
      next()
    }
  },
  mounted () {
    this.getArea('', 2)
    this.getEstate()
    this.toSearch()
  },
  methods: {
    changeArea (areasId) {
      this.estateList = []
      this.form.setFieldsValue({ housingEstate: undefined })
      if (areasId.length < 4) {
        this.getEstate(areasId)
      } else if (areasId.length === 4) {
        this.getEstate(null, areasId[3])
      }
    },
    getTableData () {
      const data = this.form.getFieldsValue()
      const startTime = (data.createTime &&
              data.createTime.length &&
              data.createTime[0].format('YYYY-MM-DD 00:00:00')) || ''
      const endTime = (data.createTime &&
              data.createTime.length &&
              data.createTime[1].format('YYYY-MM-DD 23:59:59')) ||
            ''
      const params = {
        province: this.areas[0] || '',
        city: this.areas[1] || '',
        country: this.areas[2] || '',
        street: this.areas[3] || '',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        startTime,
        endTime,
        ...data
      }
      this.loading = true
      getExchangeList(params).then(res => {
        this.loading = false
        this.data = res.result
        this.pagination.total = res.result.total
      })
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    toSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    resetForm () {
      this.form.resetFields()
      this.areas = []
    },
    handleLimitTime (val) {
      const result = moment(val[1]).diff(val[0], 'days')
      if (result > 93) {
        this.$message.error('抱歉限制查询范围为3个月！请重新选择！')
        this.$nextTick(() => {
          this.form.resetFields(['createTime'])
        })
      }
    },
    toExport () {
      const params = this.form.getFieldsValue()
      if (this.areas.length > 0) {
        params.province = this.provinceName
        params.city = this.cityName
        params.country = this.areaName
      }
      if (params.createTime && params.createTime.length) {
        params.startTime =
          params.createTime &&
          params.createTime[0].format('YYYY-MM-DD') + ' 00:00:00'
        params.endTime =
          params.createTime &&
          params.createTime[1].format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        this.$message.error('请先选择日期再导出')
        return false
      }
      delete params.createTime
      this.toExportExcel('/offLineStore/export', params, '线下活动兑换.xlsx')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    view (value) {
      this.$router.push({
        path: '/order/exchange/offlineDetails',
        query: { id: value.orderNum }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.title_li{
  height: 25px;
  list-style: none;
  margin:15px 0;
  font-size: 15px;
  font-weight: 600;
}
.title_mli{
  margin:15px 100px;
  font-size: 15px;
}
.span_li{
  height: 25px;
  list-style: none;
}
.mg100{
  margin:0 100px;
}
</style>
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
    padding 0 35px
    // box-sizing border-box
    // justify-content space-between
    .list_left
      width: 35%
      justify-content: center
      align-items: center
      display: flex
      flex-direction: column
      border-right: 1px solid #d6d6d6
    .list_right
      width: 65%;
    .list_empty
      width: 65%;
      display: flex;
      align-items: center;
      justify-content: center;
      .empty
        display: flex
        align-items center
        justify-content center
    .item
      // width 24%
      width: 186px
      display flex
      cursor pointer
      height 85px
      align-items center
      .item-r
        padding-top 20px
        line-height 16px
        margin-left 16px
        font-size 12px
        color #666666
        // width 60%
        p:last-child
          font-size 22px
          color #000
          font-weight 600
    // .solid
    //   width 1px
    //   height 58px
    //   background-color #F2F2F2
.tag
  display inline-block
  min-width 38px
  height 18px
  color #ffffff
  font-size $font12
  line-height 18px
  text-align center
  border-radius 2px
  background-color #000000
  &.grey
    background-color #8F96B3
  &.green
    background-color #57C22D
</style>
