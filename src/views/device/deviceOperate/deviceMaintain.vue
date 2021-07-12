<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="10">
            运维看板
          </a-col>
          <a-col :span="14" align="right">
            <a-radio-group
              v-model="type" class="group-radio"
              @change="changeType"
            >
              <a-radio-button value="1">
                今日
              </a-radio-button>
              <a-radio-button value="2">
                最近7天
              </a-radio-button>
              <a-radio-button value="3">
                最近30天
              </a-radio-button>
            </a-radio-group>
            <a-range-picker
              v-model="showtime"
              class="mrl12"
              :default-value="[moment(), moment()]"
              @change="changeTime"
            />
          </a-col>
        </a-row>
      </div>
      <div class="card-content">
        <a-row class="panel-container">
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <span class="icon"><iconFont type="iconicon-test1" /></span>设备总数
            </div>
            <div class="type-num">
              {{ boardObj.equipmentCount | numberFl }}
            </div>
          </a-col>
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <span class="icon"><iconFont type="iconicon-test2" /></span>巡检次数
            </div>
            <div class="type-num">
              {{ boardObj.routingInspectionCount | numberFl }}
            </div>
          </a-col>
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <span class="icon" style="margin-top: -2px;"><iconFont type="iconicon-test3" /></span>满溢次数
            </div>
            <div class="type-num">
              {{ boardObj.spillOverCount | numberFl }}
            </div>
          </a-col>
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <span class="icon"><iconFont type="iconicon-test4" /></span>清运次数
            </div>
            <div class="type-num">
              {{ boardObj.pickUpCount | numberFl }}
            </div>
          </a-col>
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <span class="icon"><iconFont type="iconicon-test5" /></span>维修次数
            </div>
            <div class="type-num">
              {{ boardObj.repairCount | numberFl }}
            </div>
          </a-col>
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <span class="icon"><iconFont type="iconicon-test6" /></span>补币总金额（元）
            </div>
            <div class="type-num">
              {{ boardObj.allRecharge | numberFl }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
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
                v-bind="formItemLayout"
              >
                <a-cascader
                  v-model="areas"
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
              <a-form-item
                label="小区"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['housingEstate']"
                  allow-clear
                  show-search
                  :filter-option="filterOption"
                  placeholder="全部"
                >
                  <a-select-option v-for="(item,index) in estateList" :key="index" :value="item.id">
                    {{ item.housingEstate }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备安装时间"
                v-bind="formItemLayout"
              >
                <a-range-picker
                  v-model="time1"
                  @change="changeInstallTime"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备状态"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['productStatus']"
                  allow-clear
                  placeholder="全部"
                >
                  <a-select-option value="1">
                    异常
                  </a-select-option>
                  <a-select-option value="2">
                    满溢
                  </a-select-option>
                  <a-select-option value="3">
                    缺币
                  </a-select-option>
                  <a-select-option value="4">
                    正常
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productName']"
                  allow-clear
                  placeholder="请输入设备名称"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备类型"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['productType']"
                  allow-clear
                  placeholder="全部"
                >
                  <a-select-option value="1">
                    智能垃圾箱
                  </a-select-option>
                  <a-select-option value="2">
                    智能回收站
                  </a-select-option>
                  <a-select-option value="4">
                    智能垃圾房
                  </a-select-option>
                  <!-- <a-select-option value="5">
                    智能垃圾亭
                  </a-select-option> -->
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备型号"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['productMark']"
                  allow-clear
                  show-search
                  :filter-option="filterOption"
                  placeholder="全部"
                >
                  <a-select-option v-for="(item, index) in markList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备编号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productNumber']"
                  allow-clear
                  placeholder="请输入设备编号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备组名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productGroupName']"
                  allow-clear
                  placeholder="请输入设备组名称"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备组型号"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['productGroupMark']"
                  allow-clear
                  placeholder="全部"
                >
                  <a-select-option v-for="(item, index) in groupMarkList" :key="index" :value="item.id">
                    {{ item.key }}
                  </a-select-option>
                </a-select>
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
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="12">
            设备列表
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
          :columns="columns"
          :row-key="record => record.id"
          :data-source="data"
          :loading="loading"
          :pagination="pagination"
          :scroll="{x: 1500}"
          @change="handleTableChange"
        >
          <template slot="member" slot-scope="text, record">
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="associatedPer(record)"
            >
              关联人员
            </a-button>
          </template>
          <template slot="detail" slot-scope="text, record">
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="toDetail(record)"
            >
              运维数据
            </a-button>
          </template>
          <template slot="productStatus" slot-scope="text">
            <div style="display: flex; align-items: center">
              <span v-if="text && text != '正常'" style="width:6px;height:6px;background:#F22635;margin-right:10px;border-radius:50%;"></span> {{ text }}
            </div>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      v-model="associatedObj.visible"
      centered
      :width="700"
      :footer="null"
      title="设备关联人员"
    >
      <a-table
        class="table-content"
        :columns="associatedObj.columns"
        :row-key="record => record.id"
        :data-source="associatedObj.data"
        :pagination="false"
      >
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { getMarkList, getGroupMark, getArea, getEstate, toExportExcel, iconFontComponent } from '@/components/mixins/mixins.js'
export default {
  components: {},
  mixins: [getMarkList, getGroupMark, getArea, getEstate, toExportExcel, iconFontComponent],
  data () {
    return {
      showtime: undefined,
      time: undefined,
      type: '1',
      boardObj: {
        allRecharge: 0,
        equipmentCount: 0,
        pickUpCount: 0,
        repairCount: 0,
        routingInspectionCount: 0,
        spillOverCount: 0
      },
      time1: undefined,
      installTime: [],
      areas: [],
      dateTab: '',
      dateTime: '',
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, {}),
      columns: [
        {
          title: '小区',
          dataIndex: 'housingEstate'
        },
        {
          title: '设备名称',
          dataIndex: 'productName'
        },
        {
          title: '设备类型',
          dataIndex: 'productType'
        },
        {
          title: '设备型号',
          dataIndex: 'productMark'
        },
        {
          title: '设备编号',
          dataIndex: 'productNumber'
        },
        {
          title: '设备安装时间',
          dataIndex: 'productInstallTime'
        },
        {
          title: '设备当前状态',
          dataIndex: 'productStatus',
          scopedSlots: { customRender: 'productStatus' }
        },
        {
          title: '关联人员',
          scopedSlots: { customRender: 'member' }
        },
        {
          title: '操作',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'detail' }
        }
      ],
      data: [],
      loading: false,
      currentPage: 1,
      totalPage: 50,
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
      associatedObj: {
        visible: false,
        columns: [
          {
            title: '清运人员',
            dataIndex: 'recoveryUsers'
          },
          {
            title: '巡检人员',
            dataIndex: 'inspectUsers'
          },
          {
            title: '维修人员',
            dataIndex: 'maintenUsers'
          },
          {
            title: '运营人员',
            dataIndex: 'operateUsers'
          }
        ],
        data: []
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'maintainDetail') {
      from.meta.keepAlive = true
      next()
    } else {
      from.meta.keepAlive = false
      next()
    }
  },
  mounted () {
    this.handleQuery()
    this.getDashBoard()
    this.getArea('', 2)
    this.getMarkList()
    this.getGroupMark()
    this.getEstate()
    this.toSearch()
  },
  methods: {
    moment,
    getDashBoard () {
      var param = {}
      param.menuId = 'efede99a52c247aa9ba32f5a9c76fcf1'
      param.type = this.type
      if (this.time) {
        param.startTime = this.time[0] + ' 00:00:00'
        param.endTime = this.time[1] + ' 23:59:59'
      }
      this.$httpPost(this.$basePath.getDashBoard, param)
        .then(res => {
          this.boardObj = res.result
        })
    },
    changeType () {
      if (this.type === '1') {
        this.showtime = [moment(), moment()]
      }
      if (this.type === '2') {
        const begin = new Date(new Date().getTime() - 86400000 * 6).setHours(0, 0, 0, 0)
        const end = new Date().getTime()
        this.showtime = [moment(begin), moment(end)]
      }
      if (this.type === '3') {
        const startDate = new Date(new Date().getTime() - 86400000 * 29).setHours(0, 0, 0, 0)
        const endDate = new Date().getTime()
        this.showtime = [moment(startDate), moment(endDate)]
      }
      this.getDashBoard()
    },
    changeTime (value, dateString) {
      this.time = dateString
      this.type = '4'
      this.getDashBoard()
    },
    changeInstallTime (value, dateString) {
      this.installTime = dateString
    },
    changeArea (areasId) {
      this.estateList = []
      this.form.setFieldsValue({ housingEstate: undefined })
      if (areasId.length < 4) {
        this.getEstate(areasId)
      } else if (areasId.length === 4) {
        this.getEstate(null, areasId[3])
      }
    },
    toSearch () {
      var param = this.form.getFieldsValue()
      param.menuId = 'a94d27c6df9841c3a86a87c90037b3fc'
      param.pageNo = 1
      param.pageSize = this.pagination.pageSize
      if (this.installTime.length) {
        param.startTime = this.installTime[0]
        param.endTime = this.installTime[1]
      }
      if (this.areas.length) {
        param.provinceId = this.areas[0]
        param.cityId = this.areas[1]
        param.areaId = this.areas[2]
        param.street = this.areas[3] || ''
      }
      this.getTableData(param)
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      var param = this.form.getFieldsValue()
      param.menuId = 'a94d27c6df9841c3a86a87c90037b3fc'
      param.pageNo = pagination.current
      param.pageSize = this.pagination.pageSize
      if (this.installTime.length) {
        param.startTime = this.installTime[0]
        param.endTime = this.installTime[1]
      }
      if (this.areas.length) {
        param.provinceId = this.areas[0]
        param.cityId = this.areas[1]
        param.areaId = this.areas[2]
        param.street = this.areas[3] || ''
      }
      this.getTableData(param)
    },
    getTableData (param) {
      this.loading = true
      this.$httpPost(this.$basePath.getEquipmentList, param)
        .then(res => {
          this.loading = false
          this.data = res.result.list
          this.pagination.total = res.result.total
        })
    },
    resetForm () {
      this.form.resetFields()
      this.areas = []
      this.time1 = undefined
      this.installTime = []
    },
    toExport () {
      var param = this.form.getFieldsValue()
      param.menuId = 'e650497364114945aa5b1324764736f6'
      if (this.areas.length) {
        param.provinceId = this.areas[0]
        param.cityId = this.areas[1]
        param.areaId = this.areas[2]
        param.street = this.areas[3] || ''
      }
      if (this.installTime.length) {
        param.startTime = this.installTime[0]
        param.endTime = this.installTime[1]
      }
      this.toExportExcel(this.$basePath.exportEquipmentList, param, '设备运维记录.xlsx')
    },
    associatedPer (record) {
      this.associatedObj.visible = true
      this.$httpGet(this.$basePath.getRoleAccount, { productId: record.id })
        .then(res => {
          var data = []
          var inspectUsers = res.result.inspectUsers
          var maintenUsers = res.result.maintenUsers
          var recoveryUsers = res.result.recoveryUsers
          var operateUsers = res.result.operateUsers
          var maxLength = Math.max(inspectUsers.length, maintenUsers.length, recoveryUsers.length, operateUsers.length)
          for (var i = 0; i < maxLength; i++) {
            data.push({
              id: i,
              recoveryUsers: recoveryUsers[i] ? recoveryUsers[i].userName : '',
              inspectUsers: inspectUsers[i] ? inspectUsers[i].userName : '',
              maintenUsers: maintenUsers[i] ? maintenUsers[i].userName : '',
              operateUsers: operateUsers[i] ? operateUsers[i].userName : ''
            })
          }
          this.associatedObj.data = data
        })
    },
    toDetail (record) {
      this.$router.push({
        path: '/device/operation/deviceMaintain/maintainDetail',
        query: { id: record.id }
      })
    },
    handleQuery () {
      const { productStatus, productType } = this.$route.query
      this.form.setFieldsValue({
        productStatus,
        productType
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
.mrl12
  margin-left 12px
.panel-container
  margin-top 8px
  margin-bottom 25px
.height-90
  height 90px
  .type-name
    color #666666
    font-size 12px
    margin-top 16px
    display flex
    justify-content center
    .icon
      width 16px
      height 16px
      margin-right 8px
  .type-num
    font-size 24px
    color #333333
    margin-top 8px
</style>
