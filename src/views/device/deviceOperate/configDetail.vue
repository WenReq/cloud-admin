<template>
  <div class="card-container">
    <a-form ref="detailForm" :form="form">
      <div>
        <div class="card-title">
          基础配置
        </div>
        <div class="card-content">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="设备编号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productId']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="设备名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['name']"
                  :disabled="!isEdit"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="设备型号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productMarkName']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="运营人员"
                v-bind="formItemLayout"
                show-search
                :filter-option="filterOption"
              >
                <a-select
                  v-decorator="['operation']"
                  placeholder="全部"
                  disabled
                >
                  <a-select-option v-for="(item, index) in userList" :key="index" :value="item.id">
                    {{ item.nickName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="绑定区域"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['areas']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="小区"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['estateName']"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="详细地址"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['address']"
                  :disabled="!isEdit"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="设备安装时间"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['updateTime']"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="设备坐标"
                v-bind="formItemLayout"
              >
                <a-input
                  v-if="isEdit"
                  v-decorator="['pos']"
                  read-only
                  @click="choosePos"
                />
                <a-input
                  v-if="!isEdit"
                  v-decorator="['pos']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="启用状态"
                v-bind="formItemLayout"
              >
                <a-radio-group
                  name="radioGroup" default-value="启用"
                  :disabled="!isEdit"
                >
                  <a-radio value="启用">
                    启用
                  </a-radio>
                  <a-radio value="停用" disabled>
                    停用
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="设备工作时间"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 18 }"
              >
                <a-radio-group
                  v-decorator="['workTime', { initialValue: '0-24' }]"
                  :disabled="!isEdit"
                >
                  <a-radio value="0-24">
                    全天
                  </a-radio>
                  <a-radio value="6-20">
                    白天（6:00-20:00）
                  </a-radio>
                  <a-radio value="20-6">
                    夜间（20:00-6:00）
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <template v-if="saveScenario != 1">
          <div class="card-title mt16">
            设备补币
          </div>
          <div class="card-content">
            <a-row>
              <a-col v-if="isEdit" :span="12">
                <a-form-item
                  label="设备补币前余额"
                  v-bind="formItemLayout"
                >
                  <a-input
                    v-decorator="['coinNum']"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col v-if="isEdit" :span="12">
                <a-form-item
                  label="本次补币金额"
                  v-bind="formItemLayout"
                >
                  <a-input
                    v-decorator="['addCoinNum', {
                      rules: [
                        {pattern: new RegExp(/^(0\.0[1-9]|0\.[1-9]\d|[1-9]\d?(\.\d\d)?|[1-3]\d\d?|400)$/, 'g'), message: '请输入小于等于400的正整数！'}
                      ]
                    }]"
                  />
                </a-form-item>
              </a-col>
              <a-col v-if="!isEdit" :span="12">
                <a-form-item
                  label="设备当前余额"
                  v-bind="formItemLayout"
                >
                  <a-input
                    v-decorator="['currentCoinNum']"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col v-if="!isEdit" :span="12">
                <a-form-item
                  label="最近补币时间"
                  v-bind="formItemLayout"
                >
                  <a-input
                    v-decorator="['createTime']"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col v-if="!isEdit" :span="12">
                <a-form-item
                  label="总计补币金额"
                  v-bind="formItemLayout"
                >
                  <a-input
                    v-decorator="['totalCoin']"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col v-if="!isEdit" :span="12">
                <a-form-item
                  label="补币人员"
                  v-bind="formItemLayout"
                >
                  <a-input
                    v-decorator="['userName']"
                    disabled
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </template>
      </div>
    </a-form>
    <div class="card-title mt16">
      投口工作时间
    </div>
    <div class="card-content">
      <a-row style="padding-left: 12px;">
        <a-col :span="23">
          <a-form-model>
            <a-table
              class="table-content"
              :row-key="record => record.deviceCode"
              :columns="workTimeColumns"
              :data-source="devicesList"
              :pagination="false"
              bordered
            >
              <template slot="workTime" slot-scope="text, record">
                <div style="text-align:left;">
                  <span v-if="record.workTime && record.workTime.length">
                    <span
                      v-for="(item,index) in record.workTime"
                      :key="item.deviceCode"
                    >
                      <a-time-picker
                        :value="item.start ? moment(item.start,'HH:mm') : null" :default-open-value="moment('00:00', 'HH:mm')" placeholder="开始时间"
                        format="HH:mm" @change="e => startTimeChange(e, index,text, record,'start')"
                      />
                      ~
                      <a-time-picker
                        :value="item.end ? moment(item.end,'HH:mm') : null" :default-open-value="moment('00:00', 'HH:mm')" placeholder="结束时间"
                        format="HH:mm" @change="e => startTimeChange(e, index,text, record,'end')"
                      />
                      <span v-if="isEdit" class="delete" @click="handleChangeTime([],index,record,'delete')">
                        <a-icon type="delete" />
                      </span>
                    </span>
                  </span>
                  <a-button
                    v-if="isEdit"
                    type="primary" ghost
                    @click="handleAddTimes(record)"
                  >
                    + 配置时间
                  </a-button>
                </div>
              </template>
            </a-table>
          </a-form-model>
        </a-col>
      </a-row>
    </div>
    <div class="card-title mt16">
      价格及满溢配置
    </div>
    <div class="card-content">
      <a-row style="padding-left: 12px;">
        <a-col :span="23">
          <a-form-model
            ref="ruleForm"
            :model="modelForm"
          >
            <a-table
              class="table-content"
              :row-key="record => record.id"
              :columns="columns"
              :data-source="data"
              :pagination="false"
              bordered
            >
              <template slot="typeTitle">
                <span>计价方式 </span>
                <a-tooltip>
                  <template slot="title">
                    金额计重指按投递重量产生对应金额（人民币）给到用户IC卡里；积分计重指按投递重量产生对应积分给到用户IC卡里；积分计次指每次投递按固定积分给到用户IC卡里。
                  </template>
                  <a-icon style="color:gray" type="question-circle" />
                </a-tooltip>
              </template>
              <template slot="weightTitle">
                <span>产生金额起始重量(千克) </span>
                <a-tooltip>
                  <template slot="title">
                    产生金额起始重量指每次投递超过设置的重量后才会计算产生对应的金额或积分，投递重量少于设置的重量则不会产生金额或积分。
                  </template>
                  <a-icon style="color:gray" type="question-circle" />
                </a-tooltip>
              </template>
              <template slot="thresholdTitle">
                <span>满溢预警阀值（千克）</span>
                <a-tooltip>
                  <template slot="title">
                    满溢预警阀值指设备达到此称重重量且红外探测到满溢等条件，则会推送给华展云APP满溢提醒信息，避免单纯靠红外检测产生误报满溢。可预估配置每个桶装满垃圾后的重量。
                  </template>
                  <a-icon style="color:gray" type="question-circle" />
                </a-tooltip>
              </template>
              <template
                v-for="col in ['unitPrice','type', 'initialWeight', 'threshold']"
                :slot="col"
                slot-scope="text, record"
              >
                <div v-if="isEdit && col !== 'type'" :key="col">
                  <a-form-model-item
                    style="margin-bottom: 0px;"
                    :prop="col"
                    :rules="{validator: checkQuantity, prodObj: record, trigger: 'blur'}"
                  >
                    <a-input
                      class="input-table"
                      :value="text"
                      onkeyup="value=value==''?0:value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                      @change="e => handleChange(e.target.value, record.key, col)"
                    />
                    <span v-if="col === 'unitPrice' && record.type === 0">
                      元/千克
                    </span>
                    <span v-else-if="col === 'unitPrice' && record.type === 1">
                      个/千克
                    </span>
                    <span v-else-if="col === 'unitPrice' && record.type === 2">
                      个 / 次
                    </span>
                    <span v-else-if="col === 'initialWeight' && record.type === 2">
                    </span>
                  </a-form-model-item>
                </div>
                <div v-else-if="isEdit && col == 'type'" :key="col">
                  <a-radio-group
                    name="radioGroup" :value="text" :default-value="0"
                    @change="e => handleChange(e.target.value, record.key, col)"
                  >
                    <a-radio :value="0">
                      金额计重
                    </a-radio>
                    <a-radio :value="1">
                      积分计重
                    </a-radio>
                    <a-radio :value="2">
                      积分计次
                    </a-radio>
                  </a-radio-group>
                </div>
                <span v-else :key="col">
                  <span v-if="col!=='type'">{{ text }}</span>
                  <span v-if="col==='type'&& record.type === 0">金额计重</span>
                  <span v-if="col==='type'&& record.type === 1">积分计重</span>
                  <span v-if="col==='type'&& record.type === 2">积分计次</span>
                  <span v-if="col === 'unitPrice' && record.type === 0 && record.unitPrice">
                    元/千克
                  </span>
                  <span v-else-if="col === 'unitPrice' && record.type === 1 && record.unitPrice">
                    个/千克
                  </span>
                  <span v-else-if="col === 'unitPrice' && record.type === 2 && record.unitPrice">
                    个 / 次
                  </span>
                  <span v-else-if="col === 'initialWeight' && record.type === 2 && record.initialWeight">
                  </span>
                </span>
              </template>
            </a-table>
          </a-form-model>
        </a-col>
      </a-row>
    </div>
    <div class="card-content mb40 mt40">
      <a-row type="flex" justify="center">
        <a-col
          :span="12" type="flex" align="middle"
          style="text-align:center;"
        >
          <a-button class="mr8" :type="isEdit?'':'primary'" @click="back">
            返回
          </a-button>
          <a-button v-if="isEdit" type="primary" @click="save">
            保存
          </a-button>
        </a-col>
      </a-row>
    </div>
    <chooseSite
      ref="chooseMap"
      :map-dialog-obj="mapDialogObj"
      @getPosition="getPosition"
    />
  </div>
</template>

<script>
import chooseSite from '@/components/map/chooseSite.vue'
import { findUser } from '@/components/mixins/mixins.js'
import moment from 'moment'
export default {
  components: { chooseSite },
  mixins: [findUser],
  data () {
    return {
      modelForm: {
        unitPrice: '',
        initialWeight: ''
      },
      isEdit: true,
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, { name: 'detailForm' }),
      workTimeColumns: [
        {
          title: '投口',
          dataIndex: 'markName',
          align: 'center',
          width: 107
        },
        {
          title: '工作时间（配置投口工作时间需重启设备后生效）',
          dataIndex: 'workTime',
          align: 'center',
          scopedSlots: { customRender: 'workTime' }
        }
      ],
      columns: [
        {
          title: '回收分类',
          dataIndex: 'dataValue',
          align: 'center'
        },
        {
          dataIndex: 'type',
          align: 'center',
          slots: { title: 'typeTitle' },
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '品类单价',
          dataIndex: 'unitPrice',
          align: 'center',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          dataIndex: 'initialWeight',
          align: 'center',
          slots: { title: 'weightTitle' },
          scopedSlots: { customRender: 'initialWeight' }
        }
      ],
      data: [],
      mapDialogObj: {
        visible: false
      },
      positionInfo: {},
      saveId: '',
      saveScenario: '',
      productId: '',
      devicesList: []
    }
  },
  mounted () {
    if (this.$route.name === 'configDetail') {
      this.isEdit = true
    } else {
      this.isEdit = false
    }
    this.getDetail()
    this.findUser('operate')
  },
  methods: {
    startTimeChange (e, index, text, record, fields) {
      const newData = [...this.devicesList]
      const target = newData.filter(item => record.deviceCode === item.deviceCode)[0]
      if (target) {
        target['workTime'][index][fields] = e && e._d ? moment(e._d).format('HH:mm') + ':00' : null
        // 如果开始时间大于结束时间，两个值调换。
        const startTime = target && target['workTime'][index]['start']
        const endTime = target && target['workTime'][index]['end']
        if (startTime > endTime) {
          target['workTime'][index]['start'] = endTime
          target['workTime'][index]['end'] = startTime
        }
      }
      this.devicesList = newData
    },
    moment,
    // 给当前投口添加时间控件
    handleAddTimes (row) {
      const newData = [...this.devicesList]
      const target = newData.filter(item => row.deviceCode === item.deviceCode)[0]
      if (target) {
        if (!target.workTime) {
          const newArr = []
          newArr.push({ start: '00:00:00', end: this.moment().format('HH:mm') + ':00' })
          target['workTime'] = newArr
        } else {
          target['workTime'].push({ start: '00:00:00', end: this.moment().format('HH:mm') + ':00' })
        }
      }
      this.devicesList = newData
    },
    handleClear () {
      console.log('clear')
    },
    handleChangeTime (time, index, record, flag) {
      const newData = [...this.devicesList]
      const target = newData.filter(item => record.deviceCode === item.deviceCode)[0]
      if (target) {
        if (flag === 'select') {
          target['workTime'][index]['start'] = time[0] + ':00'
          target['workTime'][index]['end'] = time[1] + ':00'
        } else if (flag === 'delete') {
          target['workTime'].splice(index, 1)
        }
      }
      this.devicesList = newData
    },
    checkQuantity (rule, value, callback) {
      if (rule.prodObj[rule.field] === '' || rule.prodObj[rule.field] === null || rule.prodObj[rule.field] === undefined) {
        callback(new Error('值不能为空'))
      } else if (!/(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/.test(Number(rule.prodObj[rule.field]))) {
        callback(new Error('请输入正确的值'))
      } else if (rule.field === 'unitPrice' && (rule.prodObj.type === 1 || rule.prodObj.type === 2) && (!/^[1-9]\d*$/.test(Number(rule.prodObj[rule.field])) && Number(rule.prodObj[rule.field]))) {
        callback(new Error('值必须为正整数'))
      } else {
        callback()
      }
    },
    getDetail () {
      this.$httpPost(this.$basePath.deviceDetail, {
        id: this.$route.query.id
      })
        .then(res => {
          this.saveId = res.result.id
          this.saveScenario = res.result.scenario
          this.productId = res.result.productId
          var data = res.result
          var dataArr = res.result.dictList
          // if (this.saveScenario === '2') {
          this.columns.push(
            {
              // title: '满溢预警阀值（千克）',
              dataIndex: 'threshold',
              align: 'center',
              slots: { title: 'thresholdTitle' },
              scopedSlots: { customRender: 'threshold' }
            }
          )
          // }
          if (dataArr.length > 0) {
            dataArr.forEach((item, index) => {
              item.key = index.toString()
              if (item.type === undefined) {
                item.type = 0
              }
            })
            this.data = dataArr
          }
          if (data && data.devices.length) {
            this.devicesList = data.devices
          }
          if (this.isEdit) {
            this.form.setFieldsValue({
              productId: data.productId,
              name: data.name,
              productMarkName: data.productMark ? data.productMark.name : '',
              areas: data.areas,
              estateName: data.estateName,
              address: data.address,
              updateTime: data.updateTime,
              pos: data.lo + ',' + data.la,
              workTime: data.productTime ? data.productTime.workTime : '0-24',
              coinNum: data.coinNum,
              operation: data.operation
            })
          } else {
            this.form.setFieldsValue({
              productId: data.productId,
              name: data.name,
              productMarkName: data.productMark ? data.productMark.name : '',
              areas: data.areas,
              estateName: data.estateName,
              address: data.address,
              updateTime: data.updateTime,
              pos: data.lo + ',' + data.la,
              workTime: data.productTime ? data.productTime.workTime : '0-24',
              currentCoinNum: data.coinNum,
              createTime: data.deviceCoinNum ? data.deviceCoinNum.createTime : '',
              totalCoin: data.totalCoin,
              userName: data.deviceCoinNum ? data.deviceCoinNum.userName : '',
              operation: data.operation
            })
          }
        })
    },
    handleChange (value, key, column) { // 表格input绑定值
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
      }
      // 处理计价方式为积分计次时，产生金额起始重量设置为0
      if (value === 2) {
        target['initialWeight'] = 0
      }
      this.data = newData
    },
    choosePos () {
      this.mapDialogObj.visible = true
      this.$refs.chooseMap.initMap()
    },
    getPosition (positionInfo) { // 获取地区选取信息
      if (positionInfo.point) {
        this.form.setFieldsValue({ pos: positionInfo.point.lng + ',' + positionInfo.point.lat })
      }
    },
    back () {
      this.$router.push({
        path: '/device/operation/deviceConfig'
      })
    },
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$refs['ruleForm'].validate(valid => {
            if (valid) {
              var param = {}
              var dictList = JSON.parse(JSON.stringify(this.data))
              var formData = this.form.getFieldsValue()
              var pos = formData.pos.split(',')
              dictList.forEach(item => {
                delete item.key
                // if (this.saveScenario === '1') {
                //   delete item.threshold
                // }
              })
              param.menuId = '922715ab243345f3a54e5340cf1ef215'
              param.id = this.saveId
              param.scenario = this.saveScenario
              param.productId = this.productId
              param.name = formData.name
              param.address = formData.address
              param.operation = formData.operation
              param.addCoinNum = formData.addCoinNum
              param.dictList = dictList
              param.devices = this.devicesList
              if (pos.length > 0) {
                param.lo = pos[0]
                param.la = pos[1]
              }
              param.productTime = {
                workTime: formData.workTime,
                productId: this.saveId
              }
              this.$httpPost(this.$basePath.deviceSave, param)
                .then(res => {
                  this.$message.success(res.msg)
                  this.$router.push({
                    path: '/device/operation/deviceConfig'
                  })
                })
            }
          })
        }
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
// 注释
.delete
  cursor: pointer
  margin: 0 15px 0 5px
</style>
