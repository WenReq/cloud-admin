<template>
  <a-config-provider :locale="zhCN" :get-popup-container="getPopupContainer">
    <div id="app">
      <router-view></router-view>
    </div>
    <template v-slot:renderEmpty>
      <div class="no-data">
        <a-icon type="frown" style="font-size: 18px" />
        <span>暂无数据～</span>
      </div>
    </template>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
export default {
  name: 'App',
  data () {
    return {
      zhCN
    }
  },
  methods: {
    getPopupContainer (el, dialogContext) {
      if (dialogContext) {
        return dialogContext.getDialogWrap()
      } else {
        return document.body
      }
    }
  }
}
</script>
<style lang="stylus">
#app
  height 100%
  .no-data
      display flex
      align-items center
      justify-content center
      span
        font-size 12px
        color #999
        margin-left 4px
</style>
