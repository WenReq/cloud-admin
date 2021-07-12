<template>
  <div class="reserve">
    <div class="card-container mrt16">
      <a-row>
        <a-col :span="12">
          <div class="card-title">
            厨余回收量列表
          </div>
        </a-col>
        <a-col :span="12" align="right">
          <a-button type="primary" @click="visible = true">
            录入重量
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
          <template slot="num" slot-scope="record,text,index">
            <div>
              {{ index + 1 }}
            </div>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      title="录入回收厨余重量"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="submit"
      @cancel="handleModalCancel"
    >
      <a-form :form="form" class="detail-form">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="重量（kg)"
        >
          <a-input
            v-decorator="[
              'weight',
              { rules: [{ required: true, message: '请输入厨余回收重量' }] }
            ]"
            :max-length="100"
            type="number"
            placeholder="请输入厨余回收重量"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { foodWasteList, foodWasteAdd } from '@/api/statistics'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '重量（kg）',
    dataIndex: 'weight'
  },
  {
    title: '创建时间',
    dataIndex: 'createdate'
  },
  {
    title: '创建人',
    dataIndex: 'createby'
  }
]
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
export default {
  data () {
    return {
      currentId: '',
      loading: false,
      visible: false,
      confirmLoading: false,
      columns,
      formItemLayout,
      formData: [],
      form: this.$form.createForm(this, { name: 'form' }),
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
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.getTable()
    },
    getTable () {
      const params = {
        menuId: '2f3ed78cfba44d1f99d8f227560f2cd3',
        page: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      this.loading = true
      foodWasteList(params).then(res => {
        this.loading = false
        const result = res.result
        this.formData = result.list
        this.pagination.total = result.totalCount
      })
    },
    submit () {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (values.weight < 0) {
            this.$message.error('抱歉，录入重量不能为负')
            return false
          }
          foodWasteAdd(values).then(res => {
            this.$message.success('录入成功')
            this.form.resetFields()
            this.visible = false
            this.confirmLoading = false
            this.getTable()
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleModalCancel () {
      this.visible = false
      this.form.resetFields()
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pagination = pager
      this.getTable()
    }
  }
}
</script>
<style lang="stylus">
.model-btn
  width 100%
  text-align center
</style>
<style lang="stylus" scoped>
.model-icon
  font-size 22px
  color #faad14
.modal-form
  margin-top 20px
</style>
