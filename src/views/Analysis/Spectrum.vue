<template>
  <div>
    <el-card v-loading="state.loading">
      <div class="mb-8">
        <div class="text-3xl font-bold mb-2">{{ $t("info.a7") }}</div>
        <div class="text-gray-400">{{ $t("info.a8") }}</div>
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
            <el-form-item :label="$t('molecular.a2')">
              <Uploads
                uploadType="mass_list"
                @uploadFileSuccess="handleUploadFeature"
                @handleFileDestroy="handleRemoveFeature"
                accepts=".mgf,application/x-mascot-mgf,text/plain"
              ></Uploads>
            </el-form-item>
          </el-col>
          <el-col :xs="{span: 24}" :md="{span: 12}">
            <el-form-item :label="$t('molecular.a15')">
              <el-input
                v-model="state.precursor"
                class="mb-4"
                :placeholder="$t('molecular.a16')"
              >
              </el-input>
              <el-input
                v-model="state.ms_spectrum"
                :placeholder="$t('molecular.a17')"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="mb-4">
          <el-alert type="warning" :closable="false">
            Tips: {{ $t("info.a14") }}
          </el-alert>
        </div>

        <SearchLayout :state="state"></SearchLayout>
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
          <el-col
            :xs="{span: 24}"
            :md="{span: 18}"
            v-if="state.uuid && state.uuid.length > 0"
          >
            <el-form-item>
              <el-alert
                :title="$t('info.a13', {uuid: state.uuid})"
                type="success"
                :closable="false"
              />
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
import {createTask, uploadFiles} from "@/api/tasks.js";
import {v4 as uuidv4} from "uuid";
let {proxy} = getCurrentInstance();

const state = reactive({
  loading: false,
  uuid: "",
  precursor: "",
  ms_spectrum: "",
  files: {},
  search_params: {
    ms_tolerance: 10,
    shared_peaks: 5,
    threshold_values: undefined,
    database: "default",
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
    const uuid = uuidv4();
    let files = Object.values(state.files);
    files = files.filter((item) => item && (item != null));
    let uploadParams = [];
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("uuid", uuid);
      for (const f of files) {
        if (f) {
          formData.append("files", f); // 逐个追加文件
        }
      }
      const res = await uploadFiles(formData);
      if (res.success) {
        uploadParams = res.files;
      } else {
        proxy.$elmsg.error(res.message);
        state.loading = false;
        return false;
      }
    }

    const params = {
      precursor: state.precursor,
      ms_spectrum: state.ms_spectrum,
      search_params: state.search_params,
      upload_files: uploadParams
    };
    const cres = await createTask({
      uuid: uuid,
      workflow: "Spectrum Searching",
      params: JSON.stringify(params),
    });

    if (cres.success) {
      state.uuid = cres.uuid;
    } else {
      proxy.$elmsg.error(cres.message);
    }
    state.loading = false;
  } catch (e) {
    console.log(e)
    state.loading = false;
  }
};
</script>
