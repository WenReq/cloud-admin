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
                  placeholder="省市区"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="流水号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['serialNumber']"
                  allow-clear
                  placeholder="请输入流水号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="手机号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['phone']"
                  allow-clear
                  placeholder="请输入手机号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="IC卡号" v-bind="formItemLayout">
                <a-input
                  v-decorator="['cardNum']"
                  allow-clear
                  placeholder="请输入IC卡号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item label="类型" v-bind="formItemLayout">
                <a-select
                  v-decorator="['type']"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="(item, index) in typeList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item label="时间" v-bind="formItemLayout">
                <a-range-picker v-model="timeArr" @change="handleLimitTime" />
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
            环保值流水
            <span
              style="font-size:12px;color:#999;margin-left:10px"
            ><a-icon type="info-circle" />
              用户存在跨区域流动交易行为，数据可能存在误差</span>
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
          :row-key="record => record.createTime + Math.random() * 10000"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
        >
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getArea, toExportExcel } from '@/components/mixins/mixins.js'
export default {
  mixins: [getArea, toExportExcel],
  data () {
    return {
      timeArr: [],
      areas: [],
      area: {},
      typeList: [],
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, {}),
      options: [],
      columns: [
        {
          title: '流水号',
          dataIndex: 'serialNumber'
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          customRender (val, row, index) {
            if (val) {
              return moment(val).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: 'IC卡号',
          dataIndex: 'cardNum'
        },
        {
          title: '环保值',
          dataIndex: 'environmental'
        },
        {
          title: '类型',
          dataIndex: 'typeName'
        },
        {
          title: '来源',
          dataIndex: 'clientName'
        },
        {
          title: '备注',
          dataIndex: 'remark'
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
      }
    }
  },
  mounted () {
    this.getArea('', 2, null, true)
    this.getType()
    this.toSearch()
  },
  methods: {
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    getType () {
      this.$httpPost(this.$basePath.environmentType).then(res => {
        this.typeList = res.result.list || []
      })
    },
    toSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    getTableData () {
      this.loading = true
      if (this.areas.length > 0) {
        this.area.provinceId = this.areas[0]
        this.area.cityId = this.areas[1]
        this.area.areaId = this.areas[2]
      } else {
        this.area = {}
      }
      var param = Object.assign(this.form.getFieldsValue(), this.area)
      param.menuId = '4ddf098e4e7a4e1ea59c3e6e589654b2'
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      if (this.timeArr.length > 0) {
        param.startTime = new Date(
          this.timeArr[0].format('YYYY/MM/DD') + ' 00:00:00'
        ).getTime()
        param.endTime = new Date(
          this.timeArr[1].format('YYYY/MM/DD') + ' 23:59:59'
        ).getTime()
      }
      this.$httpPost(this.$basePath.envFlow, param)
        .then(res => {
          this.loading = false
          this.data = res.result.list
          this.pagination.total = res.result.totalCount
        })
        .catch(() => {
          this.loading = false
        })
    },
    resetForm () {
      this.form.resetFields()
      this.areas = []
      this.area = {}
      this.timeArr = []
    },
    handleLimitTime (val) {
      const result = moment(val[1]).diff(val[0], 'days')
      if (result > 31) {
        this.$message.error('抱歉限制查询范围为1个月！请重新选择！')
        this.timeArr = []
      }
    },
    toExport () {
      const param = Object.assign(this.form.getFieldsValue(), this.area)
      param.menuId = 'fa1d7e88a1b243c9a285bcacdbe6fd97'
      if (this.timeArr.length) {
        param.startTime = new Date(
          this.timeArr[0].format('YYYY-MM-DD 00:00:00')
        ).getTime()
        param.endTime = new Date(
          this.timeArr[1].format('YYYY-MM-DD 23:59:59')
        ).getTime()
        this.toExportExcel(
          this.$basePath.envFlowExport,
          param,
          '环保值流水.xlsx'
        )
      } else {
        this.$message.error('请先选择日期再导出')
      }
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
</style>
