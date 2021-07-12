<template>
  <div class="memberDetails">
    <div class="commonTitle">
      基础信息
    </div>
    <a-row :gutter="16" class="basicInfo">
      <a-col :span="4" align="center" class="leftMember">
        <div class="memberImg">
          <a-avatar :size="64" :src="avatarPath" icon="user" />
        </div>
        <div class="memberLines">
          <a-row>
            <a-col :span="12" align="right">
              可用余额：
            </a-col>
            <a-col :span="12" align="left">
              &nbsp;&nbsp;&nbsp;&nbsp;{{ availableBalance }} 元
            </a-col>
          </a-row>
        </div>
        <div class="memberLines">
          <a-row>
            <a-col :span="12" align="right">
              可用环保值：
            </a-col>
            <a-col :span="12" align="left">
              &nbsp;&nbsp;&nbsp;&nbsp;{{ availableEnv }}
            </a-col>
          </a-row>
        </div>
        <div class="memberLines">
          <a-row>
            <a-col :span="12" align="right">
              环保值排行：
            </a-col>
            <a-col :span="12" align="left">
              &nbsp;&nbsp;&nbsp;&nbsp;{{
                rankEnv > 100 ? "未上榜" : rankEnv + " 名"
              }}
            </a-col>
          </a-row>
        </div>
        <div class="memberLines">
          <a-row>
            <a-col :span="12" align="right">
              累计环保值：
            </a-col>
            <a-col :span="12" align="left">
              &nbsp;&nbsp;&nbsp;&nbsp;{{ envTotal }}
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="10" class="commonCol">
        <a-row
          v-for="(item, index) in middleInfos"
          :key="index"
          :gutter="8"
          class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index | titleFilter }}:
          </a-col>
          <a-col :span="18">
            <!-- <div
              v-if="mainTitle === '编辑' && index === 'memberStatus'"
              class="statusLine"
            >
              <a-radio-group v-model="editStatus" :options="statusOptions" />
            </div> -->
            <div class="commonLine">
              {{ item }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="10" class="commonCol">
        <a-row
          v-for="(item, index) in rightInfos"
          :key="index"
          :gutter="8"
          class="commonHeight"
        >
          <a-col :span="6" align="right">
            {{ index | titFilter }}:
          </a-col>
          <a-col v-if="mainTitle === '编辑'" :span="18">
            <div v-if="index !== 'ICCardNum'" class="commonLine">
              {{ item }}
              <span
                v-if="index === 'phoneNum' && showpn"
                class="showComplete"
                @click="showAllPhoneNum()"
              >完整展示</span>
            </div>
            <div v-if="index === 'ICCardNum'">
              <div v-if="isICNum" class="commonLine">
                {{ item }}
              </div>
              <div v-else>
                <a-input v-model="rightInfos.ICCardNum" placeholder="请输入IC卡号" />
              </div>
            </div>
          </a-col>
          <a-col v-else :span="18">
            <div class="commonLine">
              {{ item }}
              <span
                v-if="index === 'phoneNum' && showpn"
                class="showComplete"
                @click="showAllPhoneNum()"
              >完整展示</span>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="commonTitle">
      身份地址
    </div>
    <a-row :gutter="16">
      <a-col :span="8" class="commonCol">
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            真实姓名:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ trueName }}
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            年龄:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ age }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="8" class="commonCol">
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            身份证号:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ identityNum }}
              <span
                v-if="showin && identityNum"
                class="showComplete"
                @click="showAllIdentityNum()"
              >完整展示</span>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            职业:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ occupation }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="8" class="commonCol">
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            性别:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ sex }}
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            小区:
          </a-col>
          <a-col :span="18">
            <a-select
              v-if="mainTitle === '编辑'"
              v-model="estateId"
              allow-clear
              show-search
              style="width:100%"
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="(item, index) in estateList"
                :key="index"
                :value="item.id"
              >
                {{ item.housingEstate }}
              </a-select-option>
            </a-select>
            <div v-else class="commonLine">
              {{ estate }}
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="8" class="commonCol">
        <a-row v-if="mainTitle === '编辑'" :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            楼栋号:
          </a-col>
          <a-col :span="18">
            <a-input v-model="buildingNumber" />
          </a-col>
        </a-row>
        <a-row v-else :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            楼栋号:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ buildingNumber }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="8" class="commonCol">
        <a-row v-if="mainTitle === '编辑'" :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            单元号:
          </a-col>
          <a-col :span="18">
            <a-input v-model="unitNumber" />
          </a-col>
        </a-row>
        <a-row v-else :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            单元号:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ unitNumber }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="8" class="commonCol">
        <a-row v-if="mainTitle === '编辑'" :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            门牌号:
          </a-col>
          <a-col :span="18">
            <a-input v-model="roomNum" />
          </a-col>
        </a-row>
        <a-row v-else :gutter="8" class="commonHeight">
          <a-col :span="6" align="right">
            门牌号:
          </a-col>
          <a-col :span="18">
            <div class="commonLine">
              {{ roomNum }}
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row :gutter="8" class="addressHeight">
      <a-col :span="2" align="right">
        详细地址:
      </a-col>
      <a-col :span="10">
        <div class="addressCol">
          {{ detailAddress }}
        </div>
      </a-col>
    </a-row>
    <div v-if="mainTitle === '编辑'" class="bottomBtn">
      <a-button class="mr16" @click="backPage()">
        取消
      </a-button>
      <a-button type="primary" :loading="confirmLoading" @click="save()">
        保存
      </a-button>
    </div>
    <div v-if="mainTitle==='查看'" class="bottomBtn">
      <a-button class="mr16" @click="backPage()">
        返回
      </a-button>
    </div>
  </div>
</template>
<script>
import {
  getMemberInfo,
  cardList,
  saveMember
} from '@/api/member'
import { getEstate } from '@/components/mixins/mixins.js'
export default {
  name: 'MemberDetails',
  filters: {
    titleFilter: function (value) {
      switch (value) {
        case 'nickname':
          return '昵称'
        case 'registerSource':
          return '注册来源'
        case 'bindTime':
          return '绑卡时间'
        case 'memberStatus':
          return '会员状态'
        default:
          return '字段值异常，请检查后台数据'
      }
    },
    titFilter: function (value) {
      switch (value) {
        case 'phoneNum':
          return '手机号'
        case 'registerTime':
          return '会员注册时间'
        case 'ICCardNum':
          return 'IC卡号'
        case 'lateTime':
          return '最近登录时间'
        default:
          return '字段值异常，请检查后台数据'
      }
    }
  },
  mixins: [getEstate],
  data () {
    return {
      isICNum: true,
      availableBalance: '',
      availableEnv: '',
      rankEnv: '',
      envTotal: '',
      middleInfos: {
        nickname: '',
        registerSource: '',
        bindTime: '',
        memberStatus: ''
      },
      rightInfos: {
        phoneNum: '',
        registerTime: '',
        ICCardNum: '',
        lateTime: ''
      },
      trueNum: '',
      trueName: '',
      age: '',
      identityNum: '',
      trueIdentityNum: '',
      occupation: '',
      sex: '',
      estate: '',
      estateId: '',
      detailAddress: '',
      buildingNumber: '',
      unitNumber: '',
      roomNum: '',
      showpn: true,
      showin: true,
      columns: [],
      tableData: [],
      IC: [],
      loading: false,
      mainTitle: '',
      statusOptions: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
      editStatus: '',
      mId: '',
      currentKey: '',
      confirmLoading: false,
      avatarPath: '',
      province: '',
      city: '',
      country: ''
    }
  },
  created () {
    this.mainTitle = this.$route.query.title
    this.mId = this.$route.query.id
  },
  mounted () {
    const params = {}
    params.menuId = '69520d904b9347919fca0ce63632cd7f'
    params.id = this.mId
    this.getInfo(params)
  },
  methods: {
    getInfo (params) {
      getMemberInfo(params).then(res => {
        this.middleInfos.nickname = res.result.userName
        this.middleInfos.registerSource =
          Number(res.result.origin) === 0
            ? 'APP注册'
            : Number(res.result.origin) === 1
              ? 'IC开卡'
              : Number(res.result.origin) === 2
                ? '设备'
                : Number(res.result.origin) === 3
                  ? '小程序'
                  : Number(res.result.origin) === 4
                    ? '数据导入'
                    : Number(res.result.origin) === 5
                      ? '客服录入'
                      : Number(res.result.origin) === 6
                        ? '小哥录入'
                        : ''
        this.middleInfos.bindTime = res.result.bindDate
        this.availableBalance = res.result.catCoin
        this.rankEnv = res.result.rank
        this.middleInfos.memberStatus =
          res.result.isLock === '0' || res.result.isLock === 0
            ? '启用'
            : res.result.isLock === '1' || res.result.isLock === 1
              ? '禁用'
              : ''
        this.editStatus = res.result.isLock
        this.rightInfos.phoneNum = this.formatPhone(res.result.cellPhone)
        this.trueNum = res.result.cellPhone
        this.rightInfos.registerTime = res.result.createTime
        this.rightInfos.ICCardNum = res.result.carNum
        this.isICNum = !!res.result.carNum
        this.availableEnv = res.result.balanceEnviron
        this.envTotal = res.result.environmental
        this.rightInfos.lateTime = res.result.loginDate
        this.trueName = res.result.userRealName
        this.roomNum = res.result.roomNum
        this.unitNumber = res.result.unitNumber
        this.buildingNumber = res.result.buildingNumber
        this.age = res.result.age
        this.identityNum = this.formatIdentityNum(res.result.identity)
        this.trueIdentityNum = res.result.identity
        this.occupation = res.result.profession
        this.sex =
          res.result.sex === '0' || res.result.sex === 0
            ? '男'
            : res.result.sex === '1' || res.result.sex === 1
              ? '女'
              : ''
        this.estate = res.result.estateName
        this.detailAddress = res.result.mergerName
        this.avatarPath = res.result.path
        this.province = res.result.province
        this.city = res.result.city
        this.country = res.result.country
        !res.result.carNum && this.getCardList()
        this.getEstate().then(() => {
          this.estateId = res.result.estateId
        })
      })
    },
    getCardList () {
      cardList().then(res => {
        this.IC = res.result
      })
    },
    formatPhone (val) {
      return val && val.length > 7
        ? val.substr(0, 3) + '****' + val.substr(val.length - 4, 4)
        : val
    },
    formatIdentityNum (val) {
      return val && val.length > 2
        ? val.substr(0, 1) + '****' + val.substr(val.length - 1, 1)
        : val
    },
    showAllPhoneNum () {
      this.rightInfos.phoneNum = this.trueNum
      this.showpn = false
    },
    showAllIdentityNum () {
      this.identityNum = this.trueIdentityNum
      this.showin = false
    },
    backPage () {
      this.$router.push({ path: '/member/memberImport' })
    },
    save () {
      const params = {
        userId: this.mId,
        menuId: 'f0378a5aee764f1e959966b79eb4a3f9',
        estateId: this.estateId,
        buildingNumber: this.buildingNumber,
        roomNum: this.roomNum,
        unit: this.unitNumber,
        province: this.province,
        city: this.city,
        area: this.country
      }
      !this.isICNum && Object.assign(params, {
        cardNum: this.rightInfos.ICCardNum
      })
      this.confirmLoading = true
      saveMember(params)
        .then(res => {
          this.confirmLoading = false
          this.$message.success('会员信息修改成功')
          this.backPage()
        })
        .catch(() => {
          this.confirmLoading = false
        })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>
<style lang="stylus" scoped>
.memberDetails
  background-color #fff
  padding 16px 20px
  margin-bottom 20px
  font-size 12px
  color #000
  .pd5
    padding 5px
  .mr16
    margin-right 16px
  .mt16
    margin-top 16px
  .commonTitle
    font-size 16px
    font-weight 600
    color #333
  .basicInfo
    margin 16px 0
    .memberImg
      width 100px
      text-align center
      margin-bottom 10px
    .memberLines
      height 32px
      line-height 32px
  .commonCol
    .commonHeight
      height 32px
      line-height 32px
      margin 16px 0
      .commonLine
        background-color #f2f2f2
        height 32px
        line-height 32px
        padding 0 11px
        color #333
      .statusLine
        padding 0 10px
        color #333
  .addressHeight
    height 32px
    line-height 32px
    margin-bottom 32px
    .addressCol
      height 32px
      line-height 32px
      background-color #f2f2f2
      padding 0 10px
  .showComplete
    color #2F90FF
    font-size 12px
    float right
    cursor pointer
  .bottomBtn
    margin-top 40px
    margin-bottom 24px
    text-align center
</style>
<style lang="stylus">
.memberDetails
  .bottomBtn
    .ant-btn
      border-radius 2px
      font-size 12px
      line-height normal
  .statusLine
    .ant-radio-wrapper
      font-size 12px
</style>
