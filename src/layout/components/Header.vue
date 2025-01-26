<template>
  <div class="flex items-center justify-between">
    <div class="mr-4 lg:mr-8 flex-auto-size">
      <el-space>
        <router-link class="inline-block" to="/">
        <el-space>
          <img src="@/assets/logo.svg" class="h-10 mx-auto" />
          <strong class="logo-title">{{ proxy.$setting.title }}</strong>
        </el-space>
      </router-link>
        <div v-if="isMobile" class="ht-75 ml-4">
          <el-icon
            :size="24"
            @click="drawer = true"
            class="ht-75"
            color="#9945FF"
          >
            <Expand />
          </el-icon>
          <el-drawer
            v-model="drawer"
            direction="ltr"
            size="50%"
            :destroy-on-close="true"
            modal-class="customMenu"
          >
            <Sidebar memuMode="vertical"></Sidebar>
          </el-drawer>
        </div>
      </el-space>
    </div>
    <div class="flex-1" v-if="!isMobile">
      <Sidebar></Sidebar>
    </div>
    <div class="flex-auto-size">
      <ConnectHeader direction="horizontal"></ConnectHeader>
    </div>
  </div>
</template>
<script setup>
import {getCurrentInstance, ref} from "vue";
import {Sidebar} from "@/layout/components";
import ConnectHeader from "@/layout/components/ConnectHeader";
let {proxy} = getCurrentInstance();
defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

let drawer = ref(false);
</script>
