<template functional>
  <a-sub-menu :key="props.menuInfo.id">
    <span slot="title">
      <icon-font v-if="props.menuInfo.mIcon" class="ft-16" :type="props.menuInfo.mIcon" />
      <span>{{ props.menuInfo.name }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <sub-menu v-if="item.mType===0&&item.children.length" :key="item.id" :menu-info="item" />
      <a-menu-item v-else :key="item.id">
        <span>{{ item.name }}</span>
      </a-menu-item>
    </template>
  </a-sub-menu>
</template>
<script>
import { iconFontComponent } from '@/components/mixins/mixins.js'
export default {
  mixins: [iconFontComponent],
  // eslint-disable-next-line vue/require-prop-types
  props: ['menuInfo']
}
</script>
