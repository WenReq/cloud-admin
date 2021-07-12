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
        分类参与统计
      </div>
      <div class="operation-t">
        <div class="item bg-1">
          <div class="item-up">
            小区总计户数
          </div>
          <div>{{ boardData.peoples | numberFl }}</div>
        </div>
        <div class="item bg-2">
          <div class="item-up">
            小区用户总数
          </div>
          <div>{{ boardData.userNum | numberFl }}</div>
        </div>
        <div class="item bg-3">
          <div class="item-up">
            总开卡数
          </div>
          <div>{{ boardData.cardNum | numberFl }}</div>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <div class="card-desc">
          <p>分类参与数据</p>
          <p class="desc-right">
            <a-button @click="info">
              计算规则
            </a-button>
            <a-button
              style="margin:0 5px;"
              :loading="exportLoading"
              @click="toExport"
            >
              导出
            </a-button>
          </p>
        </div>
      </div>
      <div class="card-content">
        <a-table
          style="margin-bottom: 20px;"
          class="table-content"
          :columns="columns"
          :data-source="formData"
          :row-key="record => record.estateId"
          :loading="loading"
          :pagination="pagination"
          :scroll="{ y: 600 }"
          @change="handleTableChange"
        >
          <template slot="num" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="peoples" slot-scope="text, record">
            <a-button type="link" @click="linkCommunity(record)">
              {{ text }}
            </a-button>
          </template>
          <template slot="total" slot-scope="text, record">
            <a-button type="link" @click="showModal(record)">
              {{ text }}
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      :visible="visible"
      title="小区垃圾分类各品类参与人次（未去重）"
      centered
      :width="820"
      wrap-class-name="role-modal"
      @ok="visible = false"
      @cancel="visible = false"
    >
      <a-table
        class="table-content"
        :columns="participateColumns"
        :data-source="participateList"
        :row-key="record => record.id"
        :pagination="false"
        :scroll="participateList.length > 10 ? { y: 300 } : {}"
        bordered
      />
      <template slot="footer">
        <a-button @click="visible = false">
          关闭
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {
  getRate,
  participationCount,
  participationRate
} from '@/api/statistics'
import moment from 'moment'
import {
  getArea,
  getEstate,
  iconFontComponent,
  toExportExcel
} from '@/components/mixins/mixins.js'
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
    title: '小区总户数',
    dataIndex: 'peoples',
    sorter: true,
    scopedSlots: { customRender: 'peoples' }
  },
  {
    title: '小区用户数',
    dataIndex: 'userNum',
    sorter: true
  },
  {
    title: '小区开卡数',
    dataIndex: 'cardNum',
    sorter: true
  },
  {
    title: '分类参与数',
    dataIndex: 'total',
    scopedSlots: { customRender: 'total' }
  },
  {
    title: '可回收参与人数',
    dataIndex: 'recycle'
  },
  {
    title: '可回收参与率',
    dataIndex: 'recycleRate'
  },
  {
    title: '厨余参与人数',
    dataIndex: 'foodwaste'
  },
  {
    title: '厨余参与率',
    dataIndex: 'foodwasteRate'
  },
  {
    title: '小区参与率',
    dataIndex: 'joinRate'
  },
  {
    title: '小区注册率',
    dataIndex: 'registerRate'
  },
  {
    title: '小区开卡率',
    dataIndex: 'binCardRate'
  }
]

export default {
  mixins: [getArea, getEstate, iconFontComponent, toExportExcel],
  data () {
    return {
      loading: false,
      visible: false,
      type: '1',
      sort: 'userNumDesc',
      region: [],
      regionVal: [],
      showtime: [],
      options: [],
      formData: [],
      participateList: [],
      participateColumns: [],
      columns,
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
      }
    }
  },
  created: function () {
    this.getArea('', 2, null, true)
    this.getEstate()
    this.getTable()
    this.getTotal()
  },
  methods: {
    toExport () {
      const _date = this.showtime
      const startTime =
        (_date.length && _date[0].format('YYYY-MM-DD 00:00:00')) || ''
      const endTime =
        (_date.length && _date[1].format('YYYY-MM-DD 23:59:59')) || ''
      const params = {
        menuId: '40c5e0d7697e41a7bab6cb2020be48d5',
        sort: this.sort,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        province: this.regionVal[0] || '',
        city: this.regionVal[1] || '',
        area: this.regionVal[2] || '',
        estateId: this.form.getFieldValue('estateId'),
        startTime,
        endTime
      }
      this.toExportExcel('foodwasteWeight/export', params, '分类参与统计.xlsx')
    },
    info () {
      this.$info({
        title: '计算规则',
        content: (
          <div>
            <p>
              <b>小区总户数</b>：需人工填写，整个小区的户数。
            </p>
            <p>
              <b>小区用户数</b>：小区所有使用华展云平台的用户数。
            </p>
            <p>
              <b>分类参与数</b>
              ：小区用户中使用智能设备、软件参与垃圾分类的去重人数。
            </p>
            <p>
              <b>小区开卡数</b>：小区用户绑定了IC卡的数量。
            </p>
            <p>
              <b>可回收参与人数</b>：参与可回收物投递回收用户数。
            </p>
            <p>
              <b>可回收参与率</b>：参与可回收物投递回收用户数/小区总户数。
            </p>
            <p>
              <b>厨余参与人数</b>：参与厨余投递回收用户数。
            </p>
            <p>
              <b>厨余参与率</b>：参与厨余投递回收用户数/小区总户数。
            </p>
            <p>
              <b>小区参与率</b>：分类参与人数（去重）/小区总户数。
            </p>
            <p>
              <b>小区注册率</b>：小区用户数/小区总户数。
            </p>
            <p>
              <b>小区开卡率</b>：小区开卡数/小区总户数。
            </p>
          </div>
        ),
        width: 550,
        onOk () {}
      })
    },
    getTable () {
      const _date = this.showtime
      const startTime =
        (_date.length && _date[0].format('YYYY-MM-DD 00:00:00')) || ''
      const endTime =
        (_date.length && _date[1].format('YYYY-MM-DD 23:59:59')) || ''
      const params = {
        menuId: '40c5e0d7697e41a7bab6cb2020be48d5',
        sort: this.sort,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        province: this.regionVal[0] || '',
        city: this.regionVal[1] || '',
        area: this.regionVal[2] || '',
        estateId: this.form.getFieldValue('estateId'),
        startTime,
        endTime
      }
      this.loading = true
      getRate(params).then(res => {
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
        province: this.regionVal[0] || '',
        city: this.regionVal[1] || '',
        area: this.regionVal[2] || '',
        estateId: this.form.getFieldValue('estateId'),
        startTime,
        endTime
      }
      participationCount(params).then(res => {
        this.boardData = res.result
      })
    },
    getParticipationRate (estateId) {
      const _date = this.showtime
      const startTime =
        (_date.length && _date[0].format('YYYY-MM-DD 00:00:00')) || ''
      const endTime =
        (_date.length && _date[1].format('YYYY-MM-DD 23:59:59')) || ''
      const params = {
        province: this.regionVal[0] || '',
        city: this.regionVal[1] || '',
        area: this.regionVal[2] || '',
        estateId,
        startTime,
        endTime
      }
      participationRate(params).then(res => {
        const result = res.result
        const { columns, list } = this.handleResult(result)
        this.participateColumns = columns
        this.participateList = list
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
    toSearch () {
      this.getTable()
      this.getTotal()
    },
    changeArea (value, obj) {
      this.regionVal = []
      if (obj) {
        obj.forEach(item => {
          this.regionVal.push(item.name)
        })
      }
      this.estateList = []
      this.form.setFieldsValue({ estateId: undefined })
      if (value.length < 4) {
        this.getEstate(value)
      } else if (value.length === 4) {
        this.getEstate(null, value[3])
      }
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
      if (sorter.order) {
        this.sort = `${sorter.columnKey}${
          sorter.order === 'ascend' ? 'Asc' : 'Desc'
        }`
      }
      this.getTable()
    },
    handleResult (list) {
      const result = {
        list: [],
        columns: []
      }
      const itemMap = new Map()
      const itemObj = Object.create(null)

      for (let i = 0; i < list.length; i++) {
        const key = `key_${i + 1}`
        const obj = {
          title: list[i].dataValue,
          dataIndex: key
        }
        itemMap.set(key, list[i].count)
        itemMap.set('id', key)
        result.columns.push(obj)
      }
      for (const [key, v] of itemMap) {
        itemObj[key] = v
      }

      result.list.push(itemObj)
      return result
    },
    showModal (item) {
      if (item.total) {
        this.visible = true
        this.getParticipationRate(item.estateId)
      }
    },
    linkCommunity (item) {
      this.$router.push({
        path: '/areaManage/community',
        query: {
          name: item.estateName
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.role-modal .ant-modal-footer
  text-align center
</style>

<style lang="stylus" scoped>
.card-desc
  display flex
.desc-right
  margin-left auto
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
.operation-t
  width 100%
  display flex
  justify-content space-between
  padding-bottom 16px
  .item
    width 30%
    height 80px
    text-align center
    font-size 24px
    color #000
    font-weight 500
    padding 10px 0
    box-sizing border-box
    .item-up
      font-size 12px
      color #767D86
      margin-bottom 6px
      font-weight 400
    &.bg-1
        background-color rgba(232,242,255,.38)
    &.bg-2
        background-color rgba(255,239,228,.38)
    &.bg-3
        background-color rgba(231,255,242,.38)
    &.bg-4
        background-color rgba(243,252,222,.38)
</style>
