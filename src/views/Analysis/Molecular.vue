<template>
  <div>
    <el-card v-loading="state.loading">
      <div class="mb-8">
        <div class="text-3xl font-bold mb-2">{{ $t("info.a3") }}</div>
        <div class="text-gray-400">{{ $t("info.a4") }}</div>
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
        <SearchLayout :state="state"></SearchLayout>
        <NetworkLayout :state="state"></NetworkLayout>
        <el-row :gutter="24">
          <el-col :xs="{span: 24}" :md="{span: 6}">
            <el-form-item>
              <el-button
                class="w-full"
                size="large"
                type="primary"
                @click="startInitTask"
                >{{ $t("common.submit") }}</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :xs="{span: 24}" :md="{span: 18}" v-if="state.uuid && state.uuid.length > 0">
            <el-form-item>
              <el-alert :title="$t('info.a13', {uuid: state.uuid})" type="success" :closable="false"/>
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
import SearchLayout from "./SearchLayout.vue";
import NetworkLayout from "./NetworkLayout.vue";
import {createTask, uploadFiles} from "@/api/tasks.js";
import {v4 as uuidv4} from "uuid";
let {proxy} = getCurrentInstance();

const state = reactive({
  uuid: "",
  loading: false,
  files: {},
  search_params: {
    ms_tolerance: 10,
    shared_peaks: 5,
    threshold_values: undefined,
    database: "default",
    matching_method: "",
  },
  network_params: {
    shared_peaks: 5,
    threshold_values: undefined,
    connection_mode: "",
    matching_method: "",
  },
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
        if (f) {
          formData.append("files", f); // 逐个追加文件
        }
      }
    }else{
      proxy.$elmsg.error(proxy.$t("Error.emptyFiles"))
      state.loading = false;
      return false
    }

    const res = await uploadFiles(formData);
    if (res.success) {
      const params = {
        search_params: state.search_params,
        network_params: state.network_params,
        upload_files: res.files,
      };
      const cres = await createTask({
        uuid: uuid,
        workflow: "Molecular Networking",
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
