<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        数据筛选
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
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
            <a-col class="search-item" :span="6">
              <a-form-item v-bind="formItemLayout" label="回收时间">
                <a-range-picker v-decorator="['createTime', rangeConfig]" @change="handleLimitTime" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="姓名" v-bind="formItemLayout">
                <a-input
                  v-decorator="['userName']"
                  allow-clear
                  placeholder="请输入用户姓名"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item label="手机号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['phone']"
                  allow-clear
                  placeholder="请输入用户手机号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="IC卡号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['cardNum']"
                  allow-clear
                  placeholder="请输入用户IC卡号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="回收人员" v-bind="formItemLayout">
                <a-input
                  v-decorator="['recycleUser']"
                  allow-clear
                  placeholder="请输入回收人员"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="计价方式" v-bind="formItemLayout">
                <a-select
                  v-decorator="['type']"
                  style="width: 100%"
                  placeholder="全部"
                  allow-clear
                >
                  <a-select-option :value="1">
                    计次回收
                  </a-select-option>
                  <a-select-option :value="2">
                    计重回收
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item label="订单号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['orderId']"
                  allow-clear
                  placeholder="请输入订单号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="18" align="right">
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
    <div class="delivery-data">
      <div class="list">
        <div class="item">
          <IconFont
            type="iconchuyuhuishouzongzongliang"
            style="font-size: 40px; margin-right: 10px;"
          />
          <div class="item-r">
            <p>
              厨余回收总重量（kg）
            </p>
            <p v-if="data.allWeight">
              {{ data.allWeight }}
            </p>
            <p v-else>
              0
            </p>
          </div>
        </div>
        <div class="solid"></div>
        <div class="item">
          <IconFont
            type="iconchuyuhuishoucishu"
            style="font-size: 40px; margin-right: 10px;"
          />
          <div class="item-r">
            <p>
              厨余回收次数
            </p>
            <p v-if="data.recycleCount">
              {{ data.recycleCount }}
            </p>
            <p v-else>
              0
            </p>
          </div>
        </div>
        <div class="solid"></div>
        <div class="item">
          <IconFont
            type="iconhuanbaozhizongji"
            style="font-size: 40px; margin-right: 10px;"
          />
          <div class="item-r">
            <p>
              积分总计
            </p>
            <p v-if="data.allEnvironment">
              {{ data.allEnvironment }}
            </p>
            <p v-else>
              0
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="12">
            定点厨余列表
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
          :row-key="record => record.id"
          :columns="columns"
          :data-source="data.page.list"
          :loading="loading"
          :pagination="pagination"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <template slot="type" slot-scope="text">
            <span v-if="text == 1">计次回收</span>
            <span v-else-if="text === 2">计重回收</span>
            <span v-else>-</span>
          </template>
          <template slot="weight" slot-scope="text, record">
            <span v-if="record.type == 1 || record.type === undefined">-</span>
            <span v-else>{{ text }}</span>
          </template>
          <template slot="unitPrice" slot-scope="text, record">
            <span v-if="record.type == 1 || record.type === undefined">-</span>
            <span v-else>{{ text }}</span>
          </template>
          <template slot="operate" slot-scope="text, record">
            <a-button
              v-if="record.handleDetail.length"
              type="link"
              size="small"
              @click="view(record.handleDetail)"
            >
              查看
            </a-button>
          </template>
        </a-table>
        <!-- 处置纪录 -->
        <a-modal
          :visible="recordVisible"
          title="差额处置纪录"
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
    </div>
  </div>
</template>

<script>
import {
  getArea,
  getEstate,
  toExportExcel,
  iconFontComponent
} from '@/components/mixins/mixins.js'
import { getFoodWasteList } from '@/api/order'
import moment from 'moment'
export default {
  components: {},
  mixins: [getArea, getEstate, toExportExcel, iconFontComponent],
  data () {
    return {
      recordVisible: false,
      recordList: [],
      visible: false,
      confirmLoading: false,
      exportDate: '',
      rangeConfig: {
        initialValue: [moment(), moment()],
        rules: [{ type: 'array' }]
      },
      areas: [],
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this),
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderId',
          width: 150
        },
        {
          title: '区域',
          dataIndex: 'address'
        },
        {
          title: '小区',
          dataIndex: 'estateName'
        },
        {
          title: '用户姓名',
          dataIndex: 'userName'
        },
        {
          title: '用户手机号',
          dataIndex: 'cellPhone'
        },
        {
          title: '用户IC卡号',
          dataIndex: 'cardNum'
        },
        {
          title: '厨余回收人员',
          dataIndex: 'recycleUser'
        },
        {
          title: '回收时间',
          dataIndex: 'createTime',
          width: 130
        },
        {
          title: '回收品类',
          dataIndex: 'recycleCategory'
        },
        {
          title: '计价方式',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '重量（kg）',
          dataIndex: 'weight',
          scopedSlots: { customRender: 'weight' }
        },
        {
          title: '单价（积分/kg）',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          title: '新增积分',
          dataIndex: 'environment'
        },
        {
          title: '操作',
          key: 'operate',
          width: 100,
          fixed: 'right',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      data: {
        page: {
          list: []
        }
      },
      loading: false,
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
      provinceName: '',
      cityName: '',
      areaName: ''
    }
  },
  mounted () {
    this.getArea('', 2)
    this.getEstate()
    this.toSearch()
  },
  methods: {
    view (data) {
      this.recordVisible = true
      this.recordList = data
    },
    onMonthChange (date, dateString) {
      this.exportDate = dateString
    },
    changeArea (areasId) {
      if (areasId.length === 1) {
        this.cityName = ''
        this.areaName = ''
        this.provinceName = this.areasDescTrans(areasId[0], '1')
      }
      if (areasId.length === 2) {
        this.areaName = ''
        this.cityName = this.areasDescTrans(areasId, '2')
      }
      if (areasId.length === 3) {
        this.areaName = this.areasDescTrans(areasId, '3')
      }
      this.estateList = []
      this.form.setFieldsValue({ estateId: undefined })
      if (areasId.length < 4) {
        this.getEstate(areasId)
      } else if (areasId.length === 4) {
        this.getEstate(null, areasId[3])
      }
    },
    areasDescTrans (areasId, rank) {
      if (rank === '1') {
        for (let i = 0; i < this.options.length; i++) {
          const rank1 = this.options[i]
          if (rank1.id === areasId) {
            return rank1.name
          }
        }
      } else if (rank === '2') {
        for (let j = 0; j < this.options.length; j++) {
          const rank2 = this.options[j]
          if (rank2.id === areasId[0]) {
            for (let k = 0; k < rank2.children.length; k++) {
              const rankChild2 = rank2.children[k]
              if (rankChild2.id === areasId[1]) {
                return rankChild2.name
              }
            }
            return element.name
          }
        }
      } else if (rank === '3') {
        for (let l = 0; l < this.options.length; l++) {
          const rank3 = this.options[l]
          if (rank3.id === areasId[0]) {
            for (let m = 0; m < rank3.children.length; m++) {
              const rankChild3 = rank3.children[m]
              if (rankChild3.id === areasId[1]) {
                for (let n = 0; n < rankChild3.children.length; n++) {
                  const rankChild4 = rankChild3.children[n]
                  if (rankChild4.id === areasId[2]) {
                    return rankChild4.name
                  }
                }
              }
            }
            return element.name
          }
        }
      }
    },
    getTableData () {
      const params = this.form.getFieldsValue()
      if (this.areas.length > 0) {
        params.province = this.provinceName
        params.city = this.cityName
        params.country = this.areaName
      }
      if (params.createTime.length) {
        params.startTime =
          params.createTime &&
          params.createTime[0].format('YYYY-MM-DD') + ' 00:00:00'
        params.endTime =
          params.createTime &&
          params.createTime[1].format('YYYY-MM-DD') + ' 23:59:59'
      }
      delete params.createTime
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      this.loading = true
      getFoodWasteList(params).then(res => {
        this.loading = false
        this.data = res.result
        this.pagination.total = res.result.page.total
      })
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    toSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    resetForm () {
      this.form.resetFields()
      this.areas = []
    },
    handleLimitTime (val) {
      const result = moment(val[1]).diff(val[0], 'days')
      if (result > 93) {
        this.$message.error('抱歉限制查询范围为3个月！请重新选择！')
        this.$nextTick(() => {
          this.form.resetFields(['createTime'])
        })
      }
    },
    toExport () {
      const params = this.form.getFieldsValue()
      if (this.areas.length > 0) {
        params.province = this.areas[0]
        params.city = this.areas[1]
        params.country = this.areas[2]
      }
      if (params.createTime.length) {
        params.startTime = params.createTime[0].format('YYYY-MM-DD 00:00:00')
        params.endTime = params.createTime[1].format('YYYY-MM-DD 23:59:59')
      } else {
        this.$message.error('请先选择日期再导出')
        return false
      }
      delete params.createTime
      this.toExportExcel(
        '/pointRecycle/exportFoodWaste',
        params,
        '定点厨余记录.xlsx'
      )
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/common.styl'
.delivery-data
  width 100%
  padding 16px 20px
  box-sizing border-box
  background-color #fff
  margin 16px 0
  .list
    width 100%
    display flex
    padding 0 54px
    box-sizing border-box
    justify-content space-between
    .item
      width 24%
      display flex
      // cursor pointer
      height 90px
      align-items center
      .item-r
        padding-top 20px
        line-height 16px
        margin-left 16px
        font-size 12px
        color #666666
        width 60%
        p:last-child
          font-size 22px
          color #000
          font-weight 600
    .solid
      width 1px
      height 58px
      background-color #F2F2F2
</style>
