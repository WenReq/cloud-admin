<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        数据筛选
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
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
                  placeholder="省市区、街道"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="8">
              <a-form-item
                label="智能秤型号"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['markId']"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="(item, index) in markList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="8">
              <a-form-item
                label="智能秤名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['name']"
                  allow-clear
                  placeholder="请输入智能秤名称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="8">
              <a-form-item
                label="智能秤编号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productId']"
                  allow-clear
                  placeholder="请输入智能秤编号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="16" align="right">
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
          <a-col :span="24">
            智能秤列表
          </a-col>
        </a-row>
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :row-key="record => record.id"
          :columns="columns"
          :data-source="data"
          :loading="loading"
          :pagination="pagination"
          :scroll="{x: 1500}"
          @change="handleTableChange"
        >
          <template slot="areas" slot-scope="text, record">
            {{ record.provinceName }}{{ record.cityName }}{{ record.areaName }}
          </template>
          <template slot="productMarkName" slot-scope="text, record">
            {{ record.productMark.name }}
          </template>
          <template slot="operate" slot-scope="text, record">
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="toView(record)"
            >
              查看
            </a-button>
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="toConfig(record)"
            >
              编辑
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
// getEstate
import { getArea } from '@/components/mixins/mixins.js'
export default {
  components: {},
  mixins: [getArea], // getEstate
  data () {
    return {
      state: undefined,
      areas: [],
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this),
      columns: [
        {
          title: '区域',
          // scopedSlots: { customRender: 'areas' }
          dataIndex: 'address'
        },
        {
          title: '智能秤名称',
          dataIndex: 'name'
        },
        {
          title: '智能秤型号',
          scopedSlots: { customRender: 'productMarkName' }
        },
        {
          title: '智能秤编号',
          dataIndex: 'productId'
        },
        {
          title: '安装时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'operate' },
          width: 130
        }
      ],
      data: [],
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
      markList: []
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'smartScalesEdit') {
      next(vm => {
        vm.load()
      })
    } else {
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'smartScalesView' || to.name === 'smartScalesEdit') {
      from.meta.keepAlive = true
      next()
    } else {
      from.meta.keepAlive = false
      next()
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.findMarkListByType()
      this.getArea('', 2)
      // this.getEstate()
      this.toSearch()
    },
    findMarkListByType () {
      const params = { markType: '7' }
      this.$httpPost('/product/findMarkListByType', params)
        .then(res => {
          this.markList = res.result
        })
    },
    getTableData () {
      const params = {}
      params.queryParams = this.form.getFieldsValue()
      // params.queryParams = {}
      if (this.areas.length > 0) {
        params.queryParams.provinceId = this.areas[0] || ''
        params.queryParams.cityId = this.areas[1] || ''
        params.queryParams.areaId = this.areas[2] || ''
        params.queryParams.streetId = this.areas[3] || ''
      }
      params.queryParams.scenario = '7'
      params.pageNo = this.pagination.current
      params.pageSize = this.pagination.pageSize
      this.loading = true
      this.$httpPost('/product/getList', params)
        .then(res => {
          this.loading = false
          this.data = res.result.data
          this.pagination.total = res.result.totalCount
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
      this.state = undefined
    },
    toView (record) {
      this.$router.push({
        path: '/device/smartScales/info',
        query: { id: record.id, pageType: 'view' }
      })
    },
    toConfig (record) {
      this.$router.push({
        path: '/device/smartScales/info',
        query: { id: record.id, pageType: 'edit' }
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
.tag
  display inline-block
  min-width 38px
  height 18px
  color #ffffff
  font-size $font12
  line-height 18px
  text-align center
  border-radius 2px
  background-color #000000
  &.grey
    background-color #8F96B3
  &.green
    background-color #57C22D
</style>
