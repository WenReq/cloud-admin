<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        设备信息
      </div>
      <div class="card-content">
        <a-form ref="detailForm" :form="form" class="detail-form">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="设备名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productName']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="设备类型"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['name']"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="设备型号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['type']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="设备编号"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['productId']"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="所在区域"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['areaName']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="小区"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['estateName']"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="card-title mt16">
        设备广告编辑
        <!-- <span style="font-size:14px;color:#999;">（此页面所有改动均在提交页面保存后生效）</span> -->
      </div>
      <div v-for="(item,index) in adList" :key="index" class="card-content sec">
        <div class="card-title">
          <a-row>
            <a-col :span="3" class="title-item mt5">
              {{ item.type == 0 ? '主屏广告': item.type == 1 ? '左屏广告': item.type == 2 ? '右屏广告': item.type == 3 ? '内屏广告': '' }}
            </a-col>
            <a-col :span="4" class="title-item">
              屏保时间(秒)：<a-input v-model="item.screensaverTime" disabled />
            </a-col>
            <a-col :span="4" class="title-item ">
              切换时间(秒)：<a-input v-model="item.switchTime" disabled />
            </a-col>
            <a-col :span="5" class="title-item mt8">
              最近上传时间：{{ item.createTime }}
            </a-col>
            <a-col :span="4" class="title-item mt8">
              最近上传广告状态：{{ item.state == 1 ? '待响应' : item.state == 2 ? '播放中' : '' }}
            </a-col>
            <a-col
              v-if="isEdit" :span="4" class="title-item mt8"
              align="right"
            >
              <a-button
                v-if="item.state == 1"
                type="link" size="small" style="height: auto;"
                @click="repeat(item)"
              >
                重发
              </a-button>
              <a-button
                type="link" size="small" style="height: auto;"
                @click="upload(item)"
              >
                追加上传
              </a-button>
              <a-button
                v-if="item.state!=''&&item.switchTime!=''&&item.screensaverTime!=''"
                type="link" size="small" style="height: auto;"
                @click="empty(item)"
              >
                清空
              </a-button>
            </a-col>
          </a-row>
        </div>
        <div class="card-content">
          <a-empty v-if="item.list.length == 0" class="ad-empty" description="暂无数据~">
            <a-icon
              slot="image" type="frown" style="font-size: 18px"
            />
          </a-empty>
          <div v-for="(val, key) in item.list" :key="key" class="ad-item">
            <video v-if="val.pic.split('.')[val.pic.split('.').length-1] == 'mp4'" controls="controls" controlsList="nodownload">
              <source :src="val.pic" type="video/mp4">
            </video>
            <img v-else :src="val.pic" alt="">
            <div class="ad-item-order">
              排序{{ key+1 }}
            </div>
            <a-button
              v-if="isEdit"
              class="ad-item-del"
              type="link" size="small"
              @click="delAdPic(val.id)"
            >
              删除
            </a-button>
          </div>
        </div>
      </div>
      <div class="card-content mb40 mt40">
        <a-row type="flex" justify="center">
          <a-col
            :span="12" type="flex" align="middle"
            style="text-align:center;"
          >
            <a-button class="mr8" type="primary" @click="back">
              返回
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
    <comfirmModal :dialog-obj="dialogObj" @handleOk="handleOk">
      <span>{{ dialogObj.content }}</span>
    </comfirmModal>
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
      <a-form :form="uploadObj.formData">
        <a-row class="card-content">
          <a-col class="search-item" :span="24">
            <a-form-item
              label="屏保时间(秒)"
              v-bind="uploadObj.formItemLayout"
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
              v-bind="uploadObj.formItemLayout"
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
              v-bind="{
                labelCol: { span: 4 },
                wrapperCol: { span: 16 }
              }"
            >
              <a-radio-group v-decorator="['type', {initialValue: 0}]" name="radioGroup" disabled>
                <a-radio :value="0">
                  主屏
                </a-radio>
                <a-radio :value="1">
                  左屏
                </a-radio>
                <a-radio :value="2">
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
              v-bind="{
                labelCol: { span: 4 },
                wrapperCol: { span: 19 }
              }"
            >
              <a-upload-dragger
                name="file"
                :multiple="true"
                :file-list="uploadObj.fileList"
                :before-upload="beforeUpload"
                :custom-request="customRequest"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">
                  点击或拖动文件上传
                </p>
                <p class="ant-upload-hint">
                  图片格式支持JPG、PNG，主屏建议上传 1920px* 1080px 的高清图片,左屏和右屏建议上传 1080px* 1920px 的高清图片,内屏建议上传 608px* 1080px 的高清图片；视频格式只支持MP4，建议大小为30MB以内。包括视频在内每次至多可上传10种素材。
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
    </a-modal>
  </div>
</template>

<script>
import comfirmModal from '@/components/commonModal/comfirmModal.vue'
export default {
  components: { comfirmModal },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this, { name: 'detailForm' }),
      isEdit: false,
      adList: [
        {
          type: 0,
          title: '主屏广告',
          screensaverTime: '',
          switchTime: '',
          createTime: '',
          state: '',
          list: []
        },
        {
          type: 1,
          title: '左屏广告',
          screensaverTime: '',
          switchTime: '',
          createTime: '',
          state: '',
          list: []
        },
        {
          type: 2,
          title: '右屏广告',
          screensaverTime: '',
          switchTime: '',
          createTime: '',
          state: '',
          list: []
        },
        {
          type: 3,
          title: '内屏广告',
          screensaverTime: '',
          switchTime: '',
          createTime: '',
          state: '',
          list: []
        }
      ],
      dialogObj: {
        visible: false,
        iconType: 'question-circle',
        title: '',
        content: ''
      },
      uploadObj: {
        width: '50%',
        title: '上传广告',
        visible: false,
        formData: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 19 }
        },
        fileList: [],
        picList: [],
        uploading: false
      }
    }
  },
  mounted () {
    if (this.$route.name === 'adDeliverydetailedit' || this.$route.name === 'adDeliverydetailadd') this.isEdit = true
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.$httpPost(this.$basePath.getProductInfo, {
        productId: this.$route.query.productId
      })
        .then(res => {
          var data = res.result
          this.form.setFieldsValue({
            productId: data.productId,
            areaName: data.areaName,
            estateName: data.estateName,
            name: data.name,
            type: data.type,
            productName: data.productName
          })
          this.adList = [
            {
              type: 0,
              title: '主屏广告',
              screensaverTime: '',
              switchTime: '',
              createTime: '',
              state: '',
              list: []
            },
            {
              type: 1,
              title: '左屏广告',
              screensaverTime: '',
              switchTime: '',
              createTime: '',
              state: '',
              list: []
            },
            {
              type: 2,
              title: '右屏广告',
              screensaverTime: '',
              switchTime: '',
              createTime: '',
              state: '',
              list: []
            },
            {
              type: 3,
              title: '内屏广告',
              screensaverTime: '',
              switchTime: '',
              createTime: '',
              state: '',
              list: []
            }
          ]
          data.productList.forEach(item => {
            if (item.type === 0) Object.assign(this.adList[0], item)
            if (item.type === 1) Object.assign(this.adList[1], item)
            if (item.type === 2) Object.assign(this.adList[2], item)
            if (item.type === 3) Object.assign(this.adList[3], item)
          })
        })
    },
    upload (item) {
      this.uploadObj.visible = true
      this.uploadObj.picList = []
      this.$nextTick(() => {
        this.uploadObj.formData.setFieldsValue({
          type: item.type,
          screensaverTime: item.screensaverTime,
          switchTime: item.switchTime
        })
        item.list.forEach(item => {
          this.uploadObj.picList.push(item.pic)
        })
      })
    },
    beforeUpload (file) {
      if (this.uploadObj.fileList.length > 10) {
        this.$message.error('每次至多可上传10种素材！')
        return false
      }
      const isLt30M = file.size / 1024 / 1024 < 30
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'video/mp4'
      if (!isLt30M) {
        this.$message.error('素材大小不能超过30M！')
        return false
      }
      if (!isType) {
        this.$message.error('请选择png，jpg, mp4格式图片上传！')
        return false
      }
    },
    customRequest (e) {
      var formdata = new FormData()
      formdata.append('file', e.file)
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.$httpPost(this.$basePath.uploadPic, formdata, config)
        .then(res => {
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
      if (this.uploadObj.picList.length === 0) {
        this.$message.error('请上传素材！')
        return
      }
      this.uploadObj.formData.validateFields(err => {
        if (!err) {
          var param = {}
          param = this.uploadObj.formData.getFieldsValue()
          param.picList = this.uploadObj.picList
          param.productIds = [this.$route.query.productId]
          this.$httpPost(this.$basePath.upAdvInfo, param)
            .then(res => {
              this.$message.success('上传成功！')
              this.uploadObj.visible = false
              this.uploadObj.formData.resetFields()
              this.uploadObj.picList = []
              this.uploadObj.fileList = []
              this.getDetail()
            })
        }
      })
    },
    delAdPic (id) {
      this.dialogObj.visible = true
      this.dialogObj.title = '是否确定删除此广告素材'
      this.dialogObj.type = 'delImage'
      this.dialogObj.imageId = id
    },
    handleCancel () {
      this.uploadObj.formData.resetFields()
      this.uploadObj.picList = []
      this.uploadObj.fileList = []
      this.uploadObj.visible = false
    },
    back () {
      this.$router.push({
        path: '/advert/terminalAd/adDelivery'
      })
    },
    repeat (item) {
      this.dialogObj.visible = true
      this.dialogObj.title = '是否确定重发广告'
      this.dialogObj.content = '已在播放中的广告不会重发，只针对等待设备响应的广告素材进行重发，页面提交保存后进行重发！'
      this.dialogObj.type = 'repeat'
      this.dialogObj.screentype = item.type
    },
    empty (item) {
      this.dialogObj.visible = true
      this.dialogObj.title = '是否确定清空此屏幕所有广告'
      this.dialogObj.content = '将清空此屏幕播放中及待响应状态的广告，页面保存后生效！'
      this.dialogObj.type = 'empty'
      this.dialogObj.screentype = item.type
    },
    handleOk () {
      if (this.dialogObj.type === 'repeat') {
        this.$httpPost(this.$basePath.resend, {
          productId: this.$route.query.productId,
          type: this.dialogObj.screentype
        })
          .then(res => {
            this.$message.success('重发成功！')
            this.dialogObj.visible = false
            this.getDetail()
          })
      }
      if (this.dialogObj.type === 'empty') {
        this.$httpPost(this.$basePath.clearImage, {
          productId: this.$route.query.productId,
          type: this.dialogObj.screentype
        })
          .then(res => {
            this.$message.success('清空成功！')
            this.dialogObj.visible = false
            this.getDetail()
          })
      }
      if (this.dialogObj.type === 'delImage') {
        this.$httpPost(this.$basePath.deleteImage, { id: this.dialogObj.imageId })
          .then(res => {
            this.$message.success('删除成功！')
            this.dialogObj.visible = false
            this.getDetail()
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-content
  &.sec
    border 1px solid #C4C4C4
    margin-bottom 16px
    .card-title
      font-size 14px
      padding 10px
      background-color #F4F5F7
      .title-item
        font-size 12px
        color #666666
        >>>.ant-input
          width 50px
          padding 0
          text-align center
        &:first-child
          font-size 14px
          color #333333
    .card-content
      padding 0 0 16px 16px
      overflow hidden
      .ad-item
        position relative
        float left
        width 19%
        height 0
        padding-bottom 10%
        margin-top 16px
        margin-right 1%
        margin-bottom 20px
        .ad-item-order
          position absolute
          bottom -18px
          height 15px
          left 50%
          transform translateX(-50%)
          font-size 12px
          color #333333
        .ad-item-del
          position absolute
          bottom -18px
          right 0
          height 15px
        img, video
          position absolute
          left 0
          top 0
          width 100%
          height 100%
      .ad-empty
        >>>.ant-empty-image
          height auto
          margin-top 16px
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
