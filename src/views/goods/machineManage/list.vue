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
                  v-decorator="['nameSearch']"
                  allow-clear placeholder="请输入商品名称"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="商品条码"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['barcodeSearch']"
                  allow-clear placeholder="请输入商品条码"
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
              商品列表
            </a-col>
            <a-col :span="12" align="right">
              <a-button type="primary" @click="add()">
                新建商品
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
          <template slot="url" slot-scope="text, record">
            <viewer class="item-img_list" :images="[record.url]">
              <img
                v-if="record.url"
                class="td-image"
                :src="record.url"
              >
            </viewer>
          </template>
          <!-- <template slot="status" slot-scope="text, record">
            <span v-if="record.status === 1">展示</span>
            <span v-else>隐藏</span>
          </template> -->
          <template slot="operate" slot-scope="text, record">
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="edit(record)"
            >
              编辑
            </a-button>
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="del(record)"
            >
              删除
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <comfirmModal :dialog-obj="dialogObj" @handleOk="handleOk">
      <span>{{ dialogObj.content }}</span>
    </comfirmModal>
    <a-modal
      title="配置商品"
      :visible="dialogVisiable"
      width="600px"
      class="siteModal"
      @cancel="handleCancel"
    >
      <a-form :form="dialogForm" @submit="submitForm">
        <a-form-item label="商品名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请输入商品名称' }] }]"
            placeholder="请输入商品名称" :max-length="50" allow-clear
          />
        </a-form-item>
        <a-form-item label="商品规格" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['unit']"
            placeholder="请输入商品规格，如200ml、500g" :max-length="5" allow-clear
          />
        </a-form-item>
        <a-form-item label="商品条码" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['barcode']"
            placeholder="请输入商品条形码" :max-length="50" allow-clear
          />
        </a-form-item>
        <a-form-item label="商品进价" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input-number
            v-decorator="['price']"
            style="font-size: 12px;width: 100%;"
            :min="0" :max="99999"
            placeholder="请输入商品进价"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="库存" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['stock']"
            placeholder="请输入商品库存，仅作记录使用" :max-length="5" allow-clear
          />
        </a-form-item>
        <a-form-item label="展示排序" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input-number
            v-decorator="['sort']"
            style="font-size: 12px;width: 100%;"
            :min="0" :max="99999"
            placeholder="请输入排序"
            allow-clear
          />
        </a-form-item>
        <!-- <a-form-item label="展示状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-select
            v-decorator="['status']"
            allow-clear
            @change="handleStatusChange"
          >
            <a-select-option :value="1">
              展示
            </a-select-option>
            <a-select-option :value="2">
              隐藏
            </a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item
          label="商品图片："
          :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }"
        >
          <div class="uploadLeft">
            <a-upload
              v-decorator="['imageUrl',{rules: [{ required: true, message: '请上传商品图片' }]}]"
              list-type="picture-card"
              class="avatar-uploader"
              :disabled="pageType === 'view'"
              :show-upload-list="false"
              :action="serveUrl"
              :headers="headers"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <img v-if="imageUrl!=''" :src="imageUrl" alt="商品图片">
              <div v-else>
                <a-icon :type="loadingIcon ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传图片
                </div>
              </div>
            </a-upload>
            <div class="upload-tip">
              <a-icon class="tip-icon" type="info-circle" />  建议图片大小为1000px x 1000px，图片格式支持png、jpeg、jpg且需小于10M。请上传光底的标准商品图片用以屏幕展示。
            </div>
          </div>
        </a-form-item>
        <a-form-item label="商品简介" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-textarea
            v-decorator="['remark']"
            placeholder="请输入商品简介"
            :auto-size="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button
          type="primary" :loading="confirmLoading"
          html-type="submit" @click="submitForm"
        >
          提交
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import Host from '@/config/apiHost'
import comfirmModal from '@/components/commonModal/comfirmModal.vue'
import { mapGetters } from 'vuex'
import { addMachine } from '@/api/good'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  components: { comfirmModal },
  data () {
    return {
      serveUrl: `${Host.uploadImgHost}/building/adv/upload`,
      headers: {
        token: ''
      },
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      firstList: [],
      secondList: [],

      form: this.$form.createForm(this, {}),
      dialogForm: this.$form.createForm(this, {}),
      columns: [
        {
          title: '商品图片',
          dataIndex: 'url',
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '商品名称',
          dataIndex: 'name'
        },
        {
          title: '商品规格',
          dataIndex: 'unit'
        },
        {
          title: '库存',
          dataIndex: 'stock'
        },
        // {
        //   title: '展示状态',
        //   dataIndex: 'status',
        //   scopedSlots: { customRender: 'status' }
        // },
        // {
        //   title: '商品条码',
        //   dataIndex: 'barcode'
        // },
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
      },
      dialogObj: {
        title: '是否确定删除此商品',
        visible: false,
        iconType: 'question-circle',
        content: '删除后不会影响已被上架展示中的设备屏幕展示'
      },
      dialogVisiable: false,
      pageType: '',
      confirmLoading: false,
      baseHeadUrl: '',
      loadingIcon: false,
      imageUrl: '',
      editId: ''
    }
  },
  created () {
    this.headers.token = this.token()
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    ...mapGetters(['token']),
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isJpgOrPng) {
        this.$message.error('您只能上传 JPG/PNG/JPEG 文件!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('图像必须小于10MB!')
      }
      return isJpgOrPng && isLt10M
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loadingIcon = true
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.result) {
          this.baseHeadUrl = info.file.response.result
        }
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loadingIcon = false
        })
      }
    },
    getTableData () {
      var data = this.form.getFieldsValue()
      const param = {}
      param.barcode = data.barcodeSearch
      param.name = data.nameSearch
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      this.loading = true
      this.$httpPost(this.$basePath.emGoodsGetList, param)
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
    },
    add () {
      this.dialogVisiable = true
      this.pageType = 'add'
      this.imageUrl = ''
      this.baseHeadUrl = ''
      this.dialogForm.resetFields()
    },
    del (record) {
      this.dialogObj.visible = true
      this.dialogObj.id = record.id
    },
    handleCancel (e) {
      this.dialogForm.resetFields()
      this.dialogVisiable = false
    },
    submitForm () {
      this.dialogForm.validateFields((err, values) => {
        if (!err) {
          const param = this.dialogForm.getFieldsValue()
          param.status = 1
          delete param.imageUrl
          param.url = this.baseHeadUrl
          if (this.pageType === 'edit') {
            param.id = this.editId
          }
          for (const key in param) {
            param[key] = param[key] ? param[key] : ''
          }
          addMachine(param).then(res => {
            this.dialogVisiable = false
            if (res.code === 0) {
              this.$message.success(res.msg)
              this.getTableData()
            } else {
              this.$message.error(res.msg)
            }
          }).catch((error) => {
            console.error(error)
          })
        }
      })
    },
    handleOk () {
      this.$httpPost(this.$basePath.emGoodsDelById, {
        id: this.dialogObj.id
      })
        .then(res => {
          this.$message.success('删除成功')
          this.dialogObj.visible = false
          this.getTableData()
        })
    },
    edit (record) {
      this.dialogVisiable = true
      this.pageType = 'edit'
      this.editId = record.id
      this.$nextTick(() => {
        this.dialogForm.setFieldsValue({
          name: record.name,
          remark: record.remark,
          barcode: record.barcode,
          price: record.price && (record.price + ''),
          imageUrl: record.url,
          unit: record.unit,
          stock: record.stock,
          sort: record.sort
        })
      })
      this.imageUrl = record.url
      this.baseHeadUrl = record.url
    },
    handleStatusChange (value) {
      if (value === 2) {
        this.$message.warning('若商品正在使用中将下架此商品，请谨慎操作')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.upload-tip
  line-height 25px
.uploadLeft
  display flex
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
.td-image
  width 48px
  height 48px
  margin 6px 0
.siteModal
  .ant-modal-body
    padding-bottom 0
  .ant-modal-footer
    padding-top 0
    padding-bottom 24px
    text-align center
</style>
