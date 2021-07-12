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
                label="智能秤名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['name']"
                  :disabled="!isEdit"
                  max-length="50"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="智能秤型号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productMarkName']"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
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
                label="运营人员"
                v-bind="formItemLayout"
                show-search
                :filter-option="filterOption"
              >
                <a-select
                  v-decorator="['operation']"
                  placeholder="全部"
                  :disabled="!isEdit"
                >
                  <a-select-option v-for="(item, index) in userList" :key="index" :value="item.id">
                    {{ item.nickName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-form>
    <div class="card-title mt16">
      回收配置
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
              <template
                v-for="col in ['unitPrice','type', 'initialWeight', 'threshold','isShow']"
                :slot="col"
                slot-scope="text, record"
              >
                <div v-if="isEdit && col !== 'type' && col !== 'isShow'" :key="col">
                  <a-form-model-item
                    style="margin-bottom: 0px;"
                    :prop="col"
                    :rules="{validator: checkQuantity, prodObj: record, trigger: 'blur'}"
                  >
                    <a-input
                      class="input-table"
                      :value="text"
                      onkeyup="value=value==''?'':value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
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
                <span v-else-if="isEdit && col === 'isShow'" :key="col">
                  <a-switch
                    checked-children="显示" un-checked-children="隐藏" :checked="text === 1"
                    @change="e => handleSwitchChange(e, record.key, col)"
                  />
                </span>
                <span v-else :key="col">
                  <span v-if="col!=='type' && col!=='isShow'">{{ text }}</span>
                  <span v-if="col==='type'&& record.type === 0">金额计重</span>
                  <span v-if="col==='type'&& record.type === 1">积分计重</span>
                  <span v-if="col==='type'&& record.type === 2">积分计次</span>
                  <span v-if="col==='isShow'&& record.isShow === 1">显示</span>
                  <span v-if="col==='isShow'&& record.isShow === 0">隐藏</span>
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
    <div v-if="!isEdit" class="card-title mt16">
      智能秤回收记录
    </div>
    <div v-if="!isEdit" class="card-content">
      <a-table
        class="table-content"
        :row-key="record => record.id"
        :columns="tableColumns"
        :data-source="dataList"
        :loading="loading"
        :pagination="pagination"
        :scroll="{x: 1500}"
        @change="handleTableChange"
      >
      </a-table>
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
      tableColumns: [
        {
          title: '订单号',
          dataIndex: 'orderId'
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
          dataIndex: 'deliveryTime'
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
      },
      dataList: [],
      loading: false,
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
        },
        {
          title: '前端显示',
          dataIndex: 'isShow',
          align: 'center',
          scopedSlots: { customRender: 'isShow' }
        }
      ],
      data: [],
      mapDialogObj: {
        visible: false
      },
      positionInfo: {},
      saveId: '',
      saveScenario: '',
      productId: ''
    }
  },
  mounted () {
    if (this.$route.query.pageType === 'edit') {
      this.isEdit = true
    } else {
      this.isEdit = false
      this.getViewDate()
    }
    this.getDetail()
    this.findUser('operate')
  },
  methods: {
    moment,
    handleClear () {
      console.log('clear')
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
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getViewDate()
    },
    getViewDate () {
      const vm = this
      const params = {}
      params.id = vm.$route.query.id
      params.pageNo = vm.pagination.current
      params.pageSize = vm.pagination.pageSize
      vm.loading = true
      vm.$httpPost('/product/getDeliveryScale', params).then(res => {
        vm.loading = false
        vm.dataList = res.result.list
        vm.pagination.total = res.result.totalCount
      }).catch(error => {
        vm.loading = false
        console.error(error)
      })
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
          if (dataArr.length > 0) {
            dataArr.forEach((item, index) => {
              item.key = index.toString()
              if (item.type === undefined) {
                item.type = 0
              }
              if (item.isShow === undefined) {
                item.isShow = 1
              }
            })
            this.data = dataArr
          }
          if (data && data.devices.length) {
            this.devicesList = data.devices
          }
          this.form.setFieldsValue({
            productId: data.productId,
            name: data.name,
            productMarkName: data.productMark ? data.productMark.name : '',
            areas: data.areas,
            updateTime: data.updateTime,
            operation: data.operation
          })
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
    handleSwitchChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value ? 1 : 0
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
        path: '/device/smartScales/list'
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
              // var pos = formData.pos.split(',')
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
              param.operation = formData.operation
              param.dictList = dictList
              param.devices = this.devicesList
              this.$httpPost(this.$basePath.deviceSave, param)
                .then(res => {
                  this.$message.success(res.msg)
                  this.$router.push({
                    path: '/device/smartScales/list'
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
