
const getMarkList = { // 获取设备型号
  data () {
    return {
      markList: []
    }
  },
  methods: {
    getMarkList () {
      this.$httpPost(this.$basePath.findMarkList)
        .then(res => {
          this.markList = res.result
        })
    }
  }
}

const getGroupMark = { // 获取设备组型号
  data () {
    return {
      groupMarkList: []
    }
  },
  methods: {
    getGroupMark () {
      this.$httpPost(this.$basePath.findAllGroupMark)
        .then(res => {
          this.groupMarkList = res.result
        })
    }
  }
}

const getArea = { // 获取省市区、街道
  data () {
    return {
      options: []
    }
  },
  methods: {
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption)
    },
    loadDataNoStreet (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.getArea(targetOption.id, targetOption.layer + 1, targetOption, true)
    },
    getArea (id, layer, targetOption, notStreet) {
      this.$httpPost(this.$basePath.getArea, {
        id: id,
        layer: layer
      })
        .then(res => {
          res.result.data.forEach(item => {
            if (notStreet) {
              if (layer !== 4) {
                this.$set(item, 'isLeaf', false)
              }
            } else {
              if (layer !== 5) {
                this.$set(item, 'isLeaf', false)
              }
            }
          })
          if (layer === 2) {
            this.options = res.result.data
          } else {
            if (targetOption) {
              this.$set(targetOption, 'children', res.result.data)
            }
          }
        })
    }
  }
}

const getEstate = {
  data () {
    return {
      estateList: []
    }
  },
  methods: {
    getEstate (areaIds, street) {
      return new Promise((resolve, reject) => {
        const params = {}
        if (areaIds) {
          params.areaIds = areaIds.join(',')
        }
        if (street) {
          params.street = street
        }
        this.$httpPost(this.$basePath.getEstate, params)
          .then(res => {
            this.estateList = res.result
            resolve(res.result)
          })
      })
    }
  }
}

const findUser = {
  data () {
    return {
      userList: []
    }
  },
  methods: {
    findUser (type) {
      this.$httpPost(this.$basePath.findUser, {
        identify: type
      })
        .then(res => {
          this.userList = res.result
        })
    }
  }
}

const toExportExcel = {
  data () {
    return {
      exportLoading: false
    }
  },
  methods: {
    toExportExcel (url, param, fileName) {
      this.exportLoading = true
      this.$httpExport(url, param)
        .then(res => {
          this.exportLoading = false
          if (!fileName) {
            fileName = '导出信息.xlsx'
          }
          const content = res.data
          const blob = new Blob([content])
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
    }
  }
}

import { Icon } from 'ant-design-vue'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1442067_eze5hc6znxs.js'
})
const iconFontComponent = {
  components: { IconFont }
}

// 百度坐标转高德（传入经度、纬度）
const bdEncrypt = {
  methods: {
    bdEncrypt (point) {
      var X_PI = Math.PI * 3000.0 / 180.0
      var x = point.lng - 0.0065
      var y = point.lat - 0.006
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
      var gg_lng = z * Math.cos(theta)
      var gg_lat = z * Math.sin(theta)
      return { lng: gg_lng, lat: gg_lat }
    }
  }
}

export {
  getMarkList,
  getGroupMark,
  getArea,
  getEstate,
  findUser,
  toExportExcel,
  iconFontComponent,
  bdEncrypt
}
