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
                label="签到人员"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-decorator="['userId']"
                  allow-clear
                  placeholder="全部"
                >
                  <a-select-option
                    v-for="(item, index) in crewList"
                    :key="index"
                    :value="item.userId"
                  >
                    {{ item.userName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="手机号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['cellPhone']"
                  allow-clear
                  placeholder="请输入志愿者手机号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备名称"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['name']"
                  allow-clear
                  placeholder="请输入设备名称"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备编号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['productId']"
                  allow-clear
                  placeholder="请输入设备编号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="创建时间"
              >
                <a-range-picker v-decorator="['createTime']" />
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
      <a-row>
        <a-col :span="12">
          <div class="card-title">
            签到列表
          </div>
        </a-col>
        <a-col :span="12" align="right">
          <a-button class="mr8" @click="toExport">
            导出
          </a-button>
        </a-col>
      </a-row>
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
            <img :src="record.path" alt="" @click="handleShowImg(record.path)">
          </template>
        </a-table>
      </div>
      <a-modal :visible="visible" :footer="null" @cancel="()=>visible=false">
        <img class="w100" :src="imgSrc">
      </a-modal>
    </div>
  </div>
</template>
<script>
import {
  getArea,
  getEstate,
  toExportExcel
} from '@/components/mixins/mixins'
import { getAreaList, estateList } from '@/api/common'
import { volunteerList, crewList } from '@/api/takeBack'
const columns = [
  {
    title: '区域',
    dataIndex: 'areas',
    key: 'areas'
  },
  {
    title: '小区',
    dataIndex: 'estateName',
    key: 'estateName'
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '设备编号',
    dataIndex: 'productId',
    key: 'productId'
  },
  {
    title: '签到人员',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '人员手机号',
    dataIndex: 'mobile',
    key: 'mobile'
  },
  {
    title: '创建时间',
    dataIndex: 'singDate',
    key: 'singDate'
  },
  {
    title: '签到照片',
    key: 'action',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  mixins: [getArea, getEstate, toExportExcel],
  data () {
    return {
      loading: false,
      visible: false,
      imgSrc: '',
      region: [],
      formData: [],
      areaData: [],
      crewList: [],
      columns,
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
      this.getCrewList()
      this.getTable()
    },
    getTable () {
      const data = this.form.getFieldsValue()
      const params = {
        menuId: '56b1028d31a743b3988339fc395647f1',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        provinceId: this.region[0] || '',
        cityId: this.region[1] || '',
        areaId: this.region[2] || '',
        street: this.region[3] || '',
        estateId: data.estateId || '',
        userId: data.buildingNumuserIdberId || '',
        name: data.name || '',
        mobile: data.mobile || '',
        productId: data.productId || '',
        startDate:
            (data.createTime &&
              data.createTime.length &&
              data.createTime[0].format('YYYY-MM-DD 00:00:00')) ||
            '',
        endDate:
            (data.createTime &&
              data.createTime.length &&
              data.createTime[1].format('YYYY-MM-DD 23:59:59')) ||
            ''
      }
      this.loading = true
      volunteerList(params).then(res => {
        this.loading = false
        const result = res.result
        this.formData = result.list
        this.pagination.total = result.totalCount
      })
    },
    getCrewList () {
      crewList().then(res => {
        this.crewList = res.result
        console.log(res)
      })
    },
    getEstateList (data) {
      estateList(data).then(res => {
        const result = res.result
        this.community = result
      })
    },
    getAreaData (provinceId) {
      const newOptions = JSON.parse(JSON.stringify([...this.options]))
      newOptions.forEach(item => {
        if (item.id === provinceId) {
          getAreaList({
            id: item.id,
            layer: 3
          })
            .then(resp => {
              item.children = resp.result.data
              item.children.forEach(thing => {
                getAreaList({
                  id: thing.id,
                  layer: 4
                })
                  .then(respo => {
                    thing.children = respo.result.data
                  })
              })
            })
        }
      })
      this.areaData = newOptions
    },
    toSearch (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.pagination.current = 1
          this.getTable()
        }
      })
    },
    resetForm () {
      this.region = []
      this.form.resetFields()
    },
    handleAreaData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption)
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getTable()
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
    handleAreaChange (value, obj) {
      const params = {
        areaIds: value.join(',')
      }
      value.length === 4 &&
        Object.assign(params, {
          street: value[3]
        })
      this.getEstateList(params)
    },
    toExport () {
      const data = this.form.getFieldsValue()
      const params = {
        menuId: '56b1028d31a743b3988339fc395647f1',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        provinceId: this.region[0] || '',
        cityId: this.region[1] || '',
        areaId: this.region[2] || '',
        street: this.region[3] || '',
        estateId: data.estateId || '',
        userId: data.buildingNumuserIdberId || '',
        name: data.name || '',
        mobile: data.mobile || '',
        productId: data.productId || '',
        startDate:
            (data.createTime &&
              data.createTime.length &&
              data.createTime[0].format('YYYY-MM-DD 00:00:00')) ||
            '',
        endDate:
            (data.createTime &&
              data.createTime.length &&
              data.createTime[1].format('YYYY-MM-DD 23:59:59')) ||
            ''
      }
      this.toExportExcel('/volunteer/export', params, '签到列表.xlsx')
    },
    handleShowImg (path) {
      this.visible = true
      this.imgSrc = path
    }
  }
}
</script>
<style lang="stylus">
.role-modal .ant-modal-footer
  text-align center
.siteModal
  .ant-modal-body
    padding-bottom 0
  .ant-modal-footer
    padding-top 0
    padding-bottom 24px
    text-align center
</style>
<style lang="stylus" scoped>
@import '~@/assets/css/common.styl'
.modal-title
  font-size 14px
  color #000000
  font-weight 500
.modal-list
  width 100%
  margin 20px 0
  padding-left 20px
  box-sizing border-box
  .item
    width 100%
    font-size 12px
    color #000000
    margin-bottom 16px
</style>
