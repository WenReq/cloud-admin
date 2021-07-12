<template>
  <div class="recyclingSiteList">
    <div class="card-container">
      <div class="card-title">
        数据筛选
      </div>
      <div class="card-content">
        <a-form>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="区域"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-cascader
                  v-model="areaContain"
                  :options="options"
                  :load-data="loadData"
                  :field-names="{
                    label: 'name',
                    value: 'id',
                    children: 'children'
                  }"
                  placeholder="省市区"
                  change-on-select
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="街道"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input v-model="streetName" allow-clear placeholder="请输入街道名称" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="4" align="right">
              <a-form-item>
                <a-button type="primary" class="mr8" @click="toSearch">
                  查询
                </a-button>
                <a-button @click="resetTable">
                  重置
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <div class="bottomContent">
      <div class="mb20">
        <a-row>
          <a-col :span="12" class="title">
            街道列表
          </a-col>
          <a-col :span="12" align="right">
            <a-button type="primary" @click="add()">
              添加街道
            </a-button>
          </a-col>
        </a-row>
      </div>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :row-key="record => record.id"
        :loading="loading"
        class="table-content"
        @change="handleTableChange"
      >
        <template slot="province" slot-scope="text, record">
          <span>{{ record.areas.split(',')[1] }}</span>
        </template>
        <template slot="city" slot-scope="text, record">
          <span>{{ record.areas.split(',')[2] }}</span>
        </template>
        <template slot="area" slot-scope="text, record">
          <span>{{ record.areas.split(',')[3] }}</span>
        </template>
        <template slot="operate" slot-scope="text">
          <a-button
            type="link" size="small"
            @click="edit(text)"
          >
            编辑
          </a-button>
          <a-button
            type="link" size="small"
            @click="del(text)"
          >
            删除
          </a-button>
        </template>
      </a-table>
    </div>
    <a-modal
      v-model="deleteVisible" ok-text="确定" :ok-button-props="{ props: { disabled: modelDisabled } }"
      cancel-text="取消" class="comModal" @ok="deleteModal"
    >
      <div class="dlContent">
        <icon-font type="iconShape" class="dlIcon"></icon-font>
        <span class="dlTitle">提示</span>
        <div class="dlMain">
          {{ modelContent }}
        </div>
      </div>
    </a-modal>
    <a-modal
      title="街道配置"
      :visible="siteVisiable"
      width="600px"
      class="siteModal"
      @cancel="handleCancel"
    >
      <a-form :form="form" @submit="handleOk">
        <a-form-item label="区域" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-cascader
            v-decorator="['area', { rules: [{ required: true, message: '请选择省市区' }] }]"
            :options="options"
            :load-data="loadData"
            :field-names="{
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            placeholder="省市区"
            change-on-select
            @change="changeArea"
          />
        </a-form-item>
        <a-form-item label="街道" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['address', { rules: [{ required: true, message: '请填写街道名称' }] }]"
            placeholder="请输入街道名称" :max-length="50" allow-clear
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button
          type="primary" :loading="confirmLoading"
          html-type="submit" @click="handleOk"
        >
          提交
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getAreaListData, addArea, delArea } from '@/api/areaManage'
import { getAreaList } from '@/api/common'
import { iconFontComponent, getArea } from '@/components/mixins/mixins.js'
const columns = [{
  title: '省',
  key: 'areas',
  dataIndex: 'areas',
  scopedSlots: { customRender: 'province' }
}, {
  title: '市',
  key: 'city',
  dataIndex: 'city',
  scopedSlots: { customRender: 'city' }
}, {
  title: '区县',
  key: 'area',
  dataIndex: 'area',
  scopedSlots: { customRender: 'area' }
}, {
  title: '街道',
  key: 'street',
  dataIndex: 'street'
}, {
  title: '小区数',
  key: 'num',
  dataIndex: 'num'
}, {
  title: '创建时间',
  key: 'createTime',
  dataIndex: 'createTime'
}, {
  title: '操作',
  key: 'operate',
  width: 150,
  fixed: 'right',
  scopedSlots: { customRender: 'operate' }
}]
export default {
  mixins: [iconFontComponent, getArea],
  data () {
    return {
      modelDisabled: false,
      modelContent: '',
      areaContain: [],
      streetName: '',
      options: [],
      columns,
      tableData: [],
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
      deleteVisible: false,
      delId: '',
      siteVisiable: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'siteContent' }),
      headers: {
        token: ''
      },
      areaNames: [],
      pageType: '',
      editId: ''
    }
  },
  watch: {
    $route () {
      this.toSearch()
    }
  },
  created () {
    this.headers.token = this.token()
  },
  mounted () {
    this.getArea('', 2, null, true)
    this.toSearch()
  },
  methods: {
    ...mapGetters(['token']),
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    getTableData (params) {
      this.loading = true
      getAreaListData(params)
        .then(res => {
          this.loading = false
          this.tableData = res.result.list
          this.pagination.total = res.result.totalCount
        })
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.initData()
    },
    initData () {
      const params = { 'type': '1', 'areaId': '', 'streetId': '', 'housingEstate': '' }
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      if (this.areaContain.length !== 0) {
        params.areaId = this.areaContain.join(',')
      }
      if (this.streetName) {
        params.street = this.streetName
      }
      this.getTableData(params)
    },
    toSearch () {
      this.pagination.current = 1
      this.initData()
    },
    resetTable () {
      this.areaContain = []
      this.streetName = ''
      const params = { 'type': '1', 'areaId': '', 'streetId': '', 'housingEstate': '' }
      params.page = 1
      params.pageSize = this.pagination.pageSize
      this.getTableData(params)
    },
    add () {
      this.siteVisiable = true
      this.pageType = 'add'
    },
    changeArea (value, options) {
      this.areaNames = []
      if (!options) return
      options.forEach(item => {
        this.areaNames.push(item.name)
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const params = {}
          params.areaId = values.area.join(',')
          params.street = values.address
          params.type = '1'
          params.pid = values.area[2]
          if (this.pageType === 'edit') {
            params.id = this.editId
          }
          this.confirmLoading = true
          addArea(params).then(res => {
            this.$message.success('街道添加成功')
            this.siteVisiable = false
            this.confirmLoading = false
            this.form.resetFields()
            this.initData()
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel (e) {
      this.form.resetFields()
      this.siteVisiable = false
    },
    edit (value) {
      this.siteVisiable = true
      this.pageType = 'edit'
      this.editId = value.id
      const areaIds = value.areaId.split(',')
      areaIds.splice(0, 1)
      this.getAreaData(areaIds[0])
      setTimeout(() => {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            address: value.street,
            area: areaIds
          })
        })
      }, 800)
    },
    getAreaData (provinceId) {
      const newOptions = JSON.parse(JSON.stringify([...this.options]))
      newOptions.forEach(item => {
        if (item.id === provinceId) {
          getAreaList({
            id: item.id,
            layer: 3
          })
            .then(resp => {
              item.children = resp.result.data
              item.children.forEach(thing => {
                getAreaList({
                  id: thing.id,
                  layer: 4
                })
                  .then(respo => {
                    thing.children = respo.result.data
                  })
              })
            })
        }
      })
      this.options = newOptions
    },
    del (value) {
      this.deleteVisible = true
      this.delId = value.id
      this.modelDisabled = value.num !== 0
      this.modelContent = value.num === 0 ? '是否确定删除此街道？' : '此街道含有已配置的小区，暂不允许删除，请将此街道所有小区全部删除后方可进行此操作！'
    },
    deleteModal () {
      const params = {}
      params.id = this.delId
      delArea(params).then(res => {
        this.$message.success('删除成功')
        this.deleteVisible = false
        this.initData()
      })
    },
    siteBeforeUpload (file) {
      const isTYPE = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isTYPE) {
        this.$message.error('上传的站点照片只能是 JPG/PNG/JPEG 格式!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传的站点照片每张大小不超过10MB!')
      }
      if (!isTYPE || !isLt10M) {
        this.$refs.siteFileUpload.handleRemove(file)
      }
      return isTYPE && isLt10M
    }
  }
}
</script>

<style lang="stylus" scoped>
.recyclingSiteList
  .w100
    width 100%
  .mr8
    margin-right 8px
  .bottomContent
    background-color #fff
    padding 16px 20px
    .mb20
      margin-bottom 20px
  .title
    color #333
    font-weight 600
    font-size 16px
.dlContent
  .dlIcon
    font-size 30px
  .dlTitle
    vertical-align text-bottom
    padding-left: 10px
    font-size: 16px
    color: #333
    font-weight: 500
  .dlMain
    // position absolute
    // top 64px
    // left 64px
    color #666
    font-size 14px
    margin 15px 0 0 40px
.comModal .ant-modal-footer
  padding 10px 16px
</style>
<style lang="stylus">
.recyclingSiteList
  .ant-btn-sm
    padding-left 0
    padding-right 10px
.siteModal
  .ant-modal-body
    padding-bottom 0
  .ant-modal-footer
    padding-top 0
    padding-bottom 24px
    text-align center
</style>
