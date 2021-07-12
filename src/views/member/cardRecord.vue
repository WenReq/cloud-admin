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
                label="IC卡号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['cardNum']"
                  allow-clear
                  placeholder="请输入IC卡号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="姓名"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['userName']"
                  allow-clear
                  placeholder="请输入姓名"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="手机号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['cellPhone']"
                  allow-clear
                  placeholder="请输入手机号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="办卡人员"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input
                  v-decorator="['nickName']"
                  allow-clear
                  placeholder="请输入人员名称或手机号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="办卡时间"
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
            办卡记录
            <span
              style="font-size:12px;color:#999;margin-left:10px"
            ><a-icon type="info-circle" />
              只展示2020年9月后产生的办卡数据，包括APP及后台开卡，当前办卡数量：{{
                pagination.total
              }}</span>
          </div>
        </a-col>
        <a-col :span="12" align="right">
          <a-button class="mr8" icon="search" @click="visible = true">
            卡状态查询
          </a-button>
          <a-button :loading="exportLoading" class="mr8" @click="toExport">
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
        />
      </div>
    </div>
    <a-modal
      :visible="visible"
      title="卡状态查询"
      :footer="null"
      centered
      @cancel="handleCancel"
    >
      <a-input-search
        v-model="searchVal"
        :loading="searchLoading"
        placeholder="请输入卡号查询"
        enter-button="查询"
        allow-clear
        @search="handleInputSearch"
      />
      <div>
        <a-empty v-if="isEmpty" style="margin:30px;" />
        <a-result v-else :status="state">
          <div slot="title">
            {{ stateVal }}
          </div>
          <div v-if="result.records.length" class="desc">
            <p v-for="(item, index) in result.records" :key="index">
              <a-icon
                v-if="item"
                :style="{ color: 'green' }"
                type="info-circle"
              />
              {{ item }}
            </p>
          </div>
        </a-result>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  getArea,
  getEstate,
  iconFontComponent,
  toExportExcel
} from '@/components/mixins/mixins'
import { getAreaList } from '@/api/common'
import { openCardRecord, cardState } from '@/api/member'
const columns = [
  {
    title: '区域',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '小区',
    dataIndex: 'housingEstate',
    key: 'housingEstate'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '手机号',
    key: 'cellPhone',
    dataIndex: 'cellPhone'
  },
  {
    title: '卡号',
    dataIndex: 'cardNum',
    key: 'cardNum'
  },
  {
    title: '楼栋号',
    dataIndex: 'buildingNumber',
    key: 'buildingNumber'
  },
  {
    title: '单元号',
    dataIndex: 'unitNumber',
    key: 'unitNumber'
  },
  {
    title: '门牌号',
    dataIndex: 'roomNum',
    key: 'roomNum'
  },
  {
    title: '办卡时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '办卡人员',
    dataIndex: 'nickName',
    key: 'nickName'
  },
  {
    title: '办卡人员手机号',
    dataIndex: 'mobile',
    key: 'mobile'
  }
]
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
export default {
  mixins: [getArea, getEstate, iconFontComponent, toExportExcel],
  data () {
    return {
      visible: false,
      loading: false,
      isEmpty: true,
      searchLoading: false,
      state: '',
      stateVal: '',
      searchVal: '',
      region: [],
      formData: [],
      areaData: [],
      columns,
      formItemLayout,
      result: {
        records: []
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
      this.getOpenCardRecord()
    },
    getOpenCardRecord () {
      const data = this.form.getFieldsValue()
      const params = {
        menuId: '86665050d0be403a84224ecfa8fdb901',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        province: this.region[0] || '',
        city: this.region[1] || '',
        country: this.region[2] || '',
        streetId: this.region[3] || '',
        estateId: data.estateId || '',
        nickName: data.nickName || '',
        cellPhone: data.cellPhone || '',
        userName: data.userName || '',
        cardNum: data.cardNum || '',
        startTime:
          (data.createTime &&
            data.createTime.length &&
            data.createTime[0].format('YYYY-MM-DD 00:00:00')) ||
          '',
        endTime:
          (data.createTime &&
            data.createTime.length &&
            data.createTime[1].format('YYYY-MM-DD 23:59:59')) ||
          ''
      }
      this.loading = true
      openCardRecord(params).then(res => {
        this.loading = false
        const result = res.result
        this.formData = result.list
        this.pagination.total = result.totalCount
      })
    },
    getCardState (cardNum) {
      this.searchLoading = true
      cardState(cardNum)
        .then(res => {
          this.searchLoading = false
          this.isEmpty = false
          const { state, records } = res.result
          this.result.records = records || []
          this.stateVal = this.handleStateVal(state).stateVal
          this.state = this.handleStateVal(state).state
        })
        .catch(() => {
          this.searchLoading = false
          this.isEmpty = true
        })
    },
    getAreaData (provinceId) {
      const newOptions = JSON.parse(JSON.stringify([...this.options]))
      newOptions.forEach(item => {
        if (item.id === provinceId) {
          getAreaList({
            id: item.id,
            layer: 3
          }).then(resp => {
            item.children = resp.result.data
            item.children.forEach(thing => {
              getAreaList({
                id: thing.id,
                layer: 4
              }).then(respo => {
                thing.children = respo.result.data
              })
            })
          })
        }
      })
      this.areaData = newOptions
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
    toSearch (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.pagination.current = 1
          this.getOpenCardRecord()
        }
      })
    },
    resetForm () {
      this.region = []
      this.form.resetFields()
    },
    handleInputSearch (val) {
      val && this.getCardState(val)
    },
    handleStateVal (value) {
      // 1:暂未绑卡 2:已绑卡 3:已作废
      let state = ''
      let stateVal = ''
      switch (value) {
        case 2:
          stateVal = '此卡正在使用中'
          state = 'success'
          break
        case 3:
          stateVal = '此卡已作废不可使用'
          state = 'error'
          break
        default:
          stateVal = '此卡暂未绑定'
          state = 'warning'
          break
      }
      return { state, stateVal }
    },
    handleCancel () {
      this.searchVal = ''
      this.isEmpty = true
      this.visible = false
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getOpenCardRecord()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    toExport () {
      const data = this.form.getFieldsValue()
      const params = {
        menuId: '86665050d0be403a84224ecfa8fdb901',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        province: this.region[0] || '',
        city: this.region[1] || '',
        country: this.region[2] || '',
        streetId: this.region[3] || '',
        estateId: data.estateId || '',
        nickName: data.nickName || '',
        cellPhone: data.cellPhone || '',
        userName: data.userName || '',
        cardNum: data.cardNum || '',
        startTime:
          (data.createTime &&
            data.createTime.length &&
            data.createTime[0].format('YYYY-MM-DD 00:00:00')) ||
          '',
        endTime:
          (data.createTime &&
            data.createTime.length &&
            data.createTime[1].format('YYYY-MM-DD 23:59:59')) ||
          ''
      }
      this.toExportExcel(
        '/memberUser/exportCardRecordList',
        params,
        '办卡记录.xlsx'
      )
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
.ant-result-icon
  .anticon
    font-size 60px
.ant-result-title
  font-size 18px
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
