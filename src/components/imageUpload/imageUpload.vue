<template>
  <div class="myFileList">
    <a-spin :spinning="confirmLoading">
      <a-upload
        list-type="picture-card"
        class="upload-list-inline"
        :file-list="[]"
        :custom-request="uploadImage"
        :before-upload="beforeUpload"
      >
        <a-icon type="plus" />
        <div class="ant-upload-text">
          图片上传
        </div>
      </a-upload>
      <div class="ant-upload-list ant-upload-list-picture">
        <draggable
          class="syllable_ul"
          tag="ul"
          :list="fileList"
          :options="{group:'title', animation:150}"
          :no-transition-on-drag="true"
          @change="change"
        >
          <transition-group type="transition" :name="!drag? 'syll_li' : null" :css="true">
            <div
              v-for="(item, index) in fileList" :key="index + Math.random()"
              class="ant-upload-list-item ant-upload-list-item-done"
              style="display:inline-block;margin-right:10px;width:106px;height:106px;"
            >
              <div class="ant-upload-list-item-info">
                <span>
                  <div class="ant-upload-list-item-thumbnail" style="width:88px;height:88px;">
                    <viewer class="item-img_list" :images="[item.url]">
                      <img :src="item.url" style="width:88px;height:88px;">
                    </viewer>
                  </div>
                  <!-- <div class="ant-upload-list-item-name">
                    {{ item.name }}
                  </div> -->
                </span>
              </div>
              <i
                aria-label="图标: close" tabindex="-1" class="anticon anticon-close"
                @click="removeCoupon(item.uid)"
              >
                <svg
                  viewBox="64 64 896 896" data-icon="close" width="1em"
                  height="1em" fill="currentColor"
                >
                  <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                </svg>
              </i>
            </div>
          </transition-group>
        </draggable>
      </div>
    </a-spin>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'UploadImage',
  components: {
    draggable
  },
  props: {
    limitObj: {
      type: Object,
      default: () => {
        return {
          sheet: 99,
          size: 20
        }
      }
    }
  },
  data () {
    return {
      fileList: [],
      imageId: [],
      files: [],
      a: [],
      confirmLoading: false,
      drag: false
    }
  },
  mounted () {
  },
  methods: {
    clear () {
      this.fileList = []
    },
    initFile (imgList) {
      if (imgList.length) {
        imgList.forEach((val, key) => {
          this.fileList.push({
            uid: '-' + val.id || '-' + val.fileName,
            name: '' + val.fileName,
            status: 'done',
            imgWidth: val.imgWidth,
            imgHeight: val.imgHeight,
            url: val.filePath || val.url
          })
        })
        this.$emit('getFlielist', this.fileList)
      }
    },
    change (evt) {
      this.$emit('draggable', this.fileList)
    },
    beforeUpload (file) {
      if (this.fileList.length >= this.limitObj.sheet) {
        this.$message.error('最多可上传' + this.limitObj.sheet + '张图片！')
        return false
      }
      const isLt = file.size / 1024 / 1024 < this.limitObj.size
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isLt) {
        this.$message.error('每张图片大小不能超过20M！')
        return false
      }
      if (!isType) {
        this.$message.error('请选择png，jpeg，jpg，gif格式图片上传！')
        return false
      }
      return true
    },
    removeCoupon (uid) {
      this.fileList.forEach((val, key) => {
        if (uid === val.uid) {
          this.fileList.splice(key, 1)
          this.$emit('removeCoupon', this.fileList)
        }
      })
    },
    uploadImage (e) {
      this.confirmLoading = true
      const formdata = new FormData()
      formdata.append('file', e.file)
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.$httpPost(this.$basePath.uploadImage, formdata, config)
        .then((res) => {
          this.confirmLoading = false
          this.$message.success('上传成功！')
          const img = new Image()
          img.src = res.result
          var self = this
          img.onload = function () {
            self.fileList.push({
              uid: '-' + e.file.name, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
              fileName: e.file.name, // 文件名
              status: 'done', // 状态有：uploading done error removed
              imgWidth: img.width,
              imgHeight: img.height,
              url: res.result
            })
            self.$emit('getFlielist', self.fileList)
          }
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
  ul
    padding 0
</style>
