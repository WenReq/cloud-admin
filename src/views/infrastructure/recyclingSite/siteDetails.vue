<template>
  <div class="siteDetails">
    <div class="commonTitle">
      {{ mainTitle==='查看'?'回收站点信息':'回收站点信息修改' }}
    </div>
    <div class="card-content">
      <a-form :form="form" @submit="handleSubmit">
        <a-row>
          <a-col class="line-item" :span="12">
            <a-form-item
              label="回收站点名称"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-input
                v-decorator="['name', { rules: [{ required: true, message: '请填写回收站点名称' }] }]"
                allow-clear
                :placeholder="mainTitle==='查看'?'':'请输入回收站点名称'" :disabled="mainTitle==='查看'" :max-length="30"
              />
            </a-form-item>
          </a-col>
          <a-col class="line-item" :span="12">
            <a-form-item
              label="站点属性"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-select
                v-decorator="['siteType', {initialValue: 0}]"
                :placeholder="mainTitle==='查看'?'':'请选择站点属性'"
                :disabled="mainTitle==='查看'"
                allow-clear
                show-search
                option-filter-prop="children"
              >
                <a-select-option v-for="item in attributes" :key="item.id">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="line-item" :span="12">
            <a-form-item
              label="负责人"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-input
                v-decorator="['person', { rules: [{ required: true, message: '请填写负责人' }] }]"
                allow-clear
                :placeholder="mainTitle==='查看'?'':'请输入负责人'" :disabled="mainTitle==='查看'" :max-length="5"
              />
            </a-form-item>
          </a-col>
          <a-col class="line-item" :span="12">
            <a-form-item
              label="联系电话"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <div v-if="mainTitle==='查看'" class="commonLine">
                {{ phoneNum }}
                <span v-if="showpn" class="showComplete" @click="showAllPhoneNum()">完整展示</span>
              </div>
              <a-input
                v-else
                v-decorator="['phoneNum', { rules: [{ required: true, message: '请填写联系电话' }, {validator: validatePhoneNum}] }]"
                allow-clear
                :placeholder="mainTitle==='查看'?'':'请输入联系电话'"
                :max-length="11"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="line-item" :span="12">
            <a-form-item
              label="详细地址"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-input
                v-decorator="['address', { rules: [{ required: true, message: '请填写详细地址' }] }]"
                allow-clear
                :placeholder="mainTitle==='查看'?'':'请输入详细地址'" :disabled="mainTitle==='查看'" :max-length="50"
              />
            </a-form-item>
          </a-col>
          <a-col class="line-item" :span="12">
            <a-form-item
              label="简介"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-input
                v-decorator="['summary']"
                allow-clear
                :placeholder="mainTitle==='查看'?'':'请输入简介'" :disabled="mainTitle==='查看'" :max-length="50"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="mainTitle==='查看'">
          <a-col class="line-item" :span="12">
            <a-form-item
              label="创建时间"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <div class="commonLine">
                {{ createTime }}
              </div>
            </a-form-item>
          </a-col>
          <a-col class="line-item" :span="12">
            <a-form-item
              label="创建人"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <div class="commonLine">
                {{ createPerson }}
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="line-item" :span="12">
            <a-form-item
              label="区域"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
            >
              <div class="commonLine">
                {{ areas }}
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="站点照片"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 22 }"
            >
              <div>
                <a-upload
                  ref="siteFileUpload"
                  :action="serveUrl"
                  :headers="headers"
                  :remove="removePicture"
                  list-type="picture-card"
                  :file-list="siteFileList"
                  :before-upload="siteBeforeUpload"
                  :disabled="mainTitle==='查看'"
                  :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: mainTitle!=='查看' }"
                  @preview="handleSitePreview"
                  @change="handleSiteChange"
                >
                  <div v-if="siteFileList.length < 3&&mainTitle!=='查看'">
                    <a-icon type="plus" />
                    <div>
                      上传图片
                    </div>
                  </div>
                  <div v-if="siteFileList.length===0&&mainTitle==='查看'"></div>
                </a-upload>
                <div v-if="mainTitle==='添加'||mainTitle==='编辑'" class="photoWarn">
                  <a-icon type="exclamation-circle" />  站点照片每张大小不超过10M，最多可以上传3张，格式为png，jpeg，jpg。
                </div>
                <a-modal :visible="siteVisible" :footer="null" @cancel="handleSiteCancel">
                  <img class="w100" :src="siteImage">
                </a-modal>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <div class="zhanwei"></div>
          </a-col>
        </a-row>
        <a-row type="flex" justify="center">
          <a-col :span="24">
            <a-form-item v-if="mainTitle==='添加'||mainTitle==='编辑'" :wrapper-col="{ span: 24 }" class="bottomBtn">
              <a-button class="mr16" @click="backPage()">
                取消
              </a-button>
              <a-button type="primary" html-type="submit" :loading="confirmLoading">
                保存
              </a-button>
            </a-form-item>
            <a-form-item v-else-if="mainTitle==='查看'" :wrapper-col="{ span: 24 }" class="bottomBtn">
              <a-button type="primary" @click="backPage()">
                返回
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>
<script>
import Host from '@/config/apiHost'
import { mapGetters } from 'vuex'
import { delPicture } from '@/api/common'
import { editSite, viewSite } from '@/api/recyclingSite'
export default {
  name: 'SiteDetails',
  data () {
    return {
      mainTitle: '',
      form: this.$form.createForm(this, { name: 'siteDetails' }),
      phoneNum: '',
      trueNum: '',
      attributes: [{
        id: 0,
        value: '自营'
      }, {
        id: 1,
        value: '加盟'
      }],
      serveUrl: `${Host.uploadImgHost}/building/adv/upload`,
      headers: {
        token: ''
      },
      siteVisible: false,
      siteImage: '',
      siteFileList: [],
      showpn: true,
      sId: '',
      confirmLoading: false,
      createTime: '',
      createPerson: '',
      areas: ''
    }
  },
  created () {
    this.headers.token = this.token()
    this.mainTitle = this.$route.query.title
    this.sId = this.$route.query.id
  },
  mounted () {
    const params = {}
    params.menuId = '9588905c801e460c892015ed0e243405'
    if (this.sId) {
      params.id = this.sId
    }
    this.getSiteInfo(params)
  },
  methods: {
    ...mapGetters(['token']),
    getSiteInfo (params) {
      viewSite(params)
        .then(res => {
          this.form.setFieldsValue({
            name: res.result.info.name,
            siteType: res.result.info.siteType,
            person: res.result.info.person,
            address: res.result.info.address,
            summary: res.result.info.summary
          })
          if (this.mainTitle === '查看') {
            this.phoneNum = this.formatPhone(res.result.info.phone)
            this.trueNum = res.result.info.phone
          } else if (this.mainTitle === '编辑') {
            this.form.setFieldsValue({
              phoneNum: res.result.info.phone
            })
          }
          const newSite = []
          if (res.result.info.sitePhoto) {
            res.result.info.sitePhoto.forEach((item) => {
              newSite.push({ uid: item, name: item, url: item })
            })
            this.siteFileList = newSite
          }
          if (res.result.info.provinceName && res.result.info.cityName && res.result.info.areaName) {
            this.areas = res.result.info.provinceName + ' / ' + res.result.info.cityName + ' / ' + res.result.info.areaName
          } else if (res.result.info.provinceName && res.result.info.cityName) {
            this.areas = res.result.info.provinceName + ' / ' + res.result.info.cityName
          } else if (res.result.info.provinceName) {
            this.areas = res.result.info.provinceName
          }
          this.createPerson = res.result.info.createUser
          this.createTime = res.result.info.createTime
        })
    },
    validatePhoneNum (rule, value, callback) {
      const reg = /^[1][3-9][0-9]{9}$/
      if (value && !reg.test(value)) {
        callback(new Error('请输入正确的联系电话'))
      } else {
        callback()
      }
    },
    formatPhone (val) {
      return val && val.length > 7 ? val.substr(0, 3) + '****' + val.substr(val.length - 4, 4) : val
    },
    showAllPhoneNum () {
      this.phoneNum = this.trueNum
      this.showpn = false
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {}
          params.id = this.sId
          params.name = values.name
          params.phone = values.phoneNum
          params.siteType = values.siteType
          params.person = values.person
          params.address = values.address
          params.summary = values.summary
          const newSite = []
          this.siteFileList.forEach((item) => {
            if (item.response) {
              newSite.push(item.response.result)
            } else {
              newSite.push(item.url)
            }
          })
          params.sitePhoto = newSite
          params.menuId = '381b159147d8461cbb020bad153118fb'
          this.confirmLoading = true
          editSite(params).then(res => {
            this.confirmLoading = false
            this.$message.success('回收站点信息修改成功')
            this.backPage()
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    backPage () {
      this.$router.push({ path: '/infrastructure/recyclingSite/recyclingSiteList' })
    },
    removePicture (obj) {
      if (this.mainTitle === '查看') {
        return false
      } else {
        if (obj.uid) {
          const params = {}
          params.id = obj.uid
          delPicture(params)
        }
      }
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
.siteDetails
  background-color #fff
  padding 16px 20px 0 20px
  margin-bottom 20px
  font-size 12px
  color #000
  .mr16
    margin-right 16px
  .w100
    width 100%
  .photoWarn
    color #999
    // height 102px
    // line-height 102px
  .commonTitle
    font-size 16px
    font-weight 600
    color #333
  .card-content
    margin-top 16px
    .commonLine
      height 32px
      line-height 32px
      background-color #f2f2f2
      padding 0 11px
      color #333
      font-size 12px
      .showComplete
        color #2F90FF
        font-size 12px
        float right
        cursor pointer
  .bottomBtn
    margin-top 40px
    margin-bottom 40px !important
    text-align center
  .zhanwei
    height 75px
</style>
<style lang="stylus">
.siteDetails
  .card-content
    label
      font-size 12px
    .ant-input, .ant-form-explain
      font-size 12px
    .ant-form-item
      margin-bottom 16px
    .ant-select
      font-size 12px
    .ant-form-item-label
      height 32px
      line-height 32px
    .ant-form-item-control
      height 32px
      line-height 32px
    .ant-upload.ant-upload-select-picture-card
      float left
    .ant-input-disabled, .ant-cascader-picker-disabled, .ant-select-disabled .ant-select-selection
      background-color #f2f2f2
      border 1px solid #f2f2f2
      color #333
      cursor default
      .ant-select-arrow .ant-select-arrow-icon, .ant-cascader-picker-arrow
        display none
  .bottomBtn
    .ant-btn
      border-radius 2px
      font-size 12px
      line-height normal
</style>
