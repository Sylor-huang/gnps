<template>
  <el-card class="border-0">
    <el-row :gutter="20" :class="colClass.pd">
      <el-col :xs="{ span: 24 }" :md="{ span: 12, offset: 6 }">
        <div class="text-center color-default mb-20" :class="colClass.size">
          <div class="mb-3">{{error_status}} {{$t("common.error_page")}}</div>
          <el-button type="primary" size="default" @click="router_back">{{$t("common.last_page")}}</el-button>
        </div>
        <img class="w-full" :src="`${error_page}`" :alt="`${error_status}`" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { getCurrentInstance, computed } from 'vue'
import Page500 from '@/assets/error_images/500.svg'
import Page403 from '@/assets/error_images/403.svg'
import Page404 from '@/assets/error_images/404.svg'
let { proxy } = getCurrentInstance()

defineProps({
  error_status: {
    type: String,
    default: "404"
  }
})

let error_page = computed(() => {
  if(proxy.error_status === "500") {
    return Page500
  }else if (proxy.error_status === "403") {
    return Page403
  }else{
    return Page404
  }
})

let isMobile = computed(() => {
  return proxy.$store.state.app.device === 'mobile'
})

let colClass = computed(() => {
  if (isMobile.value) {
    return {
      pd: 'p-2',
      size: 'text-xl'
    }
  } else {
    return {
      pd: 'p-24',
      size: 'text-6xl'
    }
  }
})

let router_back = () => {
  proxy.$router.go(-1)
}
</script>
