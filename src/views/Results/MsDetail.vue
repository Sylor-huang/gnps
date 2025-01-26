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
            :fixed="index == '0'"
          >
            <template #default="scope">
              <div v-if="index == '0'">
                <el-popover placement="right" :width="120" trigger="click">
                  <template #reference>
                    <el-button
                      size="large"
                      link
                      type="primary"
                      class="w-full"
                      >{{ scope.row[cl] }}</el-button
                    >
                  </template>
                  <div>
                    <div class="mb-2">row ID: #{{ scope.row[cl] }}</div>
                    <div class="mb-2">
                      <el-button
                        link
                        type="primary"
                        @click="
                          showModalDetail(
                            'E_match_',
                            scope.row[cl],
                            'Experimental'
                          )
                        "
                        >Experimental</el-button
                      >
                    </div>
                    <div>
                      <el-button
                        link
                        type="primary"
                        @click="
                          showModalDetail(
                            'IS_match_',
                            scope.row[cl],
                            'In silico'
                          )
                        "
                        >In silico
                      </el-button>
                    </div>
                  </div>
                </el-popover>
              </div>
              <div v-else>
                <div v-if="scope.row[cl].length > 30">
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
    <div v-if="state.showModal">
      <el-dialog v-model="state.showModal" top="5vh" width="80%" :title="state.modalFile">
        <MsMatchDetail
          :uuid="uuid"
          :fileName="state.fileName"
          :dirName="dirName"
          :fileId="state.fileId"
        ></MsMatchDetail>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import {getCurrentInstance, ref, reactive, onMounted, computed} from "vue";
let {proxy} = getCurrentInstance();
import {getTaskResult} from "@/api/tasks.js";
import Papa from "papaparse";
import {MsMatchDetail} from "@/views/index.js";

defineProps({
  uuid: {
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
  fileName: "",
  modalFile: "",
  fileId: "",
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
      fileName: "MS1match_",
    });
    if (res.success) {
      Papa.parse(res.data, {
        header: true, // 第一行为表头
        skipEmptyLines: true, // 跳过空行
        complete: (parsedResult) => {
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

let showModalDetail = (val, id, mval) => {
  state.showModal = true;
  state.fileName = val;
  state.modalFile = mval;
  state.fileId = String(id);
};
</script>
