<template>
  <div class="memberDetails">
    <div class="commonTitle">
      基础信息
    </div>
    <a-row :gutter="16" class="basicInfo">
      <a-col :span="4" align="center" class="leftMember">
        <div class="memberImg">
          <a-avatar :size="64" :src="userInfo.path" icon="user" />
        </div>
        <div class="memberLines">
          <a-row>
            <a-col :span="12" align="right">
              可用余额：
            </a-col>
            <a-col style="padding-left:12px;" :span="12" align="left">
              {{ userInfo.catCoin }} 元
            </a-col>
          </a-row>
        </div>
        <div class="memberLines">
          <a-row>
            <a-col :span="12" align="right">
              可用环保值：
            </a-col>
            <a-col style="padding-left:12px;" :span="12" align="left">
              {{ userInfo.balanceEnviron }}
            </a-col>
          </a-row>
        </div>
        <div class="memberLines">
          <a-row>
            <a-col :span="12" align="right">
              环保值排行：
            </a-col>
            <a-col style="padding-left:10px;" :span="12" align="left">
              {{
                userInfo.rank > 100 ? "未上榜" : userInfo.rank || "--" + " 名"
              }}
            </a-col>
          </a-row>
        </div>
        <div class="memberLines">
          <a-row>
            <a-col :span="12" align="right">
              累计环保值：
            </a-col>
            <a-col style="padding-left:10px;" :span="12" align="left">
              {{ userInfo.environmental }}
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="10" class="commonCol">
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            昵称
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ userInfo.nickName }}
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            注册来源：
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ userInfo.origin | registerFl }}
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            绑卡时间：
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ userInfo.bindDate }}
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            会员状态：
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ userInfo.isLock ? "禁用" : "启用" }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="10" class="commonCol">
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            手机号：
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ userInfo.phoneNum }}
              <span
                v-if="showpn" class="showComplete" @click="showAllPhoneNum"
              >完整展示</span>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            会员注册时间：
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ userInfo.createTime }}
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            IC卡号：
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ userInfo.carNum || "" }}
              <span
                v-if="IC.length"
                class="showComplete"
                @click="deductVisible = true"
              >卡费扣除</span>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            最近登录时间：
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ userInfo.loginDate }}
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div>
      <div class="commonTitle">
        用户资金处置
      </div>
      <a-tabs default-active-key="1" class="mt16" @change="handleTabChange">
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
        <template slot="usedCatCoin" slot-scope="text, record">
          <span>{{
            text.payType == 1 || text.payType == 3 || text.payType == 4
              ? record.usedCatCoin + "元"
              : ""
          }}</span>
          <span>{{
            text.payType == 2 ? record.usedEnviron + "积分" : ""
          }}</span>
        </template>
        <template slot="payType" slot-scope="pType">
          <span>{{ pType == 1 ? "猫先生余额" : "" }}</span>
          <span>{{ pType == 2 ? "猫先生积分(环保值)" : "" }}</span>
          <span>{{ pType == 3 ? "支付宝" : "" }}</span>
          <span>{{ pType == 4 ? "微信" : "" }}</span>
        </template>
        <template slot="handleDetail" slot-scope="text">
          <a
            v-if="text.length"
            href="javascript:;"
            @click="handleRecordVisible(text)"
          >查看</a>
          <span v-else>无</span>
        </template>
        <a
          slot="recycleList"
          slot-scope="text"
          href="javascript:;"
          @click="handleRecycleVisible(text)"
        >查看</a>
        <a
          v-if="text.withdrawValue !== 0"
          slot="operate"
          slot-scope="text"
          href="javascript:;"
          @click="handleOperate(text)"
        >处置</a>
      </a-table>
      <div class="bottomBtn">
        <a-button type="primary" @click="backPage()">
          返回
        </a-button>
      </div>
    </div>
    <!-- 卡费扣除 -->
    <a-modal
      class="siteModal"
      title="卡费扣除"
      :visible="deductVisible"
      @cancel="handleCancel()"
    >
      <a-form class="modal-form" :form="deductForm">
        <a-form-item
          label="扣除金额"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-input disabled value="卡费扣除" />
        </a-form-item>
        <a-form-item
          label="IC卡号"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-select
            v-decorator="[
              'originId',
              {
                initialValue: originId,
                rules: [{ required: true, message: '请选择卡号' }]
              }
            ]"
            allow-clear
            placeholder="请选择卡号"
          >
            <a-select-option
              v-for="(item, index) in IC"
              :key="index"
              :value="item.id"
            >
              {{ item.cardNum }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="扣除金额"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-input-number
            v-decorator="[
              'amount',
              { rules: [{ required: true, message: '请填写扣除金额' }] }
            ]"
            style="width:100%;font-size:12px;"
            :max="10"
            placeholder="请填写扣除金额"
          />
        </a-form-item>
        <a-form-item
          label="备注"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-textarea
            v-decorator="[
              'remark',
              { rules: [{ required: true, message: '请填写卡费扣除备注' }] }
            ]"
            placeholder="请填写卡费扣除备注"
            allow-clear
            :max-length="50"
            :rows="3"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button @click="handleCancel()">
          取消
        </a-button>
        <a-button :loading="confirmLoading" type="primary" @click="submit()">
          确定
        </a-button>
      </template>
    </a-modal>
    <!-- 资金处置 -->
    <a-modal
      class="siteModal"
      title="资金处置"
      :visible="disposeVisible"
      @cancel="handleCancel('disposeForm')"
    >
      <a-form class="modal-form diff" :form="disposeForm">
        <a-form-item
          label="关联单号"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-input v-model="orderId" disabled />
        </a-form-item>
        <a-form-item
          v-if="currentIndex === 2"
          label="处置类型"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-input value="吐币异常补加" disabled />
        </a-form-item>
        <a-form-item
          v-if="currentIndex !== 2"
          label="处置类型"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <!-- type 0:加 1:减 -->
          <a-radio-group
            v-decorator="['type', { initialValue: 0 }]"
            @change="handleRadioChange"
          >
            <a-radio :value="0">
              {{ typeValue_1 }}
            </a-radio>
            <a-radio :value="1">
              {{ typeValue_2 }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 投递记录---变动类型 -->
        <div v-if="currentIndex === 1">
          <a-form-item
            v-if="currentItem.rubbishWeight > 0"
            label="变动类型"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-input
              :value="currentItem.catCoin > 0 ? '金额' : '积分'"
              disabled
            />
          </a-form-item>
          <a-form-item
            v-else
            label="变动类型"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-radio-group v-decorator="['changeType', { initialValue: 0 }]">
              <a-radio :value="0">
                金额
              </a-radio>
              <a-radio :value="1">
                积分
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
        <!-- 兑换记录---变动类型 -->
        <div v-if="currentIndex === 3">
          <a-form-item
            label="变动类型"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-input
              :value="parseInt(currentItem.payType) === 1 ? '金额' : '积分'"
              disabled
            />
          </a-form-item>
          <a-form-item
            label="兑换商品"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-select
              v-decorator="[
                'originId',
                {
                  initialValue: giftId,
                  rules: [{ required: true,}]
                }
              ]"
            >
              <a-select-option
                v-for="(item, index) in giftList"
                :key="index"
                :value="item.id"
              >
                {{ item.giftName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <!-- 定点可回收记录/定点厨余记录---变动类型 -->
        <div v-if="currentIndex === 4 || currentIndex === 5">
          <a-form-item
            v-if="currentItem.amount === 0 && currentItem.environment === 0"
            label="变动类型"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-radio-group v-decorator="['changeType', { initialValue: 0 }]">
              <a-radio :value="0">
                金额
              </a-radio>
              <a-radio :value="1">
                积分
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-else
            label="变动类型"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-input
              :value="currentItem.payType === 2 ? '金额' : '积分'"
              disabled
            />
          </a-form-item>
        </div>
        <!-- 定点可回收记录--需要选择回收品类 -->
        <div v-if="currentIndex === 4 && recycleList.length">
          <a-form-item
            label="回收品类"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-select
              v-decorator="[
                'categoryId',
                {
                  rules: [{ required: true, message: '请选择回收品类' }]
                }
              ]"
              placeholder="请选择回收品类"
            >
              <a-select-option
                v-for="(item, index) in recycleList"
                :key="index"
                :value="item.id"
              >
                {{ item.recycleCategory }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div v-if="currentIndex === 2">
          <a-form-item
            label="处置数额"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
          >
            <a-input-number
              v-decorator="[
                'amount',
                {
                  rules: [
                    { required: true, message: '请填写处置数额' },
                    { type: 'number', min: 1, message: '处置数额最小为1' },
                    {
                      type: 'number',
                      max: maxAmount,
                      message: `处置数额最大为${maxAmount}`
                    }
                  ]
                }
              ]"
              style="width:100%;font-size:12px;"
              placeholder="请按实际数额填写,不可超过取币数额"
            />
          </a-form-item>
        </div>
        <div v-else>
          <a-form-item
            label="处置数额"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
            :validate-status="number.validateStatus"
            :help="number.errorMsg"
          >
            <a-input-number
              v-decorator="[
                'amount',
                {
                  rules: [{ required: true, message: '请填写处置数额' }]
                }
              ]"
              style="width:100%;font-size:12px;"
              placeholder="请按实际数额填写"
              @change="handleNumberChange"
            />
          </a-form-item>
        </div>
        <a-form-item
          label="备注"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-textarea
            v-decorator="[
              'remark',
              { rules: [{ required: true, message: '请填写处置原因' }] }
            ]"
            placeholder="请填写处置原因"
            allow-clear
            :max-length="50"
            :rows="3"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button @click="handleCancel('disposeForm')">
          取消
        </a-button>
        <a-button
          :loading="confirmLoading"
          type="primary"
          @click="submit('disposeForm')"
        >
          确定
        </a-button>
      </template>
    </a-modal>
    <!-- 回收清单 -->
    <a-modal
      :visible="recycleVisible"
      title="回收清单"
      centered
      wrap-class-name="role-modal"
      @cancel="recycleVisible = false"
    >
      <div class="role-table">
        <a-table
          class="table-content"
          :columns="recycleColumns"
          :data-source="recycleList"
          :row-key="record => record.id"
          :pagination="false"
          :scroll="recycleList.length > 10 ? { y: 300 } : {}"
          bordered
        ></a-table>
      </div>
      <template slot="footer">
        <a-button @click="recycleVisible = false">
          关闭
        </a-button>
      </template>
    </a-modal>
    <!-- 处置记录 -->
    <a-modal
      :visible="recordVisible"
      title="差额处置记录"
      centered
      wrap-class-name="role-modal"
      :footer="null"
      @cancel="recordVisible = false"
    >
      <div style="max-height: 350px;overflow: auto;">
        <p v-for="(item, index) in recordList" :key="index">
          {{ item }}
        </p>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  getMemberInfo,
  getDelivery,
  getWithdraw,
  memberHandle,
  cardHandle,
  cardRecord,
  getRecycleRecord
} from '@/api/member'
import { getMachineList } from '@/api/order'
const columns_1 = [
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
    title: '处置记录',
    dataIndex: 'handleDetail',
    scopedSlots: { customRender: 'handleDetail' }
  },
  {
    title: '处置',
    key: 'operate',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'operate' }
  }
]
const columns_2 = [
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
    title: '处置记录',
    dataIndex: 'handleDetail',
    scopedSlots: { customRender: 'handleDetail' }
  },
  {
    title: '处置',
    key: 'operate',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'operate' }
  }
]
const columns_3 = [
  {
    title: '订单号',
    key: 'orderNum',
    dataIndex: 'orderNum'
  },
  {
    title: '商品名称',
    key: 'giftName',
    dataIndex: 'giftName',
    scopedSlots: { customRender: 'giftName' }
  },
  {
    title: '付款总金额',
    key: 'usedCatCoin',
    scopedSlots: { customRender: 'usedCatCoin' }
  },
  {
    title: '支付方式',
    key: 'payType',
    dataIndex: 'payType',
    scopedSlots: { customRender: 'payType' }
  },
  {
    title: '是否足额付款',
    key: 'fullPayment',
    dataIndex: 'fullPayment',
    scopedSlots: { customRender: 'fullPayment' }
  },
  {
    title: '欠款金额（元）',
    key: 'debts',
    dataIndex: 'debts'
  },
  {
    title: '用户昵称',
    key: 'userName',
    dataIndex: 'userName'
  },
  {
    title: '兑换手机号',
    key: 'phone',
    dataIndex: 'phone',
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '兑换时间',
    key: 'exchangeTime',
    dataIndex: 'exchangeTime'
  },
  {
    title: '处置记录',
    dataIndex: 'handleDetail',
    scopedSlots: { customRender: 'handleDetail' }
  },
  {
    title: '处置',
    key: 'operate',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'operate' }
  }
]
const columns_4 = [
  {
    title: '订单号',
    key: 'orderId',
    dataIndex: 'orderId'
  },
  {
    title: '区域',
    key: 'address',
    dataIndex: 'address'
  },
  {
    title: '回收时间',
    key: 'createTime',
    dataIndex: 'createTime'
  },
  {
    title: '回收人员',
    key: 'recycleUser',
    dataIndex: 'recycleUser'
  },
  {
    title: '回收清单',
    key: 'recycleList',
    dataIndex: 'recycleList',
    scopedSlots: { customRender: 'recycleList' }
  },
  {
    title: '回收总额',
    key: 'amount',
    dataIndex: 'amount',
    customRender: (text, record) => {
      text =
        record.payType === 2
          ? `${record.amount}元`
          : `${record.environment}积分`
      return text
    }
  },
  {
    title: '处置记录',
    dataIndex: 'handleDetail',
    scopedSlots: { customRender: 'handleDetail' }
  },
  {
    title: '处置',
    key: 'operate',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'operate' }
  }
]
const columns_5 = [
  {
    title: '订单号',
    key: 'orderId',
    dataIndex: 'orderId'
  },
  {
    title: '区域',
    key: 'address',
    dataIndex: 'address'
  },
  {
    title: '厨余回收人员',
    key: 'recycleUser',
    dataIndex: 'recycleUser'
  },
  {
    title: '回收时间',
    key: 'createTime',
    dataIndex: 'createTime'
  },
  {
    title: '计价方式',
    key: 'type',
    dataIndex: 'type',
    customRender (text, record) {
      text = record.type === 2 ? '计重计价' : '计次计价'
      return text
    }
  },
  {
    title: '重量（kg）',
    key: 'weight',
    dataIndex: 'weight'
  },
  {
    title: '单价（积分/kg）',
    key: 'unitPrice',
    dataIndex: 'unitPrice',
    customRender (text) {
      return text || '--'
    }
  },
  {
    title: '新增积分',
    key: 'environment',
    dataIndex: 'environment'
  },
  {
    title: '处置记录',
    dataIndex: 'handleDetail',
    scopedSlots: { customRender: 'handleDetail' }
  },
  {
    title: '处置',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'operate' }
  }
]
const recycleColumns = [
  {
    title: '品类',
    key: 'recycleCategory',
    dataIndex: 'recycleCategory'
  },
  {
    title: '回收量',
    key: 'recycleWeight',
    dataIndex: 'recycleWeight'
  },
  {
    title: '单价',
    key: 'unitPrice',
    dataIndex: 'unitPrice'
  },
  {
    title: '合计',
    key: 'recycleAmount',
    dataIndex: 'recycleAmount'
  }
]
// type 0:加 1:减 changeType 0:金额 1:积分
function validatePrimeNumber (number, max, type, changeType) {
  if (number < 0) {
    return {
      validateStatus: 'error',
      errorMsg: '抱歉处置数额不能为负'
    }
  }
  if (changeType === 1 && parseInt(number) !== parseFloat(number)) {
    return {
      validateStatus: 'error',
      errorMsg: `抱歉积分不能为小数`
    }
  }
  if (type) {
    if (number < max || number === max) {
      return {
        validateStatus: 'success',
        errorMsg: null
      }
    } else {
      return {
        validateStatus: 'error',
        errorMsg: `抱歉该订单的最大数额为${max}`
      }
    }
  } else {
    if (changeType === 1) {
      if (number > 2000) {
        return {
          validateStatus: 'error',
          errorMsg: `抱歉积分最大为2000`
        }
      }
    } else {
      if (number > 20) {
        return {
          validateStatus: 'error',
          errorMsg: `抱歉金额最大为20`
        }
      }
    }
  }
}

export default {
  data () {
    return {
      showpn: true,
      visible: false,
      loading: false,
      deductVisible: false,
      disposeVisible: false,
      recycleVisible: false,
      recordVisible: false,
      confirmLoading: false,
      maxAmount: 0,
      currentIndex: 1,
      id: '',
      userId: '',
      orderId: '',
      originId: '',
      giftId: '',
      changeTypeValue: '',
      typeValue_1: '投递未计额补加',
      typeValue_2: '投递违规扣减',
      IC: [],
      columns: [],
      tableData: [],
      recordList: [],
      recycleList: [],
      giftList: [],
      number: {},
      userInfo: {},
      currentItem: {},
      recycleColumns,
      deductForm: this.$form.createForm(this, { name: 'deductForm' }),
      disposeForm: this.$form.createForm(this, { name: 'disposeForm' }),
      tabsTitle: [
        {
          title: '投递记录',
          value: 1
        },
        {
          title: '取币记录',
          value: 2
        },
        {
          title: '兑换记录',
          value: 3
        },
        {
          title: '定点可回收记录',
          value: 4
        },
        {
          title: '定点厨余记录',
          value: 5
        }
      ],
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
  created: function () {
    this.load()
  },
  methods: {
    load () {
      this.handleQuery()
      this.getDetail()
      this.getTableData()
      this.getCardRecord()
    },
    submit (formName = 'deductForm') {
      const {
        [formName]: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors && !this.number.errorMsg) {
          if (formName === 'deductForm') {
            this.postDeduct(values)
          } else {
            this.postDispose(values)
          }
        }
      })
    },
    postDeduct (data) {
      const params = {
        userId: this.userId,
        ...data
      }
      cardHandle(params).then(res => {
        this.confirmLoading = false
        this.$message.success('卡费扣除成功')
        setTimeout(() => {
          this.handleCancel()
        }, 500)
      })
    },
    postDispose (data) {
      const params = {
        menuId: '52ae2863894b412c9a806d5996129795',
        type: 0,
        changeType: this.handleSetChangeType(this.currentIndex),
        originId: data.categoryId ? data.categoryId : this.id,
        userId: this.userId,
        handleType: this.currentIndex,
        ...data
      }
      this.confirmLoading = true
      memberHandle(params)
        .then(res => {
          this.confirmLoading = false
          this.$message.success('资金处置成功')
          setTimeout(() => {
            this.handleCancel('disposeForm')
            this.getTableData()
          }, 500)
        })
        .catch(() => {
          this.confirmLoading = false
        })
    },
    getDetail (id) {
      const params = {
        id: this.userId,
        menuId: '52ae2863894b412c9a806d5996129795'
      }
      getMemberInfo(params).then(res => {
        const result = res.result
        result.phoneNum = this.formatPhone(result.cellPhone)
        this.userInfo = res.result
      })
    },
    getTableData () {
      let func
      const index = this.currentIndex
      switch (index) {
        case 1:
          func = getDelivery
          this.columns = columns_1
          this.typeValue_1 = '投递未计额补加'
          this.typeValue_2 = '投递违规扣减'
          break
        case 2:
          func = getWithdraw
          this.columns = columns_2
          break
        case 3:
          func = getMachineList
          this.columns = columns_3
          this.typeValue_1 = '兑换机少出货补加'
          this.typeValue_2 = '兑换机多出货扣减'
          break
        case 4:
          func = getRecycleRecord
          this.columns = columns_4
          this.typeValue_1 = '定点可回收少计额补加'
          this.typeValue_2 = '定点可回收多计额扣减'
          break
        default:
          func = getRecycleRecord
          this.columns = columns_5
          this.typeValue_1 = '厨余回收少计额补加'
          this.typeValue_2 = '厨余回收多计额扣减'
          break
      }
      const params = {
        id: this.userId,
        page: this.pagination.current,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      if (index === 4 || index === 5) {
        params.type = index === 4 ? 0 : 1 // 1 定点厨余 0 可回收
      }
      this.loading = true
      func(params).then(res => {
        this.loading = false
        this.tableData = res.result.list
        this.pagination.total = res.result.totalCount || res.result.total || 0
      })
    },
    // 获取绑卡记录
    getCardRecord () {
      cardRecord(this.userId).then(res => {
        const list = res.result
        this.IC = list
        if (list.length) this.originId = list[0].id
      })
    },
    handleQuery () {
      this.userId = this.$route.query.id
    },
    handleTabChange (value) {
      this.currentIndex = value
      this.getTableData()
    },
    handleTableChange (pagination) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    handleRadioChange () {
      const val = this.disposeForm.getFieldValue('amount')
      if (val) {
        this.disposeForm.setFields({ amount: '' })
        this.number = { validateStatus: 'success', errorMsg: null }
      }
    },
    handleOperate (item) {
      this.orderId = item.orderId || item.id || ''
      this.id = item.id
      this.currentItem = item
      switch (this.currentIndex) {
        case 1:
          this.maxAmount =
            item.rubbishWeight > 0 ? item.catCoin || item.integralValue : 0
          break
        case 2:
          this.maxAmount = item.withdrawValue
          break
        case 3:
          this.maxAmount = item.usedCatCoin || item.usedEnviron || 0
          this.giftList = item.giftInfoList || []
          if (item.giftInfoList.length) this.giftId = item.giftInfoList[0].id
          break
        case 4:
          this.maxAmount =
            item.payType === 1 ? item.environment : item.amount || 0
          this.recycleList = item.recycleList || []
          break
        default:
          this.maxAmount = item.environment || 0
          break
      }
      this.disposeVisible = true
    },
    handleSetChangeType (index) {
      // changeType 0:金额 1:积分
      let val = 0
      if (index === 1) {
        if (this.currentItem.rubbishWeight > 0) {
          val = this.currentItem.catCoin > 0 ? 0 : 1
        } else {
          val = this.disposeForm.getFieldValue('changeType')
        }
      }
      if (index === 3) {
        val = parseInt(this.currentItem.payType) === 1 ? 0 : 1
      }
      if (index === 4 || index === 5) {
        val = parseInt(this.currentItem.payType) === 2 ? 0 : 1
      }
      return val
    },
    handleRecycleVisible (list) {
      this.recycleList = list
      this.recycleVisible = true
    },
    handleRecordVisible (list) {
      this.recordList = list
      this.recordVisible = true
    },
    handleCancel (formName = 'deductForm') {
      this[formName].resetFields()
      if (formName === 'disposeForm') {
        this.number = {
          validateStatus: 'success',
          errorMsg: null
        }
      }
      this.$nextTick(() => {
        if (formName === 'deductForm') {
          this.deductVisible = false
        } else {
          this.disposeVisible = false
        }
      })
    },
    handleNumberChange (value) {
      if (value || value === 0) {
        const changeType = this.handleSetChangeType(this.currentIndex)
        const type = this.disposeForm.getFieldValue('type')
        this.number = {
          ...validatePrimeNumber(value, this.maxAmount, type, changeType)
        }
      }
    },
    backPage () {
      this.$router.push({ path: '/member/memberList' })
    },
    formatPhone (val) {
      return val && val.length > 7
        ? val.substr(0, 3) + '****' + val.substr(val.length - 4, 4)
        : val
    },
    showAllPhoneNum () {
      this.userInfo.phoneNum = this.userInfo.cellPhone
      this.showpn = false
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
<style lang="stylus">
.diff
  .ant-form-item
    margin-bottom 10px
.siteModal
  .ant-modal-body
    padding-bottom 0
  .ant-modal-footer
    padding-top 0
    padding-bottom 24px
    text-align center
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
