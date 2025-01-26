<template>
  <el-card>
    <div class="mb-6">
      <el-space class="w-full" fill wrap :size="24" :fill-ratio="20">
        <el-button icon="Refresh" size="large" @click="get_targets">{{
          $t("table.Refresh")
        }}</el-button>
        <el-popconfirm
          :confirm-button-text="$t('table.Yes')"
          :cancel-button-text="$t('table.No')"
          :title="$t('table.ConfirmDelete')"
          :width="220"
          @confirm="deleteRecords(state.batchIds)"
        >
          <template #reference>
            <el-button
              icon="Delete"
              size="large"
              :disabled="state.batchIds.length == 0"
              >{{ $t("table.BatchDelete") }}</el-button
            >
          </template>
        </el-popconfirm>
        <el-input
          v-model="state.q"
          size="large"
          class="w-52"
          placeholder="Search task id"
          clearable
          @change="searchColumn"
        >
        </el-input>
        <el-select
          v-model="state.w"
          placeholder="Select Workflow"
          clearable
          size="large"
          class="w-40"
          @change="SelectWorkflow"
        >
          <el-option
            v-for="(item, index) in state.workflows"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-space>
    </div>
    <el-table
      :data="state.targets"
      v-loading="state.loading"
      size="large"
      class="w-full"
      height="500px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column fixed type="index" label="Index" width="70">
        <template #default="scope">
          {{ tableIndex(scope.$index, state.pagies) }}
        </template>
      </el-table-column>
      <el-table-column fixed prop="uuid" label="Task Id" min-width="340">
        <template #default="scope">
          <div>
            <router-link
              :to="`/r/task_detail?uuid=${scope.row.uuid}`"
              class="hover:underline"
            >
              <span class="text-primary">{{ scope.row.uuid }}</span>
            </router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="workflow" label="Workflow" width="200">
      </el-table-column>
      <el-table-column prop="status" label="Status" width="120">
        <template #default="scope">
          <div>
            <span class="text-success"  v-if="scope.row.status && scope.row.status.toLowerCase() == 'done'">
              {{ scope.row.status }}
            </span>
            <span v-else>{{ scope.row.status }}</span>
            
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="Create Time" width="140">
        <template #default="scope">
          <div>
            <el-tooltip :content="scope.row.updated_at" effect="light">
              {{ timeAgo(scope.row.updated_at) }}
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="File Size(Mb)" width="120">
        <template #default="scope">
          <div>
            {{ scope.row.result_files?.size || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Delete Task" width="240">
        <template #default="scope">
          <el-popconfirm
            :confirm-button-text="$t('table.Yes')"
            :cancel-button-text="$t('table.No')"
            :title="$t('table.ConfirmDelete')"
            :width="220"
            @confirm="deleteRecords(scope.row.uuid)"
          >
            <template #reference>
              <el-button :loading="state.dloading" icon="Delete" size="small">{{
                $t("table.Delete")
              }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-8">
      <el-pagination
        layout="total,prev, pager, next"
        :total="state.pagies.total"
        :page-size="state.pagies.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>
<script setup>
import {getCurrentInstance, ref, reactive, onMounted} from "vue";
let {proxy} = getCurrentInstance();
import {timeAgo, tableIndex} from "@/utils/validate.js";
import {getTasks, deleteTask} from "@/api/tasks.js";

const state = reactive({
  loading: false,
  dloading: false,
  workflows: [
    "Molecular Networking",
    "Reanalysis",
    "Spectrum Searching",
  ],
  batchIds: [],
  q: "",
  w: "",
  pagies: {
    total: 0,
    page: 1,
    pageSize: 10,
    orderBy: "id",
    orderType: "desc",
    columns: ["id", "uuid", "workflow", "status", "result_files", "updated_at"],
  },
  params: {},
  targets: [],
});

onMounted(() => {
  get_targets();
});

let get_targets = async () => {
  state.loading = true;
  const res = await getTasks({conditions: state.params, options: state.pagies});
  if (res.success) {
    state.targets = res.data.data;
    state.pagies.total = res.data.total;
  } else {
    proxy.$elmsg.error(res.message);
  }
  state.loading = false;
};

const handleSelectionChange = (val) => {
  state.batchIds = val.map((e) => e.uuid);
};

let handleCurrentChange = (page) => {
  state.pagies.page = page;
  get_targets();
};

let deleteRecords = async (uuid) => {
  state.dloading = true;
  let batchIds = [];
  if (typeof uuid == "string") {
    batchIds = [uuid];
  } else {
    batchIds = state.batchIds;
  }

  for (const uuid of batchIds) {
    const res = await deleteTask({uuid: uuid});
    if (!res.success) {
      proxy.$elmsg.error(res.message);
    }
  }
  state.dloading = false;
  get_targets();
};

let searchColumn = () => {
  if (state.q && state.q.length > 0) {
    state.params.uuid = {like: state.q};
  } else {
    state.params.uuid = "";
  }
  get_targets();
};

let SelectWorkflow = (val) => {
  state.params.workflow = val;
  get_targets();
};
</script>
