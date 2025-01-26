<template>
  <div>
    <el-card v-loading="state.loading">
      <div class="mb-8">
        <div class="text-3xl font-bold mb-2">{{ $t("info.a9") }}</div>
        <div class="text-gray-400">{{ $t("info.a10") }}</div>
      </div>
      <el-form
        ref="refInputForm"
        size="large"
        :model="state"
        label-position="top"
      >
        <el-row :gutter="24">
          <el-col :span="24" class="mb-4">
            <div class="text-xl font-bold text-primary">
              - {{ $t("molecular.a19") }}
            </div>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('molecular.a20')">
              <el-input
                v-model="state.database_name"
                :placeholder="$t('molecular.a20')"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb-4">
            <div class="text-xl font-bold text-primary">
              - {{ $t("molecular.a0") }}
            </div>
          </el-col>
          <el-col :xs="{span: 24}" :md="{span: 12}">
            <el-form-item :label="$t('molecular.a1')">
              <Uploads
                uploadType="feature_file"
                @uploadFileSuccess="handleUploadFeature"
                @handleFileDestroy="handleRemoveFeature"
                accepts="text/csv"
              ></Uploads>
            </el-form-item>
          </el-col>
          <el-col :xs="{span: 24}" :md="{span: 12}">
            <el-form-item :label="$t('molecular.a2')">
              <Uploads
                uploadType="mass_list"
                @uploadFileSuccess="handleUploadFeature"
                @handleFileDestroy="handleRemoveFeature"
                accepts=".mgf,.txt,application/x-mascot-mgf,text/plain"
              ></Uploads>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :xs="{span: 24}" :md="{span: 6}">
            <el-form-item>
              <el-button class="w-full" size="large" type="primary" @click="startInitTask">{{
                $t("common.submit")
              }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="{span: 24}" :md="{span: 18}" v-if="state.uuid && state.uuid.length > 0">
            <el-form-item>
              <el-alert :title="$t('info.a15', {uuid: state.uuid})" type="success" :closable="false"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import {getCurrentInstance, ref, reactive} from "vue";
import Uploads from "./Uploads";
import {createCustomDb, uploadFiles} from "@/api/tasks.js";
import {v4 as uuidv4} from "uuid";
let {proxy} = getCurrentInstance();

const state = reactive({
  loading: false,
  uuid: "",
  loading: false,
  files: {},
  mass_list: undefined,
  database_name: "",
});

let handleRemoveFeature = (info) => {
  state.files[info.uploadType] = undefined;
};

let handleUploadFeature = (info) => {
  state.files[info.uploadType] = info.file.raw;
};

let startInitTask = async () => {
  try {
    state.loading = true;
    const formData = new FormData();
    const uuid = uuidv4();
    let files = Object.values(state.files);
    files = files.filter((item) => item && (item != null));
    formData.append("uuid", uuid);
    if (files.length > 0) {
      for (const f of files) {
        formData.append("files", f); // 逐个追加文件
      }
    }else{
      proxy.$elmsg.error(proxy.$t("Error.emptyFiles"))
      state.loading = false;
      return false
    }

    const res = await uploadFiles(formData);
    if (res.success) {
      const params = {
        upload_files: res.files,
      };
      const cres = await createCustomDb({
        uuid: uuid,
        name: state.database_name,
        params: JSON.stringify(params),
      });
      if (cres.success) {
        state.uuid = cres.uuid
      } else {
        proxy.$elmsg.error(cres.message);
      }
    } else {
      proxy.$elmsg.error(res.message);
    }

    state.loading = false;
  } catch (e) {
    state.loading = false;
  }
};


</script>
