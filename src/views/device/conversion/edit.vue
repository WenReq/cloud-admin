<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        兑换机信息
      </div>
      <div class="card-content">
        <a-form ref="detailForm" :form="form" class="detail-form">
          <a-row>
            <a-col :span="12">
              <a-form-item label="兑换机名称" v-bind="formItemLayout">
                <a-input v-decorator="['name']" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="兑换机编号" v-bind="formItemLayout">
                <a-input v-decorator="['deviceNumber']" disabled />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="兑换机型号" v-bind="formItemLayout">
                <a-input v-decorator="['markName']" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="绑定回收设备编号" v-bind="formItemLayout">
                <a-input v-decorator="['productId']" disabled />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="区域" v-bind="formItemLayout">
                <a-input v-decorator="['areas']" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="详细地址" v-bind="formItemLayout">
                <a-input v-decorator="['address']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="小区" v-bind="formItemLayout">
                <a-input v-decorator="['estateName']" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="安装时间" v-bind="formItemLayout">
                <a-input v-decorator="['updateTime']" disabled />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div v-if="supplier === 3" class="card-title">
        货道配置
      </div>
      <div v-if="supplier === 3" class="card-content">
        <a-table
          class="table-content"
          :row-key="record => record.storey"
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :scroll="{ y: 500 }"
          :pagination="false"
        >
          <template slot="racksTitle">
            每层每个货道放置商品容量
            <span
              style="font-weight:normal;font-size:10px;color:red;"
            >（配置货道容量需提前将兑换机对应货道的商品全部下架）</span>
          </template>
          <template slot="racks" slot-scope="record">
            <div class="list">
              <div v-for="item in record.racks" :key="item.id">
                <div class="item">
                  <span>货道{{ item.serialNum }}:</span><a-input-number
                    v-model="item.numCapacity"
                    :disabled="item.num > 0"
                    :min="0"
                    :precision="0"
                    :max="20"
                  />
                </div>
                <span>现有商品{{ item.num || 0 }}件</span>
              </div>
            </div>
          </template>
        </a-table>
      </div>
      <div class="card-content mb40 mt40">
        <a-row>
          <a-col :span="23" style="text-align:center;">
            <a-button class="mr8" @click="back">
              返回
            </a-button>
            <a-button type="primary" @click="save">
              保存
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { exchangeConfig } from '@/api/deviceOrder'
const columns = [
  {
    title: '货道层数',
    dataIndex: 'storey',
    width: 130
  },
  {
    title: '每层货道数量',
    dataIndex: 'rackAmount',
    width: 130
  },
  {
    key: 'racks',
    scopedSlots: { customRender: 'racks' },
    slots: { title: 'racksTitle' }
  }
]
export default {
  data () {
    return {
      loading: false,
      supplier: '',
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
      },
      columns,
      form: this.$form.createForm(this, { name: 'detailForm' }),
      tableData: []
    }
  },
  created: function () {
    this.getExchangeConfig()
  },
  mounted: function () {
    const data = JSON.parse(this.$route.query.info)
    this.getDetail(data)
  },
  methods: {
    getDetail (data) {
      this.form.setFieldsValue({
        address: data.address || '',
        name: data.name || '',
        estateName: data.estateName || '',
        areas: data.provinceName + data.cityName + data.areaName,
        productId: data.productId || '',
        deviceNumber: data.deviceNumber || '',
        markName: data.markName || '',
        updateTime: data.updateTime || ''
      })
      this.supplier = data.supplier
    },
    getExchangeConfig () {
      const { id } = JSON.parse(this.$route.query.info)
      exchangeConfig(id).then(res => {
        this.tableData = res.result
      })
    },
    save () {
      var param = JSON.parse(JSON.stringify(this.form.getFieldsValue()))
      this.form.validateFields(err => {
        if (!err) {
          const paramsData = JSON.parse(this.$route.query.info)
          param.provinceId = paramsData.provinceId
          param.provinceName = paramsData.provinceName
          param.cityId = paramsData.cityId
          param.cityName = paramsData.cityName
          param.areaId = paramsData.areaId
          param.areaName = paramsData.areaName
          param.deviceName = param.name
          param.id = this.$route.query.id
          if (this.supplier === 3) {
            Object.assign(param, {
              racks: this.handleRacksData(this.tableData)
            })
          }
          this.$httpPost(this.$basePath.conversionEdit, param).then(res => {
            this.$message.success('操作成功')
            this.$router.push({
              path: '/device/conversion/list'
            })
          })
        }
      })
    },
    handleRacksData (list) {
      const result = []
      list.forEach(item => {
        result.push(...item.racks)
      })
      return result
    },
    back () {
      this.$router.push({
        path: '/device/conversion/list'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/common.styl'
.list
  display flex
  flex-wrap wrap
  .item
    width 160px
    display flex
    align-items center
    margin-top 8px
    margin-bottom 4px
    span
      margin-right 10px
</style>
