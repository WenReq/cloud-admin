<template>
  <a-layout id="layout">
    <a-layout-header class="header">
      <div class="logo">
        <img
          src="http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191107/15731230059270aeb040db9a64d8488a47de33858e9b8.png"
          alt="logo"
        >
      </div>
      <div class="header-r">
        <a-menu
          theme="dark"
          mode="horizontal"
          :selected-keys="topSelectedKeys"
          :style="{ lineHeight: '50px' }"
          @click="topMenuClick"
        >
          <a-menu-item v-for="item in menuList" :key="item.id">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
        <a-dropdown :trigger="['click']" overlay-class-name="dropdown-menu">
          <div class="user">
            <a-avatar
              class="avatar" size="small" :src="avatar()"
              icon="user"
            />
            <div class="user-text">
              <span>{{ nickname() }}</span>
              <a-icon type="caret-down" />
            </div>
          </div>
          <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
            <a-menu-item key="0">
              <div class="user-layer_item" @click="handleShowInfo()">
                <a-icon type="user" />
                <span>个人信息</span>
              </div>
            </a-menu-item>
            <a-menu-item key="1">
              <div class="user-layer_item" @click="handleShowInfo('password')">
                <a-icon type="form" />
                <span>修改密码</span>
              </div>
            </a-menu-item>
            <a-menu-item key="2">
              <div class="user-layer_item" @click="handleLogout">
                <a-icon type="export" />
                <span>退出</span>
              </div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        v-show="siderMenuList.length && !isError"
        width="200"
        style="background: #fff"
      >
        <a-menu
          mode="inline"
          :selected-keys="selectedKeys"
          :open-keys="openKeys"
          :style="{ height: '100%', borderRight: 0 }"
          @click="siderMenuClick"
          @openChange="siderMenuChange"
        >
          <template v-for="item in siderMenuList">
            <sub-menu
              v-if="item.mType == 0 && item.children.length"
              :key="item.id"
              :menu-info="item"
            />
            <a-menu-item v-else :key="item.id">
              <icon-font v-if="item.mIcon" class="ft-16" :type="item.mIcon" />
              <span>{{ item.name }}</span>
            </a-menu-item>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout v-if="isError">
        <router-view></router-view>
      </a-layout>
      <a-layout v-else style="padding: 0 16px 24px">
        <a-breadcrumb separator=">" style="margin: 12px 0">
          <a-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
            {{ item }}
          </a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content>
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <!-- 个人信息对话框 -->
    <a-modal
      v-model="infoVisible"
      :title="infoTitle"
      centered
      width="460px"
      wrap-class-name="home-modal"
    >
      <div v-if="infoType == 'user'" class="home-list">
        <a-row class="home-list_item">
          <a-col style="text-align:right;" :span="4">
            <span>用户名:</span>
          </a-col>
          <a-col :span="20">
            <p>{{ userInfo().userName }}</p>
          </a-col>
        </a-row>
        <a-row class="home-list_item">
          <a-col style="text-align:right;" :span="4">
            <span>昵称:</span>
          </a-col>
          <a-col :span="20">
            <p>{{ userInfo().nickName }}</p>
          </a-col>
        </a-row>
        <a-row class="home-list_item">
          <a-col style="text-align:right;" :span="4">
            <span>手机号:</span>
          </a-col>
          <a-col :span="20">
            <p>{{ userInfo().mobile }}</p>
          </a-col>
        </a-row>
        <a-row class="home-list_item">
          <a-col style="text-align:right;" :span="4">
            <span>注册时间:</span>
          </a-col>
          <a-col :span="20">
            <p>{{ userInfo().createTime }}</p>
          </a-col>
        </a-row>
        <a-row class="home-list_item">
          <a-col style="text-align:right;" :span="4">
            <span>关联角色:</span>
          </a-col>
          <a-col :span="20">
            <p>{{ userInfo().roleNames }}</p>
          </a-col>
        </a-row>
      </div>
      <div v-else class="home-list">
        <a-row class="home-list_item">
          <a-col style="text-align:right;" :span="4">
            <span>用户名:</span>
          </a-col>
          <a-col :span="20">
            <p>{{ userInfo().userName }}</p>
          </a-col>
        </a-row>
        <a-row class="home-list_item">
          <a-col style="text-align:right;" :span="4">
            <span>昵称:</span>
          </a-col>
          <a-col :span="20">
            <p>{{ userInfo().nickName }}</p>
          </a-col>
        </a-row>
        <a-form :form="passwordForm" @submit="handleSubmit">
          <a-form-item
            label="原密码"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入原密码'
                    }
                  ]
                }
              ]"
              type="password"
              placeholder="请输入原密码"
            />
          </a-form-item>
          <a-form-item
            label="新密码"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              v-decorator="[
                'newPassword',
                {
                  rules: [
                    {
                      required: true,
                      message: '请设置新密码最长30位'
                    },
                    {
                      validator: validateToNextPassword
                    }
                  ]
                }
              ]"
              type="password"
              maxlength="30"
              placeholder="请设置新密码最长30位"
            />
          </a-form-item>
          <a-form-item
            label="确认密码"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              v-decorator="[
                'confirm',
                {
                  rules: [
                    {
                      required: true,
                      message: '请再次输入登录密码'
                    },
                    {
                      validator: compareToFirstPassword
                    }
                  ]
                }
              ]"
              type="password"
              placeholder="请再次输入密码"
              @blur="handleConfirmBlur"
            />
          </a-form-item>
        </a-form>
      </div>
      <template slot="footer">
        <div v-if="infoType == 'user'">
          <a-button type="primary" @click="() => (infoVisible = false)">
            关闭
          </a-button>
        </div>
        <div v-else>
          <a-button @click="() => (infoVisible = false)">
            关闭
          </a-button>
          <a-button type="primary" html-type="submit" @click="handleSubmit">
            确定
          </a-button>
        </div>
      </template>
    </a-modal>
  </a-layout>
</template>
<script>
import md5 from 'md5'
import mqtt from 'mqtt'
import SubMenu from './sub-menu'
import { updatePwd } from '@/api/login'
import { mapState, mapActions, mapGetters } from 'vuex'
import { iconFontComponent } from '@/components/mixins/mixins.js'
import { MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD } from '@/config/mqtt.js'
function handleFilter (items, value, key = 'path') {
  let _item = null
  function filters (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][key] === value) {
        _item = list[i]
        break
      } else {
        if (list[i].children && list[i].children.length) {
          filters(list[i].children)
        }
      }
    }
  }
  filters(items)
  return _item
}
export default {
  components: {
    SubMenu
  },
  mixins: [iconFontComponent],
  data () {
    return {
      isError: false,
      infoVisible: false,
      confirmDirty: false,
      currentMenuId: 0,
      openKey: '',
      selectedKey: '',
      menuActiveId: '',
      infoType: 'user',
      infoTitle: '个人信息',
      breadcrumb: [],
      siderMenuList: [],
      mqttConfig: {
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD
      },
      labelCol: {
        sm: { span: 4 }
      },
      wrapperCol: {
        sm: { span: 20 }
      },
      passwordForm: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapState({
      menuList: state => state.user.menus
    }),
    // 顶部菜单 选中的key
    topSelectedKeys () {
      return [this.menuActiveId]
    },
    // 侧边栏菜单 选中的key
    selectedKeys () {
      return [`${this.selectedKey}`]
    },
    // 侧边栏菜单 打开菜单的key
    openKeys () {
      return [`${this.openKey}`]
    }
  },
  watch: {
    $route: 'handleRoute'
  },
  created: function () {
    this.onLoad()
    this.getUserInfo()
  },
  methods: {
    ...mapActions(['Logout', 'GetInfo', 'resetHas']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    onLoad () {
      this.handleRoute()
    },
    getUserInfo () {
      this.GetInfo().then(() => {
        const { id } = this.userInfo()
        this.initMQTT(id, this.handleMsg)
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        passwordForm: { validateFields }
      } = this
      validateFields((err, values) => {
        if (!err) {
          const params = {
            oldPwd: md5(values.password),
            newPwd: md5(values.newPassword)
          }
          updatePwd(params).then(res => {
            this.infoVisible = false
            this.$message.success('密码修改成功')
            setTimeout(() => {
              this.$router.push({ path: '/login' })
            }, 3000)
          })
        }
      })
    },
    handleRoute (route) {
      const path = (route && route.path) || this.$route.path
      if (path !== '/error') {
        this.isError = false
        const { menuId, pId, title } =
          (route && route.meta) || this.$route.meta
        if (pId === '0') {
          this.handleSetKey(menuId)
        } else {
          const parentItem = this.handleRefreshMenu(pId)
          const item = handleFilter(this.menuList, menuId, 'id')
          const topKey = parentItem.id
          const sideKey = item.mType === 2 ? item.pId : item.id
          const openKey =
            item.mType === 2
              ? handleFilter(this.menuList, item.pId, 'id').pId
              : item.pId
          this.handleSetKey(topKey, sideKey, openKey)
          this.siderMenuList = parentItem.children
        }
        this.handleBreadcrumb(title)
      } else {
        this.isError = true
      }
    },
    handleSetKey (topkey, sideKey, openKey) {
      if (topkey) {
        this.menuActiveId = topkey
      }
      if (sideKey) {
        this.selectedKey = sideKey
      }
      if (openKey) {
        this.openKey = openKey
      }
    },
    // 处理刷新时的菜单
    handleRefreshMenu (id) {
      const _menuList = this.menuList
      let item = null
      function filter (id) {
        const _item = handleFilter(_menuList, id, 'id')
        if (_item.pId === '0') {
          item = _item
        } else {
          filter(_item.pId)
        }
      }
      filter(id)
      return item
    },
    // 处理页面刷新默认展示的顶部菜单
    handleSelectedMenu (data) {
      let _item = null
      function filters (items) {
        if (items.mType === 0 && items.children && items.children.length) {
          filters(items.children[0])
        } else {
          _item = items
        }
      }
      filters(data)
      return _item
    },
    // 处理面包屑
    handleBreadcrumb (title) {
      const list = []
      // item_1 面包屑第一级 item_2 面包屑第二级 item_3 面包屑第三级
      const { item_1, item_2, item_3 } = this.handleSetBreadcrumb()

      item_1 && list.push(item_1.name)
      if (item_1.name === '工作台') {
        title === '系统消息' && list.push(title)
      } else {
        item_2 && list.push(item_2.name)
        item_3 && list.push(item_3.name)
      }
      this.breadcrumb = list
    },
    handleSetBreadcrumb () {
      const result = {
        item_1: null,
        item_2: null,
        item_3: null
      }

      if (this.menuActiveId) {
        result.item_1 = handleFilter(this.menuList, this.menuActiveId, 'id')
      }
      if (this.openKeys && this.openKeys !== this.menuActiveId) {
        result.item_2 = handleFilter(this.menuList, this.openKey, 'id')
      }
      if (this.selectedKey && this.selectedKey !== this.openKey) {
        result.item_3 = handleFilter(this.menuList, this.selectedKey, 'id')
      }
      return result
    },
    topMenuClick (item) {
      const parentItem = this.menuList.find(i => i.id === item.key)
      const siderMenuList = parentItem.children
      if (parentItem.name !== '工作台') {
        if (siderMenuList.length) {
          const _item = this.handleSelectedMenu(siderMenuList[0])
          this.$router.push({ path: _item.routeUrl })
        }
      } else {
        this.siderMenuList = []
        this.$router.push({ path: '/home' })
      }
    },
    siderMenuClick (item) {
      const _item = handleFilter(this.siderMenuList, item.key, 'id')
      _item && _item.routeUrl && this.$router.replace({ path: _item.routeUrl })
    },
    siderMenuChange (openKeys) {
      this.openKey = openKeys[openKeys.length - 1]
    },
    handleShowInfo (type = 'user') {
      this.infoType = type
      this.infoVisible = true
      this.infoTitle = type === 'user' ? '个人信息' : '修改密码'
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.passwordForm
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('两次密码输入不一致！')
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.passwordForm
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    handleLogout () {
      this.Logout().then(() => {
        window.location.reload()
      })
    },
    initMQTT (userId, func) {
      const client = mqtt.connect(MQTT_SERVICE, this.mqttConfig)
      // MQTT链接
      client.on('connect', e => {
        client.subscribe('delivery_error', { qos: 1 }, error => {
          if (error) {
            console.log(error, '订阅失败')
          } else {
            console.log('MQTT订阅成功')
          }
        })
      })
      // 接收消息处理
      client.on('message', (topic, message) => {
        const msg = JSON.parse(message)
        const list = msg.userIds
        if (list.includes(userId)) {
          console.log(`收到来自${topic}的消息`)
          func && func(msg)
        }
      })
      // 断开发起重连
      client.on('reconnect', () => {
        console.log('正在重连')
      })
      // 链接异常处理
      client.on('error', error => {
        console.log(error, '连接失败')
      })
    },
    handleMsg (res) {
      this.$notification.config({
        top: '60px'
      })
      const key = `open${Date.now()}`
      this.$notification.warning({
        message: `${res.date} ${res.productId} 设备投递异常`,
        description: `小区：${res.productName} 设备名称：${res.productName} 投递品类：${res.category}称重重量：${res.weight}`,
        duration: 0,
        btn: h => {
          if (this.$route.path !== '/operation/monitor/abnormal') {
            return h(
              'a-button',
              {
                props: {
                  type: 'link',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$notification.close(key)
                    this.handleLink(res.orderId)
                  }
                }
              },
              '查看详情'
            )
          } else {
            return null
          }
        },
        key
      })
    },
    handleLink (orderId) {
      this.$router.push({
        path: '/operation/monitor/abnormal',
        query: { orderId }
      })
    }
  }
}
</script>
<style lang="stylus">
#layout .ft-16
  font-size 16px
.home-modal
  .ant-modal-footer
    text-align center
.home-list
  .ant-form-item-label label
    font-size 12px
    color #333
  .ant-form-item
    margin-bottom 20px
  .ant-form-item:last-child
    margin-bottom 0
#layout
  min-width: 1366px
  height: 100%
  .header
    height: 50px
    line-height: 50px
    padding: 0 20px
    display: flex
    justify-content: space-between
.dropdown-menu
  .ant-dropdown-menu
    margin-top -4px
    border-radius 2px
</style>
<style lang="stylus" scoped>
.header
  .logo
    width: 30%
    height: 32px
  .header-r
    display: flex
  .user
    max-width 160px
    height: 100%
    display: flex
    align-items: center
    margin-left: 30px
    color: #fff
    cursor: pointer
    .user-text
      max-width 100px
      display flex
      align-items center
      span
        max-width 80px
        overflow: hidden
        text-overflow:ellipsis
        white-space: nowrap
        margin: 0 4px
.user-layer_item
  span
    margin-left 8px
.home-list_item
  width 100%
  display flex
  align-items center
  margin-bottom 22px
  span
    width 50px
    text-align right
    font-size 12px
    color #000
    margin-right 8px
  p
    flex 1
    background-color #F2F2F2
    color #333
    height 32px
    line-height 32px
    border-radius 2px
    padding 0 10px
    box-sizing 0
    margin 0
.page-transition-enter
  opacity: 0
.page-transition-leave-active
  opacity: 0
.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container
  -webkit-transform: scale(1.1)
  transform: scale(1.1)
.max-width
  max-width 1000px
</style>
