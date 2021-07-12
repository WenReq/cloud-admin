<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        筛选查询
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="策略名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['name']"
                  allow-clear placeholder="请输入价格策略名称"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="操作人"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['createBy']"
                  allow-clear placeholder="请输入操作人"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="12" align="right">
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
    <div class="bottomContent">
      <div class="card-title">
        <div class="mb20">
          <a-row class="titleAndBtn">
            <a-col :span="12" class="title">
              <span class="disFlex">
                价格策略列表
                <span class="upload-tip">
                  <a-icon class="tip-icon" type="info-circle" />价格策略目前仅支持配置一条，适用于所有线下积分礼品兑换活动
                </span>
              </span>
            </a-col>
            <a-col :span="12" align="right">
              <a-button :disabled="data.length !== 0" type="primary" @click="view()">
                价格策略
              </a-button>
            </a-col>
          </a-row>
        </div>
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
          <template slot="operate" slot-scope="text, record">
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="view(record,'1')"
            >
              查看
            </a-button>
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="view(record,'2')"
            >
              编辑
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, {}),
      columns: [
        {
          title: '策略名称',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作人',
          dataIndex: 'createBy'
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
      }
    }
  },
  created () {

  },
  mounted () {
    this.getTableData()
  },
  methods: {
    view (item, type = '3') {
      // type 1 查看 2 编辑 3 新建
      this.$router.replace({
        path: '/goods/activePrice/activityPriceAdd',
        query: {
          type,
          id: (item && item.id) || '',
          info: item && JSON.stringify(item)
        }
      })
    },
    getTableData () {
      var param = this.form.getFieldsValue()
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      param.type = '2'
      this.loading = true
      this.$httpPost(this.$basePath.emPolicyGetList, param)
        .then(res => {
          this.loading = false
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.ant-upload-picture-card-wrapper
  width auto !important;
.bottomContent
    background-color #fff
    padding 16px 20px
  .mb20
  margin-bottom 20px
  .titleAndBtn
    align-items center
    display flex
  .title
    color #333
    font-weight 600
    font-size 16px
.disFlex
  display flex
  align-items: center;
  .upload-tip
    font-size 12px
    color #999999
    margin-left 16px
    .tip-icon
      margin-right 6px
</style>
