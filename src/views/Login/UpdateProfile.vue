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
          v-loading="state.loading"
        >
          <div class="text-center mb-8">
            <div class="text-2xl">{{ $t("common.updateUser") }}</div>
          </div>
          <el-form-item prop="email" :label="$t('common.email')">
            <div class="flex w-full">
              <el-input
                v-model="formInline.email"
                size="large"
                clearable
                autocomplete="on"
                class="flex-1 mr-4"
              ></el-input>
              <el-button
                icon="Promotion"
                @click="sendSignUpEmail"
                class="w-36"
                :loading="state.sending"
              >
                {{ state.send_msg }}
                {{ `${state.sending ? `${state.timeCount}s` : ""}` }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item prop="verify_code" :label="$t('common.verify_code')">
            <el-input
              v-model="formInline.verify_code"
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
          <el-form-item prop="name" :label="$t('common.userName')">
            <el-input
              v-model="formInline.name"
              placeholder="Optional"
              size="large"
              clearable
              autocomplete="on"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item prop="company" :label="$t('common.Organ')">
            <el-input
              v-model="formInline.company"
              placeholder="Optional"
              size="large"
              clearable
              autocomplete="on"
              maxlength="64"
            ></el-input>
          </el-form-item>
          <el-form-item class="mt-8">
            <el-button
              type="primary"
              size="large"
              class="w-full"
              :disabled="state.loading"
              @click="loginUser"
            >
              {{ $t("common.confirm") }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import {getCurrentInstance, ref, reactive, onMounted} from "vue";
import {getUserInfo, SendEmail, updateUserInfo} from "@/api/user";
import Cookies from "js-cookie";
import {validEmail, validPassword} from "@/utils/validate";

let {proxy} = getCurrentInstance();
const state = reactive({
  loading: false,
  sending: false,
  send_msg: "Send",
  timeCount: 60,
});
let formInline = reactive({
  id: "",
  email: "",
  password: "",
  company: "",
  name: "",
  verify_code: "",
  uuid: "",
});

onMounted(async () => {
  const {id} = proxy.$route.query;
  const res = await getUserInfo({id: id});
  if (res.user) {
    formInline.id = Number(id)
    formInline.email = res.user.email;
    formInline.company = res.user.company;
    formInline.name = res.user.name;
  }
});

const validateEmail = (rule, value, callback) => {
  if (value === "") {
    callback(new Error(proxy.$t("pld.email")));
  } else if (!validEmail(value)) {
    callback(new Error(proxy.$t("pld.InvalidEmail")));
  } else {
    callback();
  }
};

const validatePasswd = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (!validPassword(value)) {
      callback(new Error(proxy.$t("pld.InvalidPasswd")));
    } else {
      callback();
    }
  }else{
    callback();
  }
};
let formRules = reactive({
  name: [{required: true, message: proxy.$t("pld.email"), trigger: "blur"}],
  email: [{required: true, validator: validateEmail, trigger: "blur"}],
  password: [{validator: validatePasswd, trigger: "blur"}],
  verify_code: [
    {required: true, message: proxy.$t("pld.email"), trigger: "blur"},
  ],
});

let loginUser = () => {
  proxy.$refs["refElForm"].validate(async (valid) => {
    if (valid) {
      state.loading = true;
      try {
        const res = await updateUserInfo(formInline);
        if (res.token && res.user) {
          localStorage.setItem("gs_userInfo", JSON.stringify(res.user));
          Cookies.set("gs_userToken", res.token, {
            expires: 30,
          });
          proxy.$elmsg.success(proxy.$t("pld.updateSuccess"));
          proxy.$store.dispatch("app/toggleUserInfo", res.user);
          const redirectPath = proxy.$route.query.redirect || '/'; // 如果没有 redirect 参数，默认值为 '/'
          proxy.$router.push(redirectPath)
        } else {
          proxy.$elmsg.error(proxy.$t("Error.someError"));
        }
      } catch (e) {
        proxy.$elmsg.error(e);
      }
      state.loading = false;
    } else {
      return false;
    }
  });
};

let sendSignUpEmail = async () => {
  state.sending = true;
  state.send_msg = proxy.$t("common.resend");
  const data = {
    to: formInline.email,
    subject: proxy.$t("pld.updateEmailSubject"),
    text: proxy.$t("common.verify_code"),
  };
  const res = await SendEmail(data);
  if (res.success) {
    proxy.$elmsg.success(proxy.$t("pld.emailSendSuccess"));
    formInline.uuid = res.uuid;
    const timer = setInterval(() => {
      state.timeCount--;
      if (state.timeCount <= 0) {
        clearInterval(timer); // 清除定时器
        state.sending = false;
      }
    }, 1000); // 每秒更新一次
    state.timeCount = 60;
  } else {
    proxy.$elmsg.error(res.message);
    state.sending = false;
  }
};
</script>
