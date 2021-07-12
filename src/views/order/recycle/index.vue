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
              <a-form-item label="小区" v-bind="formItemLayout">
                <a-select
                  v-decorator="['estateId']"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="(item, index) in estateList"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.housingEstate }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item v-bind="formItemLayout" label="回收时间">
                <a-range-picker
                  v-decorator="['createTime', rangeConfig]"
                  @change="handleLimitTime"
                />
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
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item label="姓名" v-bind="formItemLayout">
                <a-input
                  v-decorator="['userName']"
                  allow-clear
                  placeholder="请输入用户姓名"
                />
              </a-form-item>
            </a-col>
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
              <a-form-item label="回收人员" v-bind="formItemLayout">
                <a-input
                  v-decorator="['recycleUser']"
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
                可回收垃圾回收总量
              </p>
              <p v-if="data.recycleGarbage">
                {{ data.recycleGarbage }} kg
              </p>
              <p v-else>
                0 kg
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
                废旧电子电器回收总量
              </p>
              <p v-if="data.electronGarbage">
                {{ data.electronGarbage }} 个
              </p>
              <p v-else>
                0 个
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
                <span v-if="data.allAmount"> {{ data.allAmount }} 元 </span>
                <span v-else>
                  0 元
                </span>
                <span style="margin:0 5px;"></span>
                <span v-if="data.allEnvironment">
                  {{ data.allEnvironment }} 积分
                </span>
                <span v-else>
                  0 积分
                </span>
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="data.categoryInfos && data.categoryInfos.length"
          :loading="categoryInfosLoading"
          class="list_right"
        >
          <div class="tip_table">
            <a-table
              class="table-content-right"
              :columns="categoryInfosCol"
              :data-source="data.categoryInfos"
              :scroll="{ y: 300 }"
              :row-key="record => record.recycleCategory"
              :pagination="false"
            >
              <span
                slot="recycleWeight" slot-scope="text, record"
              >{{ text || 0 }}&nbsp;{{ record.unit }}</span>
              <span
                slot="recycleAmount" slot-scope="text, record"
              >{{ text || 0 }} 元 <span><a-divider type="vertical" /></span>
                {{ record.environment || 0 }} 积分</span>
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
            <a-button v-action:importbtn class="mr8" @click="importBatch">
              {{ $t('memberImport.4') }}
            </a-button>
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
          :data-source="data.page.list"
          :loading="loading"
          :pagination="pagination"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <template v-if="text" slot="amount" slot-scope="text, record">
            <span
              v-if="record.payType === 1"
            >{{ record.environment }} 积分</span>
            <span v-else>{{ text }} 元</span>
          </template>
          <template slot="operate" slot-scope="text">
            <a-button type="link" size="small" @click="view(text)">
              查看
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <!-- 批量导入 -->
    <a-modal
      :title="$t('memberImport.4')"
      centered
      :visible="batchObj.visible"
      :mask-closable="false"
      @cancel="batchObj.visible = false"
    >
      <a-row>
        <a-col :span="2">
          <div class="batch">
            <iconFont type="iconshangchuanyun" />
          </div>
        </a-col>
        <a-col :span="22" class="batch-container">
          <div class="batch-title">
            {{ $t('memberImport.33') }}
          </div>
          <div class="batch-tip">
            {{ $t('memberImport.18') }}
          </div>
          <a-button icon="download" class="batch-btn" @click="batchDownload">
            {{ $t('memberImport.19') }}
          </a-button>
        </a-col>
      </a-row>
      <a-row style="margin-top: 40px;">
        <a-col :span="2">
          <div class="batch">
            <iconFont type="icontianxie" />
          </div>
        </a-col>
        <a-col :span="22" class="batch-container">
          <div class="batch-title">
            {{ $t('memberImport.34') }}
          </div>
          <div class="batch-tip">
            {{ $t('memberImport.21') }}
          </div>
          <a-upload
            name="file"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <a-button icon="upload" type="primary">
              {{ $t('memberImport.22') }}
            </a-button>
          </a-upload>
        </a-col>
      </a-row>
      <div slot="footer">
        <a-button @click="batchObj.visible = false">
          取消
        </a-button>
        <a-button type="primary" :loading="uploading" @click="batchConfirm">
          确定
        </a-button>
      </div>
    </a-modal>
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
import { getRecycleList } from '@/api/order'

const columns = [
  {
    title: '订单号',
    dataIndex: 'orderId'
  },
  {
    title: '区域',
    dataIndex: 'address'
  },
  {
    title: '小区',
    dataIndex: 'estateName'
  },
  {
    title: '用户姓名',
    dataIndex: 'userName'
  },
  {
    title: '用户手机号',
    dataIndex: 'cellPhone'
  },
  {
    title: '用户IC卡号',
    dataIndex: 'cardNum'
  },
  {
    title: '回收总额',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' }
  },
  {
    title: '回收人员',
    dataIndex: 'recycleUser'
  },
  {
    title: '回收时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作',
    key: 'operate',
    width: 150,
    fixed: 'right',
    scopedSlots: { customRender: 'operate' }
  }
]

export default {
  components: {},
  mixins: [getArea, getEstate, toExportExcel, iconFontComponent],
  data () {
    return {
      batchObj: {
        visible: false
      },
      fileList: [],
      uploading: false,
      loading: false,
      categoryInfosLoading: false,
      exportDate: '',
      region: [],
      areaNames: [],
      rangeConfig: {
        initialValue: [moment(), moment()],
        rules: [{ type: 'array' }]
      },
      categoryInfosCol: [
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
          title: '回收金额',
          dataIndex: 'recycleAmount',
          key: 'recycleAmount',
          scopedSlots: { customRender: 'recycleAmount' },
          align: 'left'
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
  },
  methods: {
    batchDownload () {
      window.open('https://cloud.mymrmao.com/recyclerecord.xlsx')
    },
    importBatch () {
      this.batchObj.visible = true
      this.fileList = []
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isExcel =
        file.name.split('.')[file.name.split('.').length - 1] === 'xlsx' ||
        file.name.split('.')[file.name.split('.').length - 1] === 'xls'
      if (isText || isTextComputer || isExcel) {
        if (!isLt10M) {
          this.$message.error(this.$t('memberImport.28'))
          return false
        }
      } else {
        this.$message.error(this.$t('memberImport.29'))
        return false
      }
      this.fileList = [file]
      return false
    },
    batchConfirm () {
      const { fileList } = this
      if (fileList.length <= 0) {
        this.$message.error(this.$t('memberImport.30'))
        return false
      }
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      this.uploading = true
      var config = {
        headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' }
      }
      this.$httpPost('/pointRecycle/importRecycleOrder', formData, config)
        .then(res => {
          this.uploading = false
          this.batchObj.visible = false
          this.toSearch()
          this.$message.success(res.msg)
        })
        .catch(() => {
          this.uploading = false
        })
    },
    changeArea (areasId, options) {
      this.estateList = []
      this.areaNames = []
      this.form.setFieldsValue({ estateId: '' })

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
      getRecycleList(params).then(res => {
        this.loading = false
        this.categoryInfosLoading = false
        this.data = res.result
        this.recycleAllList = res.result.categoryInfos
        this.pagination.total = res.result.page.total
      })
    },
    transList (list, flag) {
      const newArr = []
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        if (flag === 'recycleCategory') {
          newArr.push(element[flag])
        } else if (flag === 'recycleWeight') {
          newArr.push(element[flag] + ' ' + element.unit)
        } else if (flag === 'recycleAmount') {
          const amount = element[flag] ? element[flag] + ' 元' : '0 元'
          const environment = element.environment
            ? element['environment'] + ' 积分'
            : '0 积分'
          const obj = { amount: amount, environment: environment }
          newArr.push(obj)
        }
      }
      return newArr
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
      this.region = []
    },
    handleParams () {
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
        startTime,
        endTime,
        orderId: data.orderId,
        phone: data.phone,
        recycleUser: data.recycleUser,
        userName: data.userName,
        cardNum: data.cardNum,
        province: this.areaNames[0] || '',
        city: this.areaNames[1] || '',
        country: this.areaNames[2] || '',
        streetId: this.region[3] || '',
        estateId: data.estateId || '',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      return params
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
          '/pointRecycle/exportRecycleList',
          params,
          '定点回收记录.xlsx'
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
        path: '/order/recycle/recycleDetail',
        query: { id: value.id, payType: value.payType }
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
.batch
  text-align center
  color #cdcdcd
  margin-top 10px
  i
    font-size 30px
.batch-container
  padding-left 15px
  .batch-title
    font-size 14px
    color #333333
    font-weight 600
  .batch-tip
    font-size 12px
    color #666666
    margin 16px 0
  .batch-btn
    color #333333
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
      min-width: 400px
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
