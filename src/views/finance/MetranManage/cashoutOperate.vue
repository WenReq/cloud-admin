<template>
  <div>
    <div class="card-container memberDetails">
      <a-form ref="detailForm" class="detail-form">
        <div class="card-title">
          基础信息
        </div>
        <div class="card-content">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="提现订单号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="detail.orderNo"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="提现审核状态"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="detail.payStateName"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="会员昵称"
                v-bind="formItemLayout"
              >
                <a-input
                  disabled
                >
                  <a-button
                    slot="prefix" style="padding: 0;" type="link"
                    @click="viewMember"
                  >
                    {{ detail.userName }}
                  </a-button>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="手机号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="detail.cellPhone"
                  disabled
                >
                  <a-button
                    v-if="detail.cellPhone != cellPhone" slot="suffix" type="link"
                    @click="showCompleteMobile"
                  >
                    完整展示
                  </a-button>
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="提现金额（元）"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="detail.amount"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="服务费（元）"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="detail.serviceFee"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="申请提现时间"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="detail.createTime"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="申请到账账号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="detail.acountM"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="detail.payState == '2' || detail.payState == '3'">
            <a-col :span="12">
              <a-form-item
                label="申请到账渠道"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="detail.channel"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div v-if="isRecord">
          <div class="card-title">
            审核记录
          </div>
          <div class="card-content">
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="审核时间"
                  v-bind="formItemLayout"
                >
                  <a-input
                    v-model="detail.updateTime"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="审核人"
                  v-bind="formItemLayout"
                >
                  <a-input
                    v-model="detail.operator"
                    disabled
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="备注"
                  v-bind="formItemLayout"
                >
                  <a-input
                    v-model="detail.remark"
                    disabled
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-form>
      <div class="commonTitle">
        用户行为
      </div>
      <a-tabs default-active-key="1" class="mt16" @change="callback">
        <a-tab-pane
          v-for="item in tabsTitle" :key="item.value"
          :tab="item.title"
        >
          <a-table
            :columns="columns"
            :data-source="tableData"
            :pagination="pagination"
            :row-key="record => record.id"
            :loading="loading"
            class="table-content"
            @change="handleTableChange"
          >
            <template slot="allSuccess">
              成功
            </template>
            <template slot="type" slot-scope="type">
              <span>{{ type == 0?"设备":"" }}</span>
              <span>{{ type == 1?"APP预约":"" }}</span>
              <span>{{ type == 2?"客服录入":"" }}</span>
            </template>
            <template slot="state" slot-scope="state">
              <span>{{ state == 0?"待接单":"" }}</span>
              <span>{{ state == 1?"待回收":"" }}</span>
              <span>{{ state == 2?"已完成":"" }}</span>
              <span>{{ state == 3?"已取消":"" }}</span>
              <span>{{ state == 4?"已失效":"" }}</span>
            </template>
            <template slot="recycleoverTime" slot-scope="text, record">
              {{ record.recycleTime }}~{{ record.overTime }}
            </template>
            <template slot="exchangeType" slot-scope="text">
              <span>{{ text == 1?"商城":"" }}</span>
              <span>{{ text == 6?"实体店铺":"" }}</span>
              <span>{{ text == 7?"吐袋机":"" }}</span>
            </template>
            <template slot="deliveryPhotos" slot-scope="text">
              <viewer :images="text">
                <span v-for="(i, j) in text" :key="j">
                  <img
                    v-show="j==0" :src="i"
                    height="40" class="pd5"
                  >
                </span>
              </viewer>
            </template>
            <template slot="payType" slot-scope="payType">
              <span>{{ payType == 1?"支付宝":"" }}</span>
              <span>{{ payType == 2?"微信":"" }}</span>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
      <div class="card-content mb40 mt40">
        <a-row>
          <a-col
            :span="24" type="flex" align="middle"
            style="text-align:center;"
          >
            <a-button class="mr8" :type="isApply?'':'primary'" @click="back">
              返回
            </a-button>
            <a-button
              v-if="isApply && refuse" class="mr8"
              @click="refuseApply"
            >
              拒绝申请
            </a-button>
            <a-button
              v-if="isApply" type="primary"
              @click="applyPass"
            >
              审核通过
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
    <comfirmModal
      :dialog-obj="dialogObj" :is-btnok="dialogObj.isBtnok" :ok-loading="auditLoading"
      @handleOk="handleOk"
    >
      <a-form :form="dialogObj.form">
        <a-form-item class="comfirm-formitem">
          <a-textarea
            v-decorator="['remark', {rules: [{required: true, message: '请输入审核意见'}]}]"
            placeholder="请输入审核意见（必填）"
            :autosize="{ minRows: 4, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </comfirmModal>
    <a-modal
      v-model="memberInfoVisible" title="" width="90%"
      @ok="handleOk"
    >
      <template slot="footer">
        <a-button key="back" @click="memberInfoVisible = false">
          取消
        </a-button>
      </template>
      <div class="memberDetails">
        <div class="commonTitle">
          基础信息
        </div>
        <a-row :gutter="16" class="basicInfo">
          <a-col :span="4" align="center" class="leftMember">
            <div class="memberImg">
              <a-avatar :size="64" :src="avatarPath" icon="user" />
            </div>
            <div class="memberLines">
              <a-row>
                <a-col :span="12" align="right">
                  可用余额：
                </a-col>
                <a-col :span="12" align="left">
                  &nbsp;&nbsp;&nbsp;&nbsp;{{ availableBalance }} 元
                </a-col>
              </a-row>
            </div>
            <div class="memberLines">
              <a-row>
                <a-col :span="12" align="right">
                  可用环保值：
                </a-col>
                <a-col :span="12" align="left">
                  &nbsp;&nbsp;&nbsp;&nbsp;{{ availableEnv }}
                </a-col>
              </a-row>
            </div>
            <div class="memberLines">
              <a-row>
                <a-col :span="12" align="right">
                  环保值排行：
                </a-col>
                <a-col :span="12" align="left">
                  &nbsp;&nbsp;&nbsp;&nbsp;{{ rankEnv>100?'未上榜':rankEnv+' 名' }}
                </a-col>
              </a-row>
            </div>
            <div class="memberLines">
              <a-row>
                <a-col :span="12" align="right">
                  累计环保值：
                </a-col>
                <a-col :span="12" align="left">
                  &nbsp;&nbsp;&nbsp;&nbsp;{{ envTotal }}
                </a-col>
              </a-row>
            </div>
          </a-col>
          <a-col :span="10" class="commonCol">
            <a-row
              v-for="(item, index) in middleInfos" :key="index" :gutter="8"
              class="commonHeight"
            >
              <a-col :span="6" align="right">
                {{ index|titleFilter }}:
              </a-col>
              <a-col :span="18">
                <div v-if="mainTitle==='编辑'&&index==='memberStatus'" class="statusLine">
                  <a-radio-group v-model="editStatus" :options="statusOptions" />
                </div>
                <div v-else class="commonLine">
                  {{ item }}
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10" class="commonCol">
            <a-row
              v-for="(item, index) in rightInfos" :key="index"
              :gutter="8" class="commonHeight"
            >
              <a-col :span="6" align="right">
                {{ index|titFilter }}:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ item }}
                  <span v-if="index==='phoneNum'&&showpn" class="showComplete" @click="showAllPhoneNum()">完整展示</span>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <div class="commonTitle">
          身份地址
        </div>
        <a-row :gutter="16">
          <a-col :span="8" class="commonCol">
            <a-row :gutter="8" class="commonHeight">
              <a-col :span="6" align="right">
                真实姓名:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ trueName }}
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="8" class="commonHeight">
              <a-col :span="6" align="right">
                年龄:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ age }}
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8" class="commonCol">
            <a-row :gutter="8" class="commonHeight">
              <a-col :span="6" align="right">
                身份证号:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ identityNum }}
                  <span v-if="showin&&identityNum" class="showComplete" @click="showAllIdentityNum()">完整展示</span>
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="8" class="commonHeight">
              <a-col :span="6" align="right">
                职业:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ occupation }}
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8" class="commonCol">
            <a-row :gutter="8" class="commonHeight">
              <a-col :span="6" align="right">
                性别:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ sex }}
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="8" class="commonHeight">
              <a-col :span="6" align="right">
                小区:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ estate }}
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="addressHeight">
          <a-col :span="2" align="right">
            详细地址:
          </a-col>
          <a-col :span="10">
            <div class="addressCol">
              {{ detailAddress }}
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getMemberInfo, getDelivery, getWithdraw, getExchange, getEnvironmental, getBalance, getFindOrder, getRecharge, getDeposit } from '@/api/member'
import comfirmModal from '@/components/commonModal/comfirmModal.vue'
export default {
  components: { comfirmModal },
  filters: {
    titleFilter: function (value) {
      switch (value) {
        case 'nickname':
          return '昵称'
        case 'registerSource':
          return '注册来源'
        case 'bindTime':
          return '绑卡时间'
        case 'memberStatus':
          return '会员状态'
        default:
          return '字段值异常，请检查后台数据'
      }
    },
    titFilter: function (value) {
      switch (value) {
        case 'phoneNum':
          return '手机号'
        case 'registerTime':
          return '会员注册时间'
        case 'ICCardNum':
          return 'IC卡号'
        case 'lateTime':
          return '最近登录时间'
        default:
          return '字段值异常，请检查后台数据'
      }
    }
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      detail: {},
      dialogObj: {
        isBtnok: true,
        visible: false,
        iconType: 'question-circle',
        title: '',
        form: this.$form.createForm(this, { name: 'cash' })
      },
      cellPhone: '',
      isRecord: false,
      auditLoading: false,
      availableBalance: '',
      availableEnv: '',
      rankEnv: '',
      envTotal: '',
      middleInfos: {
        nickname: '',
        registerSource: '',
        bindTime: '',
        memberStatus: ''
      },
      rightInfos: {
        phoneNum: '',
        registerTime: '',
        ICCardNum: '',
        lateTime: ''
      },
      trueNum: '',
      trueName: '',
      age: '',
      identityNum: '',
      trueIdentityNum: '',
      occupation: '',
      sex: '',
      estate: '',
      detailAddress: '',
      showpn: true,
      showin: true,
      tabsTitle: [
        {
          title: '投递记录',
          value: '1'
        },
        {
          title: '取币记录',
          value: '2'
        },
        {
          title: '兑换记录',
          value: '3'
        },
        {
          title: '环保值记录',
          value: '4'
        },
        {
          title: '余额记录',
          value: '5'
        },
        {
          title: '预约回收记录',
          value: '6'
        },
        {
          title: '充值记录',
          value: '7'
        },
        {
          title: '提现记录',
          value: '8'
        }
      ],
      columns: [],
      tableData: [],
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
      },
      mainTitle: '',
      statusOptions: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 }
      ],
      editStatus: '',
      mId: '',
      currentKey: '',
      confirmLoading: false,
      avatarPath: '',
      memberInfoVisible: false
    }
  },
  computed: {
    isApply () {
      if (this.$route.name === 'cashoutApplyView') {
        return false
      } else {
        return true
      }
    },
    refuse () {
      return !this.$route.query.refuse
    }
  },
  mounted () {
    this.isRecord = this.$route.query.isRecord
    this.mId = JSON.parse(this.$route.query.info).userId
    this.getDetail()
    this.callback('1')
  },
  methods: {
    getDetail () {
      var detail = JSON.parse(this.$route.query.info)
      detail.acountM = detail.moblie + '（' + detail.channel + '）'
      if (detail.payState === '1') detail.payStateName = '待审核'
      if (detail.payState === '2') detail.payStateName = '已审核'
      if (detail.payState === '3') detail.payStateName = '已拒绝'
      if (detail.payState === '4') detail.payStateName = '打款失败'
      this.cellPhone = detail.cellPhone
      detail.cellPhone = detail.cellPhone && detail.cellPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
      this.detail = detail
    },
    refuseApply () {
      this.dialogObj.title = '是否确定拒绝提现申请'
      this.dialogObj.form.resetFields()
      this.dialogObj.visible = true
      this.dialogObj.payState = '3'
    },
    applyPass () {
      this.dialogObj.title = '是否确定通过提现审核'
      this.dialogObj.form.resetFields()
      this.dialogObj.visible = true
      this.dialogObj.payState = '2'
    },
    handleOk () {
      this.dialogObj.form.validateFields(err => {
        if (!err) {
          this.auditLoading = true
          this.$httpPost(this.$basePath.postalVerify, {
            menuId: '25e09c3f7558455ebc175f9c69a9b0a6',
            id: this.detail.id,
            remark: this.dialogObj.form.getFieldValue('remark'),
            payState: this.dialogObj.payState
          })
            .then(res => {
              this.auditLoading = false
              this.$router.push({
                path: '/finance/MetranManage/cashoutApply'
              })
            })
            .catch(() => {
              this.dialogObj.visible = false
              this.auditLoading = false
            })
        }
      })
    },
    back () {
      this.$router.push({
        path: '/finance/MetranManage/cashoutApply'
      })
    },
    showCompleteMobile () {
      this.detail.cellPhone = this.cellPhone
    },
    viewMember () {
      this.memberInfoVisible = true
      const params = {}
      params.menuId = '69520d904b9347919fca0ce63632cd7f'
      params.id = this.mId
      this.getInfo(params)
    },
    getInfo (params) {
      getMemberInfo(params)
        .then(res => {
          this.middleInfos.nickname = res.result.userName
          this.middleInfos.registerSource = Number(res.result.origin) === 0 ? 'APP注册' : Number(res.result.origin) === 1 ? 'IC开卡' : Number(res.result.origin) === 2 ? '设备' : Number(res.result.origin) === 3 ? '小程序' : Number(res.result.origin) === 4 ? '数据导入' : Number(res.result.origin) === 5 ? '客服录入' : Number(res.result.origin) === 6 ? '小哥录入' : ''
          this.middleInfos.bindTime = res.result.bindDate
          this.availableBalance = res.result.catCoin
          this.rankEnv = res.result.rank
          this.middleInfos.memberStatus = res.result.isLock === '0' || res.result.isLock === 0 ? '启用' : res.result.isLock === '1' || res.result.isLock === 1 ? '禁用' : ''
          this.editStatus = res.result.isLock
          this.rightInfos.phoneNum = this.formatPhone(res.result.cellPhone)
          this.trueNum = res.result.cellPhone
          this.rightInfos.registerTime = res.result.createTime
          this.rightInfos.ICCardNum = res.result.carNum
          this.availableEnv = res.result.balanceEnviron
          this.envTotal = res.result.environmental
          this.rightInfos.lateTime = res.result.loginDate
          this.trueName = res.result.userRealName
          this.age = res.result.age
          this.identityNum = this.formatIdentityNum(res.result.identity)
          this.trueIdentityNum = res.result.identity
          this.occupation = res.result.profession
          this.sex = res.result.sex === '0' || res.result.sex === 0 ? '男' : res.result.sex === '1' || res.result.sex === 1 ? '女' : ''
          this.estate = res.result.estateName
          this.detailAddress = res.result.mergerName
          this.avatarPath = res.result.path
        })
    },
    formatPhone (val) {
      return val && val.length > 7 ? val.substr(0, 3) + '****' + val.substr(val.length - 4, 4) : val
    },
    formatIdentityNum (val) {
      return val && val.length > 2 ? val.substr(0, 1) + '****' + val.substr(val.length - 1, 1) : val
    },
    showAllPhoneNum () {
      this.rightInfos.phoneNum = this.trueNum
      this.showpn = false
    },
    showAllIdentityNum () {
      this.identityNum = this.trueIdentityNum
      this.showin = false
    },
    getDeliveryList (params) {
      this.loading = true
      getDelivery(params)
        .then(res => {
          this.loading = false
          this.tableData = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    getWithdrawList (params) {
      this.loading = true
      getWithdraw(params)
        .then(res => {
          this.loading = false
          this.tableData = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    getExchangeList (params) {
      this.loading = true
      getExchange(params)
        .then(res => {
          this.loading = false
          this.tableData = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    getEnvironmentalList (params) {
      this.loading = true
      getEnvironmental(params)
        .then(res => {
          this.loading = false
          this.tableData = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    getBalanceList (params) {
      this.loading = true
      getBalance(params)
        .then(res => {
          this.loading = false
          this.tableData = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    getFindOrderList (params) {
      this.loading = true
      getFindOrder(params)
        .then(res => {
          this.loading = false
          this.tableData = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    getRechargeList (params) {
      this.loading = true
      getRecharge(params)
        .then(res => {
          this.loading = false
          this.tableData = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    getDepositList (params) {
      this.loading = true
      getDeposit(params)
        .then(res => {
          this.loading = false
          this.tableData = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    callback (key) {
      this.currentKey = key
      const params = {}
      params.id = this.mId
      this.pagination.current = 1
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      if (key === '1') {
        this.getDeliveryList(params)
        this.columns = [{
          title: '投递照片',
          key: 'pathList',
          dataIndex: 'pathList',
          scopedSlots: { customRender: 'deliveryPhotos' }
        }, {
          title: '订单号',
          key: 'orderId',
          dataIndex: 'orderId'
        }, {
          title: '投递小区',
          key: 'estateName',
          dataIndex: 'estateName'
        }, {
          title: '设备编号',
          key: 'productId',
          dataIndex: 'productId'
        }, {
          title: '投递时间',
          key: 'createDate',
          dataIndex: 'createDate'
        }, {
          title: '投递类型',
          key: 'dataName',
          dataIndex: 'dataName'
        }, {
          title: '重量(Kg)',
          key: 'rubbishWeight',
          dataIndex: 'rubbishWeight'
        }, {
          title: '新增余额',
          key: 'catCoin',
          dataIndex: 'catCoin'
        }, {
          title: '新增环保值',
          key: 'integralValue',
          dataIndex: 'integralValue'
        }, {
          title: '状态',
          key: 'allSuccess',
          dataIndex: 'allSuccess',
          scopedSlots: { customRender: 'allSuccess' }
        }]
      } else if (key === '2') {
        this.getWithdrawList(params)
        this.columns = [{
          title: '订单号',
          key: 'orderId',
          dataIndex: 'orderId'
        }, {
          title: '取币小区',
          key: 'estateName',
          dataIndex: 'estateName'
        }, {
          title: '设备编号',
          key: 'deviceCode',
          dataIndex: 'deviceCode'
        }, {
          title: '取币时间',
          key: 'createDate',
          dataIndex: 'createDate'
        }, {
          title: '取币金额（元）',
          key: 'withdrawValue',
          dataIndex: 'withdrawValue'
        }, {
          title: '状态',
          key: 'allSuccess',
          dataIndex: 'allSuccess',
          scopedSlots: { customRender: 'allSuccess' }
        }]
      } else if (key === '3') {
        this.getExchangeList(params)
        this.columns = [{
          title: '订单号',
          key: 'exchangeNum',
          dataIndex: 'exchangeNum'
        }, {
          title: '兑换渠道',
          key: 'type',
          dataIndex: 'type',
          scopedSlots: { customRender: 'exchangeType' }
        }, {
          title: '兑换商品',
          key: 'goodsName',
          dataIndex: 'goodsName'
        }, {
          title: '兑换时间',
          key: 'createDate',
          dataIndex: 'createDate'
        }, {
          title: '兑换价格（环保值）',
          key: 'integralValue',
          dataIndex: 'integralValue'
        }, {
          title: '状态',
          key: 'allSuccess',
          dataIndex: 'allSuccess',
          scopedSlots: { customRender: 'allSuccess' }
        }]
      } else if (key === '4') {
        this.getEnvironmentalList(params)
        this.columns = [{
          title: '流水号',
          key: 'serialNumber',
          dataIndex: 'serialNumber'
        }, {
          title: '时间',
          key: 'createTime',
          dataIndex: 'createTime'
        }, {
          title: '环保值',
          key: 'environmental',
          dataIndex: 'environmental'
        }, {
          title: '类型',
          key: 'originName',
          dataIndex: 'originName'
        }]
      } else if (key === '5') {
        this.getBalanceList(params)
        this.columns = [{
          title: '流水号',
          key: 'serialNumber',
          dataIndex: 'serialNumber'
        }, {
          title: '时间',
          key: 'createTime',
          dataIndex: 'createTime'
        }, {
          title: '余额',
          key: 'changeCat',
          dataIndex: 'changeCat'
        }, {
          title: '类型',
          key: 'typeName',
          dataIndex: 'typeName'
        }]
      } else if (key === '6') {
        this.getFindOrderList(params)
        this.columns = [{
          title: '订单号',
          key: 'orderId',
          dataIndex: 'orderId'
        }, {
          title: '预约回收品类',
          key: 'categoryName',
          dataIndex: 'categoryName'
        }, {
          title: '预约方式',
          key: 'type',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        }, {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime'
        }, {
          title: '预约上门时间',
          key: 'recycleoverTime',
          dataIndex: 'recycleTime',
          scopedSlots: { customRender: 'recycleoverTime' }
        }, {
          title: '订单状态',
          key: 'state',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' }
        }]
      } else if (key === '7') {
        this.getRechargeList(params)
        this.columns = [{
          title: '充值订单号',
          key: 'orderId',
          dataIndex: 'orderId'
        }, {
          title: '充值时间',
          key: 'payTime',
          dataIndex: 'payTime'
        }, {
          title: '充值渠道',
          key: 'payType',
          dataIndex: 'payType',
          scopedSlots: { customRender: 'payType' }
        }, {
          title: '充值金额（元）',
          key: 'amount',
          dataIndex: 'amount'
        }]
      } else if (key === '8') {
        this.getDepositList(params)
        this.columns = [{
          title: '提现订单号',
          key: 'orderNo',
          dataIndex: 'orderNo'
        }, {
          title: '提现完成时间',
          key: 'updateTime',
          dataIndex: 'updateTime'
        }, {
          title: '提现到账渠道',
          key: 'channel',
          dataIndex: 'channel'
        }, {
          title: '提现金额（元）',
          key: 'amount',
          dataIndex: 'amount'
        }, {
          title: '服务费（元）',
          key: 'serviceFee',
          dataIndex: 'serviceFee'
        }]
      }
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      const params = {}
      params.id = this.mId
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      if (this.currentKey === '1') {
        this.getDeliveryList(params)
      } else if (this.currentKey === '2') {
        this.getWithdrawList(params)
      } else if (this.currentKey === '3') {
        this.getExchangeList(params)
      } else if (this.currentKey === '4') {
        this.getEnvironmentalList(params)
      } else if (this.currentKey === '5') {
        this.getBalanceList(params)
      } else if (this.currentKey === '6') {
        this.getFindOrderList(params)
      } else if (this.currentKey === '7') {
        this.getRechargeList(params)
      } else if (this.currentKey === '8') {
        this.getDepositList(params)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.memberDetails
  background-color #fff
  padding 16px 20px
  margin-bottom 20px
  font-size 12px
  color #000
  .pd5
    padding 5px
  .mr16
    margin-right 16px
  .mt16
    margin-top 16px
  .commonTitle
    font-size 16px
    font-weight 600
    color #333
  .basicInfo
    margin 16px 0
    .memberImg
      width 100px
      text-align center
      margin-bottom 10px
    .memberLines
      height 32px
      line-height 32px
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
      .statusLine
        padding 0 10px
        color #333
  .addressHeight
    height 32px
    line-height 32px
    margin-bottom 32px
    .addressCol
      height 32px
      line-height 32px
      background-color #f2f2f2
      padding 0 10px
  .showComplete
    color #2F90FF
    font-size 12px
    float right
    cursor pointer
  .bottomBtn
    margin-top 40px
    margin-bottom 24px
    text-align center
</style>
