<template>
  <div class="intergral-rank">
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
                  placeholder="请选择小区"
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
                v-if="currentIndex === 0 || currentIndex === 4"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                label="排行日期"
              >
                <a-range-picker
                  v-decorator="[
                    'createTime',
                    {
                      initialValue: initDate
                    }
                  ]"
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
      <a-row>
        <a-col :span="24" align="right">
          <a-button style="margin-right:10px;" @click="handleShowDesc">
            统计说明
          </a-button>
          <a-button
            v-if="currentIndex === 0"
            :loading="exportLoading"
            @click="toExport"
          >
            导出
          </a-button>
        </a-col>
      </a-row>
      <div class="card-content">
        <a-tabs :default-active-key="0" @change="handleTabChange">
          <a-tab-pane
            v-for="item in tabsTitle"
            :key="item.value"
            :tab="item.title"
          >
          </a-tab-pane>
        </a-tabs>
        <a-table
          class="table-content"
          :pagination="false"
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :row-key="record => record.id"
          :scroll="{ x: 1500 }"
        >
          <span slot="balanceEnviron">{{
            currentIndex | environmentalZhVal
          }}</span>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { getArea, getEstate, toExportExcel } from '@/components/mixins/mixins'
import { rankGetData, deliveryRank, newRanking } from '@/api/operation'
const columns = [
  {
    title: '排名',
    key: 'rank',
    width: 50,
    customRender (text, record, index) {
      return index + 1
    }
  },
  {
    title: '区域',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '小区',
    dataIndex: 'estateName',
    key: 'estateName'
  },
  {
    title: '会员昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '手机号',
    dataIndex: 'cellPhone',
    key: 'cellPhone'
  },
  {
    title: '卡号',
    dataIndex: 'cardNum',
    key: 'cardNum'
  },
  {
    title: '家庭名称',
    key: 'holdName',
    customRender (val, row, index) {
      return `${row.estateName}${
        row.buildingNumber ? '-' + row.buildingNumber : ''
      }${row.unitNumber ? '-' + row.unitNumber : ''}${
        row.roomNum ? '-' + row.roomNum : ''
      }`
    }
  },
  {
    title: '当期投递次数',
    dataIndex: 'total',
    key: 'total'
  },
  {
    title: '当期新增余额',
    dataIndex: 'catCoin',
    key: 'catCoin'
  },
  {
    dataIndex: 'balanceEnviron',
    key: 'balanceEnviron',
    slots: { title: 'balanceEnviron' }
  }
]
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
export default {
  filters: {
    environmentalZhVal: value => {
      let str = ''
      switch (value) {
        case 0:
          str = '当期新增环保值'
          break
        case 1:
          str = '累计环保值'
          break
        case 2:
          str = '实时环保值'
          break
        case 3:
          str = '实时金额'
          break
        default:
          str = '分类投递次数'
          break
      }
      return str
    }
  },
  mixins: [getArea, getEstate, toExportExcel],
  data () {
    return {
      loading: false,
      visible: false,
      currentIndex: 0,
      initDate: [moment().subtract(60, 'days'), moment()],
      tabsTitle: [
        {
          title: '当期新增环保值',
          value: 0
        },
        {
          title: '累计环保值排行',
          value: 1
        },
        {
          title: '实时环保值排行',
          value: 2
        },
        {
          title: '实时金额排行',
          value: 3
        },
        {
          title: '分类次数排行',
          value: 4
        }
      ],
      areaNames: [],
      tableData: [],
      region: [],
      columns,
      formItemLayout,
      form: this.$form.createForm(this, { name: 'filter_from' })
    }
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.getArea('', 2)
      this.getEstate().then(res => {
        const id = res[0].id
        this.$nextTick(() => {
          this.form.getFieldDecorator('estateId', {
            initialValue: id
          })
          this.getTableData()
        })
      })
    },
    getTableData () {
      const index = this.currentIndex
      let func
      switch (this.currentIndex) {
        case 0:
          func = newRanking
          break
        case 4:
          func = deliveryRank
          break
        default:
          func = rankGetData
          break
      }
      const data = this.form.getFieldsValue()
      if (index === 0) {
        if (!data.estateId) {
          this.$message.warning('请先选择小区')
          return false
        }
      }
      const params = {
        province: this.areaNames[0] || '',
        city: this.areaNames[1] || '',
        country: this.areaNames[2] || '',
        streetId: this.region[3] || '',
        estateId: data.estateId || '',
        rank: this.currentIndex
      }
      if (index === 0 || index === 4) {
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
        Object.assign(params, {
          startTime,
          endTime
        })
      }
      this.loading = true
      func(params).then(res => {
        this.loading = false
        this.tableData = res.result
      })
    },
    toSearch (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.getTableData()
        }
      })
    },
    handleTabChange (value) {
      const index = this.columns.findIndex(item => item.key === 'holdName')
      this.currentIndex = value
      if (index > 0) {
        if (value !== 0) {
          this.columns.splice(index, 3)
        }
      } else {
        if (value === 0) {
          const _arr = [
            {
              title: '家庭名称',
              key: 'holdName',
              customRender (val, row, index) {
                return `${row.estateName}${
                  row.buildingNumber ? '-' + row.buildingNumber : ''
                }${row.unitNumber ? '-' + row.unitNumber : ''}${
                  row.roomNum ? '-' + row.roomNum : ''
                }`
              }
            },
            {
              title: '当期投递次数',
              dataIndex: 'total',
              key: 'total'
            },
            {
              title: '当期新增余额',
              dataIndex: 'catCoin',
              key: 'catCoin'
            }
          ]
          this.columns.splice(7, 0, ..._arr)
        }
      }
      this.tableData = []
      this.getTableData()
    },
    handleShowDesc () {
      this.$info({
        title: '统计说明',
        centered: true,
        content: (
          <div>
            <p>
              <b>当期新增环保值</b>
              ：查询统计时间范围内累计新增的环保值或金额排行；
            </p>
            <p>
              <b>累计环保值排行</b>：从注册到当前总共累计获取的环保值排行；
            </p>
            <p>
              <b>实时环保值排行</b>：用户当前剩余环保值排行；
            </p>
            <p>
              <b>实时金额排行</b>：用户当前剩余金额排行；
            </p>
            <p>
              <b>分类次数排行</b>：用户参与垃圾分类投递次数排行。
            </p>
          </div>
        ),
        width: 550,
        onOk () {}
      })
    },
    resetForm () {
      this.region = []
      this.areaNames = []
      this.form.resetFields()
      this.form.setFieldsValue({ estateId: undefined })
    },
    changeArea (areasId, options) {
      this.areaNames = []
      this.form.setFieldsValue({ estateId: undefined })
      this.estateList = []
      if (areasId.length === 4) {
        this.getEstate(null, areasId[3]).then(res => {
          if (res.length) {
            this.form.setFieldsValue({ estateId: res[0].id })
          }
        })
      } else {
        this.getEstate(areasId)
      }
      if (options && options.length) {
        options.forEach(item => {
          this.areaNames.push(item.name)
        })
      }
    },
    toExport () {
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
        province: this.areaNames[0] || '',
        city: this.areaNames[1] || '',
        country: this.areaNames[2] || '',
        streetId: this.region[3] || '',
        estateId: data.estateId || '',
        startTime,
        endTime
      }
      this.toExportExcel(
        '/memberUser/rankingExport',
        params,
        '新增资产排行.xlsx'
      )
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
.intergral-rank
  width 100%
</style>
