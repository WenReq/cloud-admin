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
                label="设备名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productName']"
                  allow-clear placeholder="请输入设备名称"
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
          </a-row>
          <a-row>
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
            <a-col class="search-item" :span="6">
              <a-form-item
                label="发生满溢时间"
                v-bind="formItemLayout"
              >
                <a-range-picker
                  v-model="timeArr"
                  @change="handleLimitTime"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6" align="right">
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
            满溢列表
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
          :data-source="data"
          :row-key="record => record.id"
          :loading="loading"
          :pagination="pagination"
          :scroll="{x: 1500}"
          @change="handleTableChange"
        >
          <template slot="view" slot-scope="record">
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="toView(record)"
            >
              查看
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getMarkList, getGroupMark, getArea, getEstate, toExportExcel } from '@/components/mixins/mixins.js'
export default {
  components: {},
  mixins: [getMarkList, getGroupMark, getArea, getEstate, toExportExcel],
  data () {
    return {
      timeArr: [moment(), moment()],
      areas: [],
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, {}),
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
          title: '发生满溢时间',
          dataIndex: 'spillOverTime'
        },
        {
          title: '满溢箱体分类',
          dataIndex: 'markKey'
        },
        {
          title: '满溢处理状态',
          dataIndex: 'spillOverStatus',
          customRender (text, record, index) {
            if (text === '1') return '待处理'
            if (text === '2') return '已处理'
          }
        },
        {
          title: '巡检人员',
          dataIndex: 'inspectName'
        },
        {
          title: '操作',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'view' }
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
      }
    }
  },
  computed: {
  },
  mounted () {
    this.getArea('', 2)
    this.getMarkList()
    this.getGroupMark()
    this.getEstate()
    this.toSearch()
  },
  methods: {
    toSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    getTableData () {
      var param = this.form.getFieldsValue()
      param.menuId = 'd4260bc88bcb41bf8899f15406916509'
      param.pageNo = this.pagination.current
      param.pageSize = this.pagination.pageSize
      if (this.timeArr.length) {
        param.startTime = this.timeArr[0].format('YYYY-MM-DD') + ' 00:00:00'
        param.endTime = this.timeArr[1].format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (this.areas.length) {
        param.provinceId = this.areas[0]
        param.cityId = this.areas[1]
        param.areaId = this.areas[2]
        param.street = this.areas[3] || ''
      }
      this.loading = true
      this.$httpPost(this.$basePath.getSpillOverList, param)
        .then(res => {
          this.loading = false
          this.data = res.result.list
          this.pagination.total = res.result.total
        })
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
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    resetForm () {
      this.form.resetFields()
      this.areas = []
      this.timeArr = []
    },
    handleLimitTime (val) {
      const result = moment(val[1]).diff(val[0], 'days')
      if (result > 93) {
        this.$message.error('抱歉限制查询范围为3个月！请重新选择！')
        this.timeArr = []
      }
    },
    toExport () {
      var param = this.form.getFieldsValue()
      param.menuId = '989143f34fbe4adfb5f65925bf3dfe8d'
      if (this.timeArr.length) {
        param.startTime = this.timeArr[0].format('YYYY-MM-DD') + ' 00:00:00'
        param.endTime = this.timeArr[1].format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        this.$message.error('请先选择日期再导出')
        return false
      }
      if (this.areas.length) {
        param.provinceId = this.areas[0]
        param.cityId = this.areas[1]
        param.areaId = this.areas[2]
        param.street = this.areas[3] || ''
      }
      this.toExportExcel(this.$basePath.exportSpillOver, param, '满溢记录.xlsx')
    },
    toView (record) {
      this.$router.push({
        path: '/device/maintain/recordOverflow/flowDetail',
        query: {
          id: record.id
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
@import '~@/assets/css/common.styl'
</style>
