<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        统计筛选
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
            <a-col class="search-item" :span="6" align="right">
              <a-radio-group
                v-model="type"
                class="group-radio"
                @change="changeType"
              >
                <a-radio-button value="3">
                  总计
                </a-radio-button>
                <a-radio-button value="2">
                  最近7天
                </a-radio-button>
                <a-radio-button value="1">
                  最近30天
                </a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col class="search-item" :span="6">
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
              <a-form-item label="小区" v-bind="formItemLayout">
                <a-select
                  v-decorator="['estateId']"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                  @change="changeEstate"
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
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6"></a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="家庭地址" v-bind="formItemLayout">
                <a-cascader
                  v-model="address"
                  :options="addressOptions"
                  :load-data="loadDataAddress"
                  :field-names="{
                    label: 'name',
                    value: 'id',
                    children: 'children'
                  }"
                  placeholder="楼栋、单元"
                />
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
        家庭投递数据总览
      </div>
      <div class="card-content">
        <a-row class="panel-container" type="flex" justify="center">
          <a-col :span="4" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont
                type="iconjiatingzongshu"
                style="font-size: 40px; margin-right: 10px;"
              />
              <span>
                <div class="type-name">
                  家庭总数
                </div>
                <div class="type-num" :title="boardData.holdNum">
                  {{
                    boardData.holdNum &&
                      boardData.holdNum.toString().length > 11
                      ? boardData.holdNum.toString().substring(0, 8)
                      : boardData.holdNum | numberFl1
                  }}<span
                    v-if="
                      boardData.holdNum &&
                        boardData.holdNum.toString().length > 11
                    "
                  >...</span>
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont
                type="iconyonghuzongshu"
                style="font-size: 40px; margin-right: 10px;"
              />
              <span>
                <div class="type-name">
                  用户总数
                </div>
                <div class="type-num" :title="boardData.userNum">
                  {{
                    boardData.userNum &&
                      boardData.userNum.toString().length > 11
                      ? boardData.userNum.toString().substring(0, 8)
                      : boardData.userNum | numberFl1
                  }}<span
                    v-if="
                      boardData.userNum &&
                        boardData.userNum.toString().length > 11
                    "
                  >...</span>
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont
                type="iconkehuishouwu"
                style="font-size: 40px; margin-right: 10px;"
              />
              <span>
                <div class="type-name">
                  可回收物(kg)
                </div>
                <div class="type-num" :title="boardData.recycle">
                  {{
                    boardData.recycle &&
                      boardData.recycle.toString().length > 11
                      ? boardData.recycle.toString().substring(0, 8)
                      : boardData.recycle | numberFl1
                  }}<span
                    v-if="
                      boardData.recycle &&
                        boardData.recycle.toString().length > 11
                    "
                  >...</span>
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
                  厨余垃圾(kg)
                </div>
                <div class="type-num" :title="boardData.life">
                  {{
                    boardData.life && boardData.life.toString().length > 11
                      ? boardData.life.toString().substring(0, 8)
                      : boardData.life | numberFl1
                  }}<span
                    v-if="
                      boardData.life && boardData.life.toString().length > 11
                    "
                  >...</span>
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
                  其他垃圾(kg)
                </div>
                <div class="type-num" :title="boardData.harmful">
                  {{
                    boardData.other && boardData.other.toString().length > 11
                      ? boardData.other.toString().substring(0, 8)
                      : boardData.other | numberFl1
                  }}<span
                    v-if="
                      boardData.other &&
                        boardData.harmful.toString().length > 11
                    "
                  >...</span>
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
                  有害垃圾(kg)
                </div>
                <div class="type-num" :title="boardData.harmful">
                  {{
                    boardData.harmful &&
                      boardData.harmful.toString().length > 11
                      ? boardData.harmful.toString().substring(0, 8)
                      : boardData.harmful | numberFl1
                  }}<span
                    v-if="
                      boardData.harmful &&
                        boardData.harmful.toString().length > 11
                    "
                  >...</span>
                </div>
              </span>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        家庭投递趋势
      </div>
      <div class="card-content">
        <div id="line_container" class="g2-container">
          <div v-if="!holdTrend.length" class="no-data">
            <a-icon type="frown" style="font-size: 18px" />
            <span>暂无数据～</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="12" class="title">
            家庭投递列表
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
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  toExportExcel,
  getArea,
  getEstate,
  iconFontComponent
} from '@/components/mixins/mixins.js'
import moment from 'moment'
import G2 from '@antv/g2'
export default {
  mixins: [toExportExcel, getArea, getEstate, iconFontComponent],
  data () {
    return {
      showtime: [],
      type: '3',
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, {}),
      areas: [],
      address: [],
      boardData: {},
      columns: [
        {
          title: '区域',
          dataIndex: 'areaName'
        },
        {
          title: '小区',
          dataIndex: 'housingEstate'
        },
        {
          title: '姓名',
          dataIndex: 'userName'
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '家庭名称',
          dataIndex: '',
          customRender (val, row, index) {
            return (
              row.housingEstate +
              row.buildingNumber +
              row.unitNumber +
              row.roomNum
            )
          }
        },
        {
          title: '楼栋号',
          dataIndex: 'buildingNumber'
        },
        {
          title: '单元号',
          dataIndex: 'unitNumber'
        },
        {
          title: '门牌号',
          dataIndex: 'roomNum'
        },
        {
          title: '投递次数',
          dataIndex: 'total'
        },
        {
          title: '可回收物（kg）',
          dataIndex: 'recycle',
          customRender (val, row, index) {
            return val.toFixed(2)
          }
        },
        {
          title: '厨余垃圾（kg）',
          dataIndex: 'life',
          customRender (val, row, index) {
            return val.toFixed(2)
          }
        },
        {
          title: '其他垃圾（kg）',
          dataIndex: 'other',
          customRender (val, row, index) {
            return val.toFixed(2)
          }
        },
        {
          title: '有害垃圾（kg）',
          dataIndex: 'harmful',
          customRender (val, row, index) {
            return val.toFixed(2)
          }
        }
      ],
      data: [],
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
      linechart: null,
      addressOptions: [],
      holdTrend: []
    }
  },
  created: function () {
    this.handleQuery()
  },
  mounted () {
    this.getArea('', 2)
    this.getEstate()
    this.getAllData()
  },
  methods: {
    getAllData () {
      var param = {}
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      param.queryParams = {}
      param.queryParams.estateId = this.form.getFieldValue('estateId')
      if (this.type !== '') {
        if (this.type === '3' || this.type === '1') {
          param.queryParams.days = '30'
        }
        if (this.type === '2') param.queryParams.days = '7'
        if (this.type === '3') {
          param.queryParams.type = 1
        } else {
          param.queryParams.type = 2
        }
      } else {
        if (this.showtime.length) {
          param.queryParams.startTime = this.showtime[0].format(
            'YYYY-MM-DD 00:00:00'
          )
          param.queryParams.endTime = this.showtime[1].format(
            'YYYY-MM-DD 23:59:59'
          )
          param.queryParams.days = 0
          param.queryParams.type = 2
        }
      }
      if (this.areas.length === 4) {
        param.queryParams.streetId = this.areas[3]
      }
      if (this.address.length) {
        param.queryParams.buildingNumberId = this.address[0]
        param.queryParams.unitId = this.address[1]
      }
      if (this.areas.length) {
        if (this.areas.length === 4) {
          param.queryParams.areas =
            this.areas[0] + ',' + this.areas[1] + ',' + this.areas[2]
        } else {
          param.queryParams.areas = this.areas.join(',')
        }
      }
      this.loading = true
      this.$httpPost(this.$basePath.getHoldStatic, param)
        .then(res => {
          this.loading = false
          this.boardData = res.result.holdTotal
          this.pagination.total = res.result.holdList.totalCount
          this.data = res.result.holdList.data
          this.holdTrend = res.result.holdTrend
          this.initLine(res.result.holdTrend)
        })
        .catch(() => {
          this.loading = false
        })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
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
    moment,
    changeType () {
      if (this.type === '2') {
        const begin = new Date(new Date().getTime() - 86400000 * 6).setHours(
          0,
          0,
          0,
          0
        )
        const end = new Date().getTime()
        this.showtime = [moment(begin), moment(end)]
      } else if (this.type === '1') {
        const startDate = new Date(
          new Date().getTime() - 86400000 * 29
        ).setHours(0, 0, 0, 0)
        const endDate = new Date().getTime()
        this.showtime = [moment(startDate), moment(endDate)]
      } else {
        this.showtime = []
      }
      this.getAllData()
    },
    changeTime (value, dateString) {
      this.type = ''
      if (!value.length) this.type = '3'
    },
    toSearch () {
      this.pagination.current = 1
      this.getAllData()
    },
    resetForm () {
      this.form.resetFields()
      this.type = '3'
      this.showtime = []
      this.areas = []
      this.address = []
      this.addressOptions = []
    },
    toExport () {
      var param = {}
      param.queryParams = {}
      param.queryParams.estateId = this.form.getFieldValue('estateId')
      if (this.type !== '') {
        if (this.type === '3' || this.type === '1') {
          param.queryParams.days = '30'
        }
        if (this.type === '2') param.queryParams.days = '7'
        if (this.type === '3') {
          param.queryParams.type = 1
        } else {
          param.queryParams.type = 2
        }
      } else {
        if (this.showtime.length) {
          param.queryParams.startTime = this.showtime[0].format(
            'YYYY-MM-DD 00:00:00'
          )
          param.queryParams.endTime = this.showtime[1].format(
            'YYYY-MM-DD 23:59:59'
          )
          param.queryParams.days = 0
          param.queryParams.type = 2
        }
      }
      if (this.areas.length === 4) {
        param.queryParams.streetId = this.areas[3]
      }
      if (this.address.length) {
        param.queryParams.buildingNumberId = this.address[0]
        param.queryParams.unitId = this.address[1]
      }
      if (this.areas.length) {
        if (this.areas.length === 4) {
          param.queryParams.areas =
            this.areas[0] + ',' + this.areas[1] + ',' + this.areas[2]
        } else {
          param.queryParams.areas = this.areas.join(',')
        }
      }
      const startDateVal = this.showtime.length ? this.showtime[0].format('YYYY-MM-DD') : ''
      const endDateVal = this.showtime.length ? this.showtime[1].format('YYYY-MM-DD') : ''
      const excelName = startDateVal ? `${startDateVal}-${endDateVal}家庭记录` : '家庭记录'
      this.toExportExcel(this.$basePath.exportHoldList, param, `${excelName}.xlsx`)
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      var param = this.form.getFieldsValue()
      param.menuId = ''
      param.pageNo = pagination.current
      param.pageSize = this.pagination.pageSize
      this.getAllData()
    },
    initLine (result) {
      if (this.linechart !== null) this.linechart.destroy()
      var data = []
      result.forEach(item => {
        var tmpObj1 = {}
        var tmpObj2 = {}
        var tmpObj3 = {}
        var tmpObj4 = {}
        if (item.recycle || item.recycle === 0) {
          tmpObj1.type = '可回收物'
          tmpObj1.date = item.date
          tmpObj1.num = item.recycle
        }
        data.push(tmpObj1)
        if (item.life || item.life === 0) {
          tmpObj2.type = '厨余垃圾'
          tmpObj2.date = item.date
          tmpObj2.num = item.life
        }
        data.push(tmpObj2)
        if (item.other || item.other === 0) {
          tmpObj4.type = '其他垃圾'
          tmpObj4.date = item.date
          tmpObj4.num = item.other
        }
        data.push(tmpObj4)
        if (item.harmful || item.harmful === 0) {
          tmpObj3.type = '有害垃圾'
          tmpObj3.date = item.date
          tmpObj3.num = item.harmful
        }
        data.push(tmpObj3)
      })
      this.linechart = new G2.Chart({
        container: 'line_container',
        forceFit: true,
        height: 500,
        padding: [50, 60]
      })
      this.linechart.source(data)
      this.linechart
        .line()
        .position('date*num')
        .color('type', ['#3C85FD', '#087739', '#6D5D5E', '#FB5565'])
      this.linechart
        .point()
        .position('date*num')
        .color('type')
        .size(3)
        .shape('circle')
      this.linechart.legend({
        position: 'top-right'
      })
      this.linechart.render()
    },
    changeEstate (value) {
      if (value) {
        this.getFloor(value, '3')
      } else {
        this.addressOptions = []
      }
    },
    getFloor (id, type, targetOption) {
      this.$httpPost(this.$basePath.getEstateByPId, {
        pId: id,
        type: type
      }).then(res => {
        res.result.forEach(item => {
          if (type === '3') item.isLeaf = false
        })
        if (type === '4') {
          this.$set(targetOption, 'children', res.result)
        } else {
          this.addressOptions = res.result
        }
      })
    },
    loadDataAddress (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getFloor(targetOption.id, '4', targetOption)
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
.g2-container
  position relative
  .no-data
    position absolute
    left 50%
    top 50%
    transform translateX(-50%)
    transform translateY(-50%)
.panel-container
  margin-top 8px
  margin-bottom 25px
.height-90
  height 90px
  position relative
  &.large
    width 20%
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
