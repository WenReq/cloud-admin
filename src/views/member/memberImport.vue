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
                  show-search
                  placeholder="全部"
                  option-filter-prop="children"
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
            <a-col class="search-item" :span="6">
              <a-form-item
                label="姓名"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['userRealName']"
                  allow-clear
                  placeholder="请输入用户姓名"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
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
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="绑卡时间"
              >
                <a-range-picker v-decorator="['createTime']" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="12" align="right">
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
            已导入用户列表
          </div>
        </a-col>
        <a-col :span="12" align="right">
          <a-button class="mr8" @click="showMemberModal">
            单个添加
          </a-button>
          <a-button @click="importBatch">
            批量导入
          </a-button>
        </a-col>
      </a-row>
      <div class="card-content">
        <a-table
          class="table-content"
          :columns="columns"
          :data-source="list"
          :loading="loading"
          :pagination="pagination"
          :row-key="record => record.id"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <template slot="action" slot-scope="record" class="btn-list">
            <a-button
              class="table-btn-link"
              type="link"
              size="small"
              @click="linkDeatil(record, 1)"
            >
              查看
            </a-button>
            <a-button type="link" size="small" @click="linkDeatil(record, 2)">
              编辑
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <!-- 单独导入 -->
    <a-modal
      title="会员导入"
      :visible="orderVisible"
      class="step-modal"
      :mask-closable="false"
      @cancel="handleIsMemberVisible"
    >
      <a-form :form="orderForm" class="detail-form">
        <a-form-item
          label="适用地区"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            v-decorator="[
              'type',
              {
                rules: [{ required: true, message: '请选择适用地区' }],
                validateTrigger: 'change',
                initialValue: '0'
              }
            ]"
            placeholder="请选择适用地区"
            allow-clear
            show-search
            option-filter-prop="children"
            @change="handleType"
          >
            <a-select-option v-for="item in areaList" :key="item.value">
              {{ item.desc }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="姓名"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="[
              'houseHolder',
              {
                rules: [{ required: true, message: '请填写用户姓名' }],
                validateTrigger: 'change'
              }
            ]"
            :max-length="20"
            type="text"
            allow-clear
            placeholder="请填写用户姓名"
          />
        </a-form-item>
        <a-form-item
          label="手机号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="['houseHolderCellPhone', phomeConfig]"
            :max-length="20"
            type="text"
            allow-clear
            placeholder="请填写手机号"
          />
        </a-form-item>
        <a-form-item
          label="IC卡号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="['cardNum', icCardConfig]"
            style="width: 100%"
            allow-clear
            placeholder="请输入IC卡号"
          ></a-input>
        </a-form-item>
        <a-form-item
          label="区域"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-cascader
            v-decorator="[
              'memberRegion',
              {
                initialValue: ['', '', ''],
                rules: [{ required: true, message: '请选择省市区、街道' }],
                validateTrigger: 'change'
              }
            ]"
            allow-clear
            :options="options"
            :load-data="loadData"
            :field-names="{
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            placeholder="请选择省市区、街道"
            change-on-select
            @change="onMemberAreaChange"
          />
        </a-form-item>
        <a-form-item
          label="小区"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            v-decorator="[
              'estateId',
              {
                rules: [{ required: true, message: '请选择小区' }],
                validateTrigger: 'change'
              }
            ]"
            style="width: 100%"
            placeholder="请选择小区"
            show-search
            allow-clear
            :filter-option="filterOption"
            @dropdownVisibleChange="dropdownVisibleChange"
          >
            <a-select-option
              v-for="(item, index) in memberEstate"
              :key="index"
              :value="item.id"
            >
              {{ item.housingEstate }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="楼栋号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="[
              'buildingNumber',
              {
                rules: [{ required: true, message: '请填写楼栋号' }]
              }
            ]"
            :max-length="20"
            type="text"
            allow-clear
            placeholder="请填写楼栋号"
          />
        </a-form-item>
        <a-form-item
          label="单元号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="[
              'unit',
              {
                rules: [{ required: true, message: '请填写单元号' }]
              }
            ]"
            :max-length="20"
            type="text"
            allow-clear
            placeholder="请填写单元号"
          />
        </a-form-item>
        <a-form-item
          label="门牌号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="[
              'roomNum',
              {
                rules: [{ required: true, message: '请填写门牌号' }]
              }
            ]"
            :max-length="20"
            type="text"
            allow-clear
            placeholder="请填写门牌号"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button @click="() => (orderVisible = false)">
          取消
        </a-button>
        <a-button
          :loading="confirmLoading"
          type="primary"
          @click="handleMemberOk"
        >
          保存
        </a-button>
      </template>
    </a-modal>
    <!-- 批量导入 -->
    <a-modal
      class="step-modal"
      title="批量导入"
      centered
      width="55%"
      :visible="batchObj.visible"
      :mask-closable="false"
      @cancel="handleCancle"
    >
      <a-steps :current="step">
        <a-step title="上传文件" />
        <a-step title="导入完成" />
      </a-steps>
      <div v-if="step === 0" class="step-1">
        <a-row>
          <a-col :span="2">
            <div class="batch">
              <iconFont type="iconshangchuanyun" />
            </div>
          </a-col>
          <a-col :span="22" class="batch-container">
            <div class="batch-title">
              填写导入会员的信息
            </div>
            <div class="batch-tip">
              请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除
            </div>
            <a-button icon="download" class="batch-btn" @click="batchDownload">
              下载模板
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
              上传填好的会员信息表
            </div>
            <div class="batch-tip">
              上传后缀名必须为 xls 或 xlsx（即excel格式），文件 ≤ 10M
            </div>
            <a-upload
              name="file"
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload"
            >
              <a-button icon="upload" type="primary">
                上传文件
              </a-button>
            </a-upload>
          </a-col>
        </a-row>
      </div>
      <div v-if="step === 1" class="step-2">
        <a-result
          status="success"
          title="批量导入完成"
          :sub-title="errorMsg"
        />
        <div class="card-container">
          <div class="card-title">
            不可导入用户列表
          </div>
          <div class="card-content">
            <a-table
              class="table-content"
              :columns="columns_1"
              :data-source="errorList"
              :row-key="record => record.id"
              :pagination="false"
              :scroll="{ y: 200 }"
            >
              <template slot="remark" slot-scope="record">
                <div style="color:red">
                  {{ record.remark }}
                </div>
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <div slot="footer">
        <a-button v-if="step === 0" @click="handleCancle">
          取消
        </a-button>
        <a-button v-if="step === 1" @click="handleUploadSucccess">
          完成
        </a-button>
        <a-button
          v-if="step === 0" type="primary" :loading="uploading"
          @click="batchConfirm"
        >
          下一步
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  getArea,
  getEstate,
  iconFontComponent
} from '@/components/mixins/mixins'
import { estateList } from '@/api/common'
import { cardList, saveMember, importMemberList } from '@/api/member'
const columns = [
  {
    title: '区域',
    dataIndex: 'mergerName',
    key: 'mergerName',
    width: 160
  },
  {
    title: '小区',
    dataIndex: 'estateName',
    key: 'estateName'
  },
  {
    title: '姓名',
    dataIndex: 'userRealName',
    key: 'userRealName'
  },
  {
    title: '手机号',
    dataIndex: 'cellPhone',
    key: 'cellPhone'
  },
  {
    title: '楼栋号',
    dataIndex: 'buildingNumber',
    key: 'buildingNumber'
  },
  {
    title: '单元号',
    dataIndex: 'unitNumber',
    key: 'unitNumber'
  },
  {
    title: '门牌号',
    dataIndex: 'roomNum',
    key: 'roomNum'
  },
  {
    title: 'IC卡号',
    dataIndex: 'carNum',
    key: 'carNum'
  },
  {
    title: '绑卡时间',
    dataIndex: 'bindDate',
    key: 'bindDate'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime'
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

const columns_1 = [
  {
    title: '行号',
    width: '20',
    customRender: (text, record, index) => {
      text = index + 1
      return text
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '手机号',
    dataIndex: 'cellPhone',
    key: 'cellPhone'
  },
  {
    title: 'IC卡号',
    dataIndex: 'cardNum',
    key: 'cardNum'
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    key: 'address',
    with: 200
  },
  {
    title: '错误提示',
    key: 'remark',
    scopedSlots: { customRender: 'remark' }
  }
]

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
export default {
  mixins: [getArea, getEstate, iconFontComponent],
  data () {
    return {
      step: 0,
      province: '',
      city: '',
      area: '',
      currentOrderId: '',
      errorMsg: '',
      estate: undefined,
      fetching: false,
      loading: false,
      confirmLoading: false,
      cancelLoading: false,
      orderVisible: false,
      uploading: false,
      region: [],
      memberRegion: [],
      memberEstate: [],
      areaLabel: [],
      list: [],
      errorList: [],
      IC: [],
      fileList: [],
      columns,
      columns_1,
      formItemLayout,
      icCardConfig: {
        rules: []
      },
      phomeConfig: {
        rules: [
          { required: true, message: '请填写手机号' },
          { validator: this.validatePhoneNum }
        ]
      },
      areaList: [
        { desc: '大陆', value: '0' },
        { desc: '港澳台', value: '1' }
      ],
      batchObj: {
        visible: false
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
      form: this.$form.createForm(this, { name: 'filter_from' }),
      orderForm: this.$form.createForm(this, { name: 'order_from' })
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'detail') {
      next(vm => {
        vm.load()
      })
    } else {
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'detail') {
      from.meta.keepAlive = true
      next()
    } else {
      from.meta.keepAlive = false
      next()
    }
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.initData()
      this.getArea('', 2, null, true)
      this.getEstate()
      this.getCardList()
      this.getMemberList()
    },
    handleType (value) {
      this.icCardConfig.rules = []
      this.orderForm.resetFields('cardNum')
      this.orderForm.resetFields('houseHolderCellPhone')
      if (value === '1') {
        this.icCardConfig.rules[0] = {
          required: true,
          message: '请输入IC卡号'
        }
        this.phomeConfig.rules[0].required = false
      } else {
        this.phomeConfig.rules[0].required = true
      }
    },
    getMemberList () {
      const data = this.form.getFieldsValue()
      const params = {
        menuId: '56b1028d31a743b3988339fc395647f1',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        queryParams: {
          provinceName: this.areaLabel[0] || '',
          cityName: this.areaLabel[1] || '',
          countyName: this.areaLabel[2] || '',
          estateId: data.estateId || '',
          iccard: data.iccard || '',
          userRealName: data.userRealName || '',
          cellPhone: data.cellPhone || '',
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
      this.loading = true
      importMemberList(params).then(res => {
        this.loading = false
        const result = res.result
        this.list = result.data
        this.pagination.total = result.totalCount
      })
    },
    getCardList () {
      cardList().then(res => {
        this.IC = res.result
      })
    },
    getEstateList (data) {
      estateList(data).then(res => {
        const result = res.result
        this.memberEstate = result
      })
    },
    toSearch (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.pagination.current = 1
          this.getMemberList()
        }
      })
    },
    resetForm () {
      this.region = []
      this.areaLabel = []
      this.form.resetFields()
    },
    initData () {
      if (this.region.length !== 0 && this.areaLabel.length !== 0) {
        if (this.areaLabel[0]) {
          queryObj.province = this.areaLabel[0]
        }
        if (this.areaLabel[1]) {
          queryObj.city = this.areaLabel[1]
        }
        if (this.areaLabel[2]) {
          queryObj.area = this.areaLabel[2]
        }
      }
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getMemberList()
    },
    handleIsMemberVisible () {
      this.orderForm.resetFields()
      this.icCardConfig.rules = []
      this.confirmLoading = false
      this.orderVisible = !this.orderVisible
    },
    // 录入会员
    showMemberModal () {
      this.handleIsMemberVisible()
    },
    // 录入会员确认
    handleMemberOk () {
      const {
        orderForm: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          if (!params.houseHolderCellPhone) {
            params.houseHolderCellPhone = params.cardNum
          }
          params.province = this.province
          params.city = this.city
          params.area = this.area
          params.menuId = 'f0378a5aee764f1e959966b79eb4a3f9'
          delete params.memberRegion
          saveMember(params)
            .then(res => {
              this.handleIsMemberVisible()
              this.confirmLoading = false
              this.$message.success('录入成功')
              this.resetForm()
              this.orderForm.resetFields()
              this.getCardList()
              this.getMemberList()
            })
            .catch(err => {
              console.log(err)
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    dropdownVisibleChange () {
      const memberRegion = this.orderForm.getFieldValue('memberRegion')
      if (!memberRegion[0]) {
        this.$message.error('抱歉请先选择区域')
      }
    },
    linkDetail (item) {
      this.$router.replace({
        path: '/order/takeBack/reserveDetail',
        query: {
          id: item.id
        }
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
      this.estate = undefined
      if (value.length < 4) {
        this.getEstate(value)
      } else if (value.length === 4) {
        this.getEstate(null, value[3])
      }
    },
    onMemberAreaChange (value, obj) {
      if (value.length) {
        this.province = obj[0] ? obj[0].name : ''
        this.city = obj[1] ? obj[1].name : ''
        this.area = obj[2] ? obj[2].name : ''
        const params = {
          areaIds: value.join(',')
        }
        value.length === 4 &&
          Object.assign(params, {
            street: value[3]
          })
        this.getEstateList(params)
        this.orderForm.setFields({
          estateId: '',
          errors: null
        })
      }
    },
    importBatch () {
      this.batchObj.visible = true
      this.fileList = []
    },
    batchDownload () {
      window.open('http://h5.mymrmao.com/hould.xls')
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      const isLt3M = file.size / 1024 / 1024 < 3
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isExcel =
        file.name.split('.')[file.name.split('.').length - 1] === 'xlsx' ||
        file.name.split('.')[file.name.split('.').length - 1] === 'xls'
      if (isText || isTextComputer || isExcel) {
        if (!isLt3M) {
          this.$message.error('上传文件大小不能超过 3MB!')
          return false
        }
      } else {
        this.$message.error('请选择Excel文件上传!')
        return false
      }
      this.fileList = [file]
      return false
    },
    batchConfirm () {
      const { fileList } = this
      if (fileList.length <= 0) {
        this.$message.error('请选择文件再上传!')
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
      this.$httpPost('/hold/importHold', formData, config)
        .then(res => {
          const { msg, result } = res
          this.uploading = false
          this.step = 1
          this.errorMsg = msg
          this.errorList = result
        })
        .catch(() => {
          this.uploading = false
        })
    },
    linkDeatil (value, type = 1) {
      const title = type === 2 ? '编辑' : '查看'
      this.$router.push({
        path: '/member/memberImport/detail',
        query: { id: value.id, title }
      })
    },
    validatePhoneNum (rule, value, callback) {
      const reg = /^[1][3-9][0-9]{9}$/
      if (
        value &&
        !reg.test(value) &&
        this.orderForm.getFieldValue('type') === '0'
      ) {
        callback(new Error('请填写正确的联系电话'))
      } else {
        callback()
      }
    },
    handleCancle () {
      this.fileList = []
      this.step = 0
      this.batchObj.visible = false
    },
    handleUploadSucccess () {
      this.handleCancle()
      this.getMemberList()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>
<style lang="stylus">
.step-modal
  .ant-modal-body
    padding-bottom 0
  .ant-modal-footer
    padding 24px 0
    text-align center
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
.step-1
  margin-top 30px
  .anticon
    font-size 60px
    color #ccc
</style>
