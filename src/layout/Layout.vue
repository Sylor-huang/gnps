<template>
  <div
    class="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black"
  >
    <el-container>
      <el-header
        class="shadow-md fixed w-full z-50 bg-color border-b-1 ht-75 black-bg-color"
      >
        <el-row>
          <el-col :xs="{span: 24}" :md="{span: 20, offset: 2}">
            <Header :isMobile="isMobile"></Header>
          </el-col>
        </el-row>
      </el-header>
      <el-row>
        <el-col :xs="{span: 24}" :md="{span: 20, offset: 2}">
          <el-main class="mat-75">
            <AppMain />
          </el-main>
          <el-footer class="inline">
            <el-divider></el-divider>
            <div class="p-5">
              <div class="text-3xl font-bold hover:gradient-text mb-2">
                {{ $t("about.a0") }}
              </div>
              <div class="text-gray-400 mb-2">
                <div>1. {{ $t("about.a1") }}</div>
                <div>
                  <a
                    :href="`mailto:${proxy.$setting.contactEmail}`"
                    target="_blank"
                    class="ml-2 text-primary"
                    >{{ proxy.$setting.contactEmail }}</a
                  >
                </div>
              </div>
              <div class="text-gray-400 mb-2">
                <div>
                  2. {{ $t("about.a2") }}
                </div>
                <div class="ml-2 text-primary whitespace-normal">
                  {{ proxy.$setting.contactAddr }}
                </div>
              </div>
              <div class="text-gray-400 mb-2">
                <div>
                  3. {{ $t("about.a3") }}
                </div>
                <div>
                  <a
                  :href="`${proxy.$setting.contactGithub}`"
                  target="_blank"
                  class="ml-2 text-primary break-all"
                  >{{ proxy.$setting.contactGithub }}</a
                >
                </div>
              </div>
            </div>
            <div class="text-xl p-5">
              <span class="mr-4">{{ proxy.$setting.copyright }}</span>
              <a
                :href="`${proxy.$setting.domainIcp}`"
                class="text-primary"
                target="_blank"
                >{{ proxy.$setting.nameIcp }}</a
              >
            </div>
          </el-footer>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script setup>
import {ref, onMounted, getCurrentInstance, computed} from "vue";
import {Sidebar, AppMain, Header} from "./components";
import ResizeHook from "./hook/ResizeHandler";
ResizeHook();
let {proxy} = getCurrentInstance();

let isMobile = computed(() => {
  return proxy.$store.state.app.device === "mobile";
});
</script>
