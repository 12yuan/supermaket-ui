<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.native.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script>
const tagSpacing = 4; // 标签之间的间距

export default {
  name: 'ScrollPane',
  data() {
    return {
      left: 0
    };
  },
  computed: {
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap;
    }
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40;
      const $scrollWrapper = this.scrollWrapper;
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft - eventDelta / 4;
    },
    moveToTarget(currentTag) {
      const $container = this.$refs.scrollContainer.$el;
      const $containerWidth = $container.offsetWidth;
      const $scrollWrapper = this.scrollWrapper;
      const tagList = this.$parent.$refs.tag;

      let firstTag = null;
      let lastTag = null;

      // 找到第一个和最后一个可见的标签
      if (tagList.length > 0) {
        firstTag = tagList[0];
        lastTag = tagList[tagList.length - 1];
      }

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0;
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
      } else {
        // 找到当前标签的前一个和后一个元素
        const currentIndex = tagList.findIndex(item => item === currentTag);
        const prevTag = tagList[currentIndex - 1];
        const nextTag = tagList[currentIndex + 1];

        // 标签完全可见的条件
        const afterPrevBound = prevTag && prevTag.$el.offsetLeft + prevTag.$el.offsetWidth + tagSpacing > $scrollWrapper.scrollLeft;
        const beforeNextBound = nextTag && nextTag.$el.offsetLeft < $scrollWrapper.scrollLeft + $containerWidth;

        if (afterPrevBound && beforeNextBound) {
          // 标签已经在可视区域内，不需要滚动
        } else if (afterPrevBound) {
          // 需要向右滚动，显示下一个标签
          $scrollWrapper.scrollLeft = nextTag.$el.offsetLeft - $containerWidth + nextTag.$el.offsetWidth + tagSpacing;
        } else if (beforeNextBound) {
          // 需要向左滚动，显示前一个标签
          $scrollWrapper.scrollLeft = prevTag.$el.offsetLeft - tagSpacing;
        } else {
          // 当前标签不在可视区域内，直接滚动到当前标签
          $scrollWrapper.scrollLeft = currentTag.$el.offsetLeft - ($containerWidth - currentTag.$el.offsetWidth) / 2;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>