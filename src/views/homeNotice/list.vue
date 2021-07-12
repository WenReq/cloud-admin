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
                label="标题"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-input v-model="noticeTitle" allow-clear placeholder="请输入公告标题" />
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="6">
              <a-form-item
                label="发布状态"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
              >
                <a-select
                  v-model="isPush"
                  placeholder="请选择注册来源"
                  class="w100"
                  allow-clear
                  show-search
                  option-filter-prop="children"
                >
                  <a-select-option value="全部">
                    全部
                  </a-select-option>
                  <a-select-option value="0">
                    待发布
                  </a-select-option>
                  <a-select-option value="1">
                    已发布
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="search-item" :span="12" align="right">
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
            公告列表
          </a-col>
          <a-col :span="12" align="right">
            <a-button type="primary" @click="add()">
              添加公告
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
        <template slot="isPush" slot-scope="text, record">
          <span>{{ record.isPush === 0 ? '待发布' : '已发布' }}</span>
        </template>
        <template slot="areaList" slot-scope="text, record">
          <span :title="areaListTitle(record.areaList)">
            <span v-for="(item,index) in record.areaList" :key="index">
              {{ item.areaName }}
              <span v-if="item.areaName && record.areaList.length && (record.areaList.length -1) !== index">、</span>
            </span>
          </span>
        </template>
        <template slot="operate" slot-scope="text,record">
          <a-button
            type="link" size="small"
            @click="edit(text)"
          >
            编辑
          </a-button>
          <a-button
            v-if="record.isPush === 0"
            type="link" size="small"
            @click="issue(text)"
          >
            发布
          </a-button>
          <a-button
            v-if="record.isPush === 1"
            type="link" size="small"
            @click="cancel(text)"
          >
            取消发布
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
      v-model="deleteVisible" ok-text="确定"
      cancel-text="取消" class="comModal" @ok="deleteModal"
    >
      <div class="dlContent">
        <icon-font type="iconShape" class="dlIcon"></icon-font>
        <span class="dlTitle">{{ dlTitle }}提示</span>
        <div class="dlMain">
          {{ dialogMsg }}
        </div>
      </div>
    </a-modal>
    <a-modal
      :title="dialogTil"
      :visible="siteVisiable"
      width="600px"
      class="siteModal"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <!-- <a-form :form="form" @submit="handleOk">
        <a-form-item label="标题名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input
            v-decorator="['titleName', { rules: [{ required: true, message: '请填写公告标题名称' }] }]"
            placeholder="请输入公告标题名称" :max-length="50" allow-clear
          />
        </a-form-item>
        <a-form-item
          label="区域" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }"
        >
          <a-tree-select
            v-decorator="['area', { rules: [{ required: true, message: '请选择省市区' }] }]"
            class="areaSelect"
            :tree-data="treeData"
            :load-data="treeLoadData"
            tree-checkable
            allow-clear
            placeholder="请展开选择具体的区县"
            @treeExpand="onTreeExpand"
            @change="onTreeChange"
          />
        </a-form-item> -->
      <!-- <a-form-item label="区域" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
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
        </a-form-item> -->
      <!-- <a-form-item label="公告内容" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-textarea
            v-decorator="['content']"
            placeholder="请输入回收站点简介" :max-length="50" allow-clear
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form> -->
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-model-item
          label="标题名称" prop="titleName"
        >
          <a-input
            v-model="form.titleName"
            placeholder="请输入公告标题名称" allow-clear
            :max-length="20"
          />
        </a-form-model-item>
        <a-form-model-item
          label="区域" class="areaItem" required prop="area"
        >
          <a-tree-select
            v-model="form.area"
            value=""
            class="areaSelect"
            :tree-data="treeData"
            :load-data="treeLoadData"
            tree-checkable
            allow-clear
            placeholder="请选择省市区"
            @treeExpand="onTreeExpand"
            @change="onTreeChange"
          />
        </a-form-model-item>
        <a-form-model-item
          label="公告内容" prop="content"
        >
          <a-textarea
            v-model="form.content"
            placeholder="请输入回收站点简介" allow-clear
            :max-length="50"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button
          v-if="formStatus === 0"
          type="primary" :loading="confirmLoading"
          html-type="submit" @click="saveLocal"
        >
          保存，暂不发布
        </a-button>
        <a-button
          type="primary" :loading="confirmLoading"
          html-type="submit" @click="handlePush"
        >
          立即发布
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getListData, addAndEdit, del, push } from '@/api/homeNotice.js'
import { getAreaList } from '@/api/common'
import { iconFontComponent, getArea } from '@/components/mixins/mixins.js'
const columns = [{
  title: '适用区域',
  key: 'areaList',
  dataIndex: 'areaList',
  scopedSlots: { customRender: 'areaList' },
  ellipsis: true
}, {
  title: '标题',
  key: 'title',
  dataIndex: 'title',
  ellipsis: true
}, {
  title: '公告内容',
  key: 'content',
  dataIndex: 'content',
  ellipsis: true// 单元格内容根据宽度自动省略。
}, {
  title: '发布状态',
  key: 'isPush',
  dataIndex: 'isPush',
  width: 100,
  scopedSlots: { customRender: 'isPush' }
}, {
  title: '发布时间',
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
      rules: {
        titleName: [
          { required: true, message: '请输入公告标题名称', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择省市区', trigger: 'change' }
        ]
      },
      treeData: [],
      editArea: [],
      isPush: '全部',
      dialogTil: '发布公告',
      dialogMsg: '',
      dlTitle: '',
      noticeTitle: '',
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
      // form: this.$form.createForm(this, { name: 'siteContent' }),
      form: {
        titleName: '',
        area: [],
        content: ''
      },
      headers: {
        token: ''
      },
      areaNames: [],
      pageType: '',
      editId: '',
      selectData: [],
      selectAreaId: [],
      formStatus: 0
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
    this.getTreeArea('', 2)
    this.toSearch()
  },
  methods: {
    ...mapGetters(['token']),
    areaListTitle (list) {
      const newArr = []
      list.forEach(item => {
        newArr.push(item.areaName)
      })
      return newArr.join('、')
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    getTableData (params) {
      this.loading = true
      getListData(params)
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
      const params = { 'title': '', 'isPush': '' }
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      if (this.isPush !== '全部') {
        params.isPush = this.isPush
      }
      if (this.noticeTitle) {
        params.title = this.noticeTitle
      }
      this.getTableData(params)
    },
    toSearch () {
      this.pagination.current = 1
      this.initData()
    },
    resetTable () {
      this.noticeTitle = ''
      this.isPush = '全部'
      const params = { 'title': '', 'isPush': '' }
      params.page = 1
      params.pageSize = this.pagination.pageSize
      this.getTableData(params)
    },
    add () {
      this.siteVisiable = true
      this.treeData = []
      this.pageType = 'add'
      this.dialogTil = '发布公告'
      this.getTreeArea('', 2)
    },
    changeArea (value, options) {
      this.areaNames = []
      if (!options) return
      options.forEach(item => {
        this.areaNames.push(item.name)
      })
    },
    saveLocal (e) {
      this.handleOk(e, 'save')
    },
    handlePush (e) {
      this.handleOk(e, 'push')
    },
    handleOk (e, flag) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {}
          params.areaList = this.selectData
          params.title = this.form.titleName
          params.isPush = flag === 'save' ? '0' : '1'
          params.content = this.form.content
          if (this.pageType === 'edit') {
            params.id = this.editId
          }
          this.confirmLoading = true
          addAndEdit(params).then(res => {
            this.$message.success('添加成功')
            this.siteVisiable = false
            this.confirmLoading = false
            this.$refs.ruleForm.resetFields()
            this.initData()
          }).catch(() => {
            this.confirmLoading = false
          })
        } else {
          return false
        }
      })
    },
    handleCancel (e) {
      this.$refs['ruleForm'].resetFields()
      this.siteVisiable = false
    },
    issue (value) {
      this.deleteVisible = true
      this.delId = value.id
      this.dialogMsg = '是否确定发布此条公告？'
      this.dlTitle = '发布'
    },
    cancel (value) {
      this.deleteVisible = true
      this.delId = value.id
      this.dialogMsg = '是否确定取消发布此条公告？'
      this.dlTitle = '取消发布'
    },
    edit (value) {
      this.formStatus = value.isPush
      this.siteVisiable = true
      this.pageType = 'edit'
      this.dialogTil = '编辑公告'
      this.editId = value.id
      this.treeData = []
      this.getTreeArea('', 2)
      this.editArea = value.areaList
      this.selectData = this.transAreas(value.areaList, 'obj')
      this.selectAreaId = this.transAreas(value.areaList, 'id')
      setTimeout(() => {
        this.$nextTick(() => {
          this.form.titleName = value.title
          this.form.content = value.content
          this.form.area = this.transAreas(value.areaList, 'normal')
        })
      }, 800)
    },
    transAreas (data, flag) {
      if (data) {
        const newArr = []
        data.forEach(item => {
          if (flag === 'normal' && item.areaName) {
            newArr.push(item.areaName.split('市')[1])
          } else if (flag === 'obj' && item.areaName && item.areaId) {
            const obj = {}
            obj.areaName = item.areaName.split('市')[1]
            obj.areaId = item.areaId
            newArr.push(obj)
          } else if (flag === 'id') {
            newArr.push(item.areaId)
          }
        })
        return newArr
      }
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
      this.dialogMsg = '是否确定删除此条公告？'
      this.dlTitle = '删除'
    },
    deleteModal () {
      const params = {}
      params.id = this.delId
      this.deleteVisible = false
      if (this.dlTitle === '删除') {
        del(params).then(res => {
          this.$message.success('删除成功')
          this.initData()
        })
      } else if (this.dlTitle === '发布' || this.dlTitle === '取消发布') {
        params.isPush = this.dlTitle === '发布' ? '1' : '0'
        push(params).then(res => {
          this.$message.success(this.dlTitle === '发布' ? '发布成功' : '取消成功')
          this.initData()
        })
      }
    },
    getTreeArea (id, layer) {
      getAreaList({
        id: id,
        layer: layer
      })
        .then(res => {
          let newData = JSON.parse(JSON.stringify(res.result.data).replace(/name/g, 'title'))
          newData = JSON.parse(JSON.stringify(newData).replace(/id/g, 'value'))
          newData.forEach(item => {
            if (item.layer === 2 || item.layer === 3) {
              item.disabled = true
            }
          })
          this.$nextTick(() => {
            this.treeData = newData
          })
        })
    },
    treeLoadData (treeNode) {
      const _this = this
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) { // 有值了直接渲染
          resolve()
          return
        }
        // 没有值根据当前父节点获取下面子节点并挂在树节点中，添加到对应父节点的children中
        getAreaList({
          id: treeNode.dataRef.value,
          layer: treeNode.dataRef.layer + 1
        })
          .then(res => {
            res.result.data.forEach(item => {
              if (item.layer === 4) {
                this.$set(item, 'isLeaf', true)
              }
            })
            let newData = JSON.parse(JSON.stringify(res.result.data).replace(/name/g, 'title'))
            newData = JSON.parse(JSON.stringify(newData).replace(/id/g, 'value'))
            newData.forEach(item => {
              if (item.layer === 2 || item.layer === 3) {
                item.disabled = true
              }
              if (item.layer === 4) {
                this.editArea.forEach(itemx => {
                  if (itemx.areaName && item.title === itemx.areaName.split('市')[1]) {
                    const vm = this
                    const areas = vm.form.area
                    areas.forEach(function (itemOther, index, arr) {
                      if (itemOther === item.title && vm.selectAreaId.indexOf(item.value) >= 0) {
                        areas.splice(index, 1, item.value)
                      }
                    })
                  }
                })
              }
            })
            treeNode.dataRef.children = newData
            _this.treeData = [..._this.treeData]
          })
        resolve()
      })
    },
    onTreeChange (val, label, extra) {
      if (extra.triggerNode && extra.triggerNode.dataRef && extra.triggerNode.dataRef.children) {
        extra.triggerNode.dataRef.children.forEach(item => {
          const obj = {}
          obj.areaName = item.title
          obj.areaId = item.value
          this.selectData.push(obj)
        })
      } else if (extra.triggerNode && extra.triggerNode.dataRef) {
        const obj = {}
        obj.areaName = extra.triggerNode.dataRef.title
        obj.areaId = extra.triggerNode.dataRef.value
        this.selectData.push(obj)
      } else { // clear
        if (extra.preValue.length) { // add
          const delItemIndex = extra.preValue.findIndex(item => item.value === extra.triggerValue)
          extra.preValue.splice(delItemIndex, 1)
          this.selectData = extra.preValue
        } else { // edit
          const editdelIndex = this.selectData.findIndex(item => item.areaName === extra.triggerValue)
          this.selectData.splice(editdelIndex, 1)
        }
      }
    },
    onTreeExpand (val) {
      if (this.pageType === 'add') {
        this.treeData.forEach((item) => {
          if (item.children) {
            item.children.forEach(value => {
              if (value.layer === 3) {
                val.forEach((thing) => {
                  if (value.value === thing) {
                    value.disabled = false
                  }
                })
              }
            })
          }
        })
        const newArr = []
        this.treeData.forEach((item) => {
          if (item.layer === 2) {
            val.forEach((thing) => {
              if (item.value === thing) {
                if (item.children) {
                  item.children.forEach((it) => {
                    newArr.push(it.disabled)
                  })
                }
              }
            })
          }
        })
        this.treeData.forEach((item) => {
          if (newArr.length !== 0) {
            if (newArr.indexOf(true) === -1) {
              val.forEach((thing) => {
                if (item.value === thing) {
                  item.disabled = false
                }
              })
            }
          }
        })
      }
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
