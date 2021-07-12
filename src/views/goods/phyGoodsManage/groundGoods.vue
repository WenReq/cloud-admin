<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        数据筛选
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="商品名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['giftname']"
                  allow-clear placeholder="请输入商品名称"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="一级类目"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['first']" allow-clear
                  placeholder="请选择"
                  @change="changeFirst"
                >
                  <a-select-option v-for="(item, index) in firstList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="二级类目"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['second']" allow-clear
                  placeholder="请选择"
                >
                  <a-select-option v-for="(item, index) in secondList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="商品ID"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['giftId']"
                  allow-clear placeholder="请输入商品ID"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="上架时间"
                v-bind="formItemLayout"
              >
                <a-range-picker
                  v-model="timeArr"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="18" align="right">
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
      <div class="card-title">
        已上架商品
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :columns="columns"
          :row-key="record => record.id"
          :data-source="data"
          :loading="loading"
          :pagination="pagination"
          :scroll="{x: 1500}"
          @change="handleTableChange"
        >
          <template slot="imageList" slot-scope="text, record">
            <viewer class="item-img_list" :images="record.imgArr">
              <a
                v-for="(item, index) in record.imgArr" :key="index"
                href="javascript:;"
              >
                <img
                  class="td-image"
                  :style="index == 0?'':'display:none;'"
                  :src="item"
                >
              </a>
            </viewer>
          </template>
          <template slot="operate" slot-scope="text, record">
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="downShelf(record)"
            >
              下架
            </a-button>
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="edit(record)"
            >
              编辑
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <comfirmModal
      :dialog-obj="dialogObj" :is-btnok="dialogObj.isBtnok"
      @handleOk="handleOk"
    >
      <a-form :form="dialogObj.form">
        <a-form-item class="comfirm-formitem">
          <a-textarea
            v-decorator="['remark', {rules: [{required: true, message: '请填写下架备注'}]}]"
            placeholder="请填写下架备注"
            :max-length="30"
            :autosize="{ minRows: 4, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </comfirmModal>
  </div>
</template>

<script>
import comfirmModal from '@/components/commonModal/comfirmModal.vue'
export default {
  components: { comfirmModal },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      firstList: [],
      secondList: [],
      timeArr: [],
      form: this.$form.createForm(this, {}),
      columns: [
        {
          title: '商品ID',
          dataIndex: 'giftId'
        },
        {
          title: '商品图片',
          dataIndex: 'imageList',
          scopedSlots: { customRender: 'imageList' }
        },
        {
          title: '商品名称',
          dataIndex: 'giftname'
        },
        {
          title: '价格',
          dataIndex: 'integral',
          customRender (val, row, index) {
            if (row.shopType === 5) return val + '环保值'
            if (row.shopType === 6) return val + '元'
          }
        },
        {
          title: '剩余库存',
          dataIndex: 'stockcount'
        },
        {
          title: '总计销量',
          dataIndex: 'volume'
        },
        {
          title: '上架时间',
          dataIndex: 'operateDate'
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate'
        },
        {
          title: '操作',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      data: [],
      loading: false,
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
      dialogObj: {
        isBtnok: true,
        title: '是否确定下架此商品',
        visible: false,
        iconType: 'question-circle',
        form: this.$form.createForm(this, { name: 'cash' })
      }
    }
  },
  mounted () {
    this.getTableData()
    this.getCategory(0, 1)
  },
  methods: {
    getCategory (pid, level) {
      this.$httpPost(this.$basePath.getCategory, {
        pid: pid
      })
        .then(res => {
          if (level === 1) {
            this.firstList = res.result
          }
          if (level === 2) {
            this.secondList = res.result
          }
        })
    },
    changeFirst (val) {
      if (val) {
        this.getCategory(val, 2)
      } else {
        this.form.resetFields(['second'])
        this.secondList = []
      }
    },
    getTableData () {
      var param = this.form.getFieldsValue()
      param.state = 1
      if (this.timeArr.length) {
        param.startDate = this.timeArr[0].format('YYYY-MM-DD') + ' 00:00:00'
        param.endDate = this.timeArr[1].format('YYYY-MM-DD') + ' 23:59:59'
      }
      param.menuId = ''
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      this.loading = true
      this.$httpPost(this.$basePath.getList, param)
        .then(res => {
          this.loading = false
          res.result.list.forEach(item => {
            if (item.imageList.length) {
              var imgArr = []
              item.imageList.forEach(val => {
                imgArr.push(val.filePath)
              })
              item.imgArr = imgArr
            }
          })
          this.data = res.result.list
          this.pagination.total = res.result.totalCount
        })
        .catch(() => {
          this.loading = false
        })
    },
    toSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    resetForm () {
      this.form.resetFields()
      this.timeArr = []
    },
    downShelf (record) {
      this.dialogObj.form.resetFields()
      this.dialogObj.visible = true
      this.dialogObj.id = record.id
    },
    handleOk () {
      this.$httpPost(this.$basePath.updateState, {
        id: this.dialogObj.id,
        state: 2,
        remark: this.dialogObj.form.getFieldValue('remark')
      })
        .then(res => {
          this.$message.success('下架成功')
          this.dialogObj.visible = false
          this.getTableData()
        })
    },
    edit (record) {
      this.$router.push({
        path: '/goods/phyGoodsManage/groundGoods/groundEdit',
        query: {
          id: record.id
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.td-image
  width 48px
  height 48px
  margin 6px 0
</style>
