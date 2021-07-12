<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        批量回收价格配置
      </div>
      <div class="card-content">
        <a-row>
          <a-col
            style="border-right: 1px solid #d2d2d2;padding: 15px;min-height: 395px;" :span="8"
          >
            <div class="contTile">
              选择设备
            </div>
            <a-form-model
              ref="form" class="mt15" :model="form"
              :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules"
            >
              <a-form-model-item label="设备类型：" prop="eqType">
                <a-select
                  v-model="form.eqType" allow-clear placeholder="请选择设备类型"
                  @change="findByMarkId"
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
              </a-form-model-item>
              <a-form-model-item label="设备型号：" prop="eqNo">
                <a-select
                  v-model="form.eqNo"
                  allow-clear
                  placeholder="请选择设备型号"
                  show-search
                  :filter-option="filterOption"
                  @change="findDataDictByMarkId"
                >
                  <a-select-option v-for="(item, index) in markList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="区域：" prop="areas">
                <a-cascader
                  v-model="form.areas"
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
              </a-form-model-item>
              <a-form-model-item label="小区：" prop="plot">
                <a-select
                  v-model="form.plot"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="(item,index) in estateList" :key="index" :value="item.id">
                    {{ item.housingEstate }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-form-model>
            <div style="text-align: center;">
              <a-button type="primary" @click="submitForm('form')">
                查询
              </a-button>
              <span style="margin-left:10px;">
                <a-checkbox @change="onChange">
                  全选查询结果
                </a-checkbox>
              </span>
            </div>
            <div style="margin-left: 50px;margin-left: 50px;max-height: 365px;overflow-y: auto;">
              <div v-if="treeData.length">
                <a-tree
                  v-model="checkedKeys" default-expand-all :tree-data="treeData" checkable
                  @check="onCheck"
                />
              </div>
            </div>
          </a-col>
          <a-col style="padding: 15px;" :span="16">
            <div class="contTile">
              设备回收价格
            </div>
            <div class="mt15">
              <a-row style="padding-left: 12px;">
                <a-col :span="23">
                  <a-form-model
                    ref="ruleForm"
                    :model="modelForm"
                  >
                    <a-table
                      class="table-content"
                      :row-key="record => record.id"
                      :columns="columns"
                      :data-source="data"
                      :pagination="false"
                      bordered
                    >
                      <template
                        v-for="(col,index) in ['unitPrice','type', 'initialWeight']"
                        :slot="col"
                        slot-scope="text, record"
                      >
                        <div v-if="col == 'type'" :key="index" style="width: 275px;">
                          <a-radio-group
                            name="radioGroup" :value="text" :default-value="0"
                            @change="e => handleChangeType(record,e.target.value, record.key, col)"
                          >
                            <a-radio :value="0">
                              金额计重
                            </a-radio>
                            <a-radio :value="1">
                              积分计重
                            </a-radio>
                            <a-radio :value="2">
                              积分计次
                            </a-radio>
                          </a-radio-group>
                        </div>
                        <div v-else-if="col !== 'type'" :key="index">
                          <a-form-model-item style="margin-bottom: 0px;" :prop="col" :rules="{validator: checkQuantity, prodObj: record, trigger: 'blur'}">
                            <a-input
                              class="input-table"
                              :value="text"
                              onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                              @change="e => handleChange(e.target.value, record.id, col)"
                            />
                            <span v-if="col === 'unitPrice' && record.type === 0">
                              元/千克
                            </span>
                            <span v-else-if="col === 'unitPrice' && record.type === 1">
                              个/千克
                            </span>
                            <span v-else-if="col === 'unitPrice' && record.type === 2">
                              个 / 次
                            </span>
                            <span v-else-if="col === 'initialWeight' && record.type === 2">
                              千克
                            </span>
                            <span v-else>
                              千克
                            </span>
                          </a-form-model-item>
                        </div>

                        <span v-else :key="index">
                          {{ text }}
                        </span>
                      </template>
                    </a-table>
                  </a-form-model>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="mb40 mt40">
        <a-row type="flex" justify="center">
          <a-col
            :span="12" type="flex" align="middle"
            style="text-align:center;"
          >
            <a-button class="mr8" @click="back">
              返回
            </a-button>
            <a-button type="primary" @click="save()">
              保存
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getGroupMark, getArea, getEstate, toExportExcel, findUser } from '@/components/mixins/mixins.js'
import { getEstateProduct, findDataDictByMarkId, getCateoryPrice, updateBathPrice } from '@/api/priceSeting'
export default {
  mixins: [getGroupMark, getArea, getEstate, toExportExcel, findUser],
  data () {
    return {
      // left
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        eqType: '',
        eqNo: '',
        areas: [],
        plot: ''
      },
      // right
      modelForm: {
        unitPrice: '',
        initialWeight: ''
      },
      columns: [
        {
          title: '回收分类',
          dataIndex: 'dataValue',
          align: 'center',
          width: 120
        },
        {
          title: '计价方式',
          dataIndex: 'type',
          align: 'center',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '品类单价',
          dataIndex: 'unitPrice',
          align: 'center',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          title: '产生金额起始重量',
          dataIndex: 'initialWeight',
          align: 'center',
          scopedSlots: { customRender: 'initialWeight' }
        }
      ],
      data: [],
      rules: {
        eqType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        eqNo: [{ required: true, message: '请选择设备型号', trigger: 'change' }]
      },
      treeData: [],
      confirmCheckedKeys: [],
      checkedKeys: [],
      markList: []
    }
  },
  created () {

  },
  mounted () {
    this.form = {}
    this.getArea('', 2)
    this.getEstate()
    this.findMarkListByType({})
  },
  methods: {
    checkQuantity (rule, value, callback) {
      if (rule.prodObj[rule.field] === '' || rule.prodObj[rule.field] === null || rule.prodObj[rule.field] === undefined) {
        callback(new Error('值不能为空'))
      } else if (!/(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/.test(Number(rule.prodObj[rule.field]))) {
        callback(new Error('请输入正确的值'))
      } else if (rule.field === 'unitPrice' && (rule.prodObj.type === 1 || rule.prodObj.type === 2) && (!/^[1-9]\d*$/.test(Number(rule.prodObj[rule.field])) && Number(rule.prodObj[rule.field]))) {
        callback(new Error('值必须为正整数'))
      } else {
        callback()
      }
    },
    findByMarkId () {
      this.findMarkListByType({ markType: this.form.eqType })
    },
    findMarkListByType (params) {
      this.$httpPost('/product/findMarkListByType', params)
        .then(res => {
          this.markList = res.result
        })
    },
    findDataDictByMarkId (val) {
      const params = {
        markId: val
      }
      findDataDictByMarkId(params).then(res => {
        const result = res.result
        this.data = result
      })
    },
    onCheck (checkedKeys, info) {
      // 合并两个数组
      this.confirmCheckedKeys = checkedKeys.concat(info.halfCheckedKeys)
    },
    changeArea (areasId) {
      this.estateList = []
      if (areasId.length < 4) {
        this.getEstate(areasId)
      } else if (areasId.length === 4) {
        this.getEstate(null, areasId[3])
      }
    },
    onChange (e) {
      this.checkedKeys = e.target.checked ? this.handleSelectData(this.treeData) : []
    },
    // 处理默认选中的菜单 UI展示
    handleSelectData (items) {
      const result = []
      function filter (list) {
        for (let i = 0; i < list.length; i++) {
          result.push(list[i].value)
          if (list[i].children && list[i].children.length) {
            filter(list[i].children)
          }
        }
      }
      filter(items)
      return result
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.treeData = []
          const params = {
            scenario: this.form.eqType || '',
            categoryNum: this.form.eqNo || '',
            provinceId: this.form.areas && this.form.areas[0] ? this.form.areas[0] : '',
            cityId: this.form.areas && this.form.areas[1] ? this.form.areas[1] : '',
            areaId: this.form.areas && this.form.areas[2] ? this.form.areas[2] : '',
            estateId: this.form.plot || ''
          }
          getEstateProduct(params).then(res => {
            const result = res.result
            if (result && result.length) {
              result.forEach(item => {
                this.treeData.push(this.handleTreeData(item))
              })
              console.log(this.treeData)
            } else {
              this.$message.error('暂无数据')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleTreeData (item) {
      const childrenNode = {
        title: item.name,
        key: item.id,
        value: item.id
      }
      if (item.children && item.children.length) {
        childrenNode.children = []
        item.children.forEach(subItem => {
          childrenNode.children.push(this.handleTreeData(subItem))
        })
      }
      return childrenNode
    },
    save (formName) {
      if (!this.checkedKeys.length) {
        this.$message.error('选择设备不能为空！')
        return false
      }
      // var dataFlag = true
      // this.data && this.data.forEach(item => {
      //   if (!(item.unitPrice) || !(item.initialWeight)) {
      //     dataFlag = false
      //   }
      // })
      this.$refs['ruleForm'].validate(valid => {
        // if (valid) {
        //   this.$message.error('价格配置字段不能为空！')
        // }
        if (this.checkedKeys.length && valid) {
          const params = {
            ids: this.checkedKeys,
            dictList: JSON.parse(JSON.stringify(this.data))
          }
          updateBathPrice(params).then(res => {
            if (res.code === 0) {
              this.$message.success('批量回收价格配置成功！')
              this.back()
            }
          })
        }
      })
      // const valid = this.checkedKeys.length && (this.data.length && dataFlag)
      // if (!dataFlag) {
      //   this.$message.error('价格配置字段不能为空！')
      //   return false
      // }
    },
    back () {
      this.$router.push({
        path: '/device/operation/deviceConfig'
      })
    },
    handleChange (value, key, column) { // 表格input绑定值
      const newData = [...this.data]
      const target = newData.filter(item => key === item.id)[0]
      if (target) {
        target[column] = value
      }
      this.data = newData
    },
    handleChangeType (row, value, key, column) {
      const params = {
        id: row.dictId,
        type: value
      }
      getCateoryPrice(params).then(res => {
        const result = res.result
        for (let i = 0; i < this.data.length; i++) {
          const element = this.data[i]
          if (element.dictId === row.dictId && element.id === row.id) {
            row.unitPrice = result
            row.type = value
            // 处理计价方式为积分计次时，产生金额起始重量设置为0
            if (column === 'type' && value === 2) {
              row['initialWeight'] = 0
            }
            this.data.splice(i, 1, row)
          }
        }
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
// 注释
.card-title
  font-size: 16px;
  font-weight: 600;
  border: 1px solid gainsboro;
  padding: 10px;
  color: #333;
.card-content
  border: 1px solid gainsboro;
  margin-top: 15px;
.mt15
  margin-top 15px
.contTile
  font-size 15px
  font-weight 600
</style>
