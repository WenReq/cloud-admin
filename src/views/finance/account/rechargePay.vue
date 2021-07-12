<template>
  <div class="rechargePay">
    <div class="operate">
      <div class="title">
        账户充值
      </div>
      <a-row class="basicInfo">
        <a-col :span="4" align="center" style="margin-right:40px;">
          <div class="memberImg">
            <a-avatar :size="64" icon="user" :src="avatar()" />
          </div>
          <div class="memberLines">
            <a-row>
              <a-col :span="12" align="right">
                昵称：
              </a-col>
              <a-col :span="12" align="left">
                &nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo().nickName }}
              </a-col>
            </a-row>
          </div>
          <div class="memberLines">
            <a-row>
              <a-col :span="12" align="right">
                手机号：
              </a-col>
              <a-col :span="12" align="left">
                &nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo().mobile }}
              </a-col>
            </a-row>
          </div>
          <div class="memberLines">
            <a-row>
              <a-col :span="12" align="right">
                账户(用户名)：
              </a-col>
              <a-col :span="12" align="left">
                &nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo().userName }}
              </a-col>
            </a-row>
          </div>
          <div class="memberLines">
            <a-row>
              <a-col :span="12" align="right">
                账户余额：
              </a-col>
              <a-col :span="12" align="left">
                &nbsp;&nbsp;&nbsp;&nbsp;{{ userInfo().balance }}
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :span="18">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="线上充值">
              <div v-if="isSuccess" class="pay-success">
                <a-result status="success" title="充值成功">
                  <template #extra>
                    <a-button @click="isSuccess = false">
                      继续支付
                    </a-button>
                  </template>
                </a-result>
              </div>
              <div v-else>
                <a-form
                  :form="form"
                  :label-col="{ span: 4 }"
                  :wrapper-col="{ span: 12 }"
                >
                  <a-form-item style="margin-bottom:0;" label="充值方式">
                    <div>线上扫码支付</div>
                  </a-form-item>
                  <a-form-item style="margin-bottom:0;" label="充值金额">
                    <a-input-number
                      v-decorator="[
                        'pay',
                        {
                          initialValue: 100,
                          rules: [
                            {
                              required: true,
                              message: '请填写充值金额'
                            },
                            {
                              validator: (rule, value, callback) => {
                                if (value < 0) {
                                  callback('抱歉金额不能为负');
                                }
                                if (value > 10000) {
                                  callback('抱歉金额超过10000');
                                }
                                if (
                                  value &&
                                  !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(
                                    value
                                  )
                                ) {
                                  callback('至多支持两位小数');
                                }
                                callback();
                              }
                            }
                          ]
                        }
                      ]"
                      size="small"
                      :min="1"
                      :max="10000"
                      :step="100"
                      @change="handleChange"
                    />
                  </a-form-item>
                  <a-form-item style="margin-bottom:0;" label="扣除手续费">
                    <div style="color:red">
                      {{ handlingFees }}元
                    </div>
                  </a-form-item>
                  <a-form-item style="margin-bottom:0;color:red" label="实际到账金额">
                    <div>{{ amount }}元</div>
                  </a-form-item>
                  <a-form-item style="margin-bottom:0;" :wrapper-col="{ offset: 3 }">
                    <a-button :loading="confirmLoading" @click="handleSubmit">
                      确认充值
                    </a-button>
                  </a-form-item>
                </a-form>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="线下充值" force-render>
              <div>线下充值请联系对应的客户经理索取我司账户进行汇款、转账</div>
              <div>
                并将充值结果告知客户经理，我司财务核实到账后将为您账户增加余额
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </div>
    <div class="tips">
      <div class="title">
        充值常见问题
      </div>
      <div class="tips-content">
        <div class="item-title">
          1. 手续费怎么收？
        </div>
        <div>
          答：手续费是由支付宝进行收取的，费率为0.6%每笔。您进行支付，实际到账的金额需扣除掉0.6%的手续费。
        </div>
        <div class="item-title">
          2. 账户充值金额用在何处，充值后可以提现吗？
        </div>
        <div>
          答：充值的金额用于您管理的用户使用猫先生APP进行线上提现。充值后金额原则上不支持提现；
        </div>
        <div class="item-title">
          3. 线上扫码支付为什么无法成功充值？
        </div>
        <div>
          答：通过支付宝线上扫码充值，会受到充值额度的限制，建议您分批进行充值，每次充值金额不超过10000元；
        </div>
        <div class="item-title">
          4. 线上充值成功了，为什么账户余额没有增加？
        </div>
        <div>
          答：充值金额是实时到账的，可到账户充值中查询充值记录，若没有查到记录可能是系统延时引起的，请您稍后再查询。若超过一天仍未显示，请与客户经理联系处理；
        </div>
        <div class="item-title">
          5. 线下充值了，为什么账户余额还未增加？
        </div>
        <div>
          答：线下充值需要人工处理需一定的时效，一般在您反馈充值成功后两个工作日内核实是否到账并增加余额，如长时间账户余额未增加请联系客户经理处理。
        </div>
      </div>
    </div>
    <div class="btn-list">
      <a-button type="primary" @click="handleGoBack">
        返回
      </a-button>
    </div>
    <div id="aliPay"></div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { recharge } from '@/api/finance'
export default {
  data () {
    return {
      pay: 100,
      loaded: false,
      isSuccess: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'submitForm' })
    }
  },
  computed: {
    handlingFees () {
      return Math.round(this.pay * 0.006 * 100) / 100
    },
    amount () {
      return this.pay - Math.round(this.pay * 0.006 * 100) / 100
    }
  },
  mounted: function () {
    this.handleQuery()
  },
  methods: {
    ...mapGetters(['avatar', 'userInfo']),
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const params = {
            menuId: 'adfedc8730954de6ac2fc55b9c06738e',
            amount: values.pay
          }
          recharge(params)
            .then(res => {
              const result = res.result
              const index = result.indexOf('<s')
              const payHtml = result.slice(0, index)
              this.handleDom(payHtml)
              this.$nextTick(() => {
                const form = document.punchout_form
                console.log(form)
                this.confirmLoading = false
                form.submit()
              })
            })
            .catch(err => {
              console.log(err)
              this.confirmLoading = false
            })
        }
      })
    },
    handleChange (value) {
      this.pay = value
    },
    handleDom (value) {
      const payHtml = document.getElementById('aliPay')
      const div = document.createElement('div')
      payHtml.innerHTML = ''
      div.innerHTML = value
      payHtml.appendChild(div)
    },
    handleGoBack () {
      this.$router.push('/finance/account/recharge')
    },
    handleQuery () {
      const { total_amount } = this.$route.query
      if (total_amount) {
        this.isSuccess = true
      }
    }
  }
}
</script>
<style lang="stylus">
.rechargePay
  .ant-result
    padding 0
  .ant-result-extra
    margin-top 10px
</style>
<style lang="stylus" scoped>
.rechargePay
  width 100%
  background-color #fff
  padding 16px 20px
  margin-bottom 20px
  font-size 12px
  .basicInfo
    margin 16px 0
    .memberImg
      width 100px
      text-align center
      margin-bottom 10px
    .memberLines
      height 32px
      line-height 32px
  .operate
    height 320px
  .tips
    width 100%
    margin-top 146px
    .tips-content
      margin-top 10px
      .item-title
        font-size 14px
        color #000
        margin-bottom 8px
        margin-top 4px
  .btn-list
      width 100%
      text-align center
      margin-top 60px
      margin-bottom 20px
</style>
