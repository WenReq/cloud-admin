<template>
  <div>
    <a-row>
      <a-col :span="23">
        <div class="card-container" style="background:rgba(255,241,240,1); border:1px solid rgba(255,163,158,1);margin-right: 20px">
          <div class="card-title">
            当前订单状态：{{ orderStatusTxt }}
          </div>
          <div v-if="orderStatus==1" class="card-content tip">
            已超过付款时间{{ orderTimeOver }}，请尽快为用户发货，发货前请仔细核算订单信息、收货人及收货地址等，可联系用户确认
          </div>
          <div class="mb16 mt16">
            <div v-if="orderStatus==1">
              <a-button
                class="mr8"
                type="primary"
                @click="delivery"
              >
                发货
              </a-button>
              <a-button
                class="mr8"
                @click="cancelOrder"
              >
                取消订单
              </a-button>
              <a-button
                @click="modifyInfo"
              >
                修改收货信息
              </a-button>
            </div>
            <div v-if="orderStatus==2 || orderStatus==6">
              <a-button
                class="mr8"
                type="primary"
                @click="viewExpress"
              >
                查看快递
              </a-button>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-form ref="detailForm" :form="form" class="detail-form">
      <div class="card-container">
        <div class="card-title">
          基础信息
        </div>
        <div class="card-content">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="订单号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="baseInfoObj.orderId"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="付款时间"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="baseInfoObj.payDate"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="下单用户昵称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="baseInfoObj.placeOrderName"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="下单用户手机号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="baseInfoObj.placeOrderPhone"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div class="card-title">
          付款信息
        </div>
        <a-row>
          <a-col :span="23">
            <div class="card-content" style="margin-bottom: 14px">
              <a-table
                class="table-content"
                :columns="payInfoObj.columns"
                :row-key="record => Math.random() * 10000"
                :data-source="payInfoObj.data"
                :pagination="false"
              >
                <template slot="goodsPhoto" slot-scope="text">
                  <viewer :images="[text]">
                    <span v-for="(i, j) in [text]" :key="j">
                      <img
                        v-show="j==0" :src="i"
                        height="40" class="pd5"
                      >
                    </span>
                  </viewer>
                </template>
              </a-table>
            </div>
          </a-col>
        </a-row>

        <div class="card-title">
          收货人信息
        </div>
        <div class="card-content">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="收货人"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="baseInfoObj.receiver"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="手机号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="baseInfoObj.phone"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="收货地址"
                v-bind="formItemLayout"
              >
                <a-input
                  v-model="baseInfoObj.address"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div class="card-title">
          物流信息
        </div>
        <div class="card-content">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="快递单号"
                v-bind="formItemLayout"
              >
                <a-input
                  disabled
                >
                  <a-button
                    v-if="orderStatus==2 || orderStatus==6"
                    slot="prefix" style="padding: 0;font-size: 12px;color: #1890ff;" type="link"
                    @click="viewExpress"
                  >
                    {{ baseInfoObj.logisticsNum }}
                  </a-button>
                  <span v-if="orderStatus==1" slot="prefix" style="padding: 0;font-size: 12px;color: #000;">
                    待发货
                  </span>
                  <span v-if="orderStatus==4" slot="prefix" style="padding: 0;font-size: 12px;color: #000;">
                    待付款
                  </span>
                  <span v-if="orderStatus==5" slot="prefix" style="padding: 0;font-size: 12px;color: #000;">
                    已退款
                  </span>
                  <span v-if="orderStatus==7" slot="prefix" style="padding: 0;font-size: 12px;color: #000;">
                    已取消
                  </span>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="快递名称"
                v-bind="formItemLayout"
              >
                <a-input
                  disabled
                >
                  <span v-if="orderStatus==2 || orderStatus==6" slot="prefix" style="padding: 0; font-size: 12px;color: #000;">
                    {{ baseInfoObj.logisticsName }}
                  </span>
                  <span v-if="orderStatus==1" slot="prefix" style="padding: 0; font-size: 12px;color: #000;">
                    待发货
                  </span>
                  <span v-if="orderStatus==4" slot="prefix" style="padding: 0; font-size: 12px;color: #000;">
                    待付款
                  </span>
                  <span v-if="orderStatus==5" slot="prefix" style="padding: 0; font-size: 12px;color: #000;">
                    已退款
                  </span>
                  <span v-if="orderStatus==7" slot="prefix" style="padding: 0; font-size: 12px;color: #000;">
                    已取消
                  </span>
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div class="card-title">
          操作记录
        </div>
        <div class="card-content">
          <a-row>
            <a-col :span="23">
              <a-table
                class="table-content"
                :columns="operateObj.columns"
                :row-key="record => Math.random() * 10000"
                :data-source="operateObj.data"
                :pagination="false"
              >
              </a-table>
            </a-col>
          </a-row>
        </div>
        <div class="card-content mb40 mt40">
          <a-row type="flex" justify="center">
            <a-col
              :span="12" type="flex" align="middle"
              style="text-align:center;"
            >
              <a-button class="mr8" @click="back">
                返回
              </a-button>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-form>
    <a-modal
      title="发货确认" centered :visible="deliveryObj.visible"
      :mask-closable="false"
      @ok="deliveryConfirm" @cancel="deliveryObj.visible = false"
    >
      <a-form :form="deliveryObj.form">
        <a-form-item
          label="快递公司"
          v-bind="deliveryObj.formItemLayout"
        >
          <a-select
            v-decorator="['expressObj', { rules: [{ required: true, message: '请选择快递公司' }] }]"
            placeholder="请选择快递公司"
            label-in-value
          >
            <a-select-option
              v-for="(item, index) in deliveryObj.expressList" :key="index" label-in-value :value="item.expressCode"
            >
              {{ item.expressCompany }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="快递单号"
          v-bind="deliveryObj.formItemLayout"
        >
          <a-input
            v-decorator="['expressNum', { rules: [{ required: true, message: '请填写快递单号' }] }]"
            allow-clear placeholder="请填写快递单号"
          />
        </a-form-item>
        <a-form-item
          label="备注"
          v-bind="deliveryObj.formItemLayout"
        >
          <a-textarea
            v-decorator="['remark']"
            placeholder="请填写备注"
            :autosize="{ minRows: 4, maxRows: 6 }"
            :max-length="30"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <comfirmModal :dialog-obj="cancelObj" @handleOk="cancelOk">
      <a-form :form="cancelObj.form">
        <a-form-item class="comfirm-formitem">
          <a-textarea
            v-decorator="['remark', {rules: [{required: true, message: '请填写取消订单备注'}]}]"
            placeholder="请填写取消订单备注"
            :autosize="{ minRows: 4, maxRows: 6 }"
            :max-length="30"
          />
        </a-form-item>
      </a-form>
    </comfirmModal>
    <a-modal
      title="修改收货信息" centered :visible="modifyObj.visible"
      :mask-closable="false"
      @ok="modifyConfirm" @cancel="modifyObj.visible = false"
    >
      <a-form :form="modifyObj.form">
        <a-form-item
          label="收货人"
          v-bind="modifyObj.formItemLayout"
        >
          <a-input
            v-decorator="['receiver', { rules: [{ required: true, message: '请填写收货人' }] }]"
            allow-clear placeholder="请填写收货人"
          />
        </a-form-item>
        <a-form-item
          label="手机号"
          v-bind="modifyObj.formItemLayout"
        >
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '请填写手机号' }] }]"
            allow-clear placeholder="请填写手机号"
          />
        </a-form-item>
        <a-form-item
          label="区域"
          v-bind="modifyObj.formItemLayout"
        >
          <a-cascader
            v-decorator="['areas', { rules: [{ required: true, message: '请选择省市区' }] }]"
            :options="options"
            :load-data="loadData"
            :field-names="{
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            placeholder="省市区"
            @change="changeArea"
          />
        </a-form-item>
        <a-form-item
          label="收货地址"
          v-bind="modifyObj.formItemLayout"
        >
          <a-input
            v-decorator="['address', { rules: [{ required: true, message: '请填写收货地址' }] }]"
            allow-clear placeholder="请填写收货地址"
          />
        </a-form-item>
        <a-form-item
          label="备注"
          v-bind="modifyObj.formItemLayout"
        >
          <a-textarea
            v-decorator="['remark']"
            placeholder="请填写备注"
            :autosize="{ minRows: 4, maxRows: 6 }"
            :max-length="30"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="查看物流" centered :visible="wuliuObj.visible"
      :mask-closable="false"
      :footer="null" @cancel="wuliuObj.visible = false"
    >
      <div class="goods-info">
        <div class="img-contain">
          <img
            v-if="payInfoObj.data[0] && payInfoObj.data[0].itemPic" :src="payInfoObj.data[0].itemPic" width="48"
            height="48"
          >
          <div class="tip">
            {{ payInfoObj.data.length-1 }}件商品
          </div>
        </div>
        <div class="express-info">
          <div style="margin-bottom: 10px">
            配送快递：{{ baseInfoObj.logisticsName }}
          </div>
          <div>快递单号：{{ baseInfoObj.logisticsNum }} </div>
        </div>
      </div>
      <div class="process-step">
        <a-steps direction="vertical" style="height: 450px; overflow-y: scroll;">
          <a-step v-for="(item, index) in wuliuObj.stepList" :key="index" :status="index == 0 ? 'finish' : 'wait'">
            <i slot="icon" class="iconfont">&#xe63e;</i>
            <div slot="title">
              <span class="content time">
                {{ item.time }}
              </span>
            </div>
            <div slot="description">
              <span class="content txt">
                {{ item.context }}
              </span>
            </div>
          </a-step>
        </a-steps>
      </div>
      <div class="ant-modal-confirm-btns" align="center" style="margin-top: 10px">
        <a-button type="primary" @click="wuliuObj.visible=false">
          确定
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import comfirmModal from '@/components/commonModal/comfirmModal.vue'
import { getArea } from '@/components/mixins/mixins.js'
import moment from 'moment'
export default {
  components: { comfirmModal },
  mixins: [getArea],
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, { name: 'detailForm' }),
      deliveryObj: {
        visible: false,
        formItemLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 15 }
        },
        form: this.$form.createForm(this, { name: 'deliverForm' }),
        expressList: []
      },
      cancelObj: {
        visible: false,
        iconType: 'question-circle',
        title: '是否确定取消此订单',
        form: this.$form.createForm(this, { name: 'cancelForm' })
      },
      modifyObj: {
        areas: [],
        areaNames: [],
        visible: false,
        formItemLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 15 }
        },
        form: this.$form.createForm(this, { name: 'modifyForm' })
      },
      baseInfoObj: {
        orderId: '',
        orderCreateTime: '',
        placeOrderName: '',
        placeOrderPhone: ''
      },
      payInfoObj: {
        columns: [
          {
            title: '商品图片',
            dataIndex: 'itemPic',
            scopedSlots: { customRender: 'goodsPhoto' }
          },
          {
            title: '商品名称',
            dataIndex: 'itemName'
          },
          {
            title: '商户名称',
            dataIndex: 'merchant'
          },
          {
            title: '商品单价',
            dataIndex: 'itemUnitPrice'
          },
          {
            title: '购买数量',
            dataIndex: 'itemCount'
          },
          {
            title: '支付方式',
            dataIndex: 'payType',
            customRender (val, row, index) {
              if (row.itemCount) {
                if (val === 1) {
                  return '余额支付'
                } else if (val === 2) {
                  return '环保值支付'
                } else if (val === 3) {
                  return '支付宝支付'
                } else if (val === 4) {
                  return '微信支付'
                }
              }
            }
          },
          {
            title: '小计',
            dataIndex: 'subtotal',
            customRender (val, row, index) {
              if (row.payType === 2) {
                return val + '环保值'
              } else {
                return val + '元'
              }
            }
          }
        ],
        data: []
      },
      operateObj: {
        columns: [
          {
            title: '操作时间',
            dataIndex: 'handleTime'
          },
          {
            title: '操作者',
            dataIndex: 'handleName'
          },
          {
            title: '订单状态',
            dataIndex: 'orderStatus',
            customRender (val, row, index) {
              if (val === '1') {
                return '待发货'
              }
              if (val === '2') {
                return '已发货'
              }
              if (val === '4') {
                return '待付款'
              }
              if (val === '5') {
                return '已退款'
              }
              if (val === '6') {
                return '已完成'
              }
              if (val === '7') {
                return '已取消'
              }
            }
          },
          {
            title: '操作内容',
            dataIndex: 'handleContent'
          },
          {
            title: '备注',
            dataIndex: 'remark'
          }
        ],
        data: []
      },
      orderTimeOver: '',
      orderStatus: '',
      orderStatusTxt: '',
      wuliuObj: {
        visible: false,
        stepList: []
      }
    }
  },
  mounted () {
    this.getDeail()
  },
  methods: {
    getDeail () {
      this.$httpPost(this.$basePath.getMarketOrderInfo + '?orderId=' + this.$route.query.orderId, {})
        .then(res => {
          if (res.result.orderStatus === '1') {
            this.orderStatus = 1
            this.orderStatusTxt = '待发货'
          }
          if (res.result.orderStatus === '2') {
            this.orderStatus = 2
            this.orderStatusTxt = '已发货'
          }
          if (res.result.orderStatus === '4') {
            this.orderStatus = 4
            this.orderStatusTxt = '待付款'
          }
          if (res.result.orderStatus === '5') {
            this.orderStatus = 5
            this.orderStatusTxt = '已退款'
          }
          if (res.result.orderStatus === '6') {
            this.orderStatus = 6
            this.orderStatusTxt = '已完成'
          }
          if (res.result.orderStatus === '7') {
            this.orderStatus = 7
            this.orderStatusTxt = '已取消'
          }
          var total = ''
          res.result.orderItemInfos.forEach(item => {
            total += item.subtotal
          })
          res.result.orderItemInfos.push({
            payType: res.result.orderItemInfos[0].payType,
            subtotal: '总计：' + total
          })
          if (res.result.orderStatus === '1') {
            var nowDate = moment().format('YYYY-MM-DD HH:mm:ss')
            var payTime = res.result.payDate
            var minutes = moment(nowDate).diff(moment(payTime), 'minutes')
            this.orderTimeOver = Math.floor(minutes / 60) + '小时' + (minutes - Math.floor(minutes / 60) * 60) + '分钟'
          }
          this.payInfoObj.data = res.result.orderItemInfos
          this.operateObj.data = res.result.handleRecordList
          this.baseInfoObj = res.result
        })
    },
    delivery () {
      this.deliveryObj.visible = true
      this.deliveryObj.form.resetFields()
      this.getExpressList()
    },
    getExpressList () {
      this.$httpPost(this.$basePath.getExpressList)
        .then(res => {
          this.deliveryObj.expressList = res.result
        })
    },
    deliveryConfirm () {
      this.deliveryObj.form.validateFields((err, values) => {
        if (!err) {
          var param = {}
          param.orderId = this.$route.query.orderId
          param.expressCompany = this.deliveryObj.form.getFieldValue('expressObj').label.trim()
          param.expressCode = this.deliveryObj.form.getFieldValue('expressObj').key
          param.expressNum = this.deliveryObj.form.getFieldValue('expressNum')
          param.remark = this.deliveryObj.form.getFieldValue('remark')
          this.$httpPost(this.$basePath.delivery, param)
            .then(res => {
              this.$message.success('发货成功')
              this.deliveryObj.visible = false
              this.getDeail()
            })
        }
      })
    },
    cancelOrder () {
      this.cancelObj.visible = true
      this.cancelObj.form.resetFields()
    },
    cancelOk () {
      this.$httpPost(this.$basePath.cancelOrder, {
        orderId: this.$route.query.orderId,
        remark: this.cancelObj.form.getFieldValue('remark')
      })
        .then(res => {
          this.$message.success('取消成功')
          this.cancelObj.visible = false
          this.getDeail()
        })
    },
    modifyInfo () {
      this.modifyObj.visible = true
      this.modifyObj.form.resetFields()
      this.getArea('', 2, null, true)
    },
    modifyConfirm () {
      this.modifyObj.form.validateFields(err => {
        if (!err) {
          var param = {}
          var formData = JSON.parse(JSON.stringify(this.modifyObj.form.getFieldsValue()))
          param.remark = formData.remark
          param.receiver = formData.receiver
          param.phone = formData.phone
          param.address = formData.address
          param.orderId = this.$route.query.orderId
          param.provinceId = formData.areas[0]
          param.cityId = formData.areas[1]
          param.areaId = formData.areas[2]
          param.provinceName = this.modifyObj.areaNames[0]
          param.cityName = this.modifyObj.areaNames[1]
          param.areaName = this.modifyObj.areaNames[2]
          this.$httpPost(this.$basePath.updateDeliveryAddress, param)
            .then(res => {
              this.$message.success('修改成功')
              this.modifyObj.visible = false
              this.getDeail()
            })
        }
      })
    },
    viewExpress () {
      this.wuliuObj.visible = true
      this.$httpPost(this.$basePath.getExpressInfo + '?orderId=' + this.$route.query.orderId, {})
        .then(res => {
          this.wuliuObj.stepList = res.result.data
        })
    },
    back () {
      this.$router.push({
        path: '/order/shoppingmall/phyGoodsOrder'
      })
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    changeArea (value, options) {
      this.modifyObj.areaNames = []
      if (!options) return
      options.forEach(item => {
        this.modifyObj.areaNames.push(item.name)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.pd5
  padding 5px
.tip
  font-size 12px
  color #666666
.mb16
  margin-bottom 16px
.mt16
  margin-top 16px
.goods-info
  height 68px
  border-radius 4px
  background-color #F1F1F1
  display flex
  align-items center
.express-info
  display flex
  flex-direction column
  justify-content center
  font-size 12px
  color #666666
  padding-left 10px
.img-contain
  position relative
  margin-left 10px
  .tip
    position absolute
    left 0
    bottom 0
    font-size 12px
    transform scale(0.8)
    color #fff
    text-align center
    line-height 16px
    width 48px
    height 16px
    background rgba(0,0,0,0.4)
    border-radius 0px 0px 4px 4px
.process-step
  margin-top 10px
  max-height 580px
  overflow-y auto
  >>>.ant-steps-item-finish > .ant-steps-item-tail::after
    background #e8e8e8
  >>>.ant-steps-vertical > .ant-steps-item > .ant-steps-item-tail
    padding 22px 0 0 0
    height 119%
  >>>.ant-steps-icon
    line-height 16px
  .content
    &.time
      font-size 12px
      color #999999
    &.txt
      font-size 14px
      color #333333
</style>
