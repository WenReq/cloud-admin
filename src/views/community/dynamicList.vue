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
                label="动态状态"
                v-bind="formItemLayout"
              >
                <a-select
                  v-decorator="['isPublic']"
                  allow-clear
                  placeholder="全部"
                  show-search
                >
                  <a-select-option :value="0">
                    公开
                  </a-select-option>
                  <a-select-option :value="1">
                    不公开
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="发帖位置"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['estateName']"
                  allow-clear placeholder="请输入市或区县名称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="用户昵称"
                v-bind="formItemLayout"
              >
                <a-input
                  v-decorator="['nickname']"
                  allow-clear placeholder="请输入用户昵称"
                />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="发布时间"
                v-bind="formItemLayout"
              >
                <a-range-picker
                  v-model="showTime"
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
        动态看板
      </div>
      <div class="card-content">
        <a-row class="panel-container" type="flex" justify="center">
          <a-col :span="6" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconfabu" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  发布动态总数
                </div>
                <div class="type-num">
                  {{ boardData.totalCount | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="6" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconliulan" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  浏览总数
                </div>
                <div class="type-num">
                  {{ boardData.totalBrowse | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="6" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconzan" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  点赞总数
                </div>
                <div class="type-num">
                  {{ boardData.totalLike | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
          <a-col :span="6" class="height-90">
            <a-row type="flex" align="middle" justify="center">
              <IconFont type="iconpinglun" style="font-size: 40px; margin-right: 10px;" />
              <span>
                <div class="type-name">
                  评论总数
                </div>
                <div class="type-num">
                  {{ boardData.totalCom | numberFl1 }}
                </div>
              </span>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="12">
            动态列表
          </a-col>
          <a-col :span="12" align="right">
            <!-- <a-button @click="batchHide">
              批量隐藏
            </a-button> -->
          </a-col>
        </a-row>
      </div>
      <div class="card-content">
        <a-table
          class="table-content no-header"
          :columns="columns"
          :data-source="data"
          :row-key="record => record.id"
          :loading="loading"
          :pagination="pagination"
          :scroll="{x: 1500}"
          @change="handleTableChange"
        >
          <template slot="td-detail" slot-scope="text, record">
            <div class="td-detail">
              <div class="user-info">
                <div class="user-ico">
                  <a-tooltip>
                    <template slot="title">
                      <div style="font-size:12px">
                        昵称:{{ record.userName }} 手机号:{{ record.cellPhone }}
                      </div>
                    </template>
                    <img :src="record.path" alt="">
                  </a-tooltip>
                </div>
                <div class="user-name">
                  {{ record.userName }}
                </div>
              </div>
              <div class="comments-info">
                <div class="comments-top">
                  <div>
                    <div v-if="record.recommend==1" class="comments-label">
                      HOT
                    </div>
                  </div>
                  <div class="comments-btns">
                    <a-button
                      class="table-btn-link" type="link" size="small"
                      @click="addComent(record)"
                    >
                      添加评论
                    </a-button>
                    <a-button
                      class="table-btn-link" type="link" size="small"
                      @click="manageComent(record)"
                    >
                      评论管理
                    </a-button>
                    <a-button
                      v-if="record.isPublic==0"
                      class="table-btn-link" type="link" size="small"
                      @click="hideDynamic(record)"
                    >
                      隐藏动态
                    </a-button>
                    <a-button
                      v-if="record.isPublic==1"
                      class="table-btn-link" type="link" size="small"
                      @click="publicDynamic(record)"
                    >
                      公开动态
                    </a-button>
                    <a-button
                      v-if="record.recommend==1"
                      class="table-btn-link" type="link" size="small"
                      @click="cancelHot(record)"
                    >
                      取消热门
                    </a-button>
                    <a-button
                      v-if="record.recommend==2"
                      class="table-btn-link" type="link" size="small"
                      @click="recommendHot(record)"
                    >
                      推荐热门
                    </a-button>
                  </div>
                </div>
                <div class="comments-content">
                  {{ record.content }}
                </div>
                <div class="comments-img">
                  <viewer class="item-img_list" :images="record.imgList">
                    <a v-for="(val, key) in record.imgList" :key="key" href="javascript:;">
                      <img class="img-item" :src="val.url">
                    </a>
                  </viewer>
                </div>
                <div class="comments-detail">
                  <div class="detail-left">
                    <span class="left-item">发布时间：{{ record.createDate }}</span>
                    <span class="left-item">状态：{{ record.isPublic==0?'公开':'不公开' }}</span>
                    <span class="left-item">地址：{{ record.estateName }}</span>
                  </div>
                  <div class="detail-right">
                    <div class="right-item">
                      <IconFont type="iconliulan1" /><span class="num">{{ record.browseNum }}</span>
                    </div>
                    <div class="right-item">
                      <IconFont type="icondianzan1" /><span class="num">{{ record.likeNum }}</span>
                    </div>
                    <div class="right-item">
                      <IconFont type="iconpinglun1" /><span class="num">{{ record.comNum }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </a-table>
      </div>
    </div>
    <comfirmModal :dialog-obj="dialogObj" @handleOk="handleOk">
      <span>{{ dialogObj.content }}</span>
    </comfirmModal>
    <a-modal
      :title="comentObj.title"
      centered
      :width="800"
      :mask-closable="false"
      :visible="comentObj.visible"
      @cancel="comentObj.visible = false"
      @ok="comentOk"
    >
      <template slot="footer">
        <a-button @click="comentObj.visible = false">
          取消
        </a-button>
        <a-button v-if="comentObj.type == 'addComent'" type="primary" @click="comentOk">
          保存
        </a-button>
      </template>
      <div v-if="comentObj.type == 'addComent'">
        <a-form ref="searchForm" :form="comentObj.addForm">
          <!-- <a-form-item
            label="使用账号"
            v-bind="comentObj.formItemLayout"
          >
            <a-input
              v-decorator="['nickname']"
              allow-clear placeholder="请输入用户昵称"
            />
          </a-form-item>
          <a-form-item
            label=" 评论属性"
            v-bind="comentObj.formItemLayout"
          >
            <a-radio-group v-decorator="['radio-group']">
              <a-radio value="a">
                公开
              </a-radio>
              <a-radio value="b">
                私信
              </a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item
            label="评论内容"
            v-bind="comentObj.formItemLayout"
          >
            <a-textarea
              v-decorator="['content', {rules: [{required: true, message: '请填写评论内容'}]}]"
              placeholder="请填写评论内容"
              :autosize="{ minRows: 4, maxRows: 6 }"
            />
          </a-form-item>
        </a-form>
      </div>
      <div v-if="comentObj.type == 'manageComent'">
        <a-table
          class="table-content"
          :columns="comentObj.columns"
          :data-source="comentObj.data"
          :row-key="record => record.id"
          :loading="comentObj.loading"
          :pagination="comentObj.pagination"
          @change="handleTableChangecom"
        >
          <template slot="operate" slot-scope="text, record">
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="delComent(record)"
            >
              删除
            </a-button>
            <a-button
              class="table-btn-link" type="link" size="small"
              @click="replyComent(record)"
            >
              回复
            </a-button>
          </template>
          <template slot="comuname" slot-scope="text, record">
            {{ text }} <span v-if="record.userId == comentObj.userId">(发帖人)</span>
          </template>
          <template slot="reuname" slot-scope="text, record">
            {{ text }} <span v-if="record.toUser == comentObj.userId">(发帖人)</span>
          </template>
        </a-table>
      </div>
    </a-modal>
    <comfirmModal :dialog-obj="delObj" @handleOk="handleDelOk">
      <span>{{ delObj.content }}</span>
    </comfirmModal>
    <a-modal
      title="添加评论回复"
      :visible="replyObj.visible"
      :mask-closable="false"
      centered
      ok-text="保存"
      @cancel="replyObj.visible = false"
      @ok="replyOK"
    >
      <a-form ref="searchForm" :form="replyObj.addForm">
        <a-form-item
          label="回复内容"
          v-bind="replyObj.formItemLayout"
        >
          <a-textarea
            v-decorator="['content', {rules: [{required: true, message: '请填写回复内容'}]}]"
            placeholder="请填写回复内容"
            :autosize="{ minRows: 4, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import comfirmModal from '@/components/commonModal/comfirmModal.vue'
import { getArea, getEstate, iconFontComponent } from '@/components/mixins/mixins.js'
export default {
  components: { comfirmModal },
  mixins: [getArea, getEstate, iconFontComponent],
  data () {
    return {
      areas: [],
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      form: this.$form.createForm(this),
      showTime: [],
      boardData: {},
      columns: [
        {
          title: '',
          dataIndex: 'id',
          scopedSlots: { customRender: 'td-detail' }
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
        visible: false,
        iconType: 'question-circle',
        title: '',
        content: ''
      },
      comentObj: {
        title: '',
        visible: false,
        type: '',
        addForm: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 17 }
        },
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
        columns: [
          {
            title: '评论时间',
            dataIndex: 'createDate'
          },
          {
            title: '评论人',
            dataIndex: 'comuname',
            scopedSlots: { customRender: 'comuname' }
          },
          {
            title: '被回复人',
            dataIndex: 'reuname',
            scopedSlots: { customRender: 'reuname' }
          },
          {
            title: '评论内容',
            dataIndex: 'content'
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'operate' }
          }
        ],
        data: []
      },
      delObj: {
        visible: false,
        iconType: 'question-circle',
        title: '是否确定删除评论',
        content: ''
      },
      replyObj: {
        visible: false,
        addForm: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 17 }
        }
      }
    }
  },
  mounted () {
    this.getArea('', 2, null, true)
    this.getEstate()
    this.getBoardData()
    this.getTableData()
  },
  methods: {
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    toSearch () {
      this.pagination.current = 1
      this.getBoardData()
      this.getTableData()
    },
    getBoardData () {
      var param = this.form.getFieldsValue()
      param.province = this.areas[0]
      param.city = this.areas[1]
      param.area = this.areas[2]
      if (this.showTime.length) {
        param.startTime = new Date(this.showTime[0].format('YYYY/MM/DD') + ' 00:00:00').getTime()
        param.endTime = new Date(this.showTime[1].format('YYYY/MM/DD') + ' 23:59:59').getTime()
      }
      this.$httpPost(this.$basePath.findDynamicTotal, param)
        .then(res => {
          this.boardData = res.result
        })
    },
    getTableData () {
      var param = this.form.getFieldsValue()
      param.page = this.pagination.current
      param.pageSize = this.pagination.pageSize
      param.province = this.areas[0]
      param.city = this.areas[1]
      param.area = this.areas[2]
      if (this.showTime.length) {
        param.startTime = new Date(this.showTime[0].format('YYYY/MM/DD') + ' 00:00:00').getTime()
        param.endTime = new Date(this.showTime[1].format('YYYY/MM/DD') + ' 23:59:59').getTime()
      }
      this.loading = true
      this.$httpPost(this.$basePath.findList, param)
        .then(res => {
          this.loading = false
          this.data = res.result.list
          this.pagination.total = res.result.totalCount
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getTableData()
    },
    handleTableChangecom (pagination, filters, sorter) {
      this.pagination.pageSize = pagination.pageSize
      this.pagination.current = pagination.current
      this.getComList()
    },
    addComent (record) {
      this.comentObj.type = 'addComent'
      this.comentObj.visible = true
      this.comentObj.id = record.id
      this.comentObj.title = '添加评论'
      this.comentObj.addForm.resetFields()
    },
    manageComent (record) {
      this.comentObj.type = 'manageComent'
      this.comentObj.visible = true
      this.comentObj.title = '评论及回复管理'
      this.comentObj.id = record.id
      this.comentObj.userId = record.userId
      this.getComList()
    },
    getComList () {
      this.comentObj.loading = true
      this.$httpPost(this.$basePath.getComList, {
        dynamicId: this.comentObj.id,
        page: this.comentObj.pagination.current,
        pageSize: this.comentObj.pagination.pageSize
      })
        .then(res => {
          this.comentObj.loading = false
          this.comentObj.data = res.result.list
          this.comentObj.pagination.total = res.result.totalCount
        })
        .catch(() => {
          this.comentObj.loading = false
        })
    },
    delComent (record) {
      this.delObj.visible = true
      this.delObj.id = record.id
    },
    handleDelOk () {
      this.$httpPost(this.$basePath.deleteComment, {
        id: this.delObj.id
      })
        .then(res => {
          this.$message.success('删除成功！')
          this.delObj.visible = false
          this.getComList()
        })
        .catch(err => {
          if (err === '该条评论已被删除') {
            this.delObj.visible = false
            this.getComList()
          }
          if (err === '该动态已被删除') {
            this.delObj.visible = false
            this.comentObj.visible = false
            this.getTableData()
          }
        })
    },
    replyComent (record) {
      this.replyObj.visible = true
      this.replyObj.id = record.id
      this.replyObj.userId = record.userId
      this.replyObj.dynamicId = record.dynamicId
      this.replyObj.addForm.resetFields()
    },
    replyOK () {
      this.replyObj.addForm.validateFields(err => {
        if (!err) {
          var param = this.replyObj.addForm.getFieldsValue()
          param.id = this.replyObj.id
          param.userId = '0574fff9455940eeb93cbbf8771cc217'
          param.toUser = this.replyObj.userId
          param.dynamicId = this.replyObj.dynamicId
          this.$httpPost(this.$basePath.insertComment, param)
            .then(res => {
              this.$message.success('回复成功！')
              this.replyObj.visible = false
              this.getComList()
            })
            .catch(err => {
              if (err === '该条评论已被删除') {
                this.delObj.visible = false
                this.getComList()
              }
              if (err === '该动态已被删除') {
                this.delObj.visible = false
                this.comentObj.visible = false
                this.getTableData()
              }
            })
        }
      })
    },
    comentOk () {
      if (this.comentObj.type === 'addComent') {
        this.comentObj.addForm.validateFields(err => {
          if (!err) {
            var param = this.comentObj.addForm.getFieldsValue()
            param.dynamicId = this.comentObj.id
            param.userId = '0574fff9455940eeb93cbbf8771cc217'
            param.toUser = 1
            this.$httpPost(this.$basePath.insertComment, param)
              .then(res => {
                this.$message.success('添加评论成功！')
                this.comentObj.visible = false
                this.getTableData()
              })
              .catch(err => {
                if (err === '该动态已被删除') {
                  this.comentObj.visible = false
                  this.getTableData()
                }
              })
          }
        })
      }
    },
    hideDynamic (record) {
      this.dialogObj.visible = true
      this.dialogObj.title = '是否确定隐藏动态'
      this.dialogObj.type = 'hideDynamic'
      this.dialogObj.id = record.id
    },
    publicDynamic (record) {
      this.dialogObj.visible = true
      this.dialogObj.title = '是否确定公开此社区动态'
      this.dialogObj.type = 'publicDynamic'
      this.dialogObj.id = record.id
    },
    cancelHot (record) {
      this.dialogObj.visible = true
      this.dialogObj.title = '是否确定取消此热门推荐'
      this.dialogObj.type = 'cancelHot'
      this.dialogObj.id = record.id
    },
    recommendHot (record) {
      this.dialogObj.visible = true
      this.dialogObj.title = '是否确定推荐此动态为热门'
      this.dialogObj.type = 'recommendHot'
      this.dialogObj.id = record.id
    },
    handleOk () {
      if (this.dialogObj.type === 'hideDynamic') {
        this.$httpPost(this.$basePath.updateIsPublic, {
          id: this.dialogObj.id,
          isPublic: 1
        })
          .then(res => {
            this.$message.success('隐藏成功！')
            this.dialogObj.visible = false
            this.getTableData()
          })
      }
      if (this.dialogObj.type === 'publicDynamic') {
        this.$httpPost(this.$basePath.updateIsPublic, {
          id: this.dialogObj.id,
          isPublic: 0
        })
          .then(res => {
            this.$message.success('公开成功！')
            this.dialogObj.visible = false
            this.getTableData()
          })
      }
      if (this.dialogObj.type === 'cancelHot') {
        this.$httpPost(this.$basePath.updateRecommend, {
          id: this.dialogObj.id,
          recommend: 2
        })
          .then(res => {
            this.$message.success('取消成功！')
            this.dialogObj.visible = false
            this.getTableData()
          })
      }
      if (this.dialogObj.type === 'recommendHot') {
        this.$httpPost(this.$basePath.updateRecommend, {
          id: this.dialogObj.id,
          recommend: 1
        })
          .then(res => {
            this.$message.success('推荐成功！')
            this.dialogObj.visible = false
            this.getTableData()
          })
      }
    },
    resetForm () {
      this.form.resetFields()
      this.areas = []
      this.showTime = []
    }
  }
}
</script>

<style lang="stylus" scoped>
.no-header
  >>>.ant-table-thead
    tr
      th
        height 0
.td-detail
  display flex
  .comments-info
    flex 1
    margin 17px 20px 18px 0
    .comments-detail
      display flex
      justify-content space-between
      color #999999
      font-size 12px
      .detail-left
        .left-item
          margin-right 15px
      .detail-right
        margin-right 10px
        display flex
        .right-item
          position relative
        .right-item:not(:last-child)
          margin-right 30px
          &:after
            position absolute
            right -15px
            top 50%
            transform translateY(-50%)
            content ''
            width 1px
            height 80%
            background #E8E8E8
        .num
          margin-left 8px
    .comments-img
      overflow hidden
      .img-item
        float left
        width 100px
        height 60px
        margin 0 12px 12px 0
        img
          width 100%
          height 100%
    .comments-content
      color #666666
      font-size 12px
      padding-right 10px
      margin-bottom 10px
    .comments-top
      display flex
      justify-content space-between
      .comments-label
        width 36px
        height 16px
        line-height 16px
        border-radius 2px
        background-color #F2F2F2
        text-align center
        color #F22635
        font-size 12px
  .user-info
    width 80px
    display flex
    flex-direction column
    justify-content center
    align-items center
    margin 10px 10px 10px 0
    .user-ico
      width 40px
      height 40px
      border-radius 50%
      overflow hidden
      margin-bottom 10px
      img
        width 100%
        height 100%
.panel-container
  margin-top 8px
  margin-bottom 25px
.height-90
  height 90px
  position relative
  &.large
    width 18%
  &:not(:last-child)::after
    position absolute
    right 0
    top 50%
    transform translateY(-50%)
    content ''
    display block
    width 1px
    height 58px
    background-color #F2F2F2
  &.data
    background-color #F4F5F7
    border-radius 4px
    &::after
      width 0
      height 0
  .type-name
    color #666666
    font-size 12px
    margin-top 16px
    display flex
    align-items center
    justify-content center
    text-align center
    .type-icon
      width 8px
      height 8px
      border-radius 4px
      margin-right 5px
  .type-num
    font-size 24px
    color #333333
    margin-top 8px
    text-align center
</style>
