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
                  @change="changeArea"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="8">
              <a-form-item
                label="小区"
                v-bind="formItemLayout"
              >
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
            <a-col class="search-item" :span="8">
              <a-form-item
                v-bind="formItemLayout"
                label="补货时间"
              >
                <a-range-picker v-decorator="['createTime', rangeConfig]" style="width:100%;" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="8">
              <a-form-item
                label="兑换机名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['deviceName']"
                  allow-clear
                  placeholder="请输入兑换机名称"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="8">
              <a-form-item
                label="兑换机编号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['deviceId']"
                  allow-clear
                  placeholder="请输入兑换机编号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="8">
              <a-form-item
                label="补货人员"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['userName']"
                  allow-clear
                  placeholder="请输入补货人员账号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="24" align="right">
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
        <div class="list_left">
          <div class="item">
            <IconFont type="iconbuhuocishu2" class="iconfont" style="font-size: 40px; margin-right: 10px;" />
            <div class="item-r">
              <p style="font-size: 15px;">
                补货次数总计
              </p>
              <p v-if="getGoodsTotal.total">
                {{ getGoodsTotal.total }}
              </p>
              <p v-else>
                0
              </p>
            </div>
            <div class="solid"></div>
          </div>
          <div class="item">
            <IconFont type="iconshanghuoshuliang" class="iconfont" style="font-size: 40px; margin-right: 10px;" />
            <div class="item-r">
              <p style="font-size: 15px;">
                上货数量总计
              </p>
              <p v-if="getGoodsTotal.totalAdd">
                {{ getGoodsTotal.totalAdd }}
              </p>
              <p v-else>
                0
              </p>
            </div>
          </div>
        </div>
        <div v-if="goodsList.length" :loading="getGoodsLoading" class="list_right">
          <div class="tip_table">
            <a-row
              class="tip_row"
            >
              <a-col :span="20">
                <a-icon class="tip-icon" type="info-circle" />
                <span class="text">最终上货数量指某商品经过补货、减货、下架等操作后最终的变更总数量</span>
              </a-col>
              <a-col :span="4" align="right">
                <a-button :loading="exportLoading" @click="toExport">
                  导出
                </a-button>
              </a-col>
            </a-row>
            <a-table
              class="table-content-right" :columns="columnsRight" :data-source="goodsList" :scroll="{ y:300 }" :row-key="record => record.goodsId"
              :pagination="false"
            >
              <span slot="addNum" slot-scope="text">{{ text>0?`+${text}`: text }}</span>
              <span slot="afterNum" slot-scope="text" style="font-weight:700">{{ text }}</span>
            </a-table>
            <!-- <span class="title_table">
              <ul>
                <li class="title_li">
                  商品名称
                </li>
                <li v-for="(item,index) in goodsNameList" :key="index" class="span_li1">{{ item }}</li>
              </ul>
              <ul>
                <li class="title_li title_mli">
                  补货数量
                </li>
                <li v-for="(item1,index) in addNumList" :key="index" class="span_li">{{ item1 }}</li>
              </ul>
              <ul>
                <li class="title_li">
                  减货数量
                </li>
                <li v-for="(item2,index) in reduceNumList" :key="index" class="span_li">{{ item2 }}</li>
              </ul>
              <ul>
                <li class="title_li title_mli">
                  下架数量
                </li>
                <li v-for="(item3,index) in downNumList" :key="index" class="span_li">{{ item3 }}</li>
              </ul>
              <ul>
                <li class="title_li">
                  更换数量
                </li>
                <li v-for="(item4,index) in changeNumList" :key="index" class="span_li">{{ item4 }} </li>
              </ul>
              <ul>
                <li class="title_li title_mli">
                  最终上货数量
                </li>
                <li v-for="(item1,index) in afterNumList" :key="index" class="span_li">{{ item1 }}</li>
              </ul>
            </span> -->
          </div>
        </div>
        <div v-else class="list_empty">
          <span class="empty">
            暂无数据
          </span>
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="12">
            补货列表
          </a-col>
        </a-row>
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :row-key="record => record.id"
          :columns="columns"
          :data-source="dataList"
          :loading="loading"
          :pagination="pagination"
          :scroll="{x: 1500}"
          @change="handleTableChange"
        >
          <template v-if="text" slot="type" slot-scope="text">
            <span v-if="text === 1">补货</span>
            <span v-else-if="text === 2">下架</span>
            <span v-else-if="text === 3">更换商品</span>
            <span v-else-if="text === 4">减货</span>
            <span v-else></span>
          </template>
          <template slot="operate" slot-scope="text">
            <a-button type="link" size="small" @click="view(text)">
              查看
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getArea, getEstate, toExportExcel, iconFontComponent } from '@/components/mixins/mixins.js'
import { findReplenishmentList, getGoodsCount } from '@/api/deviceOrder'
const columns = [
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
    ellipsis: true
  },
  {
    title: '补货数量',
    dataIndex: 'addNum',
    scopedSlots: { customRender: 'addNum' },
    key: 'addNum'
  },
  {
    title: '减货数量',
    dataIndex: 'reduceNum',
    key: 'reduceNum',
    ellipsis: true
  },
  {
    title: '下架数量',
    dataIndex: 'downNum',
    key: 'downNum',
    ellipsis: true
  },
  {
    title: '更换数量',
    dataIndex: 'changeNum',
    key: 'changeNum',
    ellipsis: true
  },
  {
    title: '最终上货数量',
    dataIndex: 'afterNum',
    key: 'afterNum',
    scopedSlots: { customRender: 'afterNum' },
    ellipsis: true
  }
]
export default {
  components: {},
  mixins: [getArea, getEstate, toExportExcel, iconFontComponent],
  data () {
    return {
      exportDate: '',
      rangeConfig: {
        // initialValue: [moment(), moment()],
        // rules: [{ type: 'array' }]
      },
      areas: [],
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this),
      columns: [
        {
          title: '小区',
          dataIndex: 'estateName'
        },
        {
          title: '兑换机名称',
          dataIndex: 'name'
        },
        {
          title: '兑换机编号',
          dataIndex: 'deviceCode'
        },
        {
          title: '补货人员',
          dataIndex: 'userName'
        },
        {
          title: '变动数量',
          dataIndex: 'replenishmentCount'
        },
        {
          title: '变动类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '操作时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          key: 'operate',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      dataList: [],
      columnsRight: columns,
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
      // provinceName: '',
      // cityName: '',
      // areaName: '',
      // recycleCategoryList: [],
      // recycleWeightList: [],
      // recycleAmountList: [],
      goodsList: [],
      getGoodsLoading: false,
      getGoodsTotal: {},

      goodsNameList: [],
      addNumList: [],
      reduceNumList: [],
      downNumList: [],
      changeNumList: [],
      afterNumList: []
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'replenishmentView') {
      from.meta.keepAlive = true
      next()
    } else {
      from.meta.keepAlive = false
      next()
    }
  },
  mounted () {
    this.getArea('', 2)
    this.getEstate()
    this.toSearch()
  },
  methods: {
    changeArea (areasId) {
      this.estateList = []
      this.form.setFieldsValue({ estateId: undefined })
      if (areasId.length < 4) {
        this.getEstate(areasId)
      } else if (areasId.length === 4) {
        this.getEstate(null, areasId[3])
      }
    },
    getGoodsCount (params) {
      params.pageNo && delete params.pageNo
      params.pageSize && delete params.pageSize
      this.getGoodsLoading = true
      getGoodsCount(params)
        .then(res => {
          this.getGoodsLoading = false
          if (res.result) {
            this.goodsList = res.result.goodsList
            this.getGoodsTotal = res.result.total
            /* goodsNameList: [],
      addNumList: [],
      reduceNumList: [],
      downNumList: [],
      changeNumList: [],
      afterNumList: [] */
            // this.goodsNameList = JSON.parse(JSON.stringify(res.result.goodsList)).map(a => a.goodsName)
            // this.addNumList = JSON.parse(JSON.stringify(res.result.goodsList)).map(a => '+' + a.addNum)
            // this.reduceNumList = JSON.parse(JSON.stringify(res.result.goodsList)).map(a => a.reduceNum)
            // this.downNumList = JSON.parse(JSON.stringify(res.result.goodsList)).map(a => a.downNum)
            // this.changeNumList = JSON.parse(JSON.stringify(res.result.goodsList)).map(a => a.changeNum)
            // this.afterNumList = JSON.parse(JSON.stringify(res.result.goodsList)).map(a => a.afterNum)
          }
        })
    },
    getTableData (params1) {
      params1.pageNo = this.pagination.current
      params1.pageSize = this.pagination.pageSize
      this.loading = true
      findReplenishmentList(params1)
        .then(res => {
          this.loading = false
          this.dataList = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    transList (list, flag) {
      const newArr = []
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        if (flag === 'recycleCategory') {
          newArr.push(element[flag])
        } else if (flag === 'recycleWeight') {
          newArr.push(element[flag] + ' ' + element.unit)
        } else if (flag === 'recycleAmount') {
          const amount = element[flag] ? element[flag] + ' 元' : '0 元'
          const environment = element.environment ? element['environment'] + ' 积分' : '0 积分'
          const obj = { 'amount': amount, 'environment': environment }
          newArr.push(obj)
        }
      }
      return newArr
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData(this.getParams())
    },
    getParams () {
      const params = this.form.getFieldsValue()
      if (this.areas.length > 0) {
        params.provinceId = this.areas[0] || ''
        params.cityId = this.areas[1] || ''
        params.areaId = this.areas[2] || ''
        params.streetId = this.areas[3] || ''
      }
      if (params.createTime && params.createTime.length) {
        params.startTime = params.createTime && params.createTime[0].format('YYYY-MM-DD') + ' 00:00:00'
        params.endTime = params.createTime && params.createTime[1].format('YYYY-MM-DD') + ' 23:59:59'
      }
      params.createTime && delete params.createTime
      return params
    },
    toSearch () {
      this.pagination.current = 1
      this.getTableData(this.getParams())
      this.getGoodsCount(JSON.parse(JSON.stringify(this.getParams())))
    },
    resetForm () {
      this.form.resetFields()
      this.areas = []
    },
    toExport () {
      this.toExportExcel('/replenishment/export', this.getParams(), '补货记录.xlsx')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    view (value) {
      this.$router.push({
        path: '/device/replenishment/view',
        query: { id: value.id, type: value.type }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@media screen and (max-width: 1515px) {
    .span_li1 {
      width:100px;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
}
.text{
  margin-left 10px
}
.title_table{
  max-height 300px
  min-width 695px
  overflow-y scroll
  overflow-x hidden
  display flex
  justify-content left
}
.tip_table{
  width 95%
  margin 0 auto
}
.tip_row{
  align-items: center;
  display: flex;
}
.title_li{
  height: 25px;
  list-style: none;
  margin: 15px 0;
  font-size: 15px;
  // min-width: 75px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 600;
}
.title_mli{
  // margin:15px 30px;
  font-size: 15px;
}
.span_li{
  height: 25px;
  text-align:center;
  list-style: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.span_li1{
  text-align:left;
  height: 25px;
  list-style: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.mg100{
  // margin:0 30px;
}
.list_right .tip_table .ant-table-wrapper .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
  padding: 0 !important;
}
.list_right .ant-table-tbody > tr > td{
  border-bottom: 0px solid #e8e8e8 !important;
}
</style>
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
    padding 0 35px
    .list_left
      width: 35%
      justify-content: center
      align-items: center
      display: flex
      flex-direction: column
      border-right: 1px solid #d6d6d6
    .list_right
      width: 65%;
      .tip_table .ant-table-wrapper .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
        padding: 0
      }
      .ant-table-tbody > tr > td{
        border-bottom: 0px solid #e8e8e8;
      }
    .list_empty
      width: 65%;
      display: flex;
      align-items: center;
      justify-content: center;
      .empty
        display: flex
        align-items center
        justify-content center
    .item
      min-width: 350px
      display flex
      height 100px
      align-items center
      .item-r
        padding-top 20px
        line-height 16px
        margin-left 16px
        font-size 12px
        color #666666
        span,p:last-child
          font-size 22px
          color #000
          font-weight 600
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
