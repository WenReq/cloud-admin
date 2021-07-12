<template>
  <div class="member-import">
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
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
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
                  placeholder="省市区、街道"
                  @change="changeArea"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="小区"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
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
              <a-form-item
                label="规则名称"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['ruleName']"
                  allow-clear placeholder="请输入价格规则名称"
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
    <div class="card-container mrt16">
      <div class="mb20">
        <a-row>
          <a-col :span="12" class="title">
            积分规则列表
          </a-col>
          <a-col :span="12" align="right">
            <a-button type="primary" @click="add()">
              添加规则
            </a-button>
          </a-col>
        </a-row>
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :columns="columns"
          :data-source="formData"
          :loading="loading"
          :pagination="pagination"
          :row-key="record => record.id"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <template slot="action" slot-scope="record" class="btn-list">
            <a-button type="link" size="small" @click="handleView(record)">
              查看
            </a-button>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getArea,
  getEstate,
  iconFontComponent
} from '@/components/mixins/mixins'
import { getData } from '@/api/operation'
const columns = [
  {
    title: '积分规则名称',
    dataIndex: 'ruleName',
    key: 'ruleName'
  },
  {
    title: '适用小区',
    dataIndex: 'estateNames',
    key: 'estateNames',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime'
  },
  {
    title: '操作人',
    dataIndex: 'handleUser',
    key: 'handleUser'
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
export default {
  mixins: [getArea, getEstate, iconFontComponent],
  data () {
    return {
      loading: false,
      visible: false,
      region: [],
      formData: [],
      columns,
      formItemLayout,
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
      form: this.$form.createForm(this, { name: 'filter_from' })
    }
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.getArea('', 2)
      this.getEstate()
      this.getDataList()
    },
    getDataList () {
      const data = this.form.getFieldsValue()
      const params = {
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        provinceId: this.region[0] || '',
        cityId: this.region[1] || '',
        areaId: this.region[2] || '',
        streetId: this.region[3] || '',
        estateId: data.estateId || '',
        ruleName: data.ruleName || ''
      }
      this.loading = true
      getData(params).then(res => {
        this.loading = false
        const result = res.result
        this.formData = result.list
        this.pagination.total = result.total
      })
    },
    toSearch (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.pagination.current = 1
          this.getDataList()
        }
      })
    },
    resetForm () {
      this.region = []
      this.form.resetFields()
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getDataList()
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
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    add () {
      this.$router.push({
        path: '/operation/integral/configRulePage',
        query: { pageType: 'add' }
      })
    },
    handleEdit (row) {
      this.$router.push({
        path: '/operation/integral/configRulePage',
        query: { id: row.id, pageType: 'edit' }
      })
    },
    handleView (row) {
      this.$router.push({
        path: '/operation/integral/configRulePage',
        query: { id: row.id, pageType: 'view' }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/css/common.styl'
</style>
