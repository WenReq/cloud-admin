<template>
  <div class="delivery">
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
                <!-- <a-input
                  v-decorator="['community']"
                  placeholder="请输入投递小区"
                /> -->
                <a-select
                  v-decorator="['estateId']"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="(item,index) in estateList" :key="index" :value="item.id">
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
                <a-range-picker v-decorator="['createTime', rangeConfig]" @change="changeTime" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="设备类型"
              >
                <a-select
                  v-decorator="['deviceType']"
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
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="投递品类"
              >
                <a-select
                  v-decorator="[
                    'categoryName',
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
                  <a-select-option
                    v-for="item in categoryList"
                    :key="item.dataValue"
                  >
                    {{ item.dataValue }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="18" align="right">
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
    <div class="delivery-data">
      <div class="list">
        <div v-for="(item, index) in deliveryData" :key="index" class="item">
          <a-avatar :size="52" :src="item.imgSrc" />
          <div class="item-r">
            <p>
              {{ item.title }}
            </p>
            <p>{{ item.num }}</p>
          </div>
          <div v-if="index != deliveryData.length - 1" class="solid"></div>
        </div>
      </div>
    </div>
    <div class="card-container mrt16">
      <a-row>
        <a-col :span="12">
          <div class="card-title">
            投递列表
          </div>
        </a-col>
        <a-col :span="12" align="right">
          <a-button :loading="exportLoading" @click="toExport">
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
          <template slot="cardNum" slot-scope="record">
            <span v-if="record.cardNum === '1'">
              按钮投递
            </span>
            <span v-else>
              {{ record.cardNum }}
            </span>
          </template>
          <template slot="scenario" slot-scope="record">
            <span>{{ record.scenario | deviceTypeFl }}</span>
          </template>
          <div slot="action" slot-scope="record" class="btn-list">
            <a-button
              class="table-btn-link"
              type="link"
              size="small"
              @click="showConfirm(record)"
            >
              违规
            </a-button>
            <a-button
              class="table-btn-link"
              type="link"
              size="small"
              @click="linkDetail(record)"
            >
              查看
            </a-button>
          </div>
        </a-table>
      </div>
    </div>
    <!-- <a-modal
      title="请选择导出月份"
      centered
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-month-picker
        style="width:100%;"
        placeholder="请选择导出月份"
        @change="onMonthChange"
      />
    </a-modal> -->
  </div>
</template>
<script>
import moment from 'moment'
import { getArea, getEstate, toExportExcel } from '@/components/mixins/mixins'
import { deliveryRecord, violation, category } from '@/api/order'
const columns = [
  {
    title: '订单号',
    dataIndex: 'orderId',
    width: 155
  },
  {
    title: '手机号',
    dataIndex: 'cellPhone'
  },
  {
    title: 'IC卡号',
    scopedSlots: { customRender: 'cardNum' }
  },
  {
    title: '投递小区',
    dataIndex: 'estateName'
  },
  {
    title: '设备类型',
    dataIndex: '',
    key: 'scenario',
    scopedSlots: { customRender: 'scenario' }
  },
  {
    title: '设备编号',
    dataIndex: 'productId'
  },
  {
    title: '投递时间',
    dataIndex: 'createDate',
    width: 130
  },
  {
    title: '投递品类',
    dataIndex: 'dataValue'
  },
  {
    title: '重量（kg）',
    dataIndex: 'rubbishWeight'
  },
  {
    title: '新增余额',
    dataIndex: 'catCoin'
  },
  {
    title: '新增环保值',
    dataIndex: 'integralValue'
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: (text) => {
      text = '成功'
      return text
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
  mixins: [getArea, getEstate, toExportExcel],
  data () {
    return {
      visible: false,
      loading: false,
      confirmLoading: false,
      categoryName: '',
      exportDate: '',
      exportMonth: '',
      region: [],
      rangeConfig: {
        initialValue: [moment(), moment()],
        rules: [{ type: 'array' }]
      },
      columns,
      deliveryData: [
        {
          title: '投递重量总计（kg）',
          imgSrc:
            'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200514/1589419776961a7ac7c32b8254eee9cc20a589f0153f3.png',
          num: 0
        },
        {
          title: '产生余额总计（元）',
          imgSrc:
            'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200514/1589419830194a4da895ea51c410a93cb974f21d1fa03.png',
          num: 0
        },
        {
          title: '产生环保值总计',
          imgSrc:
            'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200514/15894197542112bedb577dfab44baaec71fc365babea6.png',
          num: 0
        }
      ],
      formData: [],
      categoryList: [],
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
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'filter_from' })
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
      const params = {
        menuId: '267d57173e2d4718b102843278787cb1',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        provinceId: this.region[0] || '',
        cityId: this.region[1] || '',
        areaId: this.region[2] || '',
        streetId: this.region[3] || '',
        estateId: data.estateId || '',
        orderId: data.orderId || '',
        cardNum: data.IC || '',
        startTime:
          (data.createTime.length &&
            data.createTime[0].format('YYYY-MM-DD') + ' 00:00:00') ||
          '',
        endTime:
          (data.createTime.length &&
            data.createTime[1].format('YYYY-MM-DD') + ' 23:59:59') ||
          '',
        userName: data.nickName || '',
        productId: data.productId || '',
        scenario: data.deviceType,
        cellPhone: data.mobile || '',
        categoryName: data.categoryName || ''
      }
      this.loading = true
      deliveryRecord(params).then(res => {
        this.loading = false
        const result = res.result
        this.formData = result.list
        this.pagination.total = result.totalCount
        this.deliveryData[0].num = result.weightTotal
        this.deliveryData[1].num = result.catCoinTotal
        this.deliveryData[2].num = result.integralValueTotal
      })
    },
    getCategory () {
      category().then(res => {
        const result = res.result
        this.categoryList = result
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getOrderList()
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
    toExport () {
      const data = this.form.getFieldsValue()
      const params = {
        menuId: '267d57173e2d4718b102843278787cb1',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        provinceId: this.region[0] || '',
        cityId: this.region[1] || '',
        areaId: this.region[2] || '',
        streetId: this.region[3] || '',
        estateId: data.estateId || '',
        orderId: data.orderId || '',
        cardNum: data.IC || '',
        // startDate: this.exportDate,
        startTime:
          (data.createTime.length &&
            data.createTime[0].format('YYYY-MM-DD') + ' 00:00:00') ||
          '',
        endTime:
          (data.createTime.length &&
            data.createTime[1].format('YYYY-MM-DD') + ' 23:59:59') ||
          '',
        userName: data.nickName || '',
        productId: data.productId || '',
        scenario: data.deviceType,
        cellPhone: data.mobile || '',
        categoryName: data.categoryName || '',
        total: this.pagination.total
      }
      const deviceName = this.handleDeviceName(data.deviceType)
      // 2020年8月27日~9月20日投递记录
      const startName = data.createTime[0].format('YYYY年MM月DD日')
      const startDateYear = startName.split('年')[0]
      const endDateYear = data.createTime[1].format('YYYY年MM月DD日').split('年')[0]
      const endName = startDateYear === endDateYear ? data.createTime[1].format('MM月DD日') : data.createTime[1].format('YYYY年MM月DD日')
      const exportName = `${startName} ~ ${endName}${deviceName}投递记录.xlsx`
      this.changeTime(data.createTime) && this.toExportExcel(
        '/data/export',
        params,
        exportName
      )// 如果不超过两个月导出数据
    },
    showConfirm (item) {
      this.$confirm({
        title: '是否确定判定此次投递订单违规',
        centered: true,
        content: h => (
          <div>
            确定后将扣除用户余额并删除此投递订单，请慎重操作！若余额不足以扣减则此次操作失败！
          </div>
        ),
        onOk: () => {
          violation(item.id).then(res => {
            this.$message.success('操作成功')
            this.getOrderList()
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    linkDetail (item) {
      this.$router.replace({
        path: '/order/delivery/recordDetail',
        query: {
          type: item.scenario,
          id: item.id
        }
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    onMonthChange (date, dateString) {
      this.exportDate = dateString
      this.exportMonth = date.month() + 1
    },
    // handleOk (e) {
    //   if (!this.exportDate) {
    //     this.$message.error('请选择要导出数据的月份')
    //     return false
    //   }
    //   this.confirmLoading = true
    //   this.toExport()
    //   setTimeout(() => {
    //     this.visible = false
    //     this.confirmLoading = false
    //   }, 2000)
    // },
    handleCancel (e) {
      this.visible = false
    },
    changeTime (val) {
      const result = moment(val[1]).diff(val[0], 'days')
      if (result > 31) {
        this.$message.error('抱歉限制查询范围为1个月！请重新选择！')
        this.$nextTick(() => {
          this.form.resetFields(['createTime'])
        })
        return false
      } else {
        return true
      }
    },
    handleDeviceName (value) {
      let str = ''
      switch (value) {
        case '1':
          str = '智能垃圾桶'
          break
        case '2':
          str = '智能回收站'
          break
        case '4':
          str = '智能垃圾房'
          break
        case '':
          str = ''
          break
        default:
          break
      }
      return str
    },
    checkTime (val) {
      if (val.length) {
        // 判断时间跨度是否大于2个月
        const beginTime = val[0].split('-')
        const ednTime = val[1].split('-')
        beginTime[1] = parseInt(beginTime[1])
        beginTime[2] = parseInt(beginTime[2])
        ednTime[1] = parseInt(ednTime[1])
        ednTime[2] = parseInt(ednTime[2])
        let flag = true
        if (beginTime[0] === ednTime[0]) { // 同年
          if (ednTime[1] - beginTime[1] > 2) { // 月间隔超过2个月
            flag = false
          } else if (ednTime[1] - beginTime[1] === 2) { // 月相隔2个月，比较日
            if (ednTime[2] > beginTime[2]) { // 结束日期的日大于开始日期的日
              flag = false
            }
          }
        } else { // 不同年
          if (ednTime[0] - beginTime[0] > 1) {
            flag = false
          } else if (ednTime[0] - beginTime[0] === 1) {
            if (beginTime[1] < 10) { // 开始年的月份小于10时，不需要跨年
              flag = false
            } else if (beginTime[1] + 2 - ednTime[1] < 12) { // 月相隔大于2个月
              flag = false
            } else if (beginTime[1] + 2 - ednTime[1] === 12) { // 月相隔2个月，比较日
              if (ednTime[2] > beginTime[2]) { // 结束日期的日大于开始日期的日
                flag = false
              }
            }
          }
        }
        if (!flag) {
          return false
        }
        return true
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
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
