<template>
  <div class="memberList">
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
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-cascader
                  v-model="region"
                  :options="options"
                  :load-data="loadData"
                  :field-names="{
                    label: 'name',
                    value: 'id',
                    children: 'children'
                  }"
                  placeholder="省市区"
                  change-on-select
                  @change="onAreaChange"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="小区"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
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
              <a-form-item
                label="手机号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['cellPhone']"
                  allow-clear
                  placeholder="请输入手机号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="IC卡号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['iccard']"
                  allow-clear
                  placeholder="请输入IC卡号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="是否办卡"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-decorator="['isflag']"
                  placeholder="全部"
                  class="w100"
                  allow-clear
                  show-search
                  option-filter-prop="children"
                >
                  <a-select-option :value="1">
                    是
                  </a-select-option>
                  <a-select-option :value="2">
                    否
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="会员状态"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-decorator="['lock']"
                  placeholder="请选择会员状态"
                  class="w100"
                  allow-clear
                  show-search
                  option-filter-prop="children"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option value="0">
                    启用
                  </a-select-option>
                  <a-select-option value="1">
                    禁用
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="注册来源"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-decorator="['client']"
                  placeholder="请选择注册来源"
                  class="w100"
                  allow-clear
                  show-search
                  option-filter-prop="children"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option value="0">
                    APP注册
                  </a-select-option>
                  <a-select-option value="1">
                    IC开卡
                  </a-select-option>
                  <a-select-option value="2">
                    设备
                  </a-select-option>
                  <a-select-option value="3">
                    小程序
                  </a-select-option>
                  <a-select-option value="4">
                    数据导入
                  </a-select-option>
                  <a-select-option value="5">
                    客服录入
                  </a-select-option>
                  <a-select-option value="6">
                    小哥录入
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="注册时间"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-range-picker v-decorator="['createTime']" class="w100" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="姓名"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['userRealName']"
                  allow-clear
                  placeholder="请输入姓名"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="昵称"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['userName']"
                  allow-clear
                  placeholder="请输入昵称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="24" align="right">
              <a-button type="primary" class="mr8" @click="toSearch">
                查询
              </a-button>
              <a-button @click="resetTable">
                重置
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <div class="bottomContent">
      <div class="mb20">
        <a-row>
          <a-col :span="12" class="title">
            用户列表
          </a-col>
          <a-col :span="12" align="right">
            <a-button :loading="exportLoading" @click="toExport">
              导出
            </a-button>
          </a-col>
        </a-row>
      </div>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :row-key="record => record.id"
        :loading="loading"
        class="table-content"
        @change="handleTableChange"
      >
        <template slot="isLock" slot-scope="text">
          <a-switch
            :key="'sw' + text.id"
            size="small"
            checked-children="启用"
            un-checked-children="禁用"
            :checked="!!!text.isLock"
            @change="handleSwitch(text)"
          />
        </template>
        <template slot="operate" slot-scope="text">
          <a-button type="link" size="small" @click="view(text)">
            查看
          </a-button>
          <a-button type="link" size="small" @click="edit(text)">
            编辑
          </a-button>
          <a-button type="link" size="small" @click="linkDispose(text)">
            差额处置
          </a-button>
        </template>
      </a-table>
    </div>
    <a-modal
      width="420px"
      centered
      :closable="false"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleDisableUser"
      @cancel="handleCancelDisable"
    >
      <div class="ant-modal-confirm-body">
        <a-icon class="model-icon" type="question-circle" />
        <span
          class="ant-modal-confirm-title"
        >是否确定{{ isLock ? "禁用" : "启用" }}此账号</span>
      </div>
      <a-form class="modal-form" :form="disableForm">
        <a-form-item>
          <a-textarea
            v-decorator="[
              'remark',
              { rules: [{ required: true, message: '请输入禁用原因' }] }
            ]"
            placeholder="请输入禁用/启用原因（必填）"
            rows="3"
            :max-length="50"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import {
  toExportExcel,
  getArea,
  getEstate
} from '@/components/mixins/mixins.js'
import { getMemberList, changeLock } from '@/api/member'
const columns = [
  {
    title: '手机号',
    key: 'cellPhone',
    dataIndex: 'cellPhone',
    scopedSlots: { customRender: 'cellPhone' }
  },
  {
    title: '姓名',
    key: 'userRealName',
    dataIndex: 'userRealName'
  },
  {
    title: '昵称',
    key: 'userName',
    dataIndex: 'userName'
  },
  {
    title: 'IC卡号',
    key: 'carNum',
    dataIndex: 'carNum'
  },
  {
    title: '注册来源',
    key: 'originName',
    dataIndex: 'originName'
  },
  {
    title: '注册时间',
    key: 'createTime',
    dataIndex: 'createTime'
  },
  {
    title: '绑卡时间',
    key: 'bindDate',
    dataIndex: 'bindDate'
  },
  {
    title: '小区',
    key: 'estateName',
    dataIndex: 'estateName'
  },
  {
    title: '可用余额',
    key: 'catCoin',
    dataIndex: 'catCoin'
  },
  {
    title: '可用环保值',
    key: 'balanceEnviron',
    dataIndex: 'balanceEnviron'
  },
  {
    title: '累计环保值',
    key: 'environmental',
    dataIndex: 'environmental'
  },
  {
    title: '会员状态',
    key: 'isLock',
    scopedSlots: { customRender: 'isLock' }
  },
  {
    title: '操作',
    key: 'operate',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'operate' }
  }
]
export default {
  name: 'MemberList',
  filters: {
    isLockFilter: function (value) {
      switch (value) {
        case 0:
          return '启用'
        case 1:
          return '禁用'
        default:
          return '字段值异常，请检查后台数据'
      }
    }
  },
  mixins: [toExportExcel, getArea, getEstate],
  data () {
    return {
      loading: false,
      visible: false,
      confirmLoading: false,
      isLock: 0,
      currentId: '',
      areaLabel: [],
      estateList: [],
      options: [],
      tableData: [],
      region: [],
      columns,
      form: this.$form.createForm(this, { name: 'filter_from' }),
      disableForm: this.$form.createForm(this, { name: 'disableForm' }),
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
  beforeRouteEnter (to, from, next) {
    if (from.name === 'memberDetails') {
      next(vm => {
        vm.load()
      })
    } else {
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'memberDetails' || to.name === 'diffDispose') {
      from.meta.keepAlive = true
      next()
    } else {
      from.meta.keepAlive = false
      next()
    }
  },
  created: function () {
    this.load()
  },
  methods: {
    load () {
      this.getArea('', 2, null, true)
      this.getEstate()
      this.toSearch()
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    moment,
    getTableData () {
      const params = this.handleParams()
      this.loading = true
      getMemberList(params).then(res => {
        this.loading = false
        this.tableData = res.result.data
        this.pagination.total = res.result.totalCount
      })
    },
    onAreaChange (value, obj) {
      const newArr = []
      if (obj) {
        obj.forEach(item => {
          newArr.push(item.name)
        })
        this.areaLabel = newArr
      }
      this.estateList = []
      if (value.length < 4) {
        this.getEstate(value)
      } else if (value.length === 4) {
        this.getEstate(null, value[3])
      }
    },
    handleSwitch (item) {
      this.currentId = item.id
      this.isLock = item.isLock ? 0 : 1
      this.visible = true
    },
    handleDisableUser () {
      const {
        disableForm: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = {
            menuId: 'ebbc63858dc5402296fb2500246db65a',
            id: this.currentId,
            isLock: this.isLock,
            ...values
          }
          changeLock(params).then(res => {
            this.confirmLoading = false
            this.handleCancelDisable()
            this.getTableData()
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancelDisable () {
      this.visible = false
      this.disableForm.resetFields()
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    handleParams () {
      const data = this.form.getFieldsValue()
      const result = {
        menuId: '017da839b6454aa78414d3441c0a0335',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        queryParams: {
          ...data,
          province: this.areaLabel[0] || '',
          city: this.areaLabel[1] || '',
          area: this.areaLabel[2] || '',
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
      }
      delete result.queryParams.createTime
      return result
    },
    toSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    resetTable () {
      this.region = []
      this.areaLabel = []
      this.form.resetFields()
    },
    toExport () {
      const params = this.handleParams()
      params.menuId = '4c6c25dd77ec4d01bfb96844535f4b3c'
      this.toExportExcel('/memberUser/exportUser', params, '会员数据.xlsx')
    },
    view (value) {
      this.$router.push({
        path: '/member/memberList/memberDetails',
        query: { id: value.id, title: '查看' }
      })
    },
    edit (value) {
      this.$router.push({
        path: '/member/memberList/memberDetails',
        query: { id: value.id, title: '编辑' }
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    linkDispose (value) {
      this.$router.push({
        path: '/member/memberList/diffDispose',
        query: { id: value.id }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.model-icon
  font-size 22px
  color #faad14
.modal-form
  margin-top 20px
.memberList
  .w100
    width 100%
  .mr8
    margin-right 8px
  .bottomContent
    background-color #fff
    padding 16px 20px
    .mb20
      margin-bottom 20px
    .commonStyle
      width: 38px
      height: 18px
      line-height: 18px
      text-align: center
      border-radius: 2px
      color: #fff
      font-weight 400
      font-size: 12px
    .firstColor
      background-color #8f96b3
    .secondColor
      background-color #57c22d
  .title
    color #333
    font-weight 600
    font-size 16px
</style>
<style lang="stylus">
.model-btn
  width 100%
  text-align center
.memberList
  .ant-btn-sm
    padding-left 0
    padding-right 10px
</style>
