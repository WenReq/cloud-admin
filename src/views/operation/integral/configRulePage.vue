<template>
  <div>
    <div class="card-container">
      <div class="cardTitle">
        配置积分规则
      </div>
      <div class="card-content">
        <a-row>
          <a-col
            style="padding: 15px;min-height: 395px;" :span="12"
          >
            <a-form-model
              ref="form" :model="form"
              :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules"
            >
              <div class="mt15 contTile">
                <span class="line"></span>
                积分规则名称
              </div>
              <a-form-model-item label="规则名称" isrequire prop="ruleName">
                <a-input v-model="form.ruleName" :disabled="pageType === 'view'" placeholder="请填写规则名称"></a-input>
              </a-form-model-item>
              <div class="mt15 contTile">
                <span class="line"></span>
                关联小区
                <a-icon class="tip-icon" type="info-circle" />
                <span v-if="pageType === 'add'" class="text">选择相应小区的用户配置积分规则，已配置的小区不可选！</span>
                <span v-else class="text">选择相应小区的用户配置积分规则，小区不可重复！</span>
              </div>
              <a-form-model-item v-if="pageType !== 'view'" label="区域：" prop="areas">
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
              <!-- <a-form-model-item v-if="pageType !== 'view'" label="小区：" prop="plot">
                <a-select
                  v-model="form.plot"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                  @change="changePlot"
                >
                  <a-select-option v-for="(item,index) in estateList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item> -->
              <div v-if="pageType !== 'view'">
                <a-transfer
                  :data-source="treeData"
                  show-search
                  :list-style="{
                    width: '280px',
                    height: '450px',
                  }"
                  :selected-keys="selectedKeys"
                  :titles="['全选筛选结果', '已选小区']"
                  :locale="{itemUnit: '', itemsUnit: '', searchPlaceholder: '请输入小区名称' }"
                  :target-keys="targetKeys"
                  :filter-option="filterOptionTrans"
                  :render="item => item.isCurrentRule === 1 ? item.title : (item.ruleName ? `${item.title}(已配策略：${item.ruleName})` : `${item.title}`)"
                  @change="handleChange"
                  @selectChange="handleSelectChange"
                >
                  <a-button
                    slot="footer"
                    size="small"
                    style="float:right;margin: 5px"
                    @click="backInit"
                  >
                    <a-icon type="undo" />
                    恢复
                  </a-button>
                  <span slot="notFoundContent">
                    没数据
                  </span>
                </a-transfer>
              </div>

              <div v-else>
                <div :class="{'maxHeightView':isMaxHeight,'maxHeightNoView':isOtherMaxHeight}" style="margin-left: 50px;margin-left: 50px;overflow-y: auto;">
                  <div v-if="treeData.length">
                    <a-tree
                      v-model="checkedKeys" default-expand-all :tree-data="treeData" :checkable="pageType !== 'view'"
                      @check="onCheck"
                    />
                  </div>
                  <div v-else>
                    <a-empty />
                  </div>
                </div>
              </div>
            </a-form-model>
            <!-- <div v-if="pageType !== 'view'" class="searchBtn">
              <a-button type="primary" @click="submitForm('form')">
                查询
              </a-button>
              <span style="margin-left:10px;">
                <a-checkbox @change="onChange">
                  全选查询结果
                </a-checkbox>
              </span>
            </div> -->
            <!-- <div :class="{'maxHeightView':isMaxHeight,'maxHeightNoView':isOtherMaxHeight}" style="margin-left: 50px;margin-left: 50px;overflow-y: auto;">
              <div v-if="treeData.length">
                <a-tree
                  v-model="checkedKeys" default-expand-all :tree-data="treeData" :checkable="pageType !== 'view'"
                  @check="onCheck"
                />
              </div>
              <div v-else>
                <a-empty />
              </div>
            </div> -->
          </a-col>
          <a-col style="padding: 15px 15px 40px 15px;border-left: 1px solid #d2d2d2;" :span="12">
            <a-form-model
              ref="rightForm" :model="rightForm"
              :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rightFormRules"
            >
              <div class="mt15 contTile">
                <span class="line"></span>
                积分属性
                <a-icon class="tip-icon" type="info-circle" />
                <span class="text">暂不支持配置，请联系管理员</span>
              </div>
              <div class="mt15">
                <a-form-model-item label="积分名称" prop="integralName">
                  <a-input v-model="rightForm.integralName" disabled placeholder="请填写积分名称"></a-input>
                </a-form-model-item>
                <a-form-model-item label="积分与金额比值" prop="integralAmountRatio">
                  <a-input v-model="rightForm.integralAmountRatio" disabled placeholder="请填写积分与金额比值"></a-input>
                </a-form-model-item>
              </div>
              <div class="mt15 contTile">
                <span class="line"></span>
                积分上限
                <a-icon class="tip-icon" type="info-circle" />
                <span class="text">若配置了总上限则其他各项上限值均受总上限限制</span>
              </div>
              <div class="mt15">
                <div class="textTitle">
                  设备投递回收
                </div>
                <a-form-model-item ref="productDeliveryTimeEveryDayIntegralLimit" label="计次积分上限" prop="productDeliveryTimeEveryDayIntegralLimit">
                  <span style="display:flex;">
                    <a-radio-group v-model="productDeliveryTimeIntegralType" :disabled="pageType === 'view'" @change="numOnChange">
                      <a-radio :style="radioStyle" :value="1">
                        不限制
                      </a-radio>
                      <a-radio :style="radioStyle" :value="2">
                        每人每天
                      </a-radio>
                    </a-radio-group>
                    <a-input
                      v-model="rightForm.productDeliveryTimeEveryDayIntegralLimit" :disabled="pageType === 'view'"
                      placeholder="请输入每天获取积分上限" @blur="() => {$refs.productDeliveryTimeEveryDayIntegralLimit.onFieldBlur()}" @change="() => {$refs.productDeliveryTimeEveryDayIntegralLimit.onFieldChange()}"
                    ></a-input>
                  </span>
                </a-form-model-item>
                <a-form-model-item ref="productDeliveryWeightEveryDayIntegralLimit" label="计重积分上限" prop="productDeliveryWeightEveryDayIntegralLimit">
                  <span style="display:flex;">
                    <a-radio-group v-model="productDeliveryWeightIntegralType" :disabled="pageType === 'view'" @change="weightOnChange">
                      <a-radio :style="radioStyle" :value="1">
                        不限制
                      </a-radio>
                      <a-radio :style="radioStyle" :value="2">
                        每人每天
                      </a-radio>
                    </a-radio-group>
                    <a-input
                      v-model="rightForm.productDeliveryWeightEveryDayIntegralLimit" :disabled="pageType === 'view'" placeholder="请输入每天获取积分上限"
                      @blur="() => {$refs.productDeliveryWeightEveryDayIntegralLimit.onFieldBlur()}" @change="() => {$refs.productDeliveryWeightEveryDayIntegralLimit.onFieldChange()}"
                    ></a-input>
                  </span>
                </a-form-model-item>
                <!-- 线下定点可回收物回收 -->
                <div class="textTitle">
                  线下定点可回收物回收
                </div>
                <a-form-model-item label="支付方式">
                  <span style="display:flex;">
                    <a-radio-group v-model="offLinePayType" :disabled="pageType === 'view'" @change="recycleNumOnChange">
                      <a-radio :style="radioStyle" :value="1">
                        积分
                      </a-radio>
                      <a-radio :style="radioStyle" :value="2">
                        金额
                      </a-radio>
                    </a-radio-group>
                  </span>
                </a-form-model-item>
                <a-form-model-item
                  v-if="offLinePayType === 1" ref="offLineEveryDayIntegralLimit" label="计重积分上限"
                  prop="offLineEveryDayIntegralLimit"
                >
                  <div style="display:flex;">
                    <a-radio-group v-model="offLineIntegralType" :disabled="pageType === 'view'" @change="recycleWeightOnChange">
                      <a-radio :style="radioStyle" :value="1">
                        不限制
                      </a-radio>
                      <a-radio :style="radioStyle" :value="2">
                        每人每天
                      </a-radio>
                    </a-radio-group>
                    <a-input
                      v-model="rightForm.offLineEveryDayIntegralLimit" :disabled="pageType === 'view'" placeholder="请输入每天获取积分上限"
                      @blur="() => {$refs.offLineEveryDayIntegralLimit.onFieldBlur()}" @change="() => {$refs.offLineEveryDayIntegralLimit.onFieldChange()}"
                    ></a-input>
                  </div>
                </a-form-model-item>
                <!-- 线下厨余回收 -->
                <div class="textTitle">
                  线下厨余回收
                </div>
                <span style="display:flex;width: 102%;">
                  <span style="width:50%">
                    <a-form-model-item
                      prop="foodWasteIntegralEveryTime" :label-col="{ span: 6, offset: 0 }"
                      label="厨余积分上限"
                    >
                      <a-input-group compact>
                        <a-input style="width: 40%" disabled default-value="每次获取积分" />
                        <a-input
                          v-model="rightForm.foodWasteIntegralEveryTime" :disabled="pageType === 'view'"
                          style="width: 60%" placeholder="输入积分数量"
                        />
                      </a-input-group>
                    </a-form-model-item>
                  </span>
                  <!-- <span style="margin:0 50px"></span> -->
                  <span style="margin-left:auto" :label-col="{ span: 6}" label="">
                    <a-form-model-item prop="foodWasteEveryDayIntegralLimit">
                      <a-input-group compact>
                        <a-input style="width: 40%" disabled default-value="每天积分上限" />
                        <a-input
                          v-model="rightForm.foodWasteEveryDayIntegralLimit" :disabled="pageType === 'view'"
                          style="width: 60%" placeholder="输入积分数量"
                        />
                      </a-input-group>
                    </a-form-model-item>
                  </span>
                  <!-- <span style="margin-left:20px;"></span> -->

                </span>

                <!-- 奖励规则 -->
                <div class="textTitle">
                  奖励规则
                </div>
                <a-form-model-item label="完善个人信息" prop="improvePersonalIntegral">
                  <a-input v-model="rightForm.improvePersonalIntegral" :disabled="pageType === 'view'" placeholder="请输入奖励积分数量"></a-input>
                </a-form-model-item>
                <a-form-model-item label="绑定积分卡" prop="bindIcCardIntegral">
                  <a-input v-model="rightForm.bindIcCardIntegral" :disabled="pageType === 'view'" placeholder="请输入奖励积分数量"></a-input>
                </a-form-model-item>
              </div>
            </a-form-model>
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
            <a-button
              v-if="pageType !== 'view'" :loading="loading" type="primary"
              @click="save()"
            >
              保存
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getGroupMark, getArea, toExportExcel, findUser } from '@/components/mixins/mixins.js'
// import { getCateoryPrice } from '@/api/priceSeting'
import { addAndEdit, getStreet, getInfo } from '@/api/operation'
export default {
  mixins: [getGroupMark, getArea, toExportExcel, findUser],
  data () {
    const validateLimitNum = (rule, value, callback) => {
      if (Number(value.trim()) > 99999) {
        callback(new Error('积分上限限制 99999'))
      } else {
        callback()
      }
    }
    return {
      // left
      // change
      mockData: [],
      targetKeys: [],
      // change
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        ruleName: '',
        areas: [],
        plot: ''
      },
      // right
      rightForm: {
        integralName: '环保值',
        integralAmountRatio: '100',
        offLineEveryDayIntegralLimit: '',
        productDeliveryWeightEveryDayIntegralLimit: '',
        productDeliveryTimeEveryDayIntegralLimit: '',
        foodWasteIntegralEveryTime: 10,
        foodWasteEveryDayIntegralLimit: 10000,
        improvePersonalIntegral: '',
        bindIcCardIntegral: ''
      },
      productDeliveryWeightIntegralType: 1,
      productDeliveryTimeIntegralType: 1,
      offLinePayType: 1,
      offLineIntegralType: 1,
      radioStyle: {
        display: 'inline',
        height: '30px',
        lineHeight: '30px',
        width: '80px'
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
        ruleName: [{ required: true, message: '请填写规则名称', trigger: 'blur' }]
      },
      rightFormRules: {
        productDeliveryTimeEveryDayIntegralLimit: [{ validator: validateLimitNum, trigger: ['blur', 'change'] }],
        productDeliveryWeightEveryDayIntegralLimit: [{ validator: validateLimitNum, trigger: ['blur', 'change'] }],
        offLineEveryDayIntegralLimit: [{ validator: validateLimitNum, trigger: ['blur', 'change'] }],
        foodWasteIntegralEveryTime: [{ validator: validateLimitNum, trigger: ['blur', 'change'] }],
        foodWasteEveryDayIntegralLimit: [{ validator: validateLimitNum, trigger: ['blur', 'change'] }],
        improvePersonalIntegral: [{ validator: validateLimitNum, trigger: ['blur', 'change'] }],
        bindIcCardIntegral: [{ validator: validateLimitNum, trigger: ['blur', 'change'] }]
      },
      treeData: [],
      confirmCheckedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      markList: [],
      pageType: '',
      estateList: [],
      loading: false,
      isMaxHeight: true,
      isOtherMaxHeight: false
    }
  },
  created () {

  },
  mounted () {
    this.pageType = this.$route.query.pageType || ''
    this.form = {}
    this.getArea('', 2)
    this.getEstate()
    if (this.pageType === 'edit' || this.pageType === 'view') {
      this.getDetials()
    }
    this.isMaxHeight = this.pageType !== 'view'
    this.isOtherMaxHeight = !this.isMaxHeight
  },
  methods: {
    // change
    backInit () {
      this.getEstate()
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    filterOptionTrans (inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    handleChange (targetKeys, direction, moveKeys) {
      this.selectedKeys = []
      this.estateList.forEach(item => {
        if (this.pageType !== 'view') {
          item.checked === 1 && this.selectedKeys.push(item.id)
        }
      })
      this.targetKeys = targetKeys
    },
    // change
    getDetials () {
      const params = {
        id: this.$route.query.id || ''
      }
      getInfo(params)
        .then(res => {
          if (res) {
            const result = res.result
            this.form.ruleName = result.ruleName
            this.rightForm.integralName = result.integralName || ''
            this.rightForm.integralAmountRatio = result.integralAmountRatio || ''
            this.rightForm.offLineEveryDayIntegralLimit = result.offLineEveryDayIntegralLimit || ''
            this.rightForm.productDeliveryWeightEveryDayIntegralLimit = result.productDeliveryWeightEveryDayIntegralLimit || ''
            this.rightForm.productDeliveryTimeEveryDayIntegralLimit = result.productDeliveryTimeEveryDayIntegralLimit || ''
            this.rightForm.foodWasteIntegralEveryTime = result.foodWasteIntegralEveryTime || ''
            this.rightForm.foodWasteEveryDayIntegralLimit = result.foodWasteEveryDayIntegralLimit || ''
            this.rightForm.improvePersonalIntegral = result.improvePersonalIntegral || ''
            this.rightForm.bindIcCardIntegral = result.bindIcCardIntegral || ''

            this.productDeliveryWeightIntegralType = result.productDeliveryWeightIntegralType
            this.productDeliveryTimeIntegralType = result.productDeliveryTimeIntegralType
            this.offLinePayType = result.offLinePayType
            this.offLineIntegralType = result.offLineIntegralType
          }
        })
    },
    getEstate (areaIds, street) {
      return new Promise(resolve => {
        const params = {}
        if (areaIds) {
          params.areaIds = areaIds.join(',')
        }
        if (street) {
          params.street = street
        }
        if (this.pageType === 'edit' || this.pageType === 'view') {
          params.id = this.$route.query.id || ''
        }
        getStreet(params)
          .then(res => {
            this.treeData = []
            this.checkedKeys = []
            this.selectedKeys = []
            this.targetKeys = []
            const rightData = []
            const result = res.result
            this.estateList = result
            if (result && result.length) {
              result.forEach(item => {
                // if (this.pageType !== 'view') {
                //   item.checked === 1 && this.checkedKeys.push(item.id)
                //   item.checked === 1 && this.selectedKeys.push(item.id)
                //   if (item.isCurrentRule === 1) {
                //     rightData.push(item.id)
                //   }
                //   this.treeData.push(this.handleTreeData(item))
                // } else if (this.pageType === 'view' && item.checked) {
                //   this.treeData.push(this.handleTreeData(item))
                // }
                item.checked === 1 && this.checkedKeys.push(item.id)
                item.checked === 1 && this.selectedKeys.push(item.id)
                if (item.isCurrentRule === 1) {
                  rightData.push(item.id)
                }
                if (this.pageType !== 'view') {
                  this.treeData.push(this.handleTreeData(item))
                } else if (this.pageType === 'view' && item.isCurrentRule === 1) {
                  this.treeData.push(this.handleTreeData(item))
                }
              })
              this.targetKeys = rightData
              resolve()
            } else {
              this.$message.error('暂无数据')
            }
          })
      })
    },
    weightOnChange (e) {
      this.productDeliveryWeightIntegralType = e.target.value
    },
    recycleWeightOnChange (e) {
      this.offLineIntegralType = e.target.value
    },
    numOnChange (e) {
      this.productDeliveryTimeIntegralType = e.target.value
    },
    recycleNumOnChange (e) {
      this.offLinePayType = e.target.value
    },
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
    onCheck (checkedKeys, info) {
      // 合并两个数组
      this.confirmCheckedKeys = checkedKeys.concat(info.halfCheckedKeys)
    },
    changeArea (areasId) {
      this.estateList = []
      this.form.plot = ''
      this.treeData = []
      this.checkedKeys = []
      if (areasId.length < 4) {
        this.getEstate(areasId)
      } else if (areasId.length === 4) {
        this.getEstate(null, areasId[3])
      }
    },
    changePlot (val) {
      this.getEstate().then(res => {
        const item = this.treeData && this.treeData.find(item => item.value === val)
        const newArr = [item]
        this.treeData = newArr
        if (item.checked) {
          this.checkedKeys = [item.value]
        }
      })
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
    submitForm () {
      if (this.form.plot === '' && this.form.areas.length) {
        this.changeArea(this.form.areas)
        return
      }
      if (this.form.plot) {
        this.changePlot(this.form.plot)
        return
      }
      this.getEstate()
    },
    handleTreeData (item) {
      const childrenNode = {
        title: item.name || item.housingEstate,
        key: item.id,
        value: item.id,
        checked: item.checked,
        isCurrentRule: item.isCurrentRule,
        ruleId: item.ruleId,
        ruleName: item.ruleName,
        disabled: (item.isCurrentRule === 0 && item.ruleName !== undefined) || this.pageType === 'view'
        //         checked: 1
        // id: "01d9f8ec5bcf46b69df6a7ee018a452d"
        // isCurrentRule: 0
        // name: "金地世家"
        // ruleId: "cef945c978c24c2c9e2d429f7068f6be"
        // ruleName: "0916add"
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
      if (this.pageType === 'add' && !this.targetKeys.length) {
        this.$message.error('关联小区不能为空！')
        return false
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            ruleName: this.form.ruleName,
            integralName: this.rightForm.integralName,
            integralAmountRatio: this.rightForm.integralAmountRatio,
            offLineEveryDayIntegralLimit: this.rightForm.offLineEveryDayIntegralLimit,
            productDeliveryWeightEveryDayIntegralLimit: this.rightForm.productDeliveryWeightEveryDayIntegralLimit,
            productDeliveryTimeEveryDayIntegralLimit: this.rightForm.productDeliveryTimeEveryDayIntegralLimit,
            foodWasteIntegralEveryTime: this.rightForm.foodWasteIntegralEveryTime,
            foodWasteEveryDayIntegralLimit: this.rightForm.foodWasteEveryDayIntegralLimit,
            improvePersonalIntegral: this.rightForm.improvePersonalIntegral,
            bindIcCardIntegral: this.rightForm.bindIcCardIntegral,
            productDeliveryWeightIntegralType: this.productDeliveryWeightIntegralType,
            productDeliveryTimeIntegralType: this.productDeliveryTimeIntegralType,
            offLinePayType: this.offLinePayType,
            offLineIntegralType: this.offLineIntegralType
          }
          if (this.targetKeys.length) {
            params.estates = this.transEstates()
          }
          if (this.pageType === 'edit') {
            params.id = this.$route.query.id || ''
          }
          addAndEdit(params).then(res => {
            if (res.code === 0) {
              this.$message.success('积分规则配置成功！')
              this.back()
            }
            this.loading = false
          })
          this.loading = false
        }
      })
    },
    transEstates () {
      const params = []
      this.targetKeys.map(item => {
        const res = this.treeData.find(other => other.value === item)
        const obj = {}
        obj.id = res.value
        obj.name = res.title
        params.push(obj)
      })
      return params
    },
    back () {
      this.$router.push({
        path: '/operation/integral/configRule'
      })
    },
    // handleChange (value, key, column) { // 表格input绑定值
    //   const newData = [...this.data]
    //   const target = newData.filter(item => key === item.id)[0]
    //   if (target) {
    //     target[column] = value
    //   }
    //   this.data = newData
    // },
    // handleChangeType (row, value, key, column) {
    //   const params = {
    //     id: row.dictId,
    //     type: value
    //   }
    //   getCateoryPrice(params).then(res => {
    //     const result = res.result
    //     for (let i = 0; i < this.data.length; i++) {
    //       const element = this.data[i]
    //       if (element.dictId === row.dictId && element.id === row.id) {
    //         row.unitPrice = result
    //         row.type = value
    //         // 处理计价方式为积分计次时，产生金额起始重量设置为0
    //         if (column === 'type' && value === 2) {
    //           row['initialWeight'] = 0
    //         }
    //         this.data.splice(i, 1, row)
    //       }
    //     }
    //   })
    // },
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
.maxHeightView
  max-height 365px
.maxHeightNoView
  max-height 505px
.textTitle
  margin 10px 0
  font-size 13px
  color #000
  font-weight 600
.line
  width 3px
  display block
  height 20px
  background #1890ff
  margin-right 15px
.cardTitle
  font-size 16px
  font-weight 600
  color #333
  padding-bottom 0
.card-content
  border 1px solid gainsboro
  margin-top 15px
.ml35
  margin-left 35px
.mt15
  margin 15px 0
.searchBtn
  text-align left
  margin-left 100px
.contTile
  display flex
  align-items center
  font-size 15px
  font-weight 600
  .tip-icon
    margin 0px 5px 0 10px
  .text
    font-size 13px
    color #b3b3b3
</style>
