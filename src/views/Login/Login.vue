<template>
  <el-row :gutter="18" class="mt-4 mb-12">
    <el-col
      :xs="{span: 24}"
      :sm="{span: 18, offset: 3}"
      :md="{span: 12, offset: 6}"
    >
      <el-card>
        <el-form
          ref="refElForm"
          size="large"
          :model="formInline"
          :rules="formRules"
          label-position="top"
        >
          <div class="text-center mb-8">
            <div class="text-2xl">{{ $t("pld.login") }}</div>
          </div>
          <el-form-item prop="email" :label="$t('common.email')">
            <el-input
              v-model="formInline.email"
              size="large"
              clearable
              autocomplete="on"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" :label="$t('common.passwd')">
            <el-input
              v-model="formInline.password"
              size="large"
              type="password"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="mt-8">
            <el-button
              type="primary"
              size="large"
              class="w-full"
              :disabled="loading"
              @click="loginUser"
            >
              {{ $t("common.confirm") }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="text-right mt-8 whitespace-nowrap">
          <router-link to="/forget_password" class="default-link mr-8">
            <el-space>
              <span>{{ $t("pld.forget") }}</span>
              <el-icon><TopRight></TopRight></el-icon>
            </el-space>
          </router-link>
          <router-link to="/signup" class="default-link">
            <el-space>
              <span>{{ $t("pld.signup") }}</span>
              <el-icon><TopRight></TopRight></el-icon>
            </el-space>
          </router-link>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import {getCurrentInstance, ref, reactive} from "vue";
import { userLogin } from "@/api/user";
import { validEmail, validPassword } from "@/utils/validate";
import Cookies from "js-cookie";

let {proxy} = getCurrentInstance();
let loading = ref(false);
let formInline = reactive({
  email: "",
  password: "",
});

const validateEmail = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(proxy.$t("pld.email")))
  } else if (!validEmail(value)) {
    callback(new Error(proxy.$t("pld.InvalidEmail")))
  } else {
    callback()
  }
}

const validatePasswd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(proxy.$t("pld.email")))
  } else if (!validPassword(value)) {
    callback(new Error(proxy.$t("pld.InvalidPasswd")))
  } else {
    callback()
  }
}

let formRules = reactive({
  email: [{required: true, validator: validateEmail, trigger: "blur"}],
  password: [{validator: validatePasswd, trigger: "blur"}],
});

let loginUser = async() => {
  proxy.$refs["refElForm"].validate(async(valid) => {
    if (valid) {
      loading.value = true;
      try{
        const res = await userLogin(formInline)
        if (res.token && res.user) {
          localStorage.setItem("gs_userInfo", JSON.stringify(res.user));
          Cookies.set("gs_userToken", res.token, {
            expires: 30,
          });
          proxy.$elmsg.success(proxy.$t("pld.loginSuccess"));
          proxy.$store.dispatch("app/toggleUserInfo", res.user);
          const redirectPath = proxy.$route.query.redirect || '/'; // 如果没有 redirect 参数，默认值为 '/'
          proxy.$router.push(redirectPath)
        } else {
          proxy.$elmsg.error(proxy.$t("Error.someError"));
        }
      }catch(e) {
        console.log(e)
        // proxy.$elmsg.error(e);
      }
      loading.value = false;
    } else {
      return false;
    }
  });
};
</script>
