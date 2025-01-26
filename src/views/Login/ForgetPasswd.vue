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
            <div class="text-2xl">{{ $t("common.fpasswd") }}</div>
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
          <el-form-item prop="password" :label="$t('common.npasswd')">
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
import {SendEmail, updateUserPasswd} from "@/api/user";
import {validEmail, validPassword} from "@/utils/validate";

let {proxy} = getCurrentInstance();
const state = reactive({
  loading: false,
  sending: false,
  send_msg: "Send",
  timeCount: 60,
});
let formInline = reactive({
  email: "",
  password: "",
  verify_code: "",
  uuid: "",
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
  if (value === "") {
    callback(new Error(proxy.$t("pld.email")));
  } else if (!validPassword(value)) {
    callback(new Error(proxy.$t("pld.InvalidPasswd")));
  } else {
    callback();
  }
};

let formRules = reactive({
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
        const res = await updateUserPasswd(formInline);
        if (res.success) {
          proxy.$router.push('/login')
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
    subject: proxy.$t("pld.forgetEmailSubject"),
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
