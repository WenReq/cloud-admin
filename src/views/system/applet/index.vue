<template>
  <div>
    <a-card :title="type == 'edit' ? '应用参数配置' :'应用参数配置'">
      <a-button
        v-if="type=='list'" slot="extra" type="primary"
        @click="edit"
      >
        修改
      </a-button>
      <div>
        <a-form :form="form">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="AppID：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-input
                  v-decorator="['appletId', {
                    rules: [{ required: true, message: '请填AppID' }]
                  }]"
                  placeholder="请填写小程序ID，提交后不可修改" allow-clear :disabled="(valAppletId && type === 'edit') || (type === 'list')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="AppSecret：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-input
                  v-decorator="['appletSign', {
                    rules: [{ required: true, message: '请填小程序秘钥' }]
                  }]"
                  placeholder="请填写小程序秘钥，提交后不可修改" allow-clear :disabled="(valAppletSign && type === 'edit') || (type === 'list')"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="商户号：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-input
                  v-decorator="['merchantId',{}]"
                  placeholder="请填写商户号，提交后不可修改" allow-clear :disabled="(valMerchantId && type !== 'add') || (type === 'list')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="二维码URL：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-input
                  v-decorator="['qrCodeUrl',{}]"
                  placeholder="用于小程序扫描二维码跳转的URL链接" allow-clear :disabled="type === 'list'"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="小程序名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-input
                  v-decorator="['appletName',{}]"
                  placeholder="请填写小程序名称，如猫先生环境管家" allow-clear :disabled="type === 'list'"
                  :max-length="20"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="默认昵称格式：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-input
                  v-decorator="['baseNickName',{}]"
                  placeholder="用于数据导入等用户的昵称展示，如猫先生" allow-clear :disabled="type === 'list'"
                  :max-length="20"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                label="默认头像："
                :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }"
              >
                <div class="uploadLeft">
                  <a-upload
                    list-type="picture-card"
                    class="avatar-uploader"
                    :disabled="type === 'list'"
                    :show-upload-list="false"
                    :action="serveUrl"
                    :headers="headers"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                  >
                    <img v-if="imageUrl!=''" :src="imageUrl" alt="默认头像">
                    <div v-else>
                      <a-icon :type="loadingIcon ? 'loading' : 'plus'" />
                      <div class="ant-upload-text">
                        上传图片
                      </div>
                    </div>
                  </a-upload>
                  <div class="upload-tip">
                    <a-icon class="tip-icon" type="info-circle" />用于数据导入等用户的头像展示，图片格式支持png，jpeg，jpg，大小不超过10M。
                  </div>
                </div>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="12">
              <a-form-item label="每日积分上限：" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-input-number
                  v-decorator="['dailyCreditLimit',{}]"
                  :disabled="type === 'list'"
                  style="width:100%"
                  placeholder="用户每日获取的积分上限，只支持填写整数" :min="0" :max="999999"
                />
              </a-form-item>
            </a-col> -->
          </a-row>
        </a-form>
      </div>
      <div class="card-content mb40 mt40">
        <a-row type="flex" justify="center">
          <a-col
            :span="12" type="flex" align="middle"
            style="text-align:center;"
          >
            <a-button v-if="type == 'edit'" class="mr8" @click="back">
              返回
            </a-button>
            <a-button v-if="type == 'add'" class="mr8" @click="handleReset">
              重置
            </a-button>
            <span class="mr10"></span>
            <a-button
              v-if="type == 'add' ||type == 'edit' "
              :loading="loading" type="primary"
              @click="save"
            >
              保存
            </a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script>
import Host from '@/config/apiHost'
import { getApplet, upDateApplet } from '@/api/system'
import { mapGetters } from 'vuex'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  data () {
    return {
      isEdit: false,
      type: 'add',
      form: this.$form.createForm(this, { name: 'handles' }),
      serveUrl: `${Host.uploadImgHost}/building/adv/upload`,
      headers: {
        token: ''
      },
      advertFileList: [],
      advertVisible: false,
      advertImage: '',
      loading: false,
      baseHeadUrl: '',
      loadingIcon: false,
      imageUrl: '',
      valAppletId: false,
      valAppletSign: false,
      valMerchantId: false
    }
  },
  created () {
    this.headers.token = this.token()
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapGetters(['token']),
    init () {
      getApplet().then(res => {
        const result = res.result
        if (result && result.appletId && result.appletSign) {
          this.initForm(result)
          this.type = 'list'
        }
      })
    },
    edit () {
      this.type = 'edit'
    },
    back () {
      this.type = 'list'
      this.init()
    },
    initForm (data) {
      this.valAppletId = (data.appletId !== undefined && data.appletId !== '')
      this.valAppletSign = (data.appletSign !== undefined && data.appletSign !== '')
      this.valMerchantId = (data.merchantId !== undefined && data.merchantId !== '')
      this.form.setFieldsValue({
        appletId: data.appletId,
        appletSign: data.appletSign,
        merchantId: data.merchantId,
        qrCodeUrl: data.qrCodeUrl,
        appletName: data.appletName,
        baseNickName: data.baseNickName
        // dailyCreditLimit: data.dailyCreditLimit
      })
      this.imageUrl = data.baseHeadUrl
      this.baseHeadUrl = data.baseHeadUrl
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleReset () {
      this.form.resetFields()
    },
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          const param = this.form.getFieldsValue()
          param.baseHeadUrl = this.baseHeadUrl
          for (const key in param) {
            param[key] = param[key] ? param[key] : ''
            /* if (key === 'dailyCreditLimit') {
              param[key] = param[key] + ''
            } else {
              param[key] = param[key] ? param[key] : ''
            } */
          }
          upDateApplet(param).then(res => {
            this.loading = false
            if (res.code === 0) {
              this.$message.success(res.msg)
              this.init()
              this.type = 'list'
            } else {
              this.$message.error(res.msg)
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
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
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loadingIcon = false
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .mr10{
    margin 0 10px
  }
  // .uploadLeft{
  //   display: flex;
  //   align-items: center;
  // }
  // .ant-upload-picture-card-wrapper{
  //   width:25%;
  // }
</style>
