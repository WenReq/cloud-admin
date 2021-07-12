<template>
  <div>
    <div class="card-container">
      <div class="card-title">
        <a-row>
          <a-col :span="12">
            大屏数据配置 <span v-if="isEdit" style="font-size:12px;color:#999;margin-left:10px"><a-icon type="info-circle" /> 展示值只可输入数字，不需填写单位；大屏将按配置的展示值显示；最近修改时间：</span>
          </a-col>
          <a-col
            v-if="!isEdit" :span="12" align="right"
          >
            <a-button
              class="mr8" type="primary" icon="reload"
              @click="reload"
            >
              一键恢复
            </a-button>
            <a-button icon="edit" @click="edit">
              配置数值
            </a-button>
          </a-col>
        </a-row>
      </div>
      <div class="card-content">
        <a-table
          class="table-content"
          :columns="columns"
          :row-key="record => record.id"
          :data-source="data"
          :pagination="false"
        >
          <template
            v-for="col in ['showData']"
            :slot="col"
            slot-scope="text, record, index"
          >
            <div v-if="index != 10 && index != 11 && index != 12 && index != 14 && index != 15 && isEdit" :key="col">
              <a-input
                :value="text"
                allow-clear
                style="width:170px;"
                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                @change="e => handleChange(e.target.value, record.id, col)"
              />
            </div>
            <div v-if="index != 10 && index != 11 && index != 12 && index != 14 && index != 15 && !isEdit" :key="col">
              {{ text == '' ? '真实数据' : text }}
            </div>
            <span v-if="index==10" :key="col">
              <div v-for="(item, key) in recycleObj" :key="key" class="list-item">
                <div class="list-label">{{ item.name }}：</div>
                <div class="list-input">
                  <a-input
                    v-if="isEdit"
                    v-model="item.num" allow-clear
                    onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                  />
                  <span v-else-if="item.num == ''">真实数据</span>
                  <span v-else>{{ item.num }}</span>
                </div>
              </div>
            </span>
            <span v-if="index==11" :key="col">
              <div v-for="(item, key) in dustbinObj" :key="key" class="list-item">
                <div class="list-label">{{ item.name }}：</div>
                <div class="list-input">
                  <a-input
                    v-if="isEdit"
                    v-model="item.num" allow-clear
                    onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                  />
                  <span v-else-if="item.num == ''">真实数据</span>
                  <span v-else>{{ item.num }}</span>
                </div>
              </div>
            </span>
            <span v-if="index==12" :key="col">
              <div v-for="(item, key) in visitObj" :key="key" class="list-item">
                <div class="list-label">{{ item.name }}：</div>
                <div class="list-input">
                  <a-input
                    v-if="isEdit"
                    v-model="item.num" allow-clear
                    onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                  />
                  <span v-else-if="item.num == ''">真实数据</span>
                  <span v-else>{{ item.num }}</span>
                </div>
              </div>
            </span>
            <span v-if="index==14" :key="col">
              <div v-for="(item, key) in visitRecycleObj" :key="key" class="list-item">
                <div class="list-label">{{ item.name }}：</div>
                <div class="list-input">
                  <a-input
                    v-if="isEdit"
                    v-model="item.num" allow-clear
                    onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                  />
                  <span v-else-if="item.num == ''">真实数据</span>
                  <span v-else>{{ item.num }}</span>
                </div>
              </div>
            </span>
            <span v-if="index==15" :key="col">
              <div v-for="(item, key) in deviceRecycleObj" :key="key" class="list-item">
                <div class="list-label">{{ item.name }}：</div>
                <div class="list-input">
                  <a-input
                    v-if="isEdit"
                    v-model="item.num" allow-clear
                    onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                  />
                  <span v-else-if="item.num == ''">真实数据</span>
                  <span v-else>{{ item.num }}</span>
                </div>
              </div>
            </span>
          </template>
        </a-table>
      </div>
      <div class="card-content mb40 mt40">
        <a-row type="flex" justify="center">
          <a-col
            v-if="isEdit"
            :span="12" type="flex" align="middle"
            style="text-align:center;"
          >
            <a-button class="mr8" @click="cancel">
              取消
            </a-button>
            <a-button type="primary" @click="save">
              立即生效
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isEdit: false,
      columns: [
        {
          title: '功能模块',
          dataIndex: 'funModule',
          width: '18%',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 0) {
              obj.attrs.rowSpan = 4
            }
            if (index === 4 || index === 21) {
              obj.attrs.rowSpan = 6
            }
            if (index === 10) {
              obj.children = <span> { value } <div class='table-tip'>提示：各品类请按重量填写，若填写了其中一组里的品类则这一组的所有品类必须全部填写！</div></span>
              obj.attrs.rowSpan = 3
            }
            if (index === 13) {
              obj.children = <span> { value } <div class='table-tip'>提示：上门回收量或设备回收量若填写了其中一项里的品类则这一项里的所有品类必须全部填写！</div></span>
              obj.attrs.rowSpan = 3
            }
            if (index === 16) {
              obj.attrs.rowSpan = 5
            }
            if (index === 25 || index === 24 || index === 23 || index === 22 || index === 20 || index === 19 || index === 18 || index === 17 || index === 14 || index === 15 || index === 11 || index === 12 || index === 1 || index === 2 || index === 3 || index === 5 || index === 6 || index === 7 || index === 8 || index === 9 || index === 11) {
              obj.attrs.rowSpan = 0
            }
            return obj
          }
        },
        {
          title: '数据类别',
          dataIndex: 'dataClass',
          width: '40%'
        },
        {
          title: '展示数值',
          dataIndex: 'showData',
          width: '42%',
          scopedSlots: { customRender: 'showData' }
        }
      ],
      data: [
        {
          id: 0,
          funModule: '猫回收数据总览',
          dataClass: '小哥入驻数',
          key: 'brotherNumber',
          showData: ''
        },
        {
          id: 1,
          funModule: '猫回收数据总览',
          dataClass: '回收总量',
          key: 'recoveryWeight',
          showData: ''
        },
        {
          id: 2,
          funModule: '猫回收数据总览',
          dataClass: '回收订单量',
          key: 'recoveryOrderNum',
          showData: ''
        },
        {
          id: 3,
          funModule: '猫回收数据总览',
          dataClass: '结算订单量',
          key: 'settleOrderNum',
          showData: ''
        },
        {
          id: 4,
          funModule: '猫先生数据总览',
          dataClass: '用户数',
          key: 'userNum',
          showData: ''
        },
        {
          id: 5,
          funModule: '猫先生数据总览',
          dataClass: '家庭组',
          key: 'homeGroup',
          showData: ''
        },
        {
          id: 6,
          funModule: '猫先生数据总览',
          dataClass: '可回收物投递总量',
          key: 'recoveryDeliverWeight',
          showData: ''
        },
        {
          id: 7,
          funModule: '猫先生数据总览',
          dataClass: '生活垃圾投递总量',
          key: 'lifeTrashWeight',
          showData: ''
        },
        {
          id: 8,
          funModule: '猫先生数据总览',
          dataClass: '设备数',
          key: 'deviceNum',
          showData: ''
        },
        {
          id: 9,
          funModule: '猫先生数据总览',
          dataClass: '小区数',
          key: 'communityNum',
          showData: ''
        },
        {
          id: 10,
          funModule: '品类占比数据',
          dataClass: '回收站',
          showData: ''
        },
        {
          id: 11,
          funModule: '品类占比数据',
          dataClass: '垃圾箱',
          showData: ''
        },
        {
          id: 12,
          funModule: '品类占比数据',
          dataClass: '上门回收',
          showData: ''
        },
        {
          id: 13,
          funModule: '回收量数据',
          dataClass: '今日订单量',
          key: 'todayOrderNum',
          showData: ''
        },
        {
          id: 14,
          funModule: '回收量数据',
          dataClass: '上门回收量',
          showData: ''
        },
        {
          id: 15,
          funModule: '回收量数据',
          dataClass: '设备回收量',
          showData: ''
        },
        {
          id: 16,
          funModule: '用户数据',
          dataClass: '知晓率',
          key: 'answerRate',
          showData: ''
        },
        {
          id: 17,
          funModule: '用户数据',
          dataClass: '参与率',
          key: 'joinRate',
          showData: ''
        },
        {
          id: 18,
          funModule: '用户数据',
          dataClass: '复投率',
          key: 'repeatRate',
          showData: ''
        },
        {
          id: 19,
          funModule: '用户数据',
          dataClass: '线上注册人数',
          key: 'onlineUserNum',
          showData: ''
        },
        {
          id: 20,
          funModule: '用户数据',
          dataClass: '线下注册人数',
          key: 'offlineUserNum',
          showData: ''
        },
        {
          id: 21,
          funModule: '设备数据',
          dataClass: '设备总台数',
          key: 'deviceTotalNum',
          showData: ''
        },
        {
          id: 22,
          funModule: '设备数据',
          dataClass: '设备正常台数',
          key: 'normalDeviceNum',
          showData: ''
        },
        {
          id: 23,
          funModule: '设备数据',
          dataClass: '设备故障台数',
          key: 'failureDeviceNum',
          showData: ''
        },
        {
          id: 24,
          funModule: '设备数据',
          dataClass: '设备缺币台数',
          key: 'nomoenyDeviceNum',
          showData: ''
        },
        {
          id: 25,
          funModule: '设备数据',
          dataClass: '设备满溢台数',
          key: 'overflowDeviceNum',
          showData: ''
        }
      ],
      visitObj: [
        { type: 'visitCategoryPaper', name: '黄纸板', num: '' },
        { type: 'visitCategoryGlass', name: '玻璃', num: '' },
        { type: 'visitCategorySpin', name: '纺织', num: '' },
        { type: 'visitCategoryPlastic', name: '塑料', num: '' },
        { type: 'visitCategoryMetal', name: '金属', num: '' }
      ],
      dustbinObj: [
        { type: 'dustbinOtherTrash', name: '其他垃圾', num: '' },
        { type: 'dustbinLifeTrash', name: '厨余垃圾', num: '' },
        { type: 'dustbinRecycleTrash', name: '可回收垃圾', num: '' }
      ],
      recycleObj: [
        { type: 'recycleCategoryPaper', name: '纸品', num: '' },
        { type: 'recycleCategoryPlastic', name: '塑料', num: '' },
        { type: 'recycleCategorySpin', name: '纺织', num: '' },
        { type: 'recycleCategoryMetal', name: '金属', num: '' },
        { type: 'recycleCategoryHarmful', name: '有害', num: '' },
        { type: 'recycleCategoryGlass', name: '玻璃', num: '' }
      ],
      visitRecycleObj: [
        { type: 'visitRecyclePaper', name: '纸品', num: '' },
        { type: 'visitRecycleMetal', name: '金属', num: '' },
        { type: 'visitRecycleGlass', name: '玻璃', num: '' },
        { type: 'visitRecycleSpin', name: '纺织', num: '' },
        { type: 'visitRecyclePlastic', name: '塑料', num: '' }
      ],
      deviceRecycleObj: [
        { type: 'deviceRecyclePaper', name: '纸品', num: '' },
        { type: 'deviceRecycleMetal', name: '金属', num: '' },
        { type: 'deviceRecycleGlass', name: '玻璃', num: '' },
        { type: 'deviceRecycleSpin', name: '纺织', num: '' },
        { type: 'deviceRecyclePlastic', name: '塑料', num: '' }
      ]
    }
  },
  watch: {
    isEdit (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          document.getElementsByClassName('table-tip')[0].style.display = 'block'
          document.getElementsByClassName('table-tip')[1].style.display = 'block'
        })
      } else {
        this.$nextTick(() => {
          document.getElementsByClassName('table-tip')[0].style.display = 'none'
          document.getElementsByClassName('table-tip')[1].style.display = 'none'
        })
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleChange (value, id, column) { // 表格input绑定值
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    getList () {
      this.$httpPost(this.$basePath.WallGetList, {})
        .then(res => {
          var data = res.result
          if (!data.length) {
            this.data = [
              {
                id: 0,
                funModule: '猫回收数据总览',
                dataClass: '小哥入驻数',
                key: 'brotherNumber',
                showData: ''
              },
              {
                id: 1,
                funModule: '猫回收数据总览',
                dataClass: '回收总量',
                key: 'recoveryWeight',
                showData: ''
              },
              {
                id: 2,
                funModule: '猫回收数据总览',
                dataClass: '回收订单量',
                key: 'recoveryOrderNum',
                showData: ''
              },
              {
                id: 3,
                funModule: '猫回收数据总览',
                dataClass: '结算订单量',
                key: 'settleOrderNum',
                showData: ''
              },
              {
                id: 4,
                funModule: '猫先生数据总览',
                dataClass: '用户数',
                key: 'userNum',
                showData: ''
              },
              {
                id: 5,
                funModule: '猫先生数据总览',
                dataClass: '家庭组',
                key: 'homeGroup',
                showData: ''
              },
              {
                id: 6,
                funModule: '猫先生数据总览',
                dataClass: '可回收物投递总量',
                key: 'recoveryDeliverWeight',
                showData: ''
              },
              {
                id: 7,
                funModule: '猫先生数据总览',
                dataClass: '生活垃圾投递总量',
                key: 'lifeTrashWeight',
                showData: ''
              },
              {
                id: 8,
                funModule: '猫先生数据总览',
                dataClass: '设备数',
                key: 'deviceNum',
                showData: ''
              },
              {
                id: 9,
                funModule: '猫先生数据总览',
                dataClass: '小区数',
                key: 'communityNum',
                showData: ''
              },
              {
                id: 10,
                funModule: '品类占比数据',
                dataClass: '回收站',
                showData: ''
              },
              {
                id: 11,
                funModule: '品类占比数据',
                dataClass: '垃圾箱',
                showData: ''
              },
              {
                id: 12,
                funModule: '品类占比数据',
                dataClass: '上门回收',
                showData: ''
              },
              {
                id: 13,
                funModule: '回收量数据',
                dataClass: '今日订单量',
                key: 'todayOrderNum',
                showData: ''
              },
              {
                id: 14,
                funModule: '回收量数据',
                dataClass: '上门回收量',
                showData: ''
              },
              {
                id: 15,
                funModule: '回收量数据',
                dataClass: '设备回收量',
                showData: ''
              },
              {
                id: 16,
                funModule: '用户数据',
                dataClass: '知晓率',
                key: 'answerRate',
                showData: ''
              },
              {
                id: 17,
                funModule: '用户数据',
                dataClass: '参与率',
                key: 'joinRate',
                showData: ''
              },
              {
                id: 18,
                funModule: '用户数据',
                dataClass: '复投率',
                key: 'repeatRate',
                showData: ''
              },
              {
                id: 19,
                funModule: '用户数据',
                dataClass: '线上注册人数',
                key: 'onlineUserNum',
                showData: ''
              },
              {
                id: 20,
                funModule: '用户数据',
                dataClass: '线下注册人数',
                key: 'offlineUserNum',
                showData: ''
              },
              {
                id: 21,
                funModule: '设备数据',
                dataClass: '设备总台数',
                key: 'deviceTotalNum',
                showData: ''
              },
              {
                id: 22,
                funModule: '设备数据',
                dataClass: '设备正常台数',
                key: 'normalDeviceNum',
                showData: ''
              },
              {
                id: 23,
                funModule: '设备数据',
                dataClass: '设备故障台数',
                key: 'failureDeviceNum',
                showData: ''
              },
              {
                id: 24,
                funModule: '设备数据',
                dataClass: '设备缺币台数',
                key: 'nomoenyDeviceNum',
                showData: ''
              },
              {
                id: 25,
                funModule: '设备数据',
                dataClass: '设备满溢台数',
                key: 'overflowDeviceNum',
                showData: ''
              }
            ]
            this.visitObj = [
              { type: 'visitCategoryPaper', name: '黄纸板', num: '' },
              { type: 'visitCategoryGlass', name: '玻璃', num: '' },
              { type: 'visitCategorySpin', name: '纺织', num: '' },
              { type: 'visitCategoryPlastic', name: '塑料', num: '' },
              { type: 'visitCategoryMetal', name: '金属', num: '' }
            ]
            this.dustbinObj = [
              { type: 'dustbinOtherTrash', name: '其他垃圾', num: '' },
              { type: 'dustbinLifeTrash', name: '厨余垃圾', num: '' },
              { type: 'dustbinRecycleTrash', name: '可回收垃圾', num: '' }
            ]
            this.recycleObj = [
              { type: 'recycleCategoryPaper', name: '纸品', num: '' },
              { type: 'recycleCategoryPlastic', name: '塑料', num: '' },
              { type: 'recycleCategorySpin', name: '纺织', num: '' },
              { type: 'recycleCategoryMetal', name: '金属', num: '' },
              { type: 'recycleCategoryHarmful', name: '有害', num: '' },
              { type: 'recycleCategoryGlass', name: '玻璃', num: '' }
            ]
            this.visitRecycleObj = [
              { type: 'visitRecyclePaper', name: '纸品', num: '' },
              { type: 'visitRecycleMetal', name: '金属', num: '' },
              { type: 'visitRecycleGlass', name: '玻璃', num: '' },
              { type: 'visitRecycleSpin', name: '纺织', num: '' },
              { type: 'visitRecyclePlastic', name: '塑料', num: '' }
            ]
            this.deviceRecycleObj = [
              { type: 'deviceRecyclePaper', name: '纸品', num: '' },
              { type: 'deviceRecycleMetal', name: '金属', num: '' },
              { type: 'deviceRecycleGlass', name: '玻璃', num: '' },
              { type: 'deviceRecycleSpin', name: '纺织', num: '' },
              { type: 'deviceRecyclePlastic', name: '塑料', num: '' }
            ]
            return
          }
          const newData = [...this.data]
          const visitObj = [...this.visitObj]
          const dustbinObj = [...this.dustbinObj]
          const recycleObj = [...this.recycleObj]
          const visitRecycleObj = [...this.visitRecycleObj]
          const deviceRecycleObj = [...this.deviceRecycleObj]
          data.forEach(item => {
            newData.forEach(val => {
              if (val.key === item.typeKey) {
                val.showData = item.typeValue
              }
            })
            visitObj.forEach(val1 => {
              if (val1.type === item.typeKey) {
                val1.num = item.typeValue
              }
            })
            dustbinObj.forEach(val2 => {
              if (val2.type === item.typeKey) {
                val2.num = item.typeValue
              }
            })
            recycleObj.forEach(val3 => {
              if (val3.type === item.typeKey) {
                val3.num = item.typeValue
              }
            })
            visitRecycleObj.forEach(val4 => {
              if (val4.type === item.typeKey) {
                val4.num = item.typeValue
              }
            })
            deviceRecycleObj.forEach(val5 => {
              if (val5.type === item.typeKey) {
                val5.num = item.typeValue
              }
            })
          })
          console.log(visitObj)
          this.data = newData
          this.visitObj = visitObj
          this.dustbinObj = dustbinObj
          this.recycleObj = recycleObj
          this.visitRecycleObj = visitRecycleObj
          this.deviceRecycleObj = deviceRecycleObj
        })
    },
    save () {
      var tableData = JSON.parse(JSON.stringify(this.data))
      var visitObj = JSON.parse(JSON.stringify(this.visitObj))
      var dustbinObj = JSON.parse(JSON.stringify(this.dustbinObj))
      var recycleObj = JSON.parse(JSON.stringify(this.recycleObj))
      var visitRecycleObj = JSON.parse(JSON.stringify(this.visitRecycleObj))
      var deviceRecycleObj = JSON.parse(JSON.stringify(this.deviceRecycleObj))
      var param = {}
      var wallList = []
      tableData.forEach(item => {
        if (item.key) {
          wallList.push({
            typeName: item.dataClass,
            typeValue: item.showData,
            typeKey: item.key
          })
        }
      })
      visitObj.forEach(item => {
        wallList.push({
          typeName: item.name,
          typeValue: item.num,
          typeKey: item.type
        })
      })
      dustbinObj.forEach(item => {
        wallList.push({
          typeName: item.name,
          typeValue: item.num,
          typeKey: item.type
        })
      })
      recycleObj.forEach(item => {
        wallList.push({
          typeName: item.name,
          typeValue: item.num,
          typeKey: item.type
        })
      })
      visitRecycleObj.forEach(item => {
        wallList.push({
          typeName: item.name,
          typeValue: item.num,
          typeKey: item.type
        })
      })
      deviceRecycleObj.forEach(item => {
        wallList.push({
          typeName: item.name,
          typeValue: item.num,
          typeKey: item.type
        })
      })
      param.wallList = wallList
      param.isEdit = false
      this.$httpPost(this.$basePath.wallEdit, param)
        .then(res => {
          this.$message.success('已生效！')
          this.getList()
          this.isEdit = false
        })
    },
    reload () {
      const self = this
      self.$confirm({
        centered: true,
        title: '是否确定全部恢复成真实数据展示',
        onOk () {
          self.$httpPost(self.$basePath.doEmpty, {})
            .then(res => {
              self.$message.success('一键恢复成功！')
              self.getList()
              self.isEdit = false
            })
        }
      })
    },
    edit () {
      this.isEdit = true
    },
    cancel () {
      this.isEdit = false
      this.getList()
    }
  }
}
</script>

<style lang="stylus" scoped>
.table-tip
  color red
  margin-top 5px
  margin-right 10px
  display none
.list-item
  display flex
  align-items center
  margin 8px 0
  .list-label
    width 90px
</style>
