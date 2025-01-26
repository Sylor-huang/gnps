<template>
  <div id="Sidebar" class="sidebar">
    <el-menu
        :default-active="activeMenu"
        class="border-b-0"
        :ellipsis="false"
        :mode="memuMode"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance} from "vue";
import SidebarItem from "./SidebarItem";

import {useRoute} from "vue-router";
import {useStore} from "vuex";
const store = useStore();
const route = useRoute();
let routes = computed(() => {
  return store.state.permission.routes;
});

let {proxy} = getCurrentInstance();

defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
  memuMode: {
    type: String,
    default: "horizontal",
  },
});

const activeMenu = computed(() => {
  const {meta, fullPath} = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return fullPath;
});

let is_current_light_them = computed(() => {
  return proxy.$store.state.app.theme === "default";
});
</script>
