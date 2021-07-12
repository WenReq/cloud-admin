<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        筛选查询
      </div>
      <div class="card-content">
        <a-form ref="detailForm" class="detail-form" :form="form">
          <a-row>
            <a-col class="search-item" :span="5">
              <a-radio-group
                v-model="type"
                class="group-radio"
                @change="changeType"
              >
                <a-radio-button value="1">
                  总计
                </a-radio-button>
                <a-radio-button value="2">
                  最近7天
                </a-radio-button>
                <a-radio-button value="3">
                  最近30天
                </a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col class="search-item" :span="5">
              <a-form-item label="自定义日期" v-bind="formItemLayout">
                <a-range-picker
                  v-model="showtime"
                  class="mrl12"
                  @change="changeTime"
                />
              </a-form-item>
            </a-col>
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
                  placeholder="省市区"
                  @change="changeArea"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="小区" v-bind="formItemLayout">
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
            <a-col class="search-item" :span="2" align="right">
              <a-button type="primary" class="mr8" @click="toSearch">
                查询
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        小区数据总计
        <span>回收总量：{{ boardData.weightCount | numberFl1 }}kg</span>
        <span>投递总次数：{{ boardData.totalCount | numberFl1 }}次</span>
      </div>
      <div class="card-content">
        <a-row class="panel-container" type="flex" justify="center">
          <a-col :span="3" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont
                type="iconxiaoquzongshu"
                style="font-size: 40px; margin-right: 10px;"
              />
              <span>
                <div class="type-name">
                  管理小区总数
                </div>
                <div class="type-num">
                  {{ boardData.estateCount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont
                type="iconshebeizongshu"
                style="font-size: 40px; margin-right: 10px;"
              />
              <span>
                <div class="type-name">
                  设备总数
                </div>
                <div class="type-num">
                  {{ boardData.deviceCount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="5" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont
                type="iconkehuishouwu"
                style="font-size: 40px; margin-right: 10px;"
              />
              <span>
                <div class="type-name">
                  可回收物(kg)
                </div>
                <div class="type-num">
                  {{ boardData.recycleCount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont
                type="iconchuyu"
                style="font-size: 40px; margin-right: 10px;"
              />
              <span>
                <div class="type-name">
                  厨余垃圾（kg）
                </div>
                <div class="type-num">
                  {{ boardData.lifeCount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont
                type="iconshenghuolaji"
                style="font-size: 40px; margin-right: 10px;"
              />
              <span>
                <div class="type-name">
                  其他垃圾（kg）
                </div>
                <div class="type-num">
                  {{ boardData.otherCount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont
                type="iconyouhailaji"
                style="font-size: 40px; margin-right: 10px;"
              />
              <span>
                <div class="type-name">
                  有害垃圾（kg）
                </div>
                <div class="type-num">
                  {{ boardData.harmfulCount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="card-container mrt16">
      <a-row>
        <a-col :span="12">
          <div class="card-title">
            小区设备数据
          </div>
        </a-col>
      </a-row>
      <div class="card-content">
        <a-table
          class="table-content"
          :columns="columns"
          :data-source="formData"
          :loading="loading"
          :pagination="pagination"
          :row-key="record => record.estateId"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <template slot="num" slot-scope="record, text, index">
            <div>
              {{ index + 1 }}
            </div>
          </template>
          <template slot="recycleBin" slot-scope="record, text">
            <a v-if="text.recycleBin" @click="recycleBinFind('recycleBin',text)">
              {{ text.recycleBin }}
            </a>
            <span v-else>{{ text.recycleBin }}</span>
          </template>
          <template slot="garbageRoom" slot-scope="record, text">
            <a v-if="text.garbageRoom" @click="recycleBinFind('garbageRoom',text)">
              {{ text.garbageRoom }}
            </a>
            <span v-else>{{ text.garbageRoom }}</span>
          </template>
          <template slot="trashCan" slot-scope="record, text">
            <a v-if="text.trashCan" @click="recycleBinFind('trashCan',text)">
              {{ text.trashCan }}
            </a>
            <span v-else>{{ text.trashCan }}</span>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      v-model="detialVisible" title="小区设备回收统计" :width="800"
      :footer="null"
    >
      <div>
        <a-table
          class="table-content"
          :columns="detialColumns"
          :data-source="detialList"
          :loading="detialLoading"
          :row-key="record => record.recycle"
          :scroll="{ x: 300 }"
          :pagination="paginationDetials"
          @change="handleTableChangeDel"
        >
        </a-table>
      </div>
      <!-- <template slot="footer">
        <a-button key="back" @click="detialVisible = false">
          关闭
        </a-button>
      </template> -->
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import {
  getArea,
  getEstate,
  iconFontComponent
} from '@/components/mixins/mixins.js'
import { plotDeviceList, plotDeviceDetails, statisticsList } from '@/api/statistics'
const columns = [
  {
    title: '序号',
    width: '5%',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '区域',
    dataIndex: 'area'
  },
  {
    title: '小区',
    dataIndex: 'estateName'
  },
  {
    title: '回收站',
    dataIndex: 'recycleBin',
    scopedSlots: { customRender: 'recycleBin' }
  },
  {
    title: '垃圾房',
    dataIndex: 'garbageRoom',
    scopedSlots: { customRender: 'garbageRoom' }
  },
  {
    title: '垃圾箱/亭',
    dataIndex: 'trashCan',
    scopedSlots: { customRender: 'trashCan' }
  },
  {
    title: '兑换机',
    dataIndex: 'exchange'
  },
  {
    title: '可回收物（kg）',
    dataIndex: 'recycle'
  },
  {
    title: '厨余垃圾（kg）',
    dataIndex: 'life'
  },
  {
    title: '其他垃圾（kg）',
    dataIndex: 'other'
  },
  {
    title: '有害垃圾（kg）',
    dataIndex: 'harmful'
  },
  {
    title: '回收总量（kg）',
    dataIndex: 'weight'
  },
  {
    title: '投递次数',
    dataIndex: 'total'
  }
]
const detialColumns = [
  {
    title: '设备名称',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '可回收物（kg）',
    dataIndex: 'recycle',
    width: 100
  },
  {
    title: '厨余垃圾（kg）',
    dataIndex: 'life',
    width: 100
  },
  {
    title: '其他垃圾（kg）',
    dataIndex: 'other',
    width: 100
  },
  {
    title: '有害垃圾（kg）',
    dataIndex: 'harmful',
    width: 100
  },
  {
    title: '回收总量（kg）',
    dataIndex: 'weight',
    width: 100
  },
  {
    title: '投递次数',
    dataIndex: 'total',
    width: 100
  }
]
export default {
  mixins: [getArea, getEstate, iconFontComponent],
  data () {
    return {
      detialVisible: false,
      loading: false,
      detialList: [],
      detialLoading: false,
      type: '1',
      showtime: [],
      region: [],
      options: [],
      formData: [],
      columns,
      detialColumns,
      boardData: {},
      form: this.$form.createForm(this, {}),
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
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
      paginationDetials: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => '共' + total + '条记录',
        pageSizeOptions: ['10', '20', '30', '40'],
        defaultPageSize: 10,
        total: 0
      },
      rowFlag: null,
      rowText: null
    }
  },
  created: function () {
    this.handleQuery()
  },
  mounted: function () {
    this.load()
  },
  methods: {
    handleOk (e) {
      console.log(e)
      this.detialVisible = false
    },
    handleTableChangeDel (paginationDetials, filters, sorter) {
      const pager = { ...this.paginationDetials }
      pager.current = paginationDetials.current
      pager.pageSize = paginationDetials.pageSize
      this.paginationDetials = pager
      const params = {
        page: this.paginationDetials.current,
        pageSize: this.paginationDetials.pageSize,
        esid: this.rowText.estateId,
        scenario: this.rowFlag && this.rowFlag === 'recycleBin' ? 2 : (this.rowFlag && this.rowFlag === 'garbageRoom' ? 4 : 5)
      }
      this.getDetials(params)
    },
    recycleBinFind (flag, text) {
      this.detialVisible = true
      this.paginationDetials.current = 1
      const params = {
        page: 1,
        pageSize: this.paginationDetials.pageSize,
        esid: text.estateId,
        scenario: flag === 'recycleBin' ? 2 : (flag === 'garbageRoom' ? 4 : 5)
      }
      this.rowFlag = flag
      this.rowText = text
      this.getDetials(params)
    },
    getDetials (params) {
      this.detialLoading = true
      const _date = this.showtime
      const startTime =
        (_date.length && _date[0].format('YYYY-MM-DD 00:00:00')) || ''
      const endTime =
        (_date.length && _date[1].format('YYYY-MM-DD 23:59:59')) || ''
      params.startTime = startTime
      params.endTime = endTime
      plotDeviceDetails(params).then(res => {
        const result = res.result
        this.detialLoading = false
        this.detialList = result.list
        this.paginationDetials.total = result.totalCount
      })
    },
    load () {
      this.getArea('', 2, null, true)
      this.getEstate()
      this.getTable()
      this.getTotal()
    },
    getTable () {
      const _date = this.showtime
      const startTime =
        (_date.length && _date[0].format('YYYY-MM-DD 00:00:00')) || ''
      const endTime =
        (_date.length && _date[1].format('YYYY-MM-DD 23:59:59')) || ''
      const params = {
        menuId: 'c45efcb70e624d9aae98d765d456bab5',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        provinceId: this.region[0] || '',
        cityId: this.region[1] || '',
        areaId: this.region[2] || '',
        estateId: this.form.getFieldValue('estateId'),
        startTime,
        endTime
      }
      this.loading = true
      plotDeviceList(params).then(res => {
        this.loading = false
        const result = res.result
        this.formData = result.list
        this.pagination.total = result.totalCount
      })
    },
    getTotal () {
      const _date = this.showtime
      const startTime =
        (_date.length && _date[0].format('YYYY-MM-DD 00:00:00')) || ''
      const endTime =
        (_date.length && _date[1].format('YYYY-MM-DD 23:59:59')) || ''
      const params = {
        provinceId: this.region[0] || '',
        cityId: this.region[1] || '',
        areaId: this.region[2] || '',
        estateId: this.form.getFieldValue('estateId'),
        startTime,
        endTime
      }
      statisticsList(params).then(res => {
        this.boardData = res.result
      })
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    changeType () {
      if (this.type === '1') {
        this.showtime = []
      }
      if (this.type === '2') {
        const begin = new Date(new Date().getTime() - 86400000 * 6).setHours(
          0,
          0,
          0,
          0
        )
        const end = new Date().getTime()
        this.showtime = [moment(begin), moment(end)]
      }
      if (this.type === '3') {
        const startDate = new Date(
          new Date().getTime() - 86400000 * 29
        ).setHours(0, 0, 0, 0)
        const endDate = new Date().getTime()
        this.showtime = [moment(startDate), moment(endDate)]
      }
      this.getTable()
    },
    changeTime (value, dateString) {
      this.type = ''
    },
    changeArea (areasId) {
      this.estateList = []
      this.form.setFieldsValue({ estateId: undefined })
      if (areasId.length < 4) {
        this.getEstate(areasId)
      } else if (areasId.length === 4) {
        this.getEstate(null, areasId[3])
      }
    },
    toSearch () {
      this.getTable()
      this.getTotal()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getTable()
    },
    handleQuery () {
      const status = this.$route.query.status || ''
      if (status === 'today') {
        this.showtime = [moment(), moment()]
        this.type = ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-container
  .card-title
    span
      font-weight normal
      margin-left 30px
      font-size 14px
.panel-container
  margin-top 8px
  margin-bottom 25px
.height-90
  height 90px
  position relative
  &.large
    width 18%
  &:not(:last-child)::after
    position absolute
    right 0
    top 50%
    transform translateY(-50%)
    content ''
    display block
    width 1px
    height 58px
    background-color #F2F2F2
  &.data
    background-color #F4F5F7
    border-radius 4px
    &::after
      width 0
      height 0
  .type-name
    color #666666
    font-size 12px
    margin-top 16px
    display flex
    align-items center
    justify-content center
    text-align center
    .type-icon
      width 8px
      height 8px
      border-radius 4px
      margin-right 5px
  .type-num
    font-size 24px
    color #333333
    margin-top 8px
    text-align center
</style>
