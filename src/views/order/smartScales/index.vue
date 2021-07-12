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
              <a-form-item label="区域" v-bind="formItemLayout">
                <a-cascader
                  v-model="region"
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
            <a-col class="search-item" :span="6">
              <a-form-item v-bind="formItemLayout" label="回收时间">
                <a-range-picker v-decorator="['createTime']" @change="handleLimitTime" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="订单号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['orderId']"
                  allow-clear
                  placeholder="请输入订单号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="姓名" v-bind="formItemLayout">
                <a-input
                  v-decorator="['userName']"
                  allow-clear
                  placeholder="请输入用户姓名"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item label="手机号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['phone']"
                  allow-clear
                  placeholder="请输入用户手机号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="IC卡号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['cardNum']"
                  allow-clear
                  placeholder="请输入用户IC卡号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                v-bind="formItemLayout"
                label="回收品类"
              >
                <a-select
                  v-decorator="[
                    'dictId',
                    {
                      initialValue: ''
                    }
                  ]"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in categoryList" :key="item.id">
                    {{ item.dataValue }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="智能秤名称" v-bind="formItemLayout">
                <a-input
                  v-decorator="['name']"
                  allow-clear
                  placeholder="请输入智能秤名称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item label="智能秤编号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['productId']"
                  allow-clear
                  placeholder="请输入智能秤编号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="回收人员" v-bind="formItemLayout">
                <a-input
                  v-decorator="['deliveryUser']"
                  allow-clear
                  placeholder="请输入回收人员"
                />
              </a-form-item>
            </a-col>
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
        <div class="list_left">
          <div class="item">
            <IconFont
              type="iconkehuishoulajihuishouzongliang"
              style="font-size: 40px; margin-right: 10px;"
            />
            <div class="item-r">
              <p>
                智能秤回收总量
              </p>
              <p>
                {{ data.total }}
              </p>
            </div>
            <div class="solid"></div>
          </div>
          <div class="item">
            <IconFont
              type="iconfeijiudianzidianqihuishouzongliang"
              style="font-size: 40px; margin-right: 10px;"
            />
            <div class="item-r">
              <p>
                智能秤回收总次数
              </p>
              <p>
                {{ data.totalCount }}
              </p>
            </div>
          </div>
          <div class="item">
            <IconFont
              type="iconhuishouzongjine"
              style="font-size: 40px; margin-right: 10px;"
            />
            <div class="item-r">
              <p>
                回收总额
              </p>
              <p>
                {{ data.totalBalance }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="data.list && data.list.length"
          :loading="categoryInfosLoading"
          class="list_right"
        >
          <div class="tip_table">
            <a-table
              class="table-content-right"
              :columns="categoryInfosCol"
              :data-source="data.list"
              :scroll="{ y: 300 }"
              :row-key="record => record.dataValue"
              :pagination="false"
            >
            </a-table>
          </div>
        </div>
        <div v-else class="list_empty">
          <span class="empty">
            暂无数据
          </span>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="12">
            定点回收列表
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
          :row-key="record => record.id"
          :columns="columns"
          :data-source="tableList"
          :loading="loading"
          :pagination="paginationObj"
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
import moment from 'moment'
import {
  getArea,
  getEstate,
  toExportExcel,
  iconFontComponent
} from '@/components/mixins/mixins.js'
import { getSmartScalesList, getDeliveryScaleList, category } from '@/api/order' // getSmartScalesList

const columns = [
  {
    title: '订单号',
    dataIndex: 'orderId',
    width: 150
  },
  {
    title: '区域',
    dataIndex: 'address',
    width: 130
  },
  {
    title: '智能秤名称',
    dataIndex: 'name'
  },
  {
    title: '智能秤编号',
    dataIndex: 'productId'
  },
  {
    title: '用户姓名',
    dataIndex: 'nickName'
  },
  {
    title: '用户手机号',
    dataIndex: 'cellPhone'
  },
  {
    title: 'IC卡号',
    dataIndex: 'cardNum'
  },
  {
    title: '回收品类',
    dataIndex: 'dataValue'
  },
  {
    title: '称重重量',
    dataIndex: 'total'
  },
  {
    title: '回收总额',
    dataIndex: 'totalNum'
  },
  {
    title: '回收人员',
    dataIndex: 'deliveryUser'
  },
  {
    title: '回收时间',
    dataIndex: 'deliveryTime',
    width: 130
  },
  {
    title: '操作',
    key: 'operate',
    width: 60,
    fixed: 'right',
    scopedSlots: { customRender: 'operate' }
  }
]

export default {
  components: {},
  mixins: [getArea, getEstate, toExportExcel, iconFontComponent],
  data () {
    return {
      loading: false,
      categoryInfosLoading: false,
      exportDate: '',
      region: [],
      areaNames: [],
      categoryList: [],
      categoryInfosCol: [
        {
          title: '品类',
          dataIndex: 'dataValue',
          key: 'dataValue',
          align: 'left'
        },
        {
          title: '回收量',
          dataIndex: 'totalNum',
          key: 'totalNum',
          align: 'left'
        },
        {
          title: '回收金额',
          dataIndex: 'total',
          key: 'total'
        }
      ],
      columns,
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this),
      data: {
        page: {
          list: []
        }
      },
      tableList: [],
      paginationObj: {
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
  beforeRouteLeave (to, from, next) {
    if (to.name === 'recycleDetail') {
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
    this.getCategory()
  },
  methods: {
    getCategory () {
      category().then(res => {
        const result = res.result
        this.categoryList = result
      })
    },
    changeArea (areasId, options) {
      this.estateList = []
      this.areaNames = []

      if (areasId.length === 4) {
        this.getEstate(null, areasId[3])
      } else {
        this.getEstate(areasId)
      }
      if (options && options.length) {
        options.forEach(item => {
          this.areaNames.push(item.name)
        })
      }
    },
    getTableData () {
      const params = this.handleParams()
      this.loading = true
      this.categoryInfosLoading = true
      getSmartScalesList(params).then(res => {
        this.loading = false
        this.categoryInfosLoading = false
        this.data = res.result
      })
      this.getDeliveryScaleList()
    },
    getDeliveryScaleList () {
      const data = this.form.getFieldsValue()
      const startTime =
        (data.createTime &&
          data.createTime.length &&
          data.createTime[0].format('YYYY-MM-DD 00:00:00')) ||
        ''
      const endTime =
        (data.createTime &&
          data.createTime.length &&
          data.createTime[1].format('YYYY-MM-DD 23:59:59')) ||
        ''
      const params = {
        streetId: this.region[3] || '',
        productId: data.productId || '',
        cellPhone: data.phone || '',
        cardNum: data.cardNum || '',
        startTime,
        endTime,
        areas: this.transRegion(this.region),
        orderId: data.orderId || '',
        dictId: data.dictId || '',
        name: data.name || '',
        userName: data.userName || '',
        deliveryUser: data.deliveryUser || '',
        pageNo: this.paginationObj.current,
        pageSize: this.paginationObj.pageSize
      }
      getDeliveryScaleList(params).then(res => {
        this.tableList = res.result.list
        this.paginationObj.total = res.result.totalCount
      })
    },
    handleTableChange (pagination, filters, sorter) {
      this.paginationObj.pageSize = pagination.pageSize
      this.paginationObj.current = pagination.current
      this.getTableData()
    },
    toSearch () {
      this.paginationObj.current = 1
      this.getTableData()
    },
    resetForm () {
      this.form.resetFields()
      this.region = []
    },
    handleParams () {
      //     	"menuId": "",
      // "streetId": "",
      // "productId": "",
      // "cellPhone": "",
      // "cardNum": "",
      // "startTime": "",
      // "endTime": "",
      // "areas": "",
      // "orderId": "",
      // "dictId": ""

      /*
        dictId: ""
        endTime: ""
        page: 1
        pageSize: 10
        startTime: ""
        streetId: ""
      */
      const data = this.form.getFieldsValue()
      const startTime =
        (data.createTime &&
          data.createTime.length &&
          data.createTime[0].format('YYYY-MM-DD 00:00:00')) ||
        ''
      const endTime =
        (data.createTime &&
          data.createTime.length &&
          data.createTime[1].format('YYYY-MM-DD 23:59:59')) ||
        ''
      const params = {
        streetId: this.region[3] || '',
        productId: data.productId || '',
        cellPhone: data.phone || '',
        cardNum: data.cardNum || '',
        startTime,
        endTime,
        areas: this.transRegion(this.region),
        orderId: data.orderId || '',
        dictId: data.dictId || '',
        name: data.name || '',
        userName: data.userName || '',
        deliveryUser: data.deliveryUser || ''
      }
      return params
    },
    transRegion (region) {
      const data = JSON.parse(JSON.stringify(region))
      if (data.length === 4) {
        data.pop()
        return data.join(',')
      } else {
        return data.join(',')
      }
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
      const params = this.handleParams()
      if (params.startTime) {
        this.toExportExcel(
          '/product/exportDeliveryScale',
          params,
          '智能秤回收记录.xlsx'
        )
      } else {
        this.$message.error('请先选择日期再导出')
      }
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
        path: '/order/smartScales/view',
        query: { id: value.id, dataObj: JSON.stringify(value) }
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
.tip_table{
  width 95%
  margin 0 auto
}
.list_right .tip_table .ant-table-wrapper .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
  padding: 0 !important;
}
.list_right .ant-table-tbody > tr > td{
  border-bottom: 0px solid #e8e8e8 !important;
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
    .list_left
      width: 35%
      justify-content: center
      align-items: center
      display: flex
      flex-direction: column
      border-right: 1px solid #d6d6d6
    .list_right
      width: 65%;
      .tip_table .ant-table-wrapper .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
        padding: 0
      }
      .ant-table-tbody > tr > td{
        border-bottom: 0px solid #e8e8e8;
      }
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
      min-width: 350px
      display flex
      height 85px
      align-items center
      .item-r
        padding-top 20px
        line-height 16px
        margin-left 16px
        font-size 12px
        color #666666
        span,p:last-child
          font-size 22px
          color #000
          font-weight 600
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
