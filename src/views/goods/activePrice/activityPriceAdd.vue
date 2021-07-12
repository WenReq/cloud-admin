<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        价格策略配置
      </div>
      <div class="card-content">
        <a-row>
          <a-col class="pd15" :span="24">
            <div class="contTile">
              商品价格配置
              <span v-if="pageTypes !== '1'">
                <!-- <a-icon class="tip-icon" type="info-circle" />
                <span class="text">按需选择对应商品配置价格</span> -->
                <span class="upload-tip">
                  <a-icon class="tip-icon" type="info-circle" />按需选择对应商品配置价格
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
              <!-- <a-table
                class="table-content"
                :scroll="{ y: 440 }"
                :row-key="record => record.goodsId"
                :columns="columns"
                :data-source="data"
                :pagination="false"
                bordered
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
                  <a-input
                    v-if="pageTypes !== '1'"
                    class="input-table"
                    :value="text"
                    suffix="积分"
                    @change="e => handleChange(e.target.value, record.goodsId)"
                  />
                  <span v-else>{{ text }}&nbsp;积分</span>
                </template>
              </a-table> -->
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
                  <!-- :custom-row="
                      ({ key, disabled: itemDisabled }) => ({
                        on: {
                          click: () => {
                            if (itemDisabled || listDisabled) return;
                            itemSelect(key, !selectedKeys.includes(key));
                          },
                        },
                      })
                    " -->
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
  data () {
    return {
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
      detail: {}
    }
  },
  mounted () {
    this.pageTypes = this.$route.query.type// type 1 查看 2 编辑 3 新建
    this.pageId = this.$route.query.id
    if (this.pageTypes === '2' || this.pageTypes === '1') {
      this.detail = this.$route.query.info && JSON.parse(this.$route.query.info)
      this.modelForm.strategyName = this.detail.name || ''
    }
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
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    handleSearch (dir, value) {
      console.log('search:', dir, value)
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
            // this.checkedKeys = this.pageTypes === '3' ? [] : data
            this.data = result
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    // add和edit的保存操作
    save (formName) {
      this.$refs['ruleForm'].validate(valid => {
        // this.$refs['form'].validate(valid1 => {
        if (valid) {
          const goodsList = JSON.parse(JSON.stringify(this.data))
          const params = {
            type: '2',
            deivceList: [],
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
                  path: '/goods/activePrice/activityPrice'
                })
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
        // })
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
        path: '/goods/activePrice/activityPrice'
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
.card-content
  border: 1px solid gainsboro;
  margin-top: 15px;
.mt15
  margin-top 15px
.upload-tip
    font-size 12px
    color #999999
    margin-left 16px
  .tip-icon
    margin-right 6px
</style>
