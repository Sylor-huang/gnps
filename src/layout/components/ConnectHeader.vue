<template>
  <el-space :direction="direction">
    <!-- <el-dropdown>
      <el-space>
        <el-button text key="plain" type="default" size="large" class="p-2">
          <img src="@/assets/lanauge.svg" class="w-4 mr-2"/>
          EN 
        </el-button>
      </el-space>
     
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <router-link to="/chinese">{{ $t("menu.Chinese") }}</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/english">{{ $t("menu.English") }}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
    <div class="ml-2">
      <div v-if="userInfo?.id">
        <el-dropdown>
          <el-space>
            <el-button text key="plain" type="default" size="large" class="p-2">
              {{ sliceString(userInfo.name, 5) }}
            </el-button>
          </el-space>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-button @click="updateUserInfo" link>
                  {{
                  $t("common.updateUser")
                }}
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button @click="logoutUser" link>{{
                  $t("common.logout")
                }}</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-button
        size="large"
        round
        type="primary"
        class="gradient-text"
        @click="RouteToLogin"
        v-else
        >{{ $t("menu.Login") }}</el-button
      >
    </div>
  </el-space>
</template>
<script setup>
import {getCurrentInstance, computed, reactive} from "vue";
import {sliceString} from "@/utils/validate";
let {proxy} = getCurrentInstance();
import Cookies from "js-cookie";


defineProps({
  direction: {
    type: String,
    default: "horizontal",
  },
});

let RouteToLogin = () => {
  const fullPath = proxy.$route.fullPath;
  const query = proxy.$route.query;
  const redirect = query.redirect || (fullPath.includes("signup") ? "/" : fullPath);
  proxy.$router.push(`/login?redirect=${redirect}`);
};

let userInfo = computed(() => {
  return proxy.$store.state.app.userInfo;
});

let logoutUser = () => {
  localStorage.removeItem("gs_userInfo");
  Cookies.remove("gs_userToken");
  proxy.$store.dispatch("app/toggleUserInfo", {});
  proxy.$router.push("/");
};

let updateUserInfo = () => {
  if(userInfo.value?.id) {
    proxy.$router.push(`/update_info?id=${userInfo.value?.id}`);
  }else{
    proxy.$elmsg.error(proxy.$t("Error.InvalidUser"))
  }
}
</script>
