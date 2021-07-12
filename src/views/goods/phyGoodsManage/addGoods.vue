<template>
  <div>
    <a-form ref="addForm" :form="form" class="detail-form">
      <div class="card-container">
        <div class="card-title">
          实物商品配置
        </div>
        <div class="card-title subtitle">
          基础信息
        </div>
        <div class="card-content">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="商品名称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="[
                    'giftname',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请填写商品名称',
                        }
                      ]
                    }
                  ]"
                  placeholder="请填写商品名称"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="商户名称"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="[
                    'shop',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择商户名称',
                        }
                      ]
                    }
                  ]"
                  placeholder="请选择商户名称"
                >
                  <a-select-option v-for="(item, index) in merchantList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="商品简述"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['content']"
                  placeholder="请填写商品简述"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="商品价格"
                v-bind="formItemLayout"
              >
                <a-radio-group
                  v-model="shopType" name="radioGroup"
                  @change="changeShopType"
                >
                  <a-radio value="5">
                    环保值
                  </a-radio>
                  <a-input-number
                    v-if="shopType == '5'"
                    v-decorator="[
                      'integral',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入环保值'
                          }
                        ]
                      }
                    ]"
                    placeholder="输入环保值"
                    style="width: 100px; margin-right: 10px;"
                    :min="0"
                    :max="99999999"
                    @keyup="handleInteger"
                  />
                  <a-radio value="6">
                    金额
                  </a-radio>
                  <a-input-number
                    v-if="shopType == '6'"
                    v-decorator="[
                      'integral',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入金额',
                          }
                        ]
                      }
                    ]"
                    :min="0"
                    :max="99999999"
                    placeholder="输入金额"
                    style="width: 100px;"
                    @keyup="handleInteger2"
                  />
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="商品类目"
                v-bind="formItemLayout"
              >
                <a-cascader
                  v-decorator="['categoryId']"
                  :change-on-select="false"
                  :options="optionsItem"
                  :load-data="loadDataItem"
                  :field-names="{
                    label: 'name',
                    value: 'id',
                    children: 'children'
                  }"
                  placeholder="请选择商品类目"
                  @change="onChange"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="商品库存"
                v-bind="formItemLayout"
              >
                <a-input-number
                  v-decorator="[
                    'stockcount',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请填写库存',
                        }
                      ]
                    }
                  ]"
                  :min="1" :max="9999999"
                  placeholder="填写库存"
                  style="width: 100%; border-radius: 2px;"
                  @keyup="handleInteger"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="商品标签"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['label']"
                  mode="multiple"
                  placeholder="请选择商品标签，每个位置只可选一个"
                  allow-clear
                >
                  <a-select-opt-group v-for="(item, index) in labelList" :key="index">
                    <span slot="label">{{ item[0].position==0?'商品标题':'主图角标' }}</span>
                    <a-select-option v-for="(val, key) in item" :key="key" :value="val.id">
                      {{ val.name }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="运费模式"
                v-bind="formItemLayout"
              >
                <a-radio-group
                  v-decorator="['isPostage', {initialValue: '1'}]"
                  name="radioGroup"
                >
                  <a-radio value="1">
                    包邮
                  </a-radio>
                  <a-radio value="2">
                    到付
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="20">
              <a-form-item
                :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }"
              >
                <span slot="label"><span style="margin-right: 4px; font-size: 14px; color: #f5222d; line-height: 1;font-family: SimSun, sans-serif;">*</span>商品图片</span>
                <imageUpload
                  ref="goodsUpload"
                  :limit-obj="{
                    sheet: 6,
                    size: 20
                  }"
                  @getFlielist="getFlielistGoods"
                  @draggable="handleGoods"
                  @removeCoupon="goodsDel"
                />
                <div class="upload-tip">
                  <a-icon class="tip-icon" type="info-circle" />上传图片的最佳尺寸：800px*785px，其他尺寸会影响页效果，格式png，jpeg，jpg。每张大小不超过20M，商品图片一共可以上传6张，拖动图片可更换顺序，默认第一张为主图封面。
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="20">
              <a-form-item
                label="商品详情"
                :label-col="{ span: 3 }" :wrapper-col="{ span: 19 }"
              >
                <imageUpload
                  ref="detailUpload"
                  :limit-obj="{
                    sheet: 3,
                    size: 50
                  }"
                  @getFlielist="getFlielistDetail"
                  @draggable="handleDetail"
                  @removeCoupon="detailDel"
                />
                <div class="upload-tip">
                  <a-icon class="tip-icon" type="info-circle" />上传图片格式png，jpeg，jpg。每张大小不超过50M，按上传顺序显示，拖动图片可更换顺序。
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div class="card-title subtitle">
          商品运营
        </div>
        <div class="card-content">
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="起购数量"
                v-bind="formItemLayout"
              >
                <a-input-number
                  v-decorator="['buyNum']"
                  :min="1" :max="99999"
                  placeholder="请填写数量，不填默认为1"
                  style="width: 100%; border-radius: 2px;"
                  @keyup="handleInteger"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="限购"
                v-bind="formItemLayout"
              >
                <a-radio-group
                  v-model="isRestraint" name="radioGroup"
                >
                  <a-radio :value="1">
                    不限购
                  </a-radio>
                  <a-radio :value="2">
                    每人限购
                  </a-radio>
                  <a-input-number
                    v-if="isRestraint == 2"
                    v-decorator="['restrictNum']"
                    :min="1" :max="99999"
                    placeholder="输入数量"
                    style="width: 90px; border-radius: 2px;"
                    @keyup="handleInteger"
                  />
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="售卖区域"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['region']"
                  mode="multiple"
                  show-search
                  allow-clear
                  placeholder="请输入搜索选择指定售卖城市，不选默认为全国"
                >
                  <a-select-option v-for="(item, index) in cityList" :key="index + Math.random()" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="展示顺序"
                v-bind="formItemLayout"
              >
                <a-input-number
                  v-decorator="['weights']"
                  :min="1"
                  placeholder="请输入展示顺序，不填默认为1并排序最后"
                  style="width: 100%; border-radius: 2px;"
                  @keyup="handleInteger"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="上架时间"
                v-bind="formItemLayout"
              >
                <a-radio-group
                  v-model="upperShelf"
                  name="radioGroup"
                  @change="changeUpper"
                >
                  <a-radio :value="0">
                    立即上架
                  </a-radio>
                  <a-radio :value="1">
                    放入仓库
                  </a-radio>
                  <a-radio :value="2">
                    自定义
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="下架时间"
                v-bind="formItemLayout"
              >
                <a-radio-group
                  v-model="downShelf"
                  name="radioGroup"
                  @change="changeDown"
                >
                  <a-radio :value="0">
                    库存为0自动下架
                  </a-radio>
                  <a-radio :value="1">
                    自定义
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                v-if="showUpper"
                label="设定上架时间"
                v-bind="formItemLayout"
              >
                <a-date-picker
                  v-decorator="[
                    'registerDate',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择上架时间',
                        }
                      ]
                    }]"
                  format="YYYY-MM-DD HH:mm:ss"
                  :disabled-date="disabledDate"
                  :show-time="{ defaultValue: moment() }"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                v-if="showDown"
                label="设定下架时间"
                v-bind="formItemLayout"
              >
                <a-date-picker
                  v-decorator="[
                    'outDate',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请选择下架时间',
                        }
                      ]
                    }]"
                  format="YYYY-MM-DD HH:mm:ss"
                  :disabled-date="disabledDate"
                  :show-time="{ defaultValue: moment() }"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div class="card-content mb40 mt40">
          <a-row type="flex" justify="center">
            <a-col
              :span="12" type="flex" align="middle"
              style="text-align:center;"
            >
              <a-button
                v-if="$route.name === 'addGoods'" class="mr8"
                @click="reset"
              >
                重置
              </a-button>
              <a-button v-else class="mr8" @click="back">
                返回
              </a-button>
              <a-button
                type="primary"
                @click="save"
              >
                保存
              </a-button>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script>
import imageUpload from '@/components/imageUpload/imageUpload.vue'
import moment from 'moment'
export default {
  components: { imageUpload },
  data () {
    return {
      form: this.$form.createForm(this, { name: 'addForm' }),
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
      },
      merchantList: [],
      shopType: '5',
      isRestraint: 1,
      upperShelf: 0,
      downShelf: 0,
      showUpper: false,
      showDown: false,
      fileListGoods: [],
      fileListDetail: [],
      fileList: [],
      imageUrl: '',
      loading: false,
      optionsItem: [],
      labelList: [],
      allLabel: [],
      cityList: []
    }
  },
  mounted () {
    this.getMerchant()
    this.getCategory(0, 1)
    this.getLabel()
    this.getCityList()
    if (this.$route.name === 'houseEdit' || this.$route.name === 'groundEdit') {
      this.getDetail()
    }
  },
  methods: {
    onChange (value) {
      if (value.length <= 1) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            categoryId: []
          })
        })
      }
    },
    handleInteger (e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '')
    },
    handleInteger2 (e) {
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    getDetail () {
      this.$httpPost(this.$basePath.getList, {
        id: this.$route.query.id
      })
        .then(res => {
          this.shopType = res.result.list[0].shopType + ''
          this.form.setFieldsValue({
            giftname: res.result.list[0].giftname,
            shop: res.result.list[0].shop,
            content: res.result.list[0].content,
            integral: res.result.list[0].integral,
            categoryId: [res.result.list[0].first, res.result.list[0].second],
            stockcount: res.result.list[0].stockcount,
            label: res.result.list[0].label,
            isPostage: res.result.list[0].isPostage + '',
            buyNum: res.result.list[0].buyNum,
            weights: +res.result.list[0].weights
          })
          if (res.result.list[0].region.length > 0) {
            this.form.setFieldsValue({
              region: res.result.list[0].region.split(',')
            })
          }
          this.isRestraint = +res.result.list[0].isRestraint
          if (res.result.list[0].state === 1) this.upperShelf = 0
          if (res.result.list[0].state === 2) this.upperShelf = 1
          if (res.result.list[0].registerDate && res.result.list[0].state === 2) {
            this.upperShelf = 2
            this.showUpper = true
            this.$nextTick(() => {
              this.form.setFieldsValue({
                registerDate: moment(res.result.list[0].registerDate)
              })
            })
          }
          if (!res.result.list[0].outDate) this.downShelf = 0
          if (res.result.list[0].outDate) {
            this.downShelf = 1
            this.showDown = true
            this.$nextTick(() => {
              this.form.setFieldsValue({
                outDate: moment(res.result.list[0].outDate)
              })
            })
          }
          if (res.result.list[0].labelList.length > 0) {
            const newOptions = JSON.parse(JSON.stringify([...this.optionsItem]))
            newOptions.forEach(item => {
              this.$httpPost(this.$basePath.getCategory, {
                pid: item.id
              })
                .then(res => {
                  this.$set(item, 'children', res.result)
                })
            })
            this.optionsItem = newOptions
            setTimeout(() => {
              var label = []
              res.result.list[0].labelList.forEach(item => {
                label.push(item.id)
              })
              this.form.setFieldsValue({
                label: label
              })
              if (this.isRestraint === 2) {
                this.form.setFieldsValue({
                  restrictNum: +res.result.list[0].restrictNum
                })
              }
            }, 500)
          }
          this.$refs.goodsUpload.initFile(res.result.list[0].imageList)
          this.$refs.detailUpload.initFile(res.result.list[0].detailsImgList)
        })
    },
    changeShopType () {
      this.form.setFieldsValue({ 'integral': undefined })
    },
    getFlielistGoods (e) {
      this.fileListGoods = e
    },
    getFlielistDetail (e) {
      this.fileListDetail = e
    },
    handleGoods (e) {
      this.fileListGoods = e
    },
    goodsDel (e) {
      this.fileListDetail = e
    },
    handleDetail (e) {
      this.fileListGoods = e
    },
    detailDel (e) {
      this.fileListDetail = e
    },
    getMerchant () {
      this.$httpPost(this.$basePath.getMerchant, {})
        .then(res => {
          this.merchantList = res.result
        })
    },
    getLabel () {
      this.$httpPost(this.$basePath.getLabel, {})
        .then(res => {
          let arr = []
          const [arr1, arr2] = [[], []]
          this.allLabel = res.result
          res.result.forEach(item => {
            if (item.position === 1) {
              arr1.push(item)
            }
            if (item.position === 0) {
              arr2.push(item)
            }
          })
          arr = [arr1, arr2]
          this.labelList = arr
        })
    },
    loadDataItem (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getCategory(targetOption.id, 2, targetOption)
    },
    getCityList () {
      this.$httpPost(this.$basePath.getCityList, {})
        .then(res => {
          this.cityList = res.result
        })
    },
    getCategory (id, level, targetOption) {
      this.$httpPost(this.$basePath.getCategory, {
        pid: id
      })
        .then(res => {
          if (level === 1) {
            res.result.forEach(item => {
              item.isLeaf = false
            })
            this.optionsItem = res.result
          } else {
            this.$set(targetOption, 'children', res.result)
          }
        })
    },
    moment,
    changeUpper () {
      if (this.upperShelf === 2) {
        this.showUpper = true
      } else {
        this.showUpper = false
      }
    },
    changeDown () {
      if (this.downShelf === 1) {
        this.showDown = true
      } else {
        this.showDown = false
      }
    },
    disabledDate (current) {
      // 不能选今天和今天之前的日期
      return current && current < moment()
    },
    handleRemove (file) {
      this.fileList.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.fileList.splice(index, 1)
        }
      })
    },
    handleChange ({ file, fileList }) {
      if (this.fileList.length >= 3) {
        return false
      }
      var formdata = new FormData()
      formdata.append('file', file)
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.$httpPost(this.$basePath.uploadImage, formdata, config)
        .then(res => {
          this.$message.success('上传成功！')
          fileList.forEach(item => {
            if (item.uid === file.uid) {
              Object.assign(item, {
                url: res.result
              })
            }
          })
          this.fileList = fileList
        })
    },
    save () {
      var label = this.form.getFieldValue('label')
      var isRepeat = false
      label && label.length && this.labelList.forEach(item1 => {
        var step = 0
        item1.forEach(item2 => {
          label.forEach(item3 => {
            if (item3 === item2.id) {
              step += 1
            }
          })
        })
        if (step > 1) {
          isRepeat = true
        }
      })
      if (isRepeat) {
        this.$message.warning('商品标签每种标签只可选择一个！')
        return
      }
      var param = JSON.parse(JSON.stringify(this.form.getFieldsValue()))
      param.shopType = this.shopType
      param.categoryId && param.categoryId.length ? param.categoryId = param.categoryId[1] : ''
      param.buyNum ? param.buyNum : param.buyNum = 1
      param.isRestraint = this.isRestraint
      param.region && param.region.length ? param.region = param.region.join(',') : ''
      this.upperShelf === 0 ? param.state = 1 : param.state = 2
      param.registerDate ? param.registerDate = moment(param.registerDate).format('YYYY-MM-DD HH:mm:ss') : ''
      param.outDate ? param.outDate = moment(param.outDate).format('YYYY-MM-DD HH:mm:ss') : ''
      if (!param.weights) param.weights = 1
      if (!this.fileListGoods.length) {
        this.$message.warning('请上传商品图片！')
        return
      } else {
        param.imageList = this.fileListGoods
      }
      if (this.fileListDetail.length) {
        param.detailsImgList = this.fileListDetail
      }
      if (this.$route.query.id) {
        param.id = this.$route.query.id
      }
      this.form.validateFields(err => {
        if (!err) {
          this.$httpPost(this.$basePath.merchantEdit, param)
            .then(res => {
              this.$message.success('操作成功')
              if (this.upperShelf === 0) {
                this.$router.push({
                  path: '/goods/phyGoodsManage/groundGoods'
                })
              } else {
                this.$router.push({
                  path: '/goods/phyGoodsManage/houseGoods'
                })
              }
            })
        }
      })
    },
    back () {
      this.$router.go(-1)
    },
    reset () {
      this.form.resetFields()
      this.$refs.goodsUpload.clear()
      this.$refs.detailUpload.clear()
      this.shopType = 5
      this.isRestraint = 1
      this.upperShelf = 0
      this.downShelf = 0
      this.showDown = false
      this.showUpper = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-title.subtitle
  font-size 14px
.upload-tip
  font-size 12px
  color #999999
  .tip-icon
    margin-right 6px
</style>
