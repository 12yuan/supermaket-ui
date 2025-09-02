<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView ? this.$store.state.tagsView.cachedViews : [];
    },
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style scoped>
.app-main {
  /* 84 = navbar + tags-view = 50 + 34 */
  min-height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.fixed-header + .app-main {
  padding-top: 84px;
}

.hasTagsView .app-main {
  /* 84 = navbar + tags-view = 50 + 34 */
  min-height: calc(100vh - 84px);
}

.no-tags-view .app-main {
  /* 50 = navbar */
  min-height: calc(100vh - 50px);
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>