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
                label="创建时间"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-range-picker
                  v-model="createDate"
                  class="w100"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="回收站点属性"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-model="siteAttribute"
                  placeholder="请选择回收站点属性"
                  class="w100"
                  allow-clear
                  show-search
                  option-filter-prop="children"
                >
                  <a-select-option v-for="item in siteAttributes" :key="item.id">
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="负责人"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input v-model="chargePerson" allow-clear placeholder="请输入负责人" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="24" align="right">
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
            回收站点列表
          </a-col>
          <a-col :span="12" align="right">
            <a-button v-action:siteadd type="primary" @click="add()">
              添加回收站点
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
        <template slot="area" slot-scope="text, record">
          <span>{{ record.provinceName }}{{ record.cityName }}{{ record.areaName }}</span>
        </template>
        <template slot="siteType" slot-scope="siteType">
          <span>{{ siteType == 0?"自营":"" }}</span>
          <span>{{ siteType == 1?"加盟":"" }}</span>
        </template>
        <template slot="phone" slot-scope="phone">
          <span>{{ formatPhone(phone) }}</span>
        </template>
        <template slot="operate" slot-scope="text">
          <a-button
            v-action:siteget type="link" size="small"
            @click="view(text)"
          >
            查看
          </a-button>
          <a-button
            v-action:siteedit type="link" size="small"
            @click="edit(text)"
          >
            编辑
          </a-button>
          <a-button
            v-action:sitedel type="link" size="small"
            @click="del(text)"
          >
            删除
          </a-button>
        </template>
      </a-table>
    </div>
    <a-modal
      v-model="deleteVisible" ok-text="确定"
      cancel-text="取消" class="comModal" @ok="deleteModal"
    >
      <div class="dlContent">
        <icon-font type="iconShape" class="dlIcon"></icon-font>
        <span class="dlTitle">提示</span>
        <div class="dlMain">
          是否确定删除此回收站点？
        </div>
      </div>
    </a-modal>
    <a-modal
      title="添加回收站点"
      :visible="siteVisiable"
      width="600px"
      class="siteModal"
      @cancel="handleCancel"
    >
      <a-form :form="form" @submit="handleOk">
        <a-form-item label="回收站点名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请填写回收站点名称' }] }]"
            placeholder="请输入回收站点名称" :max-length="30" allow-clear
          />
        </a-form-item>
        <a-form-item label="负责人" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['person', { rules: [{ required: true, message: '请填写负责人员姓名' }] }]"
            placeholder="请输入负责人员姓名" :max-length="5" allow-clear
          />
        </a-form-item>
        <a-form-item label="联系电话" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['phone', { rules: [{ required: true, message: '请填写联系电话' }, {validator: validatePhoneNum}] }]"
            placeholder="请输入联系电话" allow-clear
          />
        </a-form-item>
        <a-form-item label="站点属性" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-select
            v-decorator="['siteType', {initialValue: 0}]"
            placeholder="请选择站点属性"
            class="w100"
            allow-clear
            show-search
            option-filter-prop="children"
          >
            <a-select-option v-for="item in attributes" :key="item.id">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
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
        <a-form-item label="详细地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['address', { rules: [{ required: true, message: '请填写详细地址' }] }]"
            placeholder="请输入详细地址" :max-length="50" allow-clear
          />
        </a-form-item>
        <a-form-item label="站点照片" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <div>
            <a-upload
              ref="siteFileUpload"
              :action="serveUrl"
              :headers="headers"
              :remove="removePicture"
              list-type="picture-card"
              :file-list="siteFileList"
              :before-upload="siteBeforeUpload"
              :show-upload-list="true"
              @preview="handleSitePreview"
              @change="handleSiteChange"
            >
              <div v-if="siteFileList.length < 3">
                <a-icon type="plus" />
                <div>
                  上传图片
                </div>
              </div>
              <div v-if="siteFileList.length===0"></div>
            </a-upload>
            <a-modal :visible="siteVisible" :footer="null" @cancel="handleSiteCancel">
              <img class="w100" :src="siteImage">
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item label="简介" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['summary']"
            placeholder="请输入回收站点简介" type="textarea" rows="3" :max-length="50"
          >
          </a-input>
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
import Host from '@/config/apiHost'
import { mapGetters } from 'vuex'
import { getSiteList, addSite, delSite } from '@/api/recyclingSite'
import { delPicture } from '@/api/common'
import { iconFontComponent, getArea } from '@/components/mixins/mixins.js'
const columns = [{
  title: '区域',
  key: 'area',
  dataIndex: 'area',
  scopedSlots: { customRender: 'area' }
}, {
  title: '回收站点名称',
  key: 'name',
  dataIndex: 'name'
}, {
  title: '中转站属性',
  key: 'siteType',
  dataIndex: 'siteType',
  scopedSlots: { customRender: 'siteType' }
}, {
  title: '负责人',
  key: 'person',
  dataIndex: 'person'
}, {
  title: '联系电话',
  key: 'phone',
  dataIndex: 'phone',
  scopedSlots: { customRender: 'phone' }
}, {
  title: '创建时间',
  key: 'createTime',
  dataIndex: 'createTime'
}, {
  title: '简介',
  key: 'summary',
  dataIndex: 'summary'
}, {
  title: '操作',
  key: 'operate',
  width: 150,
  fixed: 'right',
  scopedSlots: { customRender: 'operate' }
}]
export default {
  name: 'RecyclingSiteList',
  mixins: [iconFontComponent, getArea],
  data () {
    return {
      areaContain: [],
      createDate: [],
      siteAttributes: [{
        id: '全部',
        value: '全部'
      }, {
        id: 0,
        value: '自营'
      }, {
        id: 1,
        value: '加盟'
      }],
      siteAttribute: '全部',
      attributes: [{
        id: 0,
        value: '自营'
      }, {
        id: 1,
        value: '加盟'
      }],
      chargePerson: '',
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
      serveUrl: `${Host.uploadImgHost}/building/adv/upload`,
      headers: {
        token: ''
      },
      siteVisible: false,
      siteImage: '',
      siteFileList: [],
      areaNames: []
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
    removePicture (obj) {
      if (obj.uid) {
        const params = {}
        params.id = obj.uid
        delPicture(params)
      }
    },
    formatPhone (val) {
      return val && val.length > 7 ? val.substr(0, 3) + '****' + val.substr(val.length - 4, 4) : val
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    getTableData (params) {
      this.loading = true
      getSiteList(params)
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
      const params = {}
      params.menuId = 'fa4f741480bf4b02a68b28a1d0c44f47'
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      if (this.areaContain.length !== 0) {
        if (this.areaContain[0]) {
          params.provinceId = this.areaContain[0]
        }
        if (this.areaContain[1]) {
          params.cityId = this.areaContain[1]
        }
        if (this.areaContain[2]) {
          params.areaId = this.areaContain[2]
        }
      }
      if (this.createDate.length !== 0) {
        params.startDate = this.createDate[0].format('YYYY-MM-DD') + ' 00:00:00'
        params.endDate = this.createDate[1].format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (this.siteAttribute !== '全部') {
        params.siteType = this.siteAttribute
      }
      if (this.chargePerson) {
        params.person = this.chargePerson
      }
      this.getTableData(params)
    },
    toSearch () {
      this.pagination.current = 1
      this.initData()
    },
    resetTable () {
      this.areaContain = []
      this.createDate = []
      this.siteAttribute = '全部'
      this.chargePerson = ''
      const params = {}
      params.menuId = 'fa4f741480bf4b02a68b28a1d0c44f47'
      params.page = 1
      params.pageSize = this.pagination.pageSize
      this.getTableData(params)
    },
    validatePhoneNum (rule, value, callback) {
      const reg = /^[1][3-9][0-9]{9}$/
      if (value && !reg.test(value)) {
        callback(new Error('请填写正确的联系电话'))
      } else {
        callback()
      }
    },
    add () {
      this.siteVisiable = true
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
          params.name = values.name
          params.person = values.person
          params.phone = values.phone
          params.siteType = values.siteType
          params.address = values.address
          if (values.summary) {
            params.summary = values.summary
          }
          if (this.siteFileList.length !== 0) {
            const newSite = []
            this.siteFileList.forEach((item) => {
              if (item.response) {
                newSite.push(item.response.result)
              } else {
                newSite.push(item.url)
              }
            })
            params.sitePhoto = newSite
          }
          if (values.area.length !== 0) {
            if (values.area[0]) {
              params.provinceId = values.area[0]
              params.provinceName = this.areaNames[0]
            }
            if (values.area[1]) {
              params.cityId = values.area[1]
              params.cityName = this.areaNames[1]
            }
            if (values.area[2]) {
              params.areaId = values.area[2]
              params.areaName = this.areaNames[2]
            }
          }
          this.confirmLoading = true
          addSite(params).then(res => {
            this.$message.success('回收站点添加成功')
            this.siteVisiable = false
            this.confirmLoading = false
            this.form.resetFields()
            this.siteFileList = []
            this.initData()
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel (e) {
      this.form.resetFields()
      this.siteFileList = []
      this.siteVisiable = false
    },
    view (value) {
      this.$router.push({
        path: '/infrastructure/recyclingSite/siteDetails',
        query: { id: value.id, title: '查看' }
      })
    },
    edit (value) {
      this.$router.push({
        path: '/infrastructure/recyclingSite/siteDetails',
        query: { id: value.id, title: '编辑' }
      })
    },
    del (value) {
      this.deleteVisible = true
      this.delId = value.id
    },
    deleteModal () {
      const params = {}
      params.menuId = '3f41b3df741045ca8e34e67b00ed49aa'
      params.id = this.delId
      delSite(params).then(res => {
        this.$message.success('删除成功')
        this.deleteVisible = false
        this.initData()
      })
    },
    handleSiteCancel () {
      this.siteVisible = false
    },
    handleSitePreview (file) {
      this.siteImage = file.url || file.thumbUrl
      this.siteVisible = true
    },
    handleSiteChange ({ fileList }) {
      if (fileList) {
        this.siteFileList = fileList
      }
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
    position absolute
    top 64px
    left 64px
    color #666
    font-size 14px
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
