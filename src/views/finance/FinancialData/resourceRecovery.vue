<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        统计筛选
      </div>
      <!-- <div class="card-content">
        <a-form ref="detailForm" class="detail-form">
          <a-row>
            <a-col class="search-item" :span="5" style="line-height: 40px">
              <a-radio-group
                v-model="type" class="group-radio"
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
            <a-col class="search-item" :span="8">
              <a-form-item
                label="自定义日期"
                v-bind="formItemLayout"
              >
                <a-range-picker
                  v-model="showtime"
                  class="mrl12"
                  @change="changeTime"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="8">
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
                  placeholder="省市区"
                  @change="changeArea"
                />
              </a-form-item>
            </a-col>
            <a-col
              class="search-item" :span="3" align="right"
              style="line-height: 36px"
            >
              <a-button type="primary" class="mr8" @click="toSearch">
                查询
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </div> -->
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
                  v-model="areas"
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
      <div class="card-content">
        <a-row class="panel-container" type="flex" justify="center">
          <a-col
            :span="5" class="height-90" type="flex"
            align="middle"
          >
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconbianzu1" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  回收设备总数
                </div>
                <div class="type-num">
                  {{ boardData.total | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col
            :span="5" class="height-90" type="flex"
            align="middle"
          >
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconbianzu2" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  投递总量（kg）
                </div>
                <div class="type-num">
                  {{ boardData.deliverNum | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col
            :span="5" class="height-90" type="flex"
            align="middle"
          >
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconbianzu3" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  设备清运总量（kg）
                </div>
                <div class="type-num">
                  {{ boardData.pickUpNum | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col
            :span="8" class="height-90" type="flex"
            align="middle"
          >
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconbianzu4" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  上门回收总量
                </div>
                <div class="type-num">
                  <span class="num-two">{{ boardData.recycleWeight | numberFl1 }}kg</span>
                  <span class="num-two">{{ boardData.count | numberFl1 }}个</span>
                </div>
              </span>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <a-radio-group
          v-model="type2" class="group-radio"
          @change="changeType2"
        >
          <a-radio-button value="1">
            投递数据
          </a-radio-button>
          <a-radio-button value="2">
            清运数据
          </a-radio-button>
          <a-radio-button value="3">
            上门回收数据
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class="card-content">
        <a-row>
          <a-col :span="10">
            <a-table
              class="table-content"
              :columns="columns"
              :data-source="data"
              :row-key="record => Math.random() * 10000"
              :loading="loading"
              :pagination="false"
            >
              <template slot="order" slot-scope="text,record,index">
                <div class="table-index" :class="index==0?'no1':index==1?'no2':index==2?'no3':''">
                  {{ index + 1 }}
                </div>
              </template>
              <template slot="doorRecycle" slot-scope="text,record">
                <span v-if="record.count>0 && record.weight==0">{{ record.count }}个</span>
                <span v-else>{{ record.weight }}kg</span>
              </template>
            </a-table>
          </a-col>
          <a-col :span="14">
            <div id="pie_container" class="g2-container"></div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <a-radio-group
          v-model="type3" class="group-radio"
          @change="changeType3"
        >
          <a-radio-button value="1">
            总量趋势
          </a-radio-button>
          <a-radio-button value="2">
            次数趋势
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class="card-content">
        <div id="recycleLineChart" class="g2-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import G2 from '@antv/g2'
import moment from 'moment'
import { getArea, getEstate, iconFontComponent } from '@/components/mixins/mixins.js'
export default {
  mixins: [getArea, getEstate, iconFontComponent],
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      areas: [],
      areaNames: [],
      type: '1',
      boardData: {},
      type2: '1',
      type3: '1',
      showtime: [],
      form: this.$form.createForm(this, {}),
      columns: [
        {
          title: '序号',
          width: '20%',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '投递品类',
          dataIndex: 'type',
          width: '40%'
        },
        {
          title: '投递总量（kg）',
          dataIndex: 'weight',
          width: '40%'
        }
      ],
      boardData1: {},
      data: [],
      loading: false,
      piechart: null,
      linechart: null
    }
  },
  mounted () {
    this.getArea('', 2, null, true)
    this.getEstate()
    this.recycleGetData()
    this.getRecycleData()
    this.aggregateTrend()
  },
  methods: {
    moment,
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    changeType () {
      if (this.type === '1') {
        this.showtime = []
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
      this.toSearch()
    },
    changeType2 () {
      if (this.type2 === '1') {
        this.columns = [
          {
            title: '序号',
            width: '20%',
            scopedSlots: { customRender: 'order' }
          },
          {
            title: '投递品类',
            dataIndex: 'type',
            width: '40%'
          },
          {
            title: '投递总量（kg）',
            dataIndex: 'weight',
            width: '40%'
          }
        ]
        this.data = this.boardData1.deliveryData
      }
      if (this.type2 === '2') {
        this.columns = [
          {
            title: '序号',
            width: '20%',
            scopedSlots: { customRender: 'order' }
          },
          {
            title: '清运品类',
            dataIndex: 'type',
            width: '40%'
          },
          {
            title: '清运总量（kg）',
            dataIndex: 'weight',
            width: '40%'
          }
        ]
        this.data = this.boardData1.pickUpData
      }
      if (this.type2 === '3') {
        this.columns = [
          {
            title: '序号',
            width: '20%',
            scopedSlots: { customRender: 'order' }
          },
          {
            title: '上门回收品类',
            dataIndex: 'type',
            width: '40%'
          },
          {
            title: '上门回收总量',
            dataIndex: 'weight',
            width: '40%',
            scopedSlots: { customRender: 'doorRecycle' }
          }
        ]
        this.data = this.boardData1.doorRecycleData
      }
      this.initPie()
    },
    changeType3 () {
      this.aggregateTrend()
    },
    changeTime (value, dateString) {
      this.type = ''
      this.toSearch()
    },
    changeArea (areasId, options) {
      this.estateList = []
      this.form.setFieldsValue({ estateId: undefined })
      if (areasId.length < 4) {
        this.getEstate(areasId)
      } else if (areasId.length === 4) {
        this.getEstate(null, areasId[3])
      }
      this.areaNames = []
      if (!options) return
      options.forEach(item => {
        this.areaNames.push(item.name)
      })
    },
    // changeArea (value, options) {
    //   this.areaNames = []
    //   if (!options) return
    //   options.forEach(item => {
    //     this.areaNames.push(item.name)
    //   })
    // },
    toSearch () {
      const param = {}
      param.provinceId = this.areas[0]
      param.cityId = this.areas[1]
      param.areaId = this.areas[2]
      param.province = this.areaNames[0]
      param.city = this.areaNames[1]
      param.area = this.areaNames[2]
      param.estateId = this.form.getFieldValue('estateId')
      if (this.showtime.length > 0) {
        param.startTime = this.showtime[0].format('YYYY-MM-DD 00:00:00')
        param.endTime = this.showtime[1].format('YYYY-MM-DD 23:59:59')
      }
      this.recycleGetData(param)
      this.getRecycleData(param)
      this.aggregateTrend()
    },
    recycleGetData (param) {
      this.$httpPost(this.$basePath.recycleGetData, param || {})
        .then(res => {
          this.boardData = res.result
        })
    },
    getRecycleData (param) {
      this.loading = true
      this.$httpPost(this.$basePath.getRecycleData, param || {})
        .then(res => {
          this.loading = false
          this.boardData1 = res.result
          if (this.type2 === '1') this.data = this.boardData1.deliveryData
          if (this.type2 === '2') this.data = this.boardData1.pickUpData
          if (this.type2 === '3') this.data = this.boardData1.doorRecycleData
          this.initPie()
        })
    },
    aggregateTrend () {
      var param = {}
      if (this.showtime.length === 0) {
        const startDate = new Date(new Date().getTime() - 86400000 * 29).setHours(0, 0, 0, 0)
        const endDate = new Date().getTime()
        param.startTime = moment(startDate).format('YYYY-MM-DD 00:00:00')
        param.endTime = moment(endDate).format('YYYY-MM-DD 23:59:59')
      } else {
        param.startTime = this.showtime[0].format('YYYY-MM-DD 00:00:00')
        param.endTime = this.showtime[1].format('YYYY-MM-DD 23:59:59')
      }
      param.provinceId = this.areas[0]
      param.cityId = this.areas[1]
      param.areaId = this.areas[2]
      param.estateId = this.form.getFieldValue('estateId')
      param.type = this.type3
      this.$httpPost(this.$basePath.aggregateTrend, param)
        .then(res => {
          this.initLine(res.result)
        })
    },
    initPie () {
      if (this.piechart !== null) this.piechart.destroy()
      var data = []
      var total = null
      this.data.forEach(item => {
        total += item.weight
      })
      this.data.forEach(item => {
        if (!item.count || item.count === 0 || item.weight !== 0) {
          data.push({
            item: item.type,
            count: item.weight,
            percent: item.weight / total
          })
        }
      })
      this.piechart = new G2.Chart({
        container: 'pie_container',
        forceFit: true,
        height: 600
      })
      this.piechart.source(data, {
        percent: {
          formatter: val => {
            val = (val * 100).toFixed(2) + '%'
            return val
          }
        }
      })
      this.piechart.coord('theta', {
        radius: 0.75
      })
      this.piechart.tooltip({
        showTitle: false
      })
      this.piechart.intervalStack()
        .position('percent')
        .color('item')
        .label('percent', {
          formatter: (val, item) => {
            return item.point.item + ': ' + val
          }
        })
        .tooltip('item*percent', (item, percent) => {
          percent = (percent * 100).toFixed(2) + '%'
          return {
            name: item,
            value: percent
          }
        })
        .style({
          lineWidth: 1,
          stroke: '#fff'
        })
      this.piechart.render()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    initLine (result) {
      if (this.linechart !== null) this.linechart.destroy()
      var data = []
      result.forEach(item => {
        var tmpObj1 = {}
        var tmpObj2 = {}
        var tmpObj3 = {}
        if (item.deliveryWeight || item.deliveryCount || item.deliveryWeight === 0 || item.deliveryCount === 0) {
          tmpObj1.type = '投递'
          tmpObj1.date = item.date
          tmpObj1.num = item.deliveryWeight || item.deliveryCount || 0
        }
        data.push(tmpObj1)
        if (item.doorRecycleWeight || item.doorRecycleCount || item.doorRecycleWeight === 0 || item.doorRecycleCount === 0) {
          tmpObj2.type = '上门回收'
          tmpObj2.date = item.date
          tmpObj2.num = item.doorRecycleWeight || item.doorRecycleCount || 0
        }
        data.push(tmpObj2)
        if (item.pickUpWeight || item.pickUpCount || item.pickUpWeight === 0 || item.pickUpCount === 0) {
          tmpObj3.type = '清运'
          tmpObj3.date = item.date
          tmpObj3.num = item.pickUpWeight || item.pickUpCount || 0
        }
        data.push(tmpObj3)
      })
      this.linechart = new G2.Chart({
        container: 'recycleLineChart',
        forceFit: true,
        height: 500,
        padding: [50, 60]
      })
      this.linechart.source(data)
      this.linechart.line().position('date*num').color('type')
      this.linechart.point().position('date*num')
        .color('type')
        .size(3)
        .shape('circle')
      this.linechart.legend({
        position: 'top-right'
      })
      this.linechart.render()
    }
  }
}
</script>

<style lang="stylus" scoped>
.table-index
  width 20px
  height 20px
  border-radius 10px
  background-color #EBEBEB
  line-height 20px
  text-align center
  &.no1
    background-color #F1584A
    color #fff
  &.no2
    background-color #FFA239
    color #fff
  &.no3
    background-color #FFCD39
    color #fff
.mrl12
  margin-left 12px
.g2-container
  width 100%
  min-height 500px
  >>>.g2-tooltip
    background rgba(0, 0, 0, 0.5)!important
    color #fff!important
.panel-container
  margin-top 8px
  margin-bottom 25px
.height-90
  height 90px
  position relative
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
    .num-two
      position relative
      margin 0 10px
      &:not(:last-child)::after
        position absolute
        right -10px
        top 50%
        transform translateY(-50%)
        content ''
        display block
        width 1px
        height 20px
        background-color #D8D8D8
</style>
