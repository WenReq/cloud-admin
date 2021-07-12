<template>
  <div class="abnormal">
    <div class="card-container">
      <div class="card-title">
        数据筛选
      </div>
      <div class="card-content">
        <a-form :form="form">
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="区域"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-cascader
                  v-model="region"
                  :load-data="loadData"
                  :options="options"
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
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="投递小区"
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
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="订单号"
              >
                <a-input v-decorator="['orderId']" placeholder="请输入订单号" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="手机号"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input v-decorator="['mobile']" placeholder="请输入手机号" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="IC卡号"
              >
                <a-input v-decorator="['IC']" placeholder="请输入IC卡号" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="设备编号"
              >
                <a-input
                  v-decorator="['productId']"
                  placeholder="请输入设备编号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="投递时间"
              >
                <a-range-picker v-decorator="['createTime']" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="设备类型"
              >
                <a-select v-decorator="['deviceType']" placeholder="全部">
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
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="投递品类"
              >
                <a-select
                  v-decorator="[
                    'categoryId',
                    {
                      initialValue: ''
                    }
                  ]"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in categoryList" :key="item.id">
                    {{ item.dataValue }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="确认状态"
              >
                <a-select
                  v-decorator="[
                    'state',
                    {
                      initialValue: ''
                    }
                  ]"
                  placeholder="全部"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option :value="0">
                    未处理
                  </a-select-option>
                  <a-select-option :value="1">
                    已处理
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="12" align="right">
              <a-form-item>
                <a-button type="primary" class="mr8" @click="toSearch">
                  查询
                </a-button>
                <a-button @click="resetForm">
                  重置
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <div class="card-container mrt16">
      <div class="card-title">
        异常投递列表
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :columns="columns"
          :data-source="formData"
          :loading="loading"
          :pagination="pagination"
          :row-key="record => record.orderId"
          :scroll="{ x: 1500 }"
          @change="handleTableChange"
        >
          <template slot="deliveryPhotos" slot-scope="text">
            <viewer :images="text">
              <span v-for="(i, j) in text" :key="j">
                <img
                  v-show="j == 0" :src="i" height="40"
                  class="pd5"
                >
              </span>
            </viewer>
          </template>
          <template slot="scenario" slot-scope="record">
            <span>{{ record.scenario | deviceTypeFl }}</span>
          </template>
          <div slot="action" slot-scope="record" class="btn-list">
            <a-button
              class="table-btn-link"
              type="link"
              size="small"
              @click="handleOperation(record)"
            >
              {{ record.state ? "查看" : "确认处理" }}
            </a-button>
          </div>
        </a-table>
      </div>
    </div>
    <a-modal
      title="异常投递确认处理"
      :visible="visible"
      centered
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form
        :form="submitForm"
        :confirm-loading="confirmLoading"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item v-if="currentItem && currentItem.state" label="处理时间">
          <a-input :value="invalidate" disabled />
        </a-form-item>
        <a-form-item v-else label="处理时间">
          <a-date-picker
            v-decorator="[
              'time',
              {
                initialValue: invalidate,
                rules: [{ required: true, message: '请选择处理时间' }]
              }
            ]"
            style="width:100%"
            show-time
            placeholder="请选择处理时间"
          />
        </a-form-item>
        <a-form-item label="确认备注">
          <a-textarea
            v-decorator="[
              'remark',
              {
                initialValue: remark,
                rules: [{ message: '请填写确认备注' }]
              }
            ]"
            :disabled="isAffirm"
            placeholder="请填写备注"
            rows="3"
            :max-length="50"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { getArea, getEstate } from '@/components/mixins/mixins'
import { abnormalDelivery, disposeDelivery } from '@/api/monitor'
import { category } from '@/api/order'
const columns = [
  {
    title: '订单号',
    dataIndex: 'orderId',
    width: 155
  },
  {
    title: '投递照片',
    key: 'path',
    dataIndex: 'path',
    scopedSlots: { customRender: 'deliveryPhotos' }
  },
  {
    title: '手机号',
    dataIndex: 'cellPhone'
  },
  {
    title: 'IC卡号',
    dataIndex: 'cardNum'
  },
  {
    title: '投递小区',
    dataIndex: 'estateName'
  },
  {
    title: '设备类型',
    dataIndex: 'type'
  },
  {
    title: '设备编号',
    dataIndex: 'productId'
  },
  {
    title: '投递时间',
    dataIndex: 'createdate',
    width: 130
  },
  {
    title: '投递品类',
    dataIndex: 'categoryName'
  },
  {
    title: '重量（kg）',
    dataIndex: 'rubbishweight'
  },
  {
    title: '新增余额',
    dataIndex: 'catCoin'
  },
  {
    title: '新增环保值',
    dataIndex: 'integralvalue'
  },
  {
    title: '状态',
    dataIndex: 'state',
    customRender: text => {
      return text === 1 ? '已处理' : '未处理'
    }
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 120,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  mixins: [getArea, getEstate],
  data () {
    return {
      visible: false,
      loading: false,
      isAffirm: false,
      confirmLoading: false,
      remark: '',
      invalidate: '',
      region: [],
      formData: [],
      categoryList: [],
      columns,
      currentItem: null,
      form: this.$form.createForm(this, { name: 'filter_form' }),
      submitForm: this.$form.createForm(this, { name: 'submit_form' }),
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => '共' + total + '条记录',
        pageSizeOptions: ['10', '20', '30', '40'],
        defaultPageSize: 10,
        total: 0
      }
    }
  },
  created: function () {
    this.handleQuery()
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.getArea('', 2)
      this.getEstate()
      this.getOrderList()
      this.getCategory()
    },
    getOrderList () {
      const data = this.form.getFieldsValue()
      const startTime =
        (data.createTime &&
          data.createTime.length &&
          data.createTime[0].format('YYYY-MM-DD 00:00:00')) ||
        ''
      const endTime =
        (data.createTime &&
          data.createTime.length &&
          data.createTime[1].format('YYYY-MM-DD 23:59:59')) ||
        ''
      const params = {
        startTime,
        endTime,
        menuId: '60fd9f26fdf3494cab5e7892f7769090',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        provinceId: this.region[0] || '',
        cityId: this.region[1] || '',
        areaId: this.region[2] || '',
        streetId: this.region[3] || '',
        estateId: data.estateId || '',
        orderId: data.orderId || '',
        cardNum: data.IC || '',
        userName: data.nickName || '',
        productId: data.productId || '',
        scenario: data.deviceType,
        cellPhone: data.mobile || '',
        categoryId: data.categoryId || '',
        state: data.state
      }
      this.loading = true
      abnormalDelivery(params).then(res => {
        this.loading = false
        const result = res.result
        this.formData = result.list
        this.pagination.total = result.total
      })
    },
    postDisposeDelivery () {
      const data = this.submitForm.getFieldsValue()
      const params = {
        id: this.currentItem.id,
        menuId: 'fea5306b396e45baae75665dcd416941',
        handleTime: data.time,
        handleRemark: data.remark
      }
      disposeDelivery(params).then(res => {
        this.getOrderList()
        this.handleModalCancel()
      })
    },
    getCategory () {
      category().then(res => {
        const result = res.result
        this.categoryList = result
      })
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
    handleOperation (item) {
      this.remark = ''
      this.currentItem = item
      if (item.state) {
        this.invalidate = item.handleTime
        this.remark = item.handleRemark
        this.isAffirm = true
      } else {
        this.isAffirm = false
        this.invalidate = moment()
      }
      this.visible = true
    },
    handleModalOk () {
      this.postDisposeDelivery()
    },
    handleModalCancel () {
      this.submitForm.resetFields()
      this.visible = false
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getOrderList()
    },
    resetForm () {
      this.region = []
      this.form.resetFields()
    },
    toSearch (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.pagination.current = 1
          this.getOrderList()
        }
      })
    },
    handleQuery () {
      const orderId = this.$route.query.orderId || ''
      orderId && this.form.getFieldDecorator('orderId', { initialValue: orderId })
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
.abnormal
  width 100%
</style>
