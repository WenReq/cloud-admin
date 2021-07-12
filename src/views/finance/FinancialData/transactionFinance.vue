<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        统计筛选
      </div>
      <div class="card-content">
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
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        用户交易数据
      </div>
      <div class="card-content">
        <a-row class="panel-container" type="flex" justify="center">
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconic_huiyuanshu" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  用户总数（个）
                </div>
                <div class="type-num">
                  {{ boardData.memberNum | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconic_tixianjine" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  用户可提现总金额（元）
                </div>
                <div class="type-num">
                  {{ boardData.withdrawAmount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconic_shenghe" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  提现审核中金额（元）
                </div>
                <div class="type-num">
                  {{ boardData.auditAmount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconic_yitixian" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  线上已提现金额（元）
                </div>
                <div class="type-num">
                  {{ boardData.finishAmount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="4" class="height-90 large">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconic_bujiao" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  欠款补交金额（元）
                </div>
                <div class="type-num">
                  {{ boardData.payBackAmount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        猫回收业务数据
      </div>
      <div class="card-content">
        <a-row class="panel-container" type="flex" justify="center">
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <IconFont type="iconjiesuanjine" style="margin-right: 5px;" />上门回收结算总金额（元）
            </div>
            <div class="type-num">
              {{ boardData1.totalAmount | numberFl1 }}
            </div>
          </a-col>
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <IconFont type="iconpingtai" style="margin-right: 5px;" />上门回收平台结算金额（元）
            </div>
            <div class="type-num">
              {{ boardData1.settleAmount | numberFl1 }}
            </div>
          </a-col>
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <IconFont type="iconxianjin" style="margin-right: 5px;" />上门回收现金结算金额（元）
            </div>
            <div class="type-num">
              {{ boardData1.cashAmount | numberFl1 }}
            </div>
          </a-col>
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <IconFont type="iconbaozhengjin" style="margin-right: 5px;" />保证金剩余总计（元）
            </div>
            <div class="type-num">
              {{ boardData1.remainAmount | numberFl1 }}
            </div>
          </a-col>
          <a-col
            :span="4" class="height-90" type="flex"
            align="middle"
          >
            <div class="type-name">
              <IconFont type="iconbaozhengjinkoujian" style="margin-right: 5px;" />保证金扣减总计（元）
            </div>
            <div class="type-num">
              {{ boardData1.deductAmount | numberFl1 }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        设备交易数据
      </div>
      <div class="card-content">
        <a-row class="panel-container" type="flex" justify="space-between">
          <a-col
            :span="5" class="height-90 data" type="flex"
            align="middle"
          >
            <div class="type-name">
              投递总重量(kg)
            </div>
            <div class="type-num">
              {{ boardData2.totalWeight | numberFl1 }}
            </div>
          </a-col>
          <a-col
            :span="5" class="height-90 data" type="flex"
            align="middle"
          >
            <div class="type-name">
              投递产生总金额（元）
            </div>
            <div class="type-num">
              {{ boardData2.totalAmount | numberFl1 }}
            </div>
          </a-col>
          <a-col
            :span="5" class="height-90 data" type="flex"
            align="middle"
          >
            <div class="type-name">
              设备取币金额（元）
            </div>
            <div class="type-num">
              {{ boardData2.takeMoney | numberFl1 }}
            </div>
          </a-col>
          <a-col
            :span="5" class="height-90 data" type="flex"
            align="middle"
          >
            <div class="type-name">
              设备补币金额（元）
            </div>
            <div class="type-num">
              {{ boardData2.repairMoney | numberFl1 }}
            </div>
          </a-col>
        </a-row>
        <a-table
          style="margin-bottom: 20px;"
          class="table-content"
          :columns="columns"
          :data-source="data"
          :row-key="() => Math.random() * 10000"
          :loading="loading"
          :pagination="false"
        >
          <template slot="orderId" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getArea, iconFontComponent } from '@/components/mixins/mixins.js'
export default {
  mixins: [getArea, iconFontComponent],
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      showtime: [],
      type: '1',
      areas: [],
      areaNames: [],
      options: [],
      boardData: {},
      boardData1: {},
      boardData2: {},
      loading: false,
      columns: [
        {
          title: '排名',
          dataIndex: 'orderId',
          width: '19%',
          scopedSlots: { customRender: 'orderId' }
        },
        {
          title: '投递品类',
          dataIndex: 'name',
          width: '27%'
        },
        {
          title: '投递重量（kg）',
          dataIndex: 'weight',
          width: '27%',
          customRender (val, row, index) {
            if (val || val === 0) {
              return parseFloat(val).toLocaleString()
            }
          }
        },
        {
          title: '投递产生总金额（元）',
          dataIndex: 'amount',
          width: '27%',
          customRender (val, row, index) {
            if (val || val === 0) {
              return parseFloat(val).toLocaleString()
            }
          }
        }
      ],
      data: []
    }
  },
  mounted () {
    this.getArea('', 2, null, true)
    this.getBoardData()
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
      this.getBoardData()
    },
    changeTime (value, dateString) {
      this.type = ''
    },
    getBoardData () {
      var param = {}
      if (this.showtime.length) {
        param.startTime = new Date(this.showtime[0].format('YYYY/MM/DD') + ' 00:00:00').getTime()
        param.endTime = new Date(this.showtime[1].format('YYYY/MM/DD') + ' 23:59:59').getTime()
      }
      this.loading = true
      this.$httpPost(this.$basePath.memberData, Object.assign(JSON.parse(JSON.stringify(param)), {
        province: this.areas[0],
        city: this.areas[1],
        area: this.areas[2]
      })).then(res => {
        this.boardData = res.result
      })
      this.$httpPost(this.$basePath.businessData, Object.assign(JSON.parse(JSON.stringify(param)), {
        province: this.areaNames[0],
        city: this.areaNames[1],
        area: this.areaNames[2]
      })).then(res => {
        this.boardData1 = res.result
      })
      this.$httpPost(this.$basePath.deliveryStatistic, Object.assign(JSON.parse(JSON.stringify(param)), {
        province: this.areas[0],
        city: this.areas[1],
        area: this.areas[2]
      })).then(res => {
        this.boardData2 = res.result
      })
      this.$httpPost(this.$basePath.productDataList, Object.assign(JSON.parse(JSON.stringify(param)), {
        province: this.areas[0],
        city: this.areas[1],
        area: this.areas[2]
      })).then(res => {
        this.loading = false
        this.data = res.result
      })
    },
    toSearch () {
      this.getBoardData()
    },
    changeArea (value, options) {
      this.areaNames = []
      if (!options) return
      options.forEach(item => {
        this.areaNames.push(item.name)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
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
