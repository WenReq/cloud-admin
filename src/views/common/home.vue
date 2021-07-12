<template>
  <div class="home">
    <div class="home-up">
      <div class="home-up_l">
        <p>欢迎使用华展云服务平台！</p>
        <div class="avatar">
          <a-avatar :size="40" :src="info.headPath" icon="user" />
          <div class="avatar-r">
            <div
              :style="{
                'line-height': userInfo().balance < 0 ? '30px' : '16px'
              }"
            >
              {{ info.userName || "" }}
            </div>
            <div>{{ info.nickName || "" }}</div>
            <div v-action:w_recharge class="balance">
              <div class="balance-l">
                <span>账户余额 </span>
                <a-tooltip>
                  <template slot="title">
                    专用于用户线上提现出款的预缴备用金额
                  </template>
                  <a-icon type="question-circle" />：
                </a-tooltip>
                <span>{{ userInfo().balance }}元</span>
              </div>
              <a-button
                style="height:auto;"
                type="link"
                @click="handelRechargeClick"
              >
                充值
              </a-button>
            </div>
          </div>
        </div>
        <div class="left-text">
          <span>账号有效期：</span>
          {{ info.effectiveTime || "永久" }}
        </div>
      </div>
      <div class="home-up_r">
        <div class="title">
          <span>工作人员概况</span>
          <div>
            <a-icon style="font-size:12px;color:#1B85FF;" type="setting" />
            <a-button
              style="margin-left: -8px;"
              type="link"
              @click="handleAccountClick"
            >
              账号配置
            </a-button>
          </div>
        </div>
        <div v-if="staffMember.length" class="list">
          <div
            v-for="(item, index) in staffMember"
            :key="index"
            class="item"
            @click="handleWaitClick(item)"
          >
            <div class="item-up">
              <span>{{ item.name }}</span>
            </div>
            <div class="item-down">
              {{ item.num }}
            </div>
          </div>
        </div>
        <div v-else class="tips">
          暂未配置工作人员，请点击账号进行添加
        </div>
      </div>
    </div>
    <!-- 常用功能 -->
    <div class="home-center">
      <div class="home-center_title">
        <span class="title">常用功能</span>
        <div>
          <a-icon style="font-size:12px;color:#1B85FF;" type="setting" />
          <a-button
            style="margin-left: -8px;"
            type="link"
            @click="() => (settingVisible = true)"
          >
            设置
          </a-button>
        </div>
      </div>
      <div v-if="featuresList.length" class="list">
        <div
          v-for="(item, index) in featuresList"
          :key="index"
          class="item"
          @click="handleFeaturesClick(item)"
        >
          <a-avatar shape="square" :size="58" :src="item.mIcon" />
          <p>{{ item.menuName }}</p>
        </div>
      </div>
      <div v-else class="no-data">
        <a-icon type="frown" style="font-size: 18px" />
        <span>暂未设置，请点击设置按钮进行添加常用功能</span>
      </div>
    </div>
    <!-- 运营概况 -->
    <div class="operation">
      <div class="title">
        运营概况
      </div>
      <div class="operation-t">
        <router-link to="/device/operation/deviceMaintain" class="item bg-1">
          <div class="item-up">
            设备总数（台）
          </div>
          <div>{{ operation.productNum | numberFl }}</div>
        </router-link>
        <router-link to="/areaManage/community" class="item bg-2">
          <div class="item-up">
            小区总数（个）
          </div>
          <div>{{ operation.estateCount | numberFl }}</div>
        </router-link>
        <router-link to="/member/memberList" class="item bg-3">
          <div class="item-up">
            居民用户总数（个）
          </div>
          <div>{{ operation.userNum | numberFl }}</div>
        </router-link>
        <router-link to="member/familyList" class="item bg-1">
          <div class="item-up">
            家庭户数（户）
          </div>
          <div>{{ operation.holdNum | numberFl }}</div>
        </router-link>
        <router-link to="/member/memberList?status=1" class="item bg-4">
          <div class="item-up">
            禁用账号（个）
          </div>
          <div>{{ operation.isLockNum | numberFl }}</div>
        </router-link>
      </div>
      <div class="operation-c">
        <router-link
          to="/device/operation/deviceMaintain?productType=2"
          class="item"
        >
          <div class="item-up">
            <div class="item-up_icon bg-1"></div>
            <span>智能回收站数量（台）</span>
          </div>
          <div class="item-down">
            {{ operation.recycleBin | numberFl }}
          </div>
        </router-link>
        <div class="solid"></div>
        <router-link
          to="/device/operation/deviceMaintain?productType=1"
          class="item"
        >
          <div class="item-up">
            <div class="item-up_icon bg-2"></div>
            <span>智能垃圾箱数量（台）</span>
          </div>
          <div class="item-down">
            {{ operation.trashCan | numberFl }}
          </div>
        </router-link>
        <div class="solid"></div>
        <router-link
          to="/device/operation/deviceMaintain?productType=4"
          class="item"
        >
          <div class="item-up">
            <div class="item-up_icon bg-3"></div>
            <span>智能垃圾房数量（台）</span>
          </div>
          <div class="item-down">
            {{ operation.garbageRoom | numberFl }}
          </div>
        </router-link>
        <div class="solid"></div>
        <router-link to="/device/conversion/list" class="item">
          <div class="item-up">
            <div class="item-up_icon bg-4"></div>
            <span>智能兑换机数量（台）</span>
          </div>
          <div class="item-down">
            {{ operation.exchange | numberFl }}
          </div>
        </router-link>
        <!-- <div class="solid"></div>
        <router-link
          to="/device/operation/deviceMaintain?productType=5"
          class="item"
        >
          <div class="item-up">
            <div class="item-up_icon bg-5"></div>
            <span>智能垃圾亭数量（台）</span>
          </div>
          <div class="item-down">
            {{ operation.pavilion | numberFl }}
          </div>
        </router-link> -->
      </div>
      <div class="operation-d">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="item"
          @click="handleWaitClick(item)"
        >
          <a-avatar
            :size="52"
            :src="item.num ? item.errorImgSrc : item.imgSrc"
          />
          <div class="item-r">
            <p :style="{ color: item.link && item.num ? '#2F97FA' : '#666' }">
              {{ item.title }}
            </p>
            <p>{{ item.num }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 今日投递数据 -->
    <div class="delivery-data">
      <div class="title">
        今日投递数据
      </div>
      <div class="list">
        <div v-for="(item, index) in deliveryData" :key="index" class="item">
          <a-avatar :size="52" :src="item.imgSrc" />
          <div class="item-r" @click="handleWaitClick(item)">
            <p>
              {{ item.title }}
            </p>
            <p>{{ item.num }}</p>
          </div>
          <div v-if="index != deliveryData.length - 1" class="solid"></div>
        </div>
      </div>
    </div>
    <div class="home-down">
      <div class="calendar">
        <div class="title">
          备忘录
        </div>
        <a-calendar
          :key="memoKey"
          ref="calendar"
          @select="onSelect"
          @change="handleCalendarChange"
        >
          <template slot="dateCellRender" slot-scope="value">
            <div v-if="getMemo(value)">
              <a-popover :title="value.format('YYYY-MM-DD 周dd')">
                <template slot="content">
                  <div class="memo-hover">
                    {{ getMemo(value) }}
                  </div>
                </template>
                <div class="memo">
                  {{ getMemo(value) }}
                </div>
              </a-popover>
            </div>
            <a-popover
              :placement="placement"
              :visible="
                value.format('YYYY-MM-DD') === currentMemoDate && memoVisible
              "
              trigger="click"
            >
              <template slot="title">
                <div class="memo-title">
                  <span>{{ value.format("YYYY-MM-DD 周dd") }}</span>
                  <a-button
                    style="font-size:14px"
                    type="link"
                    icon="close"
                    @click.stop.prevent="() => (memoVisible = false)"
                  ></a-button>
                </div>
              </template>
              <template slot="content">
                <a-textarea
                  :ref="value.format('YYYY-MM-DD')"
                  placeholder="备忘录"
                  rows="3"
                  :value="memoValue"
                  @change="memoChange"
                />
                <div class="memo-btn">
                  <a-button
                    type="link"
                    size="small"
                    @click="handleMemoSubmit(value)"
                  >
                    提交
                  </a-button>
                </div>
              </template>
            </a-popover>
          </template>
        </a-calendar>
      </div>
      <div class="home-down_r">
        <div>
          <div class="home-down_title">
            <div class="title">
              系统消息
            </div>
            <a-badge
              :status="messageNum ? 'error' : 'default'"
              :text="`未读（${messageNum}）`"
            />
          </div>
          <div class="list">
            <div
              v-for="(item, index) in messageList"
              :key="index"
              class="item"
              @click="handlePaginationClick(item)"
            >
              <div class="item-l">
                <img :src="item.titlePath" alt>
              </div>
              <div class="item-r">
                <div class="item-r_up">
                  {{ item.title }}
                </div>
                <div class="item-r_down">
                  <div>发布时间：{{ item.sendTime }}</div>
                  <a-badge
                    v-if="item.isRead === 0"
                    count="NEW"
                    :number-style="{
                      backgroundColor: '#FDE9EA',
                      color: '#F22635'
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="down-pagination">
          <span>共 {{ pagination.totalCount }} 条消息</span>
          <a-pagination
            :page-size="pagination.pageSize"
            :total="pagination.totalCount"
            @change="handlePaginationChange"
          />
        </div>
      </div>
    </div>
    <!-- 常用功能设置弹框 -->
    <a-modal
      v-model="settingVisible"
      title="设置"
      centered
      width="530px"
      class="home-modal"
      @ok="() => (settingVisible = false)"
    >
      <div v-if="transferData">
        <a-transfer
          :data-source="transferData"
          :target-keys="targetKeys"
          show-search
          :list-style="{
            width: '210px',
            height: '300px',
            margin: '0 4px'
          }"
          :render="item => item.title"
          @change="handleTransferChange"
        ></a-transfer>
      </div>
      <template slot="footer" class="home-footer">
        <a-button @click="() => (settingVisible = false)">
          关闭
        </a-button>
        <a-button type="primary" @click="handleTransferFix">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import {
  checkToken,
  indexPageUserInfo,
  waitList,
  settingFeaturesList,
  featuresList,
  addFeatures,
  messageList,
  addMemo,
  memoList,
  staffProfile,
  todayData
} from '@/api/workBench'
import imgList from './modules'
import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {
      memoValue: '',
      placement: 'top',
      memoKey: 1,
      currentMemoDate: '',
      settingVisible: false,
      memoVisible: false,
      // 消息当前的页数
      currentPage: 1,
      // 今日待办
      transferData: [],
      targetKeys: [],
      // 常用功能
      featuresList: [],
      // 消息列表
      messageList: [],
      messageNum: 0,
      operation: {
        productNum: 0, // 设备总数
        estateCount: 0, // 小区总数
        userNum: 0, // 居民用户总数
        holdNum: 0, // 家庭户数
        recycleBin: 0, // 回收站数量
        trashCan: 0, // 垃圾桶数量
        garbageRoom: 0, // 垃圾房数量
        isLockNum: 0, // 禁用账号
        exchange: 0 // 兑换机数量
      },
      // 工作人员概况
      staffMember: [],
      items: [
        // TODO 图床用的免费的为了稳定之后替换为自己服务器
        {
          title: '正常设备数（台）',
          num: 0,
          link: '/device/operation/deviceMaintain?productStatus=4',
          imgSrc:
            'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200512/15892515585545d4325da2352484ebf1e55fe5601ef80.png',
          errorImgSrc:
            'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200512/15892515585545d4325da2352484ebf1e55fe5601ef80.png'
        },
        {
          title: '满溢设备数（台）',
          num: 0,
          link: '/device/operation/deviceMaintain?productStatus=2',
          imgSrc: 'https://s2.ax1x.com/2019/10/09/u5YctS.png',
          errorImgSrc: 'https://s2.ax1x.com/2019/10/09/u58rwT.png'
        },
        {
          title: '异常设备数（台）',
          num: 0,
          link: '/device/operation/deviceMaintain?productStatus=1',
          imgSrc: 'https://s2.ax1x.com/2019/10/09/u5tYBq.png',
          errorImgSrc: 'https://s2.ax1x.com/2019/10/09/u5t2E6.png'
        },
        {
          title: '缺币设备数（台）',
          num: 0,
          link: '/device/operation/deviceMaintain?productStatus=3',
          imgSrc: 'https://s2.ax1x.com/2019/10/09/u5wd1S.png',
          errorImgSrc: 'https://s2.ax1x.com/2019/10/09/u5wDmj.png'
        },
        {
          title: '待清运设备数（台）',
          num: 0,
          link: '',
          imgSrc: 'https://s2.ax1x.com/2019/10/09/u5ww6g.png',
          errorImgSrc: 'https://s2.ax1x.com/2019/10/09/u5w0XQ.png'
        }
      ],
      deliveryData: [
        {
          title: '可回收物（kg）',
          imgSrc:
            'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200512/1589251942775fd285399ddc2484abc9938df44629da5.png',
          num: 0,
          link: '/finance/FinancialData/plotDevice?status=today'
        },
        {
          title: '厨余垃圾（kg）',
          imgSrc:
            'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200512/1589252024424fcd60fa38b0e42418a7b421dc10cf7bb.png',
          num: 0,
          link: '/finance/FinancialData/plotDevice?status=today'
        },
        {
          title: '其他垃圾（kg）',
          imgSrc:
            'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200512/1589252036789eb3e694a857542c8b58f75c4c74f0f7e.png',
          num: 0,
          link: '/finance/FinancialData/plotDevice?status=today'
        },
        {
          title: '有害垃圾（kg）',
          imgSrc:
            'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200512/15892520602733daaafea3f71419cb44953afaf48032e.png',
          num: 0,
          link: '/finance/FinancialData/plotDevice?status=today'
        }
      ],
      // 备忘录的列表
      memoList: [],
      memoListVal: [],
      pagination: {
        current: 1,
        pageSize: 5,
        totalCount: 0
      },
      info: {}
    }
  },
  watch: {
    memoListVal: function () {
      // 通过修改key强制重新渲染组件
      ++this.memoKey
    }
  },
  beforeRouteEnter (to, from, next) {
    checkToken().then(res => {
      next()
    })
  },
  mounted: function () {
    this.load()
  },
  methods: {
    ...mapGetters(['avatar', 'userInfo']),
    load () {
      this.getUserInfo()
      this.getWaitList()
      this.getFeaturesList()
      this.getSettingFeaturesList()
      this.getMessageList()
      this.getMemoList()
      this.getStaffProfile()
      this.getTodayData()
    },
    getUserInfo () {
      indexPageUserInfo().then(res => {
        this.info = res.result
      })
    },
    // 代办事项
    getWaitList () {
      waitList().then(res => {
        const { normal, overFlow, abnormal, noMoney, clearance } = res.result
        this.operation = res.result
        this.items[0].num = normal
        this.items[1].num = overFlow
        this.items[2].num = abnormal
        this.items[3].num = noMoney
        this.items[4].num = clearance
      })
    },
    // 获取常用功能列表
    getFeaturesList () {
      featuresList().then(res => {
        const result = res.result
        for (let i = 0; i < result.length; i++) {
          if (result[i].isSelect) {
            this.targetKeys.push(result[i].id)
          }
          if (result[i].aliasName !== '系统消息') {
            const obj = {
              key: result[i].id,
              title: result[i].aliasName,
              routeUrl: result[i].routeUrl
            }
            this.transferData.push(obj)
          }
        }
      })
    },
    // 获取设置后的常用功能
    getSettingFeaturesList () {
      settingFeaturesList().then(res => {
        this.featuresList = res.result
      })
    },
    getMessageList () {
      const params = {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      }
      messageList(params).then(res => {
        const result = res.result
        this.messageList = result.list
        this.messageNum = result.messageNum
        this.pagination.totalCount = result.totalCount
      })
    },
    getMemoList (date) {
      const params = {
        dateTime: date || moment().format('YYYY-MM')
      }
      memoList(params).then(res => {
        this.memoList = res.result
      })
    },
    // 管理工作人员概况
    getStaffProfile () {
      staffProfile().then(res => {
        res.result.map(
          item => (item.link = `/system/account?roleName=${item.name}`)
        )
        this.staffMember = res.result
      })
    },
    // 今日投递数据
    getTodayData () {
      todayData().then(res => {
        const { harmful, life, recycle, other } = res.result
        this.deliveryData[0].num = recycle
        this.deliveryData[1].num = life
        this.deliveryData[2].num = other
        this.deliveryData[3].num = harmful
      })
    },
    onSelect (value) {
      this.memoVisible = true
      this.currentMemoDate = value.format('YYYY-MM-DD')
      this.memoValue = this.getMemo(value)
      if (value.weekday() === 0) {
        this.placement = 'right'
      } else if (this.memoValue) {
        this.placement = 'bottom'
      } else {
        this.placement = 'top'
      }
    },
    memoChange (e) {
      this.memoValue = e.target.value
    },
    // 获取工作日志里面的备忘录
    getMemo (value) {
      let memo
      for (let i = 0; i < this.memoList.length; i++) {
        if (value.format('YYYY-MM-DD') === this.memoList[i].dateTime) {
          memo = this.memoList[i].content
        }
      }
      return memo || ''
    },
    handleMemoSubmit (value) {
      if (!this.memoValue) {
        this.$message.error('抱歉您什么都没有填写')
        return false
      }
      this.memoVisible = false
      const _item = this.memoList.find(
        item => item.dateTime === value.format('YYYY-MM-DD')
      )
      const params = {
        content: this.memoValue,
        dateTime: value.format('YYYY-MM-DD')
      }
      if (_item) {
        Object.assign(params, {
          id: _item.id
        })
      }
      addMemo(params).then(res => {
        this.getMemoList()
      })
      this.memoListVal.push(params)
    },
    handleTransferChange (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    handleTransferFix () {
      if (!this.targetKeys.length || this.targetKeys.length > 8) {
        const msg = this.targetKeys.length
          ? '抱歉您只能选中8个常用功能'
          : '抱歉您还暂未选择常用功能哦'
        this.$message.error(msg)
        return false
      }
      this.settingVisible = false
      const list = []
      for (let i = 0; i < this.targetKeys.length; i++) {
        const _item = this.transferData.find(
          item => item.key === this.targetKeys[i]
        )
        const imgItem = imgList.find(item => item.routeUrl === _item.routeUrl)
        const obj = {
          menuId: _item.key,
          menuName: _item.title,
          mIcon: (imgItem && imgItem.imgSrc) || '',
          routeUrl: _item.routeUrl,
          sort: '',
          mUrl: ''
        }
        list.push(obj)
      }
      const params = {
        commonList: list
      }
      addFeatures(params).then(res => {
        this.getSettingFeaturesList()
      })
    },
    handleWaitClick (item) {
      item.link && item.num && this.$router.replace({ path: item.link })
    },
    handleFeaturesClick (item) {
      item.routeUrl && this.$router.replace({ path: item.routeUrl })
    },
    handleAccountClick () {
      this.$router.push('/system/account')
    },
    handlePaginationClick (item) {
      this.$router.replace({ path: '/home/msg', query: { id: item.id }})
    },
    handelRechargeClick () {
      this.$router.push('/finance/account/recharge')
    },
    handlePaginationChange (page) {
      this.pagination.page = page
      this.getMessageList()
    },
    handleCalendarChange (value) {
      this.getMemoList(value.format('YYYY-MM'))
    }
  }
}
</script>
<style lang="stylus">
.ant-transfer-list-body-not-found
  .no-data
    span
      margin-left 4px
.ant-modal-footer
  padding-top:0px
  padding-bottom 24px
.memo-hover
  width 200px
  word-wrap break-word
.memo-btn
  padding-top 5px
  text-align center
  box-sizing border-box
.memo-title
  width 100%
  display flex
  justify-content space-between
  align-items center
  .ant-btn
    padding 0
.home
  .ant-fullcalendar-fullscreen .ant-fullcalendar-month, .ant-fullcalendar-fullscreen .ant-fullcalendar-date
    height 100px
  .ant-badge-status-dot
    width 4px
    height 4px
  .ant-badge-status-text
    font-size 12px
    color #999999
    margin-left 4px
  .home-down
    .ant-radio-group-default
      display none
</style>
<style lang="stylus" scoped>
.hidden
  overflow hidden
.home
  width 100%
  p
    margin-bottom 1em
  .home-up
    width 100%
    display flex
    .home-up_l
      width 30%
      background-color #ffffff
      padding 16px 20px
      box-sizing border-box
      height 160px
      >p
        font-size 16px
        color rgba(0,0,0,0.85)
      .avatar
        display flex
        margin-bottom 12px
        .avatar-r
          flex 1
          font-size 12px
          color #666
          margin-left 9px
          margin-top -4px
      .balance
          width 100%
          font-size 12px
          display flex
          justify-content space-between
          align-items center
          margin-top -2px
      .left-text
        border-top 1px solid #E8E8E8
        color #666666
        line-height 42px
        span
          color rgba(0,0,0,0.85)
    .home-up_r
      flex 1
      margin-left 16px
      background-color #fff
      padding 16px 20px
      box-sizing border-box
      .title
        display flex
        align-items center
        justify-content space-between
        >div
          display flex
          align-items center
      .list
        width 100%
        padding 0 16px
        box-sizing border-box
        display flex;
        flex-wrap wrap
        margin-top 18px
        color #000000
        height 78px
        overflow-y auto
        .item
          width 14.28%
          text-align center
          margin-bottom 12px
          cursor pointer
          .item-up
            font-size 14px
            color #666666
          .item-down
            font-size 22px
            font-weight 500
            margin-top 9px
      .tips
        width 100%
        padding 0 16px
        box-sizing border-box
        height 78px
        line-height 78px
        text-align center
        font-size 12px
        color: #999;
  .operation
    width 100%
    padding 15px 20px
    box-sizing border-box
    background-color #fff
    margin-top 16px
    .operation-t
      width 100%
      display flex
      justify-content space-between
      margin-top 16px
      .item
        width 17%
        height 80px
        text-align center
        font-size 24px
        color #000
        font-weight 500
        padding 10px 0
        box-sizing border-box
        cursor pointer
        .item-up
          font-size 12px
          color #767D86
          margin-bottom 6px
          font-weight 400
        &.bg-1
            background-color rgba(232,242,255,.38)
        &.bg-2
            background-color rgba(255,239,228,.38)
        &.bg-3
            background-color rgba(231,255,242,.38)
        &.bg-4
            background-color rgba(243,252,222,.38)
    .operation-c
      width 100%
      border-top 1px solid #F2F2F2
      border-bottom 1px solid #F2F2F2
      padding 5px 0
      box-sizing border-box
      display flex
      justify-content space-between
      align-items center
      margin-top 20px
      .item
        width 24%
        height 90px
        padding 16px 0
        box-sizing border-box
        text-align center
        font-size 24px
        color #000
        font-weight 500
        .item-up
          width 100%
          display flex
          align-items center
          justify-content center
          font-size 12px
          font-weight 400
          margin-bottom 8px
          color #666666
          .item-up_icon
            width 8px
            height 8px
            border-radius 50%
            margin-right 6px
            &.bg-1
              background-color #57C22D
            &.bg-2
              background-color #2D45C2
            &.bg-3
              background-color #C25E2D
            &.bg-4
              background-color #9A2DC2
            &.bg-5
              background-color #F04864
      .solid
        width 1px
        height 58px
        background-color #F2F2F2
    .operation-d
      width 100%
      display flex
      margin-top 32px
      padding 0 18px
      box-sizing border-box
      .item
        width 33.33%
        display flex
        cursor pointer
        .item-r
          line-height 16px
          margin-left 16px
          font-size 12px
          color #666666
          p:last-child
            font-size 22px
            color #000
            font-weight 600
  .delivery-data
    width 100%
    padding 16px 20px
    box-sizing border-box
    background-color #fff
    margin-top 16px
    .list
      width 100%
      display flex
      margin-top 16px
      padding 0 54px
      box-sizing border-box
      justify-content space-between
      .item
        width 24%
        display flex
        cursor pointer
        height 90px
        align-items center
        .item-r
          padding-top 20px
          line-height 16px
          margin-left 16px
          font-size 12px
          color #666666
          width 60%
          p:last-child
            font-size 22px
            color #000
            font-weight 600
      .solid
        width 1px
        height 58px
        background-color #F2F2F2
  .home-center
    width 100%
    height 163px
    padding 16px 20px
    box-sizing border-box
    background-color #fff
    margin-top 18px
    .home-center_title
     display flex
     justify-content space-between
    .list
      width 100%
      display flex
      padding 0 12px
      box-sizing border-box
      margin-top 17px
      cursor pointer
      .item
        text-align center
        margin-right 64px
        p
          font-size 12px
          color #000
          margin-top 5px
  .home-down
    height 715px
    margin-top 16px
    display flex
    .calendar
      width 60%
      padding 5px 0
      box-sizing border-box
      background-color #fff
      position relative
      .title
        position absolute
        left 20px
        top 16px
      .memo
        width 100%
        font-size  12px
        color  #333
        overflow  hidden
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp 3
        -webkit-box-orient vertical
    .home-down_r
      flex 1
      margin-left 16px
      height 100%
      background-color #fff
      padding 0 20px
      display flex
      flex-direction column
      justify-content space-between
      .home-down_title
        width 100%
        display flex
        justify-content space-between
        padding 16px 0
        border-bottom 1px solid #F2F2F2
      .item
        width 100%
        padding 20px 0
        box-sizing border-box
        display flex
        border-bottom 1px solid #F2F2F2
        .item-l
          border-radius 2px
          overflow hidden
          margin-right 16px
          img
            width 120px
            height 77px
        .item-r
          flex 1
          height 77px
          display flex
          flex-direction column
          justify-content space-between
          .item-r_up
            font-weight 500
            font-size 16px
            color #000
          .item-r_down
            width 100%
            display flex
            justify-content space-between
            font-size 12px
            color #999
      .down-pagination
        width 100%
        display flex
        padding 16px 0
        justify-content space-between
        align-items center
        border-top 1px solid #F2F2F2
        span
          font-size 12px
          color #333
</style>
