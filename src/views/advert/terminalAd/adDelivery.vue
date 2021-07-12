<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        统计筛选
      </div>
      <div class="card-content">
        <a-form ref="searchForm" :form="form">
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="区域"
                v-bind="formItemLayout"
              >
                <a-cascader
                  v-model="areas"
                  :options="options"
                  :load-data="loadData"
                  change-on-select
                  :field-names="{
                    label: 'name',
                    value: 'id',
                    children: 'children'
                  }"
                  placeholder="省市区"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="小区"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['estateId']"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="(item,index) in estateList" :key="index" :value="item.id">
                    {{ item.housingEstate }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备型号"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['key']"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="(item, index) in markList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['name']"
                  allow-clear
                  placeholder="请输入设备名称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="设备编号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productId']"
                  allow-clear
                  placeholder="请输入设备编号"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="上传时间"
                v-bind="formItemLayout"
              >
                <a-range-picker
                  v-model="uploadTime"
                  @change="changeUploadTime"
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
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="12">
            设备广告列表
          </a-col>
          <a-col :span="12" align="right">
            <a-button class="mr8" @click="batchAppend">
              批量追加
            </a-button>
            <a-button @click="batchUpload">
              批量覆盖上传
            </a-button>
          </a-col>
        </a-row>
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :columns="columns"
          :data-source="data"
          :row-key="record => Math.random() * 10000"
          :loading="loading"
          :pagination="pagination"
          :scroll="{x: 1500}"
          @change="handleTableChange"
        >
          <template slot="adStatus" slot-scope="text">
            <span v-if="text.length == 0">未配置</span>
            <span v-else>
              <span v-for="(item,index) in text" :key="index">
                <span v-if="item.type==0&&item.state">主屏: {{ item.state==1?'待响应; ':item.state==2?'播放中; ':'; ' }}</span>
                <span v-if="item.type==1&&item.state">左屏: {{ item.state==1?'待响应; ':item.state==2?'播放中; ':'; ' }}</span>
                <span v-if="item.type==2&&item.state">右屏: {{ item.state==1?'待响应; ':item.state==2?'播放中; ':'; ' }}</span>
                <span v-if="item.type==3&&item.state">内屏: {{ item.state==1?'待响应; ':item.state==2?'播放中; ':'; ' }}</span>
              </span>
            </span>
          </template>
          <template slot="operate" slot-scope="text, record">
            <a-button
              v-if="record.advRecycleBinList.length"
              class="table-btn-link" type="link" size="small"
              @click="toView(record)"
            >
              查看
            </a-button>
            <a-button
              v-if="record.advRecycleBinList.length"
              class="table-btn-link" type="link" size="small"
              @click="toEdit(record)"
            >
              编辑
            </a-button>
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="toUpload(record)"
            >
              覆盖上传
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      :title="uploadObj.title"
      centered
      :width="uploadObj.width"
      :mask-closable="false"
      :visible="uploadObj.visible"
      :body-style="{
        padding: '12px 24px'
      }"
      ok-text="保存"
      @cancel="handleCancel"
      @ok="uploadOk"
    >
      <a-row class="card-container" style="padding: 0;">
        <a-col v-if="isBatch" :span="8">
          <div class="card-title" style="font-size: 12px;">
            选择设备
          </div>
          <div class="card-content">
            <a-row>
              <a-col :span="8">
                <a-select
                  v-model="uploadObj.province"
                  placeholder="省份" class="upload-select"
                  @change="changeProvince"
                >
                  <a-select-option v-for="(item,index) in uploadObj.provinceList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="8">
                <a-select
                  v-model="uploadObj.city"
                  placeholder="城市"
                  mode="multiple" class="upload-select"
                  @change="changeCity"
                >
                  <a-select-option v-for="(item,index) in uploadObj.cityList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="8">
                <a-select
                  v-model="uploadObj.area"
                  placeholder="区"
                  mode="multiple" class="upload-select"
                  @change="changeRegion"
                >
                  <a-select-option v-for="(item,index) in uploadObj.areaList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row class="mt16">
              <a-col :span="8">
                <a-select
                  v-model="uploadObj.estate"
                  placeholder="小区"
                  mode="multiple" class="upload-select"
                  @change="changeEstate"
                >
                  <a-select-option v-for="(item,index) in uploadObj.estateList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
              <!-- <a-col :span="12" align="right">
                <a-button type="primary" class="mr8" @click="searchDevice">
                  查询
                </a-button>
              </a-col> -->
              <a-col :span="8">
                <a-select
                  v-model="uploadObj.eqType"
                  show-search
                  placeholder="设备类型"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  class="upload-select"
                  allow-clear
                  @change="changeEqType"
                >
                  <a-select-option v-for="(item, index) in markList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>

                <!-- <a-select
                  v-decorator="['key']"
                  allow-clear
                  placeholder="全部"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option v-for="(item, index) in markList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select> -->
              </a-col>
              <a-col :span="8">
                <a-checkbox :checked="allCheck" style="margin-top: 5px;" @change="selectAll">
                  全选
                </a-checkbox>
              </a-col>
            </a-row>
            <div class="mt16">
              <a-empty v-if="uploadObj.treeData.length == 0"></a-empty>
              <a-tree
                v-model="checkedKeys"
                checkable
                default-expand-all
                :tree-data="uploadObj.treeData"
                @check="onCheck"
              />
            </div>
          </div>
        </a-col>
        <a-col v-if="isBatch" :span="8">
          <div class="card-title" style="font-size: 12px;">
            已选设备
          </div>
          <div class="card-content">
            <div class="mt16">
              <a-empty v-if="uploadObj.treeDataChecked.length == 0"></a-empty>
              <a-tree
                default-expand-all
                :tree-data="uploadObj.treeDataChecked"
              />
            </div>
          </div>
        </a-col>
        <a-col :span="isBatch ? '8' : '24'">
          <div v-if="isBatch" class="card-title" style="font-size: 12px;">
            广告上传
          </div>
          <a-form :form="uploadObj.formData">
            <a-row class="card-content">
              <a-col class="search-item" :span="24">
                <a-form-item
                  label="屏保时间(秒)"
                  v-bind="isBatch ? uploadObj.formItemLayout : uploadObj.formItemLayout1"
                >
                  <a-input
                    v-decorator="['screensaverTime', { rules: [{ required: true, message: '请填写屏保时间' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="card-content">
              <a-col class="search-item" :span="24">
                <a-form-item
                  label="切换时间(秒)"
                  v-bind="isBatch ? uploadObj.formItemLayout : uploadObj.formItemLayout1"
                >
                  <a-input
                    v-decorator="['switchTime', { rules: [{ required: true, message: '请填写切换时间' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="card-content">
              <a-col class="search-item" :span="24">
                <a-form-item
                  label=" 广告上传位置"
                  v-bind="isBatch ? {
                    labelCol: { span: 5 },
                    wrapperCol: { span: 19 }
                  }: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 13 }
                  }"
                >
                  <a-radio-group v-decorator="['type', {initialValue: 0}]" name="radioGroup">
                    <a-radio :value="0">
                      主屏
                    </a-radio>
                    <a-radio v-if="markType !== 2" :value="1">
                      左屏
                    </a-radio>
                    <a-radio v-if="markType !== 2" :value="2">
                      右屏
                    </a-radio>
                    <a-radio :value="3">
                      内屏
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="card-content">
              <a-col class="search-item" :span="24">
                <a-form-item
                  label=" 上传广告素材"
                  v-bind="isBatch ? {
                    labelCol: { span: 5 },
                    wrapperCol: { span: 19 }
                  } : {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 19 }
                  }"
                >
                  <a-upload-dragger
                    name="file"
                    :multiple="true"
                    :file-list="uploadObj.fileList"
                    list-type="picture"
                    :before-upload="beforeUpload"
                    :custom-request="customRequest"
                    @change="changeUpload"
                  >
                    <p class="ant-upload-drag-icon">
                      <a-icon type="inbox" />
                    </p>
                    <p class="ant-upload-text">
                      点击或拖动文件上传
                    </p>
                    <p class="ant-upload-hint">
                      <span v-if="markType !== 2">图片格式支持JPG、PNG，主屏建议上传 1920px* 1080px 的高清图片,左屏和右屏建议上传 1080px* 1920px 的高清图片,内屏建议上传 608px* 1080px 的高清图片；视频格式只支持MP4，建议大小为200MB以内。包括视频在内每次至多可上传10种素材。</span>
                      <span v-else>图片格式支持JPG、PNG，主屏建议上传 1080px* 1920px 的高清图片,内屏建议上传 1032px* 420px 的高清图片，每种广告屏幕至多可上传10张图片。</span>
                    </p>
                  </a-upload-dragger>
                  <div class="upload-list">
                    <div v-for="(item,index) in uploadObj.picList" :key="index" class="upload-item">
                      <video v-if="item.split('.')[item.split('.').length-1] == 'mp4'" controls="controls" controlsList="nodownload">
                        <source :src="item" type="video/mp4">
                      </video>
                      <img v-else :src="item" alt="">
                      <div class="detail">
                        <div class="detail-name" :title="item">
                          {{ item }}
                        </div>
                        <a-progress :percent="100" style="width: 100px" size="small" />
                        <a-button
                          type="link" size="small"
                          @click="delUploadImage(item)"
                        >
                          删除
                        </a-button>
                      </div>
                    </div>
                    <a-spin v-if="uploadObj.uploading" tip="上传中..." />
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { getMarkList, getArea, getEstate } from '@/components/mixins/mixins.js'
export default {
  mixins: [getMarkList, getArea, getEstate],
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      areas: [],
      form: this.$form.createForm(this),
      uploadTime: [],
      loading: false,
      columns: [
        {
          title: '区域',
          dataIndex: 'areaName'
        },
        {
          title: '小区',
          dataIndex: 'estateName'
        },
        {
          title: '设备型号',
          dataIndex: 'type',
          width: 100
        },
        {
          title: '设备名称',
          dataIndex: 'name'
        },
        {
          title: '设备编号',
          dataIndex: 'productId'
        },
        {
          title: '最近上传广告状态',
          dataIndex: 'advRecycleBinList',
          scopedSlots: { customRender: 'adStatus' }
        },
        {
          title: '最近上传时间',
          dataIndex: 'createTime',
          width: 130
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 130
        },
        {
          title: '操作',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'operate' }
        }
      ],
      data: [],
      selectedRowKeys: [],
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
      uploadObj: {
        width: '90%',
        title: '上传广告',
        visible: false,
        formData: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 }
        },
        formItemLayout1: {
          labelCol: { span: 4 },
          wrapperCol: { span: 19 }
        },
        fileList: [],
        provinceList: [],
        cityList: [],
        areaList: [],
        estateList: [],
        province: undefined,
        city: [],
        area: [],
        estate: [],
        checkedKeys: [],
        treeData: [],
        selectedKeys: [],
        productIds: [],
        treeDataChecked: [],
        allTreeSelect: [],
        picList: [],
        uploading: false,
        eqType: []
      },
      isBatch: false,
      allIds: [],
      checkedKeys: [],
      allCheck: false,
      markType: 0
    }
  },
  mounted () {
    this.getArea('', 2)
    this.getEstate()
    this.getMarkList()
    this.getTableData()
  },
  methods: {
    changeEqType (val) {
      const markType = (this.markList.filter(i => i.id === val))[0].type
      this.markType = markType
      this.getHouseEstate({ deviceModel: val })
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    changeUploadTime () {},
    toSearch () {
      this.pagination.current = 1
      this.getTableData()
    },
    resetForm () {
      this.form.resetFields()
      this.areas = []
      this.uploadTime = []
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    getTableData () {
      var param = this.form.getFieldsValue()
      param.menuId = '6202688193514114af32d037503bae26'
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      param.provinceId = this.areas[0]
      param.cityId = this.areas[1]
      param.areaId = this.areas[2]
      if (this.uploadTime.length > 0) {
        param.startTime = this.uploadTime[0].format('YYYY-MM-DD 00:00:00')
        param.endTime = this.uploadTime[1].format('YYYY-MM-DD 23:59:59')
      }
      this.loading = true
      this.$httpPost(this.$basePath.getProductList, param)
        .then(res => {
          this.loading = false
          this.data = res.result.list
          this.pagination.total = res.result.totalCount
        })
        .catch(() => {
          this.loading = false
        })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toView (record) {
      this.$router.push({
        path: '/advert/terminalAd/adDelivery/view',
        query: { productId: record.productId }
      })
    },
    toEdit (record) {
      this.$router.push({
        path: '/advert/terminalAd/adDelivery/edit',
        query: { productId: record.productId, markType: record.markType }
      })
    },
    toUpload (record) {
      this.uploadObj.width = '50%'
      this.uploadObj.title = '上传广告'
      this.uploadObj.visible = true
      this.uploadObj.productId = record.productId
      this.markType = record.markType
      this.isBatch = false
    },
    batchAppend () {
      this.uploadObj.width = '90%'
      this.uploadObj.title = '批量追加广告'
      this.uploadObj.visible = true
      this.uploadObj.productId = undefined
      this.isBatch = true
      this.uploadObj.batchType = 'add'
      this.getProvince()
    },
    batchUpload () {
      this.uploadObj.width = '90%'
      this.uploadObj.title = '批量覆盖上传'
      this.uploadObj.visible = true
      this.uploadObj.productId = undefined
      this.uploadObj.batchType = 'cover'
      this.isBatch = true
      this.getProvince()
    },
    beforeUpload (file) {
      if (this.uploadObj.fileList.length > 10) {
        this.$message.error('每次至多可上传10种素材！')
        return false
      }
      const isLt30M = file.size / 1024 / 1024 < 200
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'video/mp4'
      if (!isLt30M) {
        this.$message.error('素材大小不能超过200M！')
        return false
      }
      if (!isType) {
        this.$message.error('请选择png，jpg, mp4格式图片上传！')
        return false
      }
    },
    changeUpload (e) {
      // this.uploadObj.fileList = e.fileList
    },
    customRequest (e) {
      this.uploadObj.uploading = true
      var formdata = new FormData()
      formdata.append('file', e.file)
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      // this.uploadObj.fileList.push(e.file)
      this.$httpPost(this.$basePath.uploadPic, formdata, config)
        .then(res => {
          this.uploadObj.uploading = false
          this.uploadObj.picList.push(res.result)
        })
    },
    delUploadImage (id) {
      this.uploadObj.picList.forEach((item, index) => {
        if (item === id) {
          this.uploadObj.picList.splice(index, 1)
        }
      })
    },
    uploadOk () {
      if (this.isBatch && this.uploadObj.productIds.length === 0) {
        this.$message.error('请选择设备！')
        return
      }
      if (this.uploadObj.picList.length === 0) {
        this.$message.error('请上传素材！')
        return
      }
      this.uploadObj.formData.validateFields(err => {
        if (!err) {
          var param = {}
          param = this.uploadObj.formData.getFieldsValue()
          if (this.uploadObj.picList.length) param.picList = this.uploadObj.picList
          if (this.isBatch) {
            if (this.uploadObj.batchType === 'add') {
              if (this.uploadObj.productIds.length) param.productIds = this.uploadObj.productIds
              this.$httpPost(this.$basePath.addition, param)
                .then(res => {
                  this.$message.success('批量追加成功！')
                  this.uploadObj.visible = false
                  this.getTableData()
                  this.handleCancel()
                })
            }
            if (this.uploadObj.batchType === 'cover') {
              if (this.uploadObj.productIds.length) param.productIds = this.uploadObj.productIds
              this.$httpPost(this.$basePath.upAdvInfo, param)
                .then(res => {
                  this.$message.success('批量覆盖成功！')
                  this.uploadObj.visible = false
                  this.getTableData()
                  this.handleCancel()
                })
            }
          } else {
            if (this.uploadObj.productId) param.productIds = [this.uploadObj.productId]
            this.$httpPost(this.$basePath.upAdvInfo, param)
              .then(res => {
                this.$message.success('上传成功！')
                this.uploadObj.visible = false
                this.getTableData()
                this.handleCancel()
              })
          }
        }
      })
    },
    handleCancel () {
      this.uploadObj.formData.resetFields()
      // this.uploadObj.picList = []
      this.uploadObj.fileList = []
      this.uploadObj.provinceList = []
      this.uploadObj.cityList = []
      this.uploadObj.areaList = []
      this.uploadObj.estateList = []
      this.uploadObj.province = []
      this.uploadObj.city = []
      this.uploadObj.area = []
      this.uploadObj.estate = []
      this.uploadObj.checkedKeys = []
      this.checkedKeys = []
      this.uploadObj.treeData = []
      this.uploadObj.selectedKeys = []
      this.uploadObj.productIds = []
      // this.uploadObj.treeDataChecked = []
      this.uploadObj.allTreeSelect = []
      this.uploadObj.picList = []
      this.uploadObj.treeDataChecked = []
      this.allCheck = false
      this.uploadObj.visible = false
      this.uploadObj.eqType = []
    },
    searchDevice () {},
    getProvince () {
      this.$httpPost(this.$basePath.getArea, { id: '' })
        .then(res => {
          this.uploadObj.provinceList = res.result.data
        })
    },
    getCity (id) {
      this.$httpPost(this.$basePath.getArea, { id: id, layer: 3 })
        .then(res => {
          this.uploadObj.cityList = res.result.data
        })
    },
    getRegion (idArr) {
      this.$httpPost(this.$basePath.getAreaList, { areaList: idArr })
        .then(res => {
          this.uploadObj.areaList = res.result
        })
    },
    getHouseEstate (param, isEstate) {
      this.$httpPost(this.$basePath.choseProduct, param)
        .then(res => {
          this.uploadObj.estateList = res.result
          this.uploadObj.treeData = []
          this.allIds = []
          res.result.forEach(item => {
            this.allIds.push(item.id)
            item.child.length && item.child.forEach(val => {
              this.allIds.push(val.id)
            })
            this.uploadObj.treeData.push(this.handleTreeData(item))
          })
        })
    },
    selectAll (e) {
      if (e.target.checked) {
        this.checkedKeys = this.allIds
        this.onCheck(this.allIds)
      } else {
        this.checkedKeys = []
        this.onCheck([])
      }
      this.allCheck = e.target.checked
    },
    changeProvince (id) {
      this.uploadObj.city = []
      this.uploadObj.area = []
      this.uploadObj.areaList = []
      this.uploadObj.estate = []
      this.uploadObj.estateList = []
      this.uploadObj.treeData = []
      this.uploadObj.treeDataChecked = []
      this.checkedKeys = []
      this.getCity(id)
    },
    changeCity (idArr) {
      this.uploadObj.area = []
      this.uploadObj.areaList = []
      this.uploadObj.estate = []
      this.uploadObj.estateList = []
      this.uploadObj.treeData = []
      this.uploadObj.treeDataChecked = []
      this.checkedKeys = []
      if (idArr.length === 0) {
        return
      }
      this.getRegion(idArr)
    },
    changeRegion (idArr) {
      this.uploadObj.estate = []
      this.uploadObj.estateList = []
      this.uploadObj.treeData = []
      this.uploadObj.treeDataChecked = []
      this.checkedKeys = []
      if (idArr.length === 0) {
        return
      }
      this.getHouseEstate({ areaList: idArr })
    },
    changeEstate (idArr) {
      this.uploadObj.treeDataChecked = []
      this.uploadObj.treeData = []
      if (idArr.length === 0) {
        return
      }
      this.getHouseEstate({ estateList: idArr })
    },
    onCheck (checkedKeys) {
      this.filterProductId(checkedKeys)
      this.handleSelectTree()
    },
    handleSelectTree () {
      this.uploadObj.treeDataChecked = []
      this.uploadObj.treeData.forEach(item => {
        if (item.children && item.children.length) {
          var children = []
          item.children.forEach(subItem => {
            if (this.uploadObj.productIds.includes(subItem.key)) {
              children.push(subItem)
            }
          })
          if (children.length > 0) {
            this.uploadObj.treeDataChecked.push({
              key: item.key,
              title: item.title,
              children: children
            })
          }
        }
      })
    },
    filterProductId (arr) {
      this.uploadObj.productIds = []
      arr.forEach(item => {
        if (item.substring(0, 2).toLocaleLowerCase() === 'mx') {
          this.uploadObj.productIds.push(item)
        }
      })
    },
    handleTreeData (item) {
      const childrenNode = {
        title: item.name,
        key: item.id
      }
      if (item.child && item.child.length) {
        childrenNode.children = []
        item.child.forEach(subItem => {
          childrenNode.children.push(this.handleTreeData(subItem))
        })
      }
      return childrenNode
    }
  }
}
</script>

<style lang="stylus" scoped>
>>>.ant-upload-hint
  width 70%
  margin 4px auto 10px auto
>>>.ant-upload-drag-icon
  margin-top 32px
.upload-select
  width 95%
.upload-list
  margin-top 16px
  overflow hidden
  .upload-item
    float left
    margin 0 10px 20px 0
    display flex
    .detail
      width 144px
      margin-left 5px
      .detail-name
        width 144px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
    img, video
      width 80px
      height 55px
</style>
