<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        价格策略配置
      </div>
      <div class="card-content">
        <a-row>
          <a-col class="pd15" :span="14">
            <div class="contTile">
              商品价格配置
              <span v-if="pageTypes !== '1'">
                <a-icon class="tip-icon" type="info-circle" />
                <span class="text">按需选择对应商品配置价格
                  <span style="font-size:10px;color:red">(上架中的商品需先在APP中下架才可移除)</span>
                </span>
              </span>
            </div>
            <div class="mt15">
              <a-form-model
                ref="ruleForm"
                :model="modelForm"
                :rules="modelRules"
                :label-col="labelColLeft" :wrapper-col="wrapperCol"
              >
                <a-form-model-item label="策略名称：" isrequire prop="strategyName">
                  <a-input v-model="modelForm.strategyName" :disabled="pageTypes === '1'" placeholder="请填写规则名称"></a-input>
                </a-form-model-item>
              </a-form-model>
              <a-transfer
                :list-style="{
                  width:'250px',
                  height: '480px',
                  'overflow-y': 'scroll'
                }"
                :data-source="data"
                :titles="['待选商品列表', '已选商品列表']"
                :locale="{itemUnit: '', itemsUnit: '', searchPlaceholder: '请输入商品名称' }"
                show-search
                :disabled="pageTypes === '1'"
                :filter-option="filterOptionTrans"
                :target-keys="targetKeys"
                :render="item => item.title"
                @change="handleChangeTrans"
                @selectChange="handleSelectChange"
                @search="handleSearch"
              >
                <template
                  slot="children"
                  slot-scope="{
                    props: { direction, filteredItems, disabled: listDisabled },
                    on: { itemSelectAll, itemSelect },
                  }"
                >
                  <a-table
                    :row-selection="
                      getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
                    "
                    :columns="direction === 'left' ? leftColumns : rightColumns"
                    :data-source="filteredItems"
                    size="small"
                    :pagination="false"
                  >
                    <template slot="url" slot-scope="text, record">
                      <viewer class="item-img_list" :images="[record.url]">
                        <img
                          v-if="record.url"
                          class="td-image"
                          :src="record.url"
                        >
                      </viewer>
                    </template>
                    <template slot="integral" slot-scope="text, record">
                      <span style="text-align: center;display: flex;align-items: center;">
                        <a-input
                          v-if="pageTypes !== '1'"
                          class="input-table"
                          :disabled="pageTypes === '1'"
                          :value="text"
                          @change="e => handleChange(e.target.value, record.goodsId)"
                        />
                        <span v-if="pageTypes !== '1'" style="width: 56px;">积分</span>
                        <span v-else>{{ text }}&nbsp;积分</span>
                      </span>
                    </template>
                  </a-table>
                </template>
              </a-transfer>
            </div>
          </a-col>
          <a-col
            class="middleLine" :span="10"
          >
            <div class="contTile">
              关联兑换机
            </div>
            <a-form-model
              v-if="pageTypes !== '1'"
              ref="form"
              class="mt15" :model="form"
              :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules"
            >
              <a-form-model-item label="区域：" prop="areas">
                <a-cascader
                  v-model="form.areas"
                  :options="options"
                  :load-data="loadDataNoStreet"
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
                  @change="changePlot"
                >
                  <a-select-option v-for="(item,index) in estateList" :key="index" :value="item.id">
                    {{ item.estateName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="兑换机名称：" prop="machineName">
                <a-input v-model="form.machineName" placeholder="请输入兑换机名称"></a-input>
              </a-form-model-item>
            </a-form-model>
            <div v-if="pageTypes !== '1'" class="rightSearch">
              <a-button type="primary" @click="submitCheckForm('form')">
                查询
              </a-button>
              <span class="mgl10">
                <a-checkbox @change="onChange">
                  全选查询结果
                </a-checkbox>
              </span>
            </div>
            <div class="rightTree">
              <a-spin v-if="loading" style="margin:60px 160px;" />
              <a-empty v-if="!treeData.length &&!loading" />
              <div v-if="treeData.length">
                <a-tree
                  v-model="checkedKeys"
                  default-expand-all :tree-data="treeData" :checkable="pageTypes !== '1'"
                  @check="onCheck"
                />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="mb40 mt40">
        <a-row type="flex" justify="center">
          <a-col
            :span="12" type="flex" align="middle" class="tac"
          >
            <a-button class="mr8" @click="back">
              返回
            </a-button>
            <a-button v-if="pageTypes !== '1'" type="primary" @click="save()">
              保存
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import difference from 'lodash/difference'
import { getArea, getEstate } from '@/components/mixins/mixins.js'
const leftTableColumns = [
  {
    title: '商品图片',
    dataIndex: 'url',
    align: 'center',
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '商品名称',
    dataIndex: 'name'
  }
]
const rightTableColumns = [
  {
    title: '商品图片',
    dataIndex: 'url',
    align: 'center',
    width: 80,
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '商品名称',
    width: 80,
    dataIndex: 'name'
  },
  {
    title: '商品价格',
    dataIndex: 'integral',
    align: 'center',
    width: 77,
    scopedSlots: { customRender: 'integral' }
  }
]
export default {
  mixins: [getArea, getEstate],
  data () {
    return {
      loading: false,
      disabledTransfer: false,
      mockData: [],
      targetKeys: [],
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      selectedKeys: [],
      // left
      modelForm: {
        strategyName: '' // 策略名称
      },
      modelRules: {
        strategyName: [{ required: true, message: '请填写规则名称', trigger: 'blur' }]
      },
      labelColLeft: { span: 3 },
      columns: [
        {
          title: '商品图片',
          dataIndex: 'url',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '商品价格',
          dataIndex: 'integral',
          align: 'center',
          scopedSlots: { customRender: 'integral' }
        }
      ],
      data: [],
      // common
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      pageTypes: '0',
      pageId: '',
      // right
      form: {
        areas: [],
        plot: '',
        machineName: ''
      },
      rules: {
        areas: [{ required: true, message: '请选择区域', trigger: 'change' }]
      },
      treeData: [],
      confirmCheckedKeys: [],
      checkedKeys: [],
      detail: {}
    }
  },
  mounted () {
    this.pageTypes = this.$route.query.type// type 1 查看 2 编辑 3 新建
    this.pageId = this.$route.query.id
    this.rules.areas[0].required = this.pageTypes === '3'
    this.form = {}
    if (this.pageTypes === '2' || this.pageTypes === '1') {
      this.detail = this.$route.query.info && JSON.parse(this.$route.query.info)
      this.getDetail()
    }
    this.getArea('', 2, false, false)
    this.getEmGoods()
  },
  methods: {
    getRowSelection ({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled }}),
        onSelectAll (selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect ({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    },
    filterOptionTrans (inputValue, option) {
      return option.name.indexOf(inputValue) > -1
    },
    handleChangeTrans (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
      /*
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
        disabled:true
      */
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    handleSearch (dir, value) {
      console.log('search:', dir, value)
    },
    getDetail () {
      var data = this.detail
      this.modelForm.strategyName = data && data.name || ''
      if (this.pageTypes === '2') {
        this.submitForm({ 'id': this.pageId }, 'id')
      } else if (this.pageTypes === '1') {
        this.submitForm({ 'id': this.pageId }, 'view')
      }
    },
    // 获取商品列表
    getEmGoods () {
      const param = this.pageTypes === '2' || this.pageTypes === '1' ? { 'id': this.pageId } : {}
      this.$httpPost(this.$basePath.emPolicyGetEmGoods, param)
        .then(res => {
          const result = res.result
          if (result) {
            const data = []
            const leftData = []
            const rightData = []
            result.forEach((item, i) => {
              item.key = i.toString()
              item.title = item.name
              item.disabled = item.isSelect === 1 && !!item.isMove
              // const itemData = {
              //   key: i.toString(),
              //   title: item.name,
              //   description: item.name,
              //   url: item.url
              //   // chosen: Math.random() * 2 > 1
              // }
              if (item.checked) {
                data.push(item)
              }
              if (item.isSelect) {
                rightData.push(item.key)
              } else {
                leftData.push(item)
              }
            })
            this.targetKeys = rightData
            this.checkedKeys = this.pageTypes === '3' ? [] : data
            this.data = result
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // tree上的选择
    onCheck (checkedKeys, info) {
      // 合并两个数组
      this.confirmCheckedKeys = checkedKeys.concat(info.halfCheckedKeys)
    },
    // 选择区域查找对应的小区
    changeArea (areasId) {
      this.estateList = []
      this.form.plot = ''
      if (areasId.length === 3) {
        this.submitForm({ 'areaList': Array(areasId[2]) }, 'areaList')
      }
    },
    changePlot (plotId) {
      if (plotId) {
        this.submitForm({ 'estateList': Array(plotId) }, 'estateList')
      } else {
        this.form.plot = ''
        this.submitForm({ 'areaList': Array(this.form.areas[2]) }, 'areaList')
      }
    },
    // 全选查询结果
    onChange (e) {
      this.checkedKeys = e.target.checked ? this.handleSelectData(this.treeData) : []
    },
    // 处理默认选中的菜单 UI展示
    handleSelectData (items) {
      const result = []
      function filter (list) {
        for (let i = 0; i < list.length; i++) {
          if (!list[i].disableCheckbox) {
            result.push(list[i].value)
          }
          if (list[i].children && list[i].children.length) {
            filter(list[i].children)
          }
        }
      }
      filter(items)
      return result
    },
    submitCheckForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.areas.length < 3) {
            this.$message.error('区域要选择三级!')
          } else if (this.form.areas.length === 3) {
            if (this.form.plot !== '') {
              this.submitForm({ 'estateList': Array(this.form.plot) }, 'estateList')
            } else {
              this.submitForm({ 'areaList': Array(this.form.areas[2]) }, 'areaList')
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 查询兑换机信息
    submitForm (params, flag) {
      this.treeData = []
      let basePath = ''
      if (this.pageTypes === '3') {
        basePath = this.$basePath.getEmById
      } else {
        basePath = this.$basePath.emPolicyGetById
      }
      this.loading = true
      this.$httpPost(basePath, params)
        .then(res => {
          const result = res.result
          this.loading = false
          if (result && result.length) {
            res.result.forEach(item => {
              if (item.child.length) {
                this.treeData.push(this.handleTreeData(item))
              }
            })
            if (!this.treeData.length) {
              this.$message.error('兑换机列表暂无数据')
            }
            if (flag === 'areaList') {
              this.estateList = res.result
            }
            if (flag === 'id') {
              const result = res.result
              this.checkedKeys = this.handleCheckData(result)
            }
            if (flag === 'view') {
              this.treeData = []
              res.result.forEach(item => {
                this.handleTreeDataView(item)
              })
            }
          } else {
            if (flag === 'view' || flag === 'id') {
              this.$message.error('兑换机列表暂无数据')
            }
          }
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    // 处理默认选中的菜单 UI展示
    handleCheckData (items) {
      const result = []
      function filter (list) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].isSelect && list[i].isSelect === 1) {
            result.push(list[i].id)
          }
          if (list[i].child && list[i].child.length) {
            filter(list[i].child)
          }
        }
      }
      filter(items)
      return result
    },
    // 处理tree的数据进行复制显示
    handleTreeData (item) {
      const childrenNode = {
        title: item.estateName || item.name,
        key: item.id,
        value: item.id,
        disableCheckbox: item.isSelect && item.isSelect === 1
      }
      if (item.child && item.child.length) {
        childrenNode.children = []
        item.child.forEach(subItem => {
          childrenNode.children.push(this.handleTreeData(subItem))
        })
      }
      return childrenNode
    },
    handleTreeDataView (item) {
      const childrenNode = {
      }
      if ((item.child && item.child.length && item.isSelect) || item.isSelect === 1) {
        // childrenNode = {
        childrenNode.title = item.estateName || item.name
        childrenNode.key = item.id
        childrenNode.value = item.id
        // }
        if (item.child) childrenNode.children = []
        item.child && item.child.forEach(subItem => {
          const handleTreeDatachild = this.handleTreeDatachild(subItem)
          if (handleTreeDatachild) {
            childrenNode.children.push(handleTreeDatachild)
          }
        })
      }
      if (Object.keys(childrenNode).length) {
        this.treeData.push(childrenNode)
      }
    },
    handleTreeDatachild (subItem) {
      const childrenNode = {
        title: subItem.estateName || subItem.name,
        key: subItem.id,
        value: subItem.id
      }
      if (subItem && subItem.isSelect === 1) {
        return childrenNode
      } else {
        return false
      }
    },
    // add和edit的保存操作
    save (formName) {
      if (this.checkedKeys.length === 0) {
        this.$message.error('关联的兑换机不能为空!')
        return false
      }
      this.$refs['ruleForm'].validate(valid => {
        this.$refs['form'].validate(valid1 => {
          if (valid1 && valid) {
            const checkedKeys = this.checkedKeys
            const arr = []
            checkedKeys.forEach(item => {
              const obj = { deviceId: '' }
              obj.deviceId = item
              arr.push(obj)
            })
            const goodsList = JSON.parse(JSON.stringify(this.data))
            const params = {
              deivceList: arr,
              goodsList: this.transGoodsList(goodsList),
              name: this.modelForm.strategyName
            }
            if (this.pageTypes === '2') {
              params.id = this.pageId
            }
            // emPolicyEdit
            this.$httpPost(this.$basePath.emPolicyEdit, params)
              .then(res => {
                if (res.code === 0) {
                  this.$message.success(res.msg)
                  this.$router.push({
                    path: '/goods/machineManage/price'
                  })
                }
              })
              .catch((error) => {
                console.error(error)
              })
          }
        })
      })
    },
    transGoodsList (data) {
      const checkKey = this.targetKeys
      const newData = []
      for (let i = 0; i < data.length; i++) {
        const ele = data[i]
        const flag = checkKey.includes(ele.key)
        if (flag) {
          newData.push(ele)
        }
      }
      return newData
    },
    // 返回按钮的操作
    back () {
      this.$router.push({
        path: '/goods/machineManage/price'
      })
    },
    // 表格input绑定值
    handleChange (value, key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.goodsId)[0]
      if (target) {
        target['integral'] = value
      }
      this.data = newData
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
/deep/ .ant-transfer-list-header-title
  position: static;
.td-image
  width: 30px;
  height: 30px;
.input-table
  // width 85% !important;
.pd15
  padding: 15px;
.rightSearch
  text-align: left;
  margin-left: 6.8vw;
.mgl10
  margin-left 10px
.rightTree
  margin-left: 50px;
  max-height: 365px;
  overflow-y: auto;
.tac
  text-align center;
.middleLine
  border-left: 1px solid #d2d2d2;
  padding: 15px;
  min-height: 595px;
.card-content
  border: 1px solid gainsboro;
  margin-top: 15px;
.mt15
  margin-top 15px
.contTile
  font-size 15px
  font-weight 600
  .tip-icon
    margin 0px 5px 0 10px
  .text
    font-size 13px
    color #b3b3b3
</style>
