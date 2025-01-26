<template>
  <el-card>
    <template #header>
      <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3"
            >TaskId: {{ state.uuid }}
          </span>
        </template>
        <div class="mt-4">
          <el-space fill wrap :size="24" :fill-ratio="20" class="w-full">
            <div>
              <span class="text-gray-400 mr-2 text-xs">Status:</span>
              <el-tag
                v-if="state.target.status"
                :type="
                  state.target.status.toLowerCase() == 'done'
                    ? 'success'
                    : 'primary'
                "
                >{{ state.target.status }}</el-tag
              >
            </div>
            <div>
              <span class="text-gray-400 mr-2 text-xs">Workflow:</span>
              <span>{{ state.target.workflow }}</span>
            </div>
            <div>
              <span class="text-gray-400 mr-2 text-xs">UpdatedAt:</span>
              <span>{{ state.target.updated_at }}</span>
            </div>
            <div>
              <span class="text-gray-400 mr-2 text-xs">CompleteAt:</span>
              <span>{{ state.target.complete_at }}</span>
            </div>
          </el-space>
        </div>
        <div class="mt-4">
          <el-space
            fill
            wrap
            :size="24"
            :fill-ratio="20"
            class="w-full"
            alignment="start"
          >
            <div v-if="taskParams.search_params">
              <div class="">{{ formatKeys("search_params") }}:</div>
              <div v-for="(key, val) in taskParams.search_params" class="ml-2">
                <span class="text-gray-400 mr-2 text-xs"
                  >{{ formatKeys(val) }}:</span
                >
                <span>{{ key }}</span>
              </div>
            </div>
            <div v-if="taskParams.network_params">
              <div class="">{{ formatKeys("network_params") }}:</div>
              <div v-for="(key, val) in taskParams.network_params" class="ml-2">
                <span class="text-gray-400 mr-2 text-xs"
                  >{{ formatKeys(val) }}:</span
                >
                <span>{{ key }}</span>
              </div>
            </div>
            <div v-if="taskParams.other_params">
              <div class="">{{ formatKeys("other_params") }}:</div>
              <div v-for="(key, val) in taskParams.other_params" class="ml-2">
                <span class="text-gray-400 mr-2 text-xs"
                  >{{ formatKeys(val) }}:</span
                >
                <span>{{ key }}</span>
              </div>
            </div>
            <div v-if="taskParams.upload_files">
              <div class="">{{ formatKeys("upload_files") }}:</div>
              <div v-for="item in taskParams.upload_files" class="ml-2">
                <span class="text-gray-400 mr-2 text-xs">{{
                  item.filename
                }}</span>
              </div>
            </div>
            <div v-if="taskParams.result_files">
              <div class="">{{ formatKeys("result_files") }}:</div>
              <div v-for="(key, val) in taskParams.result_files" class="ml-2">
                <span class="text-gray-400 mr-2 text-xs">{{ val }}:</span>
                <span>{{ key }}</span>
              </div>
            </div>
          </el-space>
        </div>
      </el-page-header>
    </template>

    <div v-if="state.target.status && state.target.status.toLowerCase() == 'done'">
      <el-space
        fill
        wrap
        :size="24"
        :fill-ratio="20"
        class="w-full"
        alignment="start"
      >
        <el-button
          size="large"
          @click="setMenu('1')"
          :type="setButtonType('1')"
          >{{ $t("task.View") }}</el-button
        >
        <el-button
          size="large"
          @click="setMenu('2')"
          :type="setButtonType('2')"
          >{{ $t("task.NetworkView") }}</el-button
        >
        <el-button size="large" @click="downloadResult">{{
          $t("task.Download")
        }}</el-button>
      </el-space>
      <div>
        <el-empty :image-size="200" v-if="state.menu == '0'" />
        <MsDetail
          :uuid="state.target.uuid"
          :dirName="state.dirName"
          v-if="state.menu == '1'"
        ></MsDetail>
        <GraphDetail
          :uuid="state.target.uuid"
          :dirName="state.dirName"
          v-if="state.menu == '2'"
        ></GraphDetail>
      </div>
    </div>
    <el-empty :image-size="200" :description="state.target.status" v-else />
  </el-card>
</template>
<script setup>
import {getCurrentInstance, ref, reactive, onBeforeMount, computed} from "vue";
let {proxy} = getCurrentInstance();
import {getTasks, downloadZipResult} from "@/api/tasks.js";
import {formatKeys} from "@/utils/validate.js";
import {MsDetail, GraphDetail} from "@/views/index.js";
import JSON5 from "json5";

const state = reactive({
  loading: false,
  title: "",
  uuid: "",
  menu: "0",
  dirName: "",
  target: {},
  pagies: {
    total: 0,
    page: 1,
    pageSize: 1,
  },
});

const knownKeys = ["search_params", "network_params", "upload_files"];

onBeforeMount(() => {
  const {uuid} = proxy.$route.query;
  state.uuid = uuid;
  get_targets();
});

let get_targets = async () => {
  state.loading = true;
  const res = await getTasks({
    conditions: {uuid: state.uuid},
    options: state.pagies,
  });
  if (res.success) {
    state.target = res.data.data ? res.data.data[0] : {};
  } else {
    proxy.$elmsg.error(res.message);
  }
  state.loading = false;
};

let goBack = () => {
  proxy.$router.go(-1);
};

let taskParams = computed(() => {
  if (state.target.params) {
    const formatJson = JSON5.parse(state.target.params);
    const otherParams = Object.fromEntries(
      Object.entries(formatJson).filter(([key]) => !knownKeys.includes(key))
    );
    // 构建返回对象
    const result = {};

    // 如果 otherParams 存在且不为空，则添加到返回对象中
    if (Object.keys(otherParams).length > 0) {
      result.other_params = otherParams;
    }

    // 如果 search_params 存在，则添加到返回对象中
    if (formatJson.search_params) {
      result.search_params = formatJson.search_params;
    }

    // 如果 network_params 存在，则添加到返回对象中
    if (formatJson.network_params) {
      result.network_params = formatJson.network_params;
    }
    if (formatJson.upload_files) {
      result.upload_files = formatJson.upload_files;
    }

    if (state.target.result_files) {
      result.result_files = JSON5.parse(state.target.result_files);
      state.dirName = result.result_files.name;
    }

    return result;
  } else {
    return {};
  }
});

let setMenu = (val) => {
  state.menu = val;
};

let setButtonType = (val) => {
  if (state.menu == val) {
    return "primary";
  } else {
    return "default";
  }
};

let downloadResult = async () => {
  state.loading = true;
  try {
    const response = await downloadZipResult({
      uuid: state.target.uuid,
      dirName: state.dirName,
    });

    // 创建一个 Blob 对象
    const blob = new Blob([response], {type: "application/zip"});

    // 创建一个链接元素
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${state.dirName}.zip`; // 设置下载文件名
    document.body.appendChild(link);

    // 触发下载
    link.click();

    // 移除链接元素
    document.body.removeChild(link);
    state.loading = false;
    proxy.$elmsg.success(proxy.$t("task.DSuccess"))
  } catch (e) {
    state.loading = false;
  }
};
</script>
