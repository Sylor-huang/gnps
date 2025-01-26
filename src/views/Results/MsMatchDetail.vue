<template>
  <div v-loading="state.rloading" class="mt-8">
    <div v-if="state.quantCsv.length > 0">
      <el-table
        :data="paginatedData"
        :height="400"
        header-cell-class-name="text-center"
        cell-class-name="text-center"
      >
        <template v-for="(cl, index) in state.columns" :key="index">
          <el-table-column
            :prop="cl"
            :label="cl"
            width="120"
            size="small"
            :fixed="index == '0'"
          >
            <template #default="scope">
              <div v-if="scope.row[cl].length > 48">
                <el-popover
                  placement="left-end"
                  :width="200"
                  trigger="click"
                  @before-enter="show_popver(cl)"
                >
                  <template #reference>
                    <el-button size="small" link type="primary"
                      >Show Detail</el-button
                    >
                  </template>
                  <div
                    class="max-h-40 overflow-y-auto break-all"
                    v-if="state.pid == cl"
                  >
                    {{ scope.row[cl] }}
                  </div>
                </el-popover>
              </div>
              <div v-else>
                {{ scope.row[cl] }}
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="mt-8">
        <el-pagination
          layout="total,prev, pager, next"
          :total="state.pagies.total"
          :page-size="state.pagies.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-empty :image-size="200" v-else />
  </div>
</template>
<script setup>
import {getCurrentInstance, ref, reactive, onMounted, computed} from "vue";
let {proxy} = getCurrentInstance();
import {getTaskResult} from "@/api/tasks.js";
import Papa from "papaparse";
import {dirname} from "path";

defineProps({
  uuid: {
    type: String,
    default: "",
  },
  fileName: {
    type: String,
    default: "",
  },
  fileId: {
    type: String,
    default: "",
  },
  dirName: {
    type: String,
    default: "",
  },
});

const state = reactive({
  rloading: false,
  pid: undefined,
  showModal: false,
  modalFile: "",
  target: {},
  columns: [],
  quantCsv: [],
  pagies: {
    total: 0,
    pageSize: 10,
    page: 1,
  },
});

const paginatedData = computed(() => {
  const start = (state.pagies.page - 1) * state.pagies.pageSize;
  const end = start + state.pagies.pageSize;
  return state.quantCsv.slice(start, end);
});

onMounted(() => {
  getResultFile();
});

let getResultFile = async () => {
  state.rloading = true;
  try {
    const res = await getTaskResult({
      uuid: proxy.uuid,
      dirName: proxy.dirName,
      fileName: proxy.fileName,
      fileId: proxy.fileId,
    });
    if (res.success) {
      Papa.parse(res.data, {
        header: true, // 第一行为表头
        skipEmptyLines: true, // 跳过空行
        complete: (parsedResult) => {
          console.log(parsedResult);
          const csvHeaders = parsedResult.meta.fields;
          state.columns = csvHeaders;
          state.quantCsv = parsedResult.data;
          state.pagies.total = parsedResult.data.length;
        },
      });
    } else {
      state.rloading = false;
      proxy.$elmsg.error(res.message);
    }
    state.rloading = false;
  } catch (e) {
    state.rloading = false;
  }
};

let handleCurrentChange = (page) => {
  state.pagies.page = page;
};

let show_popver = (id) => {
  state.pid = id;
};
</script>
