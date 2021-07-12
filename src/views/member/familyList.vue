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
            <a-col class="search-item" :span="6">
              <a-form-item
                label="楼栋号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-decorator="['buildingNumberId']"
                  allow-clear
                  placeholder="全部"
                  @change="changeRoomNum"
                >
                  <a-select-option
                    v-for="(item, index) in floorList"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="单元号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-decorator="['unitId']"
                  allow-clear
                  placeholder="全部"
                >
                  <a-select-option
                    v-for="(item, index) in roomNumList"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
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
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="创建时间"
              >
                <a-range-picker v-decorator="['createTime']" />
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
    <div class="card-container mrt16">
      <a-row>
        <a-col :span="12">
          <div class="card-title">
            家庭列表
          </div>
        </a-col>
        <a-col :span="12" align="right">
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
        >
          <template slot="userNum" slot-scope="record">
            <a-button
              type="link"
              size="small"
              @click="handleShowUserList(record)"
            >
              {{ record.userNum }}
            </a-button>
          </template>
          <template slot="action" slot-scope="record" class="btn-list">
            <a-button type="link" size="small" @click="handleUserEdit(record)">
              编辑
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <!-- 家庭成员 -->
    <a-modal
      :visible="userVisible"
      title="家庭成员"
      centered
      wrap-class-name="role-modal"
      @ok="userVisible = false"
      @cancel="userVisible = false"
    >
      <div class="role-table">
        <a-table
          class="table-content"
          :columns="tableColumns"
          :data-source="userList"
          :row-key="record => record.id"
          :pagination="false"
          :scroll="userList.length > 10 ? { y: 300 } : {}"
          bordered
        ></a-table>
      </div>
      <template slot="footer">
        <a-button @click="userVisible = false">
          关闭
        </a-button>
      </template>
    </a-modal>
    <!-- 编辑家庭列表 -->
    <a-modal
      title="家庭用户信息编辑"
      centered
      :visible="visible"
      class="siteModal"
      width="500"
      @cancel="() => (visible = false)"
    >
      <a-form :form="orderForm" class="detail-form">
        <div class="modal-title">
          家庭信息
        </div>
        <a-form-item
          label="区域"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-cascader
            v-decorator="[
              'memberRegion',
              {
                initialValue: [],
                rules: [{ required: true, message: '请选择省市区、街道' }],
                validateTrigger: 'change'
              }
            ]"
            :options="areaData"
            :load-data="handleAreaData"
            :field-names="{
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            placeholder="请选择省市区、街道"
            change-on-select
            @change="handleAreaChange"
          />
        </a-form-item>
        <a-form-item
          label="小区"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            v-decorator="[
              'estateId',
              {
                rules: [{ required: true, message: '请选择小区' }],
                validateTrigger: 'change'
              }
            ]"
            style="width: 100%"
            placeholder="请选择小区"
          >
            <a-select-option
              v-for="(item, index) in community"
              :key="index"
              :value="item.id"
            >
              {{ item.housingEstate }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="楼栋号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="['buildingNumber']"
            :max-length="20"
            type="text"
            placeholder="请填写楼栋号"
          />
        </a-form-item>
        <a-form-item
          label="单元号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="['unit']"
            :max-length="20"
            type="text"
            placeholder="请填写单元号"
          />
        </a-form-item>
        <a-form-item
          label="门牌号"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="['roomNum']"
            :max-length="20"
            type="text"
            placeholder="请填写门牌号"
          />
        </a-form-item>
        <div v-if="memberList.length" class="modal-title">
          成员信息
        </div>
        <div v-if="memberList.length" class="modal-list">
          <a-row
            v-for="(item, index) in memberList"
            :key="index"
            class="item"
            :gutter="24"
          >
            <a-col :span="8">
              <a-row type="flex" align="middle">
                <a-col :span="8">
                  成员{{ index + 1 }}
                </a-col>
                <a-col :span="16">
                  <a-input v-model="item.userRealName" />
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row type="flex" align="middle">
                <a-col :span="8">
                  手机号
                </a-col>
                <a-col :span="16">
                  <a-input v-model="item.cellPhone" disabled />
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row type="flex" align="middle">
                <a-col :span="8">
                  IC卡号
                </a-col>
                <a-col :span="16">
                  <a-input :value="item.cardNum" disabled />
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <template slot="footer">
        <a-button @click="() => (visible = false)">
          取消
        </a-button>
        <a-button
          :loading="confirmLoading"
          type="primary"
          @click="submitUserEidt"
        >
          保存
        </a-button>
      </template>
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
import { getAreaList, estateList } from '@/api/common'
import { familyList, familyEdit } from '@/api/member'
const columns = [
  {
    title: '区域',
    dataIndex: 'areaNames',
    key: 'areaNames'
  },
  {
    title: '小区',
    dataIndex: 'estateName',
    key: 'estateName'
  },
  {
    title: '家庭名称',
    dataIndex: 'holdName',
    key: 'holdName'
  },
  {
    title: '家庭成员数',
    key: 'userNum',
    align: 'center',
    scopedSlots: { customRender: 'userNum' }
  },
  {
    title: '楼栋号',
    dataIndex: 'buildingNumber',
    key: 'buildingNumber'
  },
  {
    title: '单元号',
    dataIndex: 'unit',
    key: 'unit'
  },
  {
    title: '门牌号',
    dataIndex: 'roomNum',
    key: 'roomNum'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
const tableColumns = [
  {
    title: '成员',
    dataIndex: 'userRealName'
  },
  {
    title: 'IC卡号',
    dataIndex: 'cardNum'
  },
  {
    title: '手机号',
    dataIndex: 'cellPhone'
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
      loading: false,
      visible: false,
      userVisible: false,
      confirmLoading: false,
      currentId: '',
      region: [],
      formData: [],
      floorList: [],
      roomNumList: [],
      areaData: [],
      userList: [], // 查看的成员列表
      memberList: [], // 编辑时的成员列表
      community: [], // 编辑的小区列表
      columns,
      tableColumns,
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
      form: this.$form.createForm(this, { name: 'filter_from' }),
      orderForm: this.$form.createForm(this, { name: 'order_from' })
    }
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.getArea('', 2)
      this.getEstate()
      this.getFamilyList()
    },
    getFamilyList () {
      const data = this.form.getFieldsValue()
      const params = {
        menuId: '56b1028d31a743b3988339fc395647f1',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        queryParams: {
          areas: this.region[0] ? `${this.region[0] || ''},${this.region[1] || ''},${this.region[2] || ''}` : '',
          street: this.region[3] || '',
          estateId: data.estateId || '',
          buildingNumberId: data.buildingNumberId || '',
          unitId: data.unitId || '',
          cellPhone: data.cellPhone || '',
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
      }
      this.loading = true
      familyList(params).then(res => {
        this.loading = false
        const result = res.result
        this.formData = result.data
        this.pagination.total = result.totalCount
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
    getFloor (pId, type = 3) {
      this.$httpPost(this.$basePath.getEstateByPId, {
        pId,
        type
      }).then(res => {
        if (type === 3) {
          this.floorList = res.result
        } else {
          this.roomNumList = res.result
        }
      })
    },
    toSearch (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.pagination.current = 1
          this.getFamilyList()
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
    submitUserEidt () {
      const {
        orderForm: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', this.memberList)
          const params = {
            menuId: '59fea5809adb40159d2f4b3acfb2b786',
            unit: values.unit,
            roomNum: values.roomNum,
            estateId: values.estateId || '',
            buildingNumber: values.buildingNumber || '',
            memberUserList: this.memberList,
            id: this.currentId
          }
          familyEdit(params).then(res => {
            this.visible = false
            this.confirmLoading = false
            this.$message.success('修改成功')
            this.resetForm()
            this.orderForm.resetFields()
            this.getFamilyList()
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleUserEdit (item) {
      this.visible = true
      this.memberList = item.memberUserList
      this.currentId = item.id
      const areaIds = item.areaIds.split(',')
      areaIds.splice(0, 1)
      this.getAreaData(areaIds[0])
      this.handleAreaChange(areaIds)
      setTimeout(() => {
        this.$nextTick(() => {
          this.orderForm.setFieldsValue({ memberRegion: areaIds })
          this.orderForm.setFieldsValue({ estateId: item.estateId })
          this.orderForm.setFieldsValue({ buildingNumber: item.buildingNumber })
          this.orderForm.setFieldsValue({ unit: item.unit })
          this.orderForm.setFieldsValue({ roomNum: item.roomNum })
        })
      }, 800)
    },
    // 展示家庭列表
    handleShowUserList (item) {
      if (!item.memberUserList.length) return false
      this.userList = item.memberUserList
      this.userVisible = true
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getFamilyList()
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
    changeEstate (value) {
      if (value) {
        this.getFloor(value)
      }
    },
    changeRoomNum (value) {
      if (value) {
        this.getFloor(value, 4)
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
        menuId: '3c1992b41a5b49bfb717ebe7a662c4c3',
        queryParams: {
          provinceName: this.region[0] || '',
          cityName: this.region[1] || '',
          countyName: this.region[2] || '',
          street: this.region[3] || '',
          estateId: data.estateId || '',
          buildingNumberId: data.buildingNumberId || '',
          cellPhone: data.cellPhone || '',
          unitId: data.unitId || '',
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
      }
      this.toExportExcel('/hold/exportAllHoldList', params, '家庭列表.xlsx')
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
