<template>
  <el-config-provider :locale="proxy.$language" :message="msgConfig">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { getCurrentInstance,reactive } from 'vue'
import { ElConfigProvider } from 'element-plus'
let { proxy } = getCurrentInstance();
const msgConfig = reactive({
  grouping: true,
  duration: 3000
});
</script>
<style lang="scss">
html {
  height: 100%;
}
</style>