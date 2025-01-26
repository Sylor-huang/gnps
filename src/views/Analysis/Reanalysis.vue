<template>
  <div>
    <el-card v-loading="state.loading">
      <div class="mb-8">
        <div class="text-3xl font-bold mb-2">{{ $t("info.a5") }}</div>
        <div class="text-gray-400">{{ $t("info.a6") }}</div>
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
              - {{ $t("molecular.a14") }}
            </div>
          </el-col>
          <el-col :span="24" class="mb-4">
            <el-form-item prop="task_id">
              <el-input
                v-model="state.task_id"
                :placeholder="$t('molecular.a14')"
              >
              </el-input>
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
import {reactive, getCurrentInstance} from "vue";
import SearchLayout from "./SearchLayout.vue";
import NetworkLayout from "./NetworkLayout.vue";
import {createTask} from "@/api/tasks.js";
import {v4 as uuidv4} from "uuid";
let {proxy} = getCurrentInstance();

const state = reactive({
  loading: false,
  task_id: "",
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

let startInitTask = async () => {
  state.loading = false;
  const uuid = uuidv4();
  const params = {
    task_id: state.task_id,
    search_params: state.search_params,
    network_params: state.network_params,
  };
  const cres = await createTask({
    uuid: uuid,
    workflow: "Reanalysis",
    params: JSON.stringify(params),
  });

  if (cres.success) {
    state.uuid = cres.uuid;
  } else {
    proxy.$elmsg.error(cres.message);
  }
};
</script>
