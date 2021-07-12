<template>
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
              &nbsp;&nbsp;&nbsp;&nbsp;{{
                rankEnv > 100 ? "未上榜" : rankEnv + " 名"
              }}
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
          v-for="(item, index) in middleInfos"
          :key="index"
          :gutter="8"
          class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index | titleFilter }}:
          </a-col>
          <a-col :span="18">
            <div v-if="mainTitle === '编辑' && index === 'nickname'">
              <a-input
                v-model="userInfo.userName"
                placeholder="请输入用户昵称"
              />
            </div>
            <div v-else class="commonLine">
              {{ item }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="10" class="commonCol">
        <a-row
          v-for="(item, index) in rightInfos"
          :key="index"
          :gutter="8"
          class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index | titFilter }}:
          </a-col>
          <a-col v-if="mainTitle === '编辑'" :span="18">
            <div v-if="rightInfos.ICCardNum">
              <div class="commonLine">
                {{ item }}
                <span
                  v-if="index === 'phoneNum' && showpn"
                  class="showComplete"
                  @click="showAllPhoneNum()"
                >完整展示</span>
                <span
                  v-if="index === 'ICCardNum'"
                  class="showComplete"
                  @click="unbundleVisible = true"
                >解绑</span>
              </div>
            </div>
            <div v-else>
              <div v-if="index !== 'ICCardNum'" class="commonLine">
                {{ item }}
                <span
                  v-if="index === 'phoneNum' && showpn"
                  class="showComplete"
                  @click="showAllPhoneNum()"
                >完整展示</span>
              </div>
              <div v-if="index === 'ICCardNum'">
                <a-input v-model="cardNum" placeholder="请输入IC卡号" />
              </div>
            </div>
          </a-col>
          <a-col v-else :span="18">
            <div class="commonLine">
              {{ item }}
              <span
                v-if="index === 'phoneNum' && showpn"
                class="showComplete"
                @click="showAllPhoneNum()"
              >完整展示</span>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="commonTitle">
      身份地址
    </div>
    <a-row :gutter="16">
      <a-col :span="4">
        <div class="face">
          <div class="face-img" @click="handleVisible">
            <img :src="facePath ? facePath : defImgSrc" alt="">
          </div>
          <div v-if="facePath" class="text">
            <div>人脸识别图像存储时间：</div>
            <div>{{ faceTime }}</div>
          </div>
          <div v-else style="padding-left:10px" class="text">
            暂无人脸识别图像
          </div>
        </div>
      </a-col>
      <a-col :span="20" class="commonCol">
        <a-row class="item-row">
          <a-col :span="12">
            <a-row :gutter="8">
              <a-col :span="6" align="right">
                真实姓名:
              </a-col>
              <a-col :span="18">
                <div v-if="mainTitle === '编辑'">
                  <a-input
                    v-model="userInfo.userRealName"
                    placeholder="请输入用户真实姓名"
                  />
                </div>
                <div v-else class="commonLine">
                  {{ trueName }}
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row :gutter="8">
              <a-col :span="6" align="right">
                身份证号:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ identityNum }}
                  <span
                    v-if="showin && identityNum"
                    class="showComplete"
                    @click="showAllIdentityNum()"
                  >完整展示</span>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row class="item-row">
          <a-col :span="12">
            <a-row :gutter="8">
              <a-col :span="6" align="right">
                性别:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ sex }}
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row :gutter="8">
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
        </a-row>
        <a-row class="item-row">
          <a-col :span="12">
            <a-row :gutter="8">
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
          <a-col :span="12">
            <a-row :gutter="8">
              <a-col :span="6" align="right">
                小区:
              </a-col>
              <a-col :span="18">
                <a-select
                  v-if="mainTitle === '编辑' && address.estateId"
                  v-model="address.estateId"
                  allow-clear
                  show-search
                  style="width:100%"
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
                <div v-else class="commonLine">
                  {{ estate }}
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row class="item-row">
          <a-col :span="12">
            <a-row v-if="mainTitle === '编辑' && address.estateId" :gutter="8">
              <a-col :span="6" align="right">
                楼栋号:
              </a-col>
              <a-col :span="18">
                <a-input v-model="address.buildingNumber" />
              </a-col>
            </a-row>
            <a-row v-else :gutter="8">
              <a-col :span="6" align="right">
                楼栋号:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ address.buildingNumber }}
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row v-if="mainTitle === '编辑' && address.estateId" :gutter="8">
              <a-col :span="6" align="right">
                单元号:
              </a-col>
              <a-col :span="18">
                <a-input v-model="address.unit" />
              </a-col>
            </a-row>
            <a-row v-else :gutter="8">
              <a-col :span="6" align="right">
                单元号:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ address.unit }}
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row class="item-row">
          <a-col :span="12">
            <a-row v-if="mainTitle === '编辑' && address.estateId" :gutter="8">
              <a-col :span="6" align="right">
                门牌号:
              </a-col>
              <a-col :span="18">
                <a-input v-model="address.roomNum" />
              </a-col>
            </a-row>
            <a-row v-else :gutter="8">
              <a-col :span="6" align="right">
                门牌号:
              </a-col>
              <a-col :span="18">
                <div class="commonLine">
                  {{ address.roomNum }}
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row :gutter="8">
              <a-col :span="6" align="right">
                详细地址:
              </a-col>
              <a-col :span="18">
                <a-tooltip>
                  <template slot="title">
                    {{ detailAddress }}
                  </template>
                  <div class="addressCol">
                    {{ detailAddress }}
                  </div>
                </a-tooltip>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- 用户行为 -->
    <div v-if="mainTitle === '查看'">
      <div class="commonTitle">
        用户行为
      </div>
      <a-tabs default-active-key="1" class="mt16" @change="callback">
        <a-tab-pane
          v-for="item in tabsTitle"
          :key="item.value"
          :tab="item.title"
        >
        </a-tab-pane>
      </a-tabs>
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
          <span>{{ type == 0 ? "设备" : "" }}</span>
          <span>{{ type == 1 ? "APP预约" : "" }}</span>
          <span>{{ type == 2 ? "客服录入" : "" }}</span>
        </template>
        <template slot="state" slot-scope="state">
          <span>{{ state == 0 ? "待接单" : "" }}</span>
          <span>{{ state == 1 ? "待回收" : "" }}</span>
          <span>{{ state == 2 ? "已完成" : "" }}</span>
          <span>{{ state == 3 ? "已取消" : "" }}</span>
          <span>{{ state == 4 ? "已失效" : "" }}</span>
        </template>
        <template slot="recycleoverTime" slot-scope="text, record">
          {{ record.recycleTime }}~{{ record.overTime }}
        </template>
        <template slot="exchangeType" slot-scope="text">
          <span>{{ text == 1 ? "商城" : "" }}</span>
          <span>{{ text == 6 ? "实体店铺" : "" }}</span>
          <span>{{ text == 7 ? "吐袋机" : "" }}</span>
        </template>
        <template slot="deliveryPhotos" slot-scope="text">
          <viewer :images="text">
            <span v-for="(i, j) in text" :key="j">
              <img
                v-show="j == 0" :src="i" height="40"
                class="pd5"
              >
            </span>
          </viewer>
        </template>
        <template slot="payType" slot-scope="payType">
          <span>{{ payType == 1 ? "支付宝" : "" }}</span>
          <span>{{ payType == 2 ? "微信" : "" }}</span>
        </template>
      </a-table>
    </div>
    <div class="status-record">
      <div class="title">
        账号运维
        <a-button
          v-if="mainTitle === '编辑'"
          type="link"
          @click="operationVisible = true"
        >
          添加纪录
        </a-button>
      </div>
      <div class="steps-content">
        <a-empty v-if="!operationList.length" description="暂无记录" />
        <div v-else class="process-step">
          <a-steps direction="vertical">
            <a-step
              v-for="(item, index) in operationList"
              :key="index"
              status="finish"
            >
              <i slot="icon" class="iconfont">&#xe63e;</i>
              <div slot="title">
                <span class="content-left time">{{ item.label }}</span>
                <span
                  class="content-right people"
                >操作人员 ：{{ item.createUser }}
                </span>
                <span
                  class="content-right people" style="margin-left:10px"
                >备注：{{ item.remark }}</span>
              </div>
              <div slot="description">
                <span class="content-right remark">{{ item.createTime }}</span>
              </div>
            </a-step>
          </a-steps>
        </div>
      </div>
    </div>
    <div class="bottomBtn">
      <div v-if="mainTitle === '查看'">
        <a-button type="primary" @click="backPage()">
          返回
        </a-button>
      </div>
      <div v-else>
        <a-button class="mr16" @click="backPage()">
          取消
        </a-button>
        <a-button type="primary" :loading="confirmLoading" @click="save()">
          保存
        </a-button>
      </div>
    </div>
    <!-- 添加运维记录 -->
    <a-modal
      centered
      title="添加运维记录"
      :visible="operationVisible"
      @cancel="handleOperationCancle"
    >
      <a-form
        :form="operationForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="事件名称">
          <a-input
            v-decorator="[
              'label',
              {
                rules: [{ required: true, message: '填写事件名称' }]
              }
            ]"
            :max-length="8"
            type="text"
            allow-clear
            placeholder="填写事件名称，如：投诉回访、异常处理等"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea
            v-decorator="[
              'remark',
              { rules: [{ required: true, message: '请填写备注' }] }
            ]"
            placeholder="请填写备注"
            rows="3"
            :max-length="50"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button @click="handleOperationCancle">
          取消
        </a-button>
        <a-button
          :loading="operationLoading"
          type="primary"
          @click="submitOperation"
        >
          确定
        </a-button>
      </template>
    </a-modal>
    <a-modal
      centered
      :closable="false"
      :visible="unbundleVisible"
      @ok="handleRelieveCard"
      @cancel="unbundleVisible = false"
    >
      <div class="ant-modal-confirm-body">
        <a-icon class="model-icon" type="question-circle" />
        <span class="ant-modal-confirm-title">是否确定解绑此积分卡</span>
        <div class="ant-modal-confirm-content">
          <div>解绑绑后积分会被保留，此卡将作废，请谨慎操作！</div>
        </div>
      </div>
      <div style="margin-top:20px;">
        <a-textarea
          v-model="remark"
          placeholder="请输入解绑原因（必填）"
          rows="3"
          :max-length="100"
        />
      </div>
    </a-modal>
    <div class="img-modal">
      <a-modal
        :visible="visible"
        :footer="null"
        @cancel="() => (visible = false)"
      >
        <img class="w100" :src="facePath">
      </a-modal>
    </div>
  </div>
</template>
<script>
import {
  getMemberInfo,
  updateMember,
  getDelivery,
  getWithdraw,
  getExchange,
  getEnvironmental,
  getBalance,
  getFindOrder,
  getRecharge,
  getDeposit,
  getCardRecord,
  relieveCard,
  operationRecord,
  addOperation
} from '@/api/member'
import { getEstate } from '@/components/mixins/mixins.js'
export default {
  name: 'MemberDetails',
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
  mixins: [getEstate],
  data () {
    return {
      isICNum: true,
      loading: false,
      visible: false,
      unbundleVisible: false,
      operationLoading: false,
      operationVisible: false,
      confirmLoading: false,
      showpn: true,
      showin: true,
      mainTitle: '',
      availableBalance: '',
      availableEnv: '',
      rankEnv: '',
      envTotal: '',
      editStatus: '',
      mId: '',
      currentKey: '',
      avatarPath: '',
      remark: '',
      cardNum: '',
      trueNum: '',
      trueName: '',
      age: '',
      identityNum: '',
      trueIdentityNum: '',
      occupation: '',
      sex: '',
      estate: '',
      detailAddress: '',
      facePath: '',
      faceTime: '',
      defImgSrc:
        'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200327/1585272785046e444b8fbec2b492792378c47f220890d.png',
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
        },
        {
          title: '解绑卡记录',
          value: '9'
        }
      ],
      operationList: [],
      columns: [],
      tableData: [],
      userInfo: {
        userName: '',
        userRealName: '',
        oldUserName: '',
        oldUserRealName: ''
      },
      address: {
        province: '',
        city: '',
        area: '',
        estateId: '',
        unit: '',
        buildingNumber: '',
        roomNum: ''
      },
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
      statusOptions: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 }
      ],
      operationForm: this.$form.createForm(this, { name: 'operation' })
    }
  },
  created () {
    this.mainTitle = this.$route.query.title
    this.mId = this.$route.query.id
  },
  mounted () {
    if (this.mainTitle === '查看') {
      this.callback('1')
    }
    const params = {}
    params.menuId = '69520d904b9347919fca0ce63632cd7f'
    params.id = this.mId
    this.getInfo(params)
    this.getOperationRecord()
  },
  methods: {
    getInfo (params) {
      getMemberInfo(params).then(res => {
        const {
          province,
          city,
          country,
          estateId,
          buildingNumber,
          roomNum,
          unitNumber,
          userName,
          userRealName
        } = res.result
        this.middleInfos.nickname = res.result.userName
        this.middleInfos.registerSource =
          Number(res.result.origin) === 0
            ? 'APP注册'
            : Number(res.result.origin) === 1
              ? 'IC开卡'
              : Number(res.result.origin) === 2
                ? '设备'
                : Number(res.result.origin) === 3
                  ? '小程序'
                  : Number(res.result.origin) === 4
                    ? '数据导入'
                    : Number(res.result.origin) === 5
                      ? '客服录入'
                      : Number(res.result.origin) === 6
                        ? '小哥录入'
                        : ''
        this.middleInfos.bindTime = res.result.bindDate
        this.availableBalance = res.result.catCoin
        this.rankEnv = res.result.rank
        this.middleInfos.memberStatus =
          res.result.isLock === '0' || res.result.isLock === 0
            ? '启用'
            : res.result.isLock === '1' || res.result.isLock === 1
              ? '禁用'
              : ''
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
        this.sex =
          res.result.sex === '0' || res.result.sex === 0
            ? '男'
            : res.result.sex === '1' || res.result.sex === 1
              ? '女'
              : ''
        this.estate = res.result.estateName
        this.detailAddress = res.result.mergerName
        this.avatarPath = res.result.path
        this.facePath = res.result.facePath
        this.faceTime = res.result.faceTime
        this.isICNum = !!res.result.carNum
        this.address.province = province || ''
        this.address.city = city || ''
        this.address.area = country || ''
        this.address.buildingNumber = buildingNumber || ''
        this.address.unit = unitNumber || ''
        this.address.roomNum = roomNum || ''
        this.userInfo.userName = userName || ''
        this.userInfo.userRealName = userRealName || ''
        this.userInfo.oldUserName = userName || ''
        this.userInfo.oldUserRealName = userRealName || ''
        this.getEstate().then(() => {
          this.address.estateId = estateId || ''
        })
      })
    },
    getOperationRecord () {
      operationRecord(this.mId).then(res => {
        this.operationList = res.result
      })
    },
    submitOperation () {
      const {
        operationForm: { validateFields }
      } = this
      this.operationLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = {
            id: this.mId,
            ...values
          }
          addOperation(params).then(res => {
            this.operationLoading = false
            this.handleOperationCancle()
            this.getOperationRecord()
          })
        } else {
          this.operationLoading = false
        }
      })
    },
    formatPhone (val) {
      return val && val.length > 7
        ? val.substr(0, 3) + '****' + val.substr(val.length - 4, 4)
        : val
    },
    formatIdentityNum (val) {
      return val && val.length > 2
        ? val.substr(0, 1) + '****' + val.substr(val.length - 1, 1)
        : val
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
      getDelivery(params).then(res => {
        this.loading = false
        this.tableData = res.result.list
        this.pagination.total = res.result.totalCount
      })
    },
    getWithdrawList (params) {
      this.loading = true
      getWithdraw(params).then(res => {
        this.loading = false
        this.tableData = res.result.list
        this.pagination.total = res.result.totalCount
      })
    },
    getExchangeList (params) {
      this.loading = true
      getExchange(params).then(res => {
        this.loading = false
        this.tableData = res.result.list
        this.pagination.total = res.result.totalCount
      })
    },
    getEnvironmentalList (params) {
      this.loading = true
      getEnvironmental(params).then(res => {
        this.loading = false
        this.tableData = res.result.list
        this.pagination.total = res.result.totalCount
      })
    },
    getBalanceList (params) {
      this.loading = true
      getBalance(params).then(res => {
        this.loading = false
        this.tableData = res.result.list
        this.pagination.total = res.result.totalCount
      })
    },
    getFindOrderList (params) {
      this.loading = true
      getFindOrder(params).then(res => {
        this.loading = false
        this.tableData = res.result.list
        this.pagination.total = res.result.totalCount
      })
    },
    getRechargeList (params) {
      this.loading = true
      getRecharge(params).then(res => {
        this.loading = false
        this.tableData = res.result.list
        this.pagination.total = res.result.totalCount
      })
    },
    getDepositList (params) {
      this.loading = true
      getDeposit(params).then(res => {
        this.loading = false
        this.tableData = res.result.list
        this.pagination.total = res.result.totalCount
      })
    },
    getCardRecordList (params) {
      this.loading = true
      getCardRecord(params).then(res => {
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
        this.columns = [
          {
            title: '投递照片',
            key: 'pathList',
            dataIndex: 'pathList',
            scopedSlots: { customRender: 'deliveryPhotos' }
          },
          {
            title: '订单号',
            key: 'orderId',
            dataIndex: 'orderId'
          },
          {
            title: '投递小区',
            key: 'estateName',
            dataIndex: 'estateName'
          },
          {
            title: '设备编号',
            key: 'productId',
            dataIndex: 'productId'
          },
          {
            title: '投递时间',
            key: 'createDate',
            dataIndex: 'createDate'
          },
          {
            title: '投递类型',
            key: 'dataName',
            dataIndex: 'dataName'
          },
          {
            title: '重量(Kg)',
            key: 'rubbishWeight',
            dataIndex: 'rubbishWeight'
          },
          {
            title: '新增余额',
            key: 'catCoin',
            dataIndex: 'catCoin'
          },
          {
            title: '新增环保值',
            key: 'integralValue',
            dataIndex: 'integralValue'
          },
          {
            title: '状态',
            key: 'allSuccess',
            dataIndex: 'allSuccess',
            scopedSlots: { customRender: 'allSuccess' }
          }
        ]
      } else if (key === '2') {
        this.getWithdrawList(params)
        this.columns = [
          {
            title: '订单号',
            key: 'orderId',
            dataIndex: 'orderId'
          },
          {
            title: '取币小区',
            key: 'estateName',
            dataIndex: 'estateName'
          },
          {
            title: '设备编号',
            key: 'deviceCode',
            dataIndex: 'deviceCode'
          },
          {
            title: '取币时间',
            key: 'createDate',
            dataIndex: 'createDate'
          },
          {
            title: '取币金额（元）',
            key: 'withdrawValue',
            dataIndex: 'withdrawValue'
          },
          {
            title: '状态',
            key: 'allSuccess',
            dataIndex: 'allSuccess',
            scopedSlots: { customRender: 'allSuccess' }
          }
        ]
      } else if (key === '3') {
        this.getExchangeList(params)
        this.columns = [
          {
            title: '订单号',
            key: 'exchangeNum',
            dataIndex: 'exchangeNum'
          },
          {
            title: '兑换渠道',
            key: 'type',
            dataIndex: 'type',
            scopedSlots: { customRender: 'exchangeType' }
          },
          {
            title: '兑换商品',
            key: 'goodsName',
            dataIndex: 'goodsName'
          },
          {
            title: '兑换时间',
            key: 'createDate',
            dataIndex: 'createDate'
          },
          {
            title: '兑换价格（环保值）',
            key: 'integralValue',
            dataIndex: 'integralValue'
          },
          {
            title: '状态',
            key: 'allSuccess',
            dataIndex: 'allSuccess',
            scopedSlots: { customRender: 'allSuccess' }
          }
        ]
      } else if (key === '4') {
        this.getEnvironmentalList(params)
        this.columns = [
          {
            title: '流水号',
            key: 'serialNumber',
            dataIndex: 'serialNumber'
          },
          {
            title: '时间',
            key: 'createTime',
            dataIndex: 'createTime'
          },
          {
            title: '环保值',
            key: 'environmental',
            dataIndex: 'environmental'
          },
          {
            title: '可用环保值',
            key: 'balanceEnviron',
            dataIndex: 'balanceEnviron'
          },
          {
            title: '操作人',
            key: 'createUser',
            dataIndex: 'createUser'
          },
          {
            title: '类型',
            key: 'originName',
            dataIndex: 'originName'
          },
          {
            title: '备注',
            key: 'remark',
            dataIndex: 'remark'
          }
        ]
      } else if (key === '5') {
        this.getBalanceList(params)
        this.columns = [
          {
            title: '流水号',
            key: 'serialNumber',
            dataIndex: 'serialNumber'
          },
          {
            title: '时间',
            key: 'createTime',
            dataIndex: 'createTime'
          },
          {
            title: '余额',
            key: 'changeCat',
            dataIndex: 'changeCat'
          },
          {
            title: '类型',
            key: 'typeName',
            dataIndex: 'typeName'
          },
          {
            title: '可用余额',
            key: 'surplusCat',
            dataIndex: 'surplusCat'
          }
        ]
      } else if (key === '6') {
        this.getFindOrderList(params)
        this.columns = [
          {
            title: '订单号',
            key: 'orderId',
            dataIndex: 'orderId'
          },
          {
            title: '预约回收品类',
            key: 'categoryName',
            dataIndex: 'categoryName'
          },
          {
            title: '预约方式',
            key: 'type',
            dataIndex: 'type',
            scopedSlots: { customRender: 'type' }
          },
          {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime'
          },
          {
            title: '预约上门时间',
            key: 'recycleoverTime',
            dataIndex: 'recycleTime',
            scopedSlots: { customRender: 'recycleoverTime' }
          },
          {
            title: '订单状态',
            key: 'state',
            dataIndex: 'state',
            scopedSlots: { customRender: 'state' }
          }
        ]
      } else if (key === '7') {
        this.getRechargeList(params)
        this.columns = [
          {
            title: '充值订单号',
            key: 'orderId',
            dataIndex: 'orderId'
          },
          {
            title: '充值时间',
            key: 'payTime',
            dataIndex: 'payTime'
          },
          {
            title: '充值渠道',
            key: 'payType',
            dataIndex: 'payType',
            scopedSlots: { customRender: 'payType' }
          },
          {
            title: '充值金额（元）',
            key: 'amount',
            dataIndex: 'amount'
          }
        ]
      } else if (key === '8') {
        this.getDepositList(params)
        this.columns = [
          {
            title: '提现订单号',
            key: 'orderNo',
            dataIndex: 'orderNo'
          },
          {
            title: '提现完成时间',
            key: 'updateTime',
            dataIndex: 'updateTime'
          },
          {
            title: '提现到账渠道',
            key: 'channel',
            dataIndex: 'channel'
          },
          {
            title: '提现金额（元）',
            key: 'amount',
            dataIndex: 'amount'
          },
          {
            title: '服务费（元）',
            key: 'serviceFee',
            dataIndex: 'serviceFee'
          }
        ]
      } else if (key === '9') {
        this.getCardRecordList(params)
        this.columns = [
          {
            title: '操作时间',
            key: 'createTime',
            dataIndex: 'createTime'
          },
          {
            title: '类型',
            key: 'type',
            dataIndex: 'type'
          },
          {
            title: '卡号',
            key: 'cardNum',
            dataIndex: 'cardNum'
          },
          {
            title: '备注',
            key: 'remark',
            dataIndex: 'remark'
          },
          {
            title: '操作人',
            key: 'operateUser',
            dataIndex: 'operateUser'
          }
        ]
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
    },
    backPage () {
      this.$router.push({ path: '/member/memberList' })
    },
    save () {
      const params = {
        id: this.mId,
        menuId: 'ebbc63858dc5402296fb2500246db65a',
        ...this.userInfo
      }
      this.address.estateId && Object.assign(params, this.address)
      !this.isICNum &&
        Object.assign(params, {
          cardNum: this.cardNum
        })

      this.confirmLoading = true
      updateMember(params)
        .then(res => {
          this.confirmLoading = false
          this.$message.success('会员信息修改成功')
          this.backPage()
        })
        .catch(() => {
          this.confirmLoading = false
        })
    },
    handleRelieveCard () {
      const params = {
        menuId: '7df450d5796746278aeb05d264cdb7e8',
        userId: this.mId,
        remark: this.remark
      }
      relieveCard(params).then(res => {
        this.unbundleVisible = false
        this.remark = ''
        this.$message.success('解绑成功')
        const params = {}
        params.menuId = '69520d904b9347919fca0ce63632cd7f'
        params.id = this.mId
        this.getInfo(params)
        this.getCardRecordList({
          id: this.mId,
          page: 1,
          pageSize: 10
        })
      })
    },
    handleVisible () {
      if (this.facePath) this.visible = true
    },
    handleOperationCancle () {
      this.operationVisible = false
      this.operationForm.resetFields()
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
<style lang="stylus" scoped>
.model-icon
  font-size 22px
  color #faad14
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
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
  .showComplete
    color #2F90FF
    font-size 12px
    float right
    cursor pointer
  .bottomBtn
    margin-top 40px
    margin-bottom 24px
    text-align center
  .face
    padding 18px 0
    font-size 12px
    color #666666
    padding-left 18%
    .text
      margin-top 10px
  .face-img
    width:120px;
    height:120px;
    border-radius:4px;
    overflow hidden
    img
      width 100%
      height 100%
  .item-row
    height 32px
    line-height 32px
    margin-bottom 16px
  .steps-content
    width 100%
  .process-step
    max-height 300px
    overflow-y auto
    margin-top 10px
    >>>.ant-steps-item-finish > .ant-steps-item-tail::after
      background #e8e8e8
    >>>.ant-steps-vertical > .ant-steps-item > .ant-steps-item-tail
      padding 22px 0 0 0
      height 119%
    >>>.ant-steps-icon
      line-height 16px
    .content-left
      display inline-block
      width 180px
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
  .status-record
    margin-top 10px
    .title
      display flex
      justify-content space-between
</style>
<style lang="stylus">
.memberDetails
  .bottomBtn
    .ant-btn
      border-radius 2px
      font-size 12px
      line-height normal
  .statusLine
    .ant-radio-wrapper
      font-size 12px
</style>
