<template>
  <el-row :gutter="24">
    <el-col :span="24" class="mb-4">
      <div class="text-xl font-bold text-primary">
        - {{ $t("molecular.a3") }}
      </div>
    </el-col>
    <el-col :xs="{span: 24}" :md="{span: 8}">
      <el-form-item prop="ms_tolerance" :label="$t('molecular.a4')">
        <el-input v-model="state.search_params.ms_tolerance" type="number">
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="{span: 24}" :md="{span: 8}">
      <el-form-item prop="shared_peaks" :label="$t('molecular.a8')">
        <el-input v-model="state.search_params.shared_peaks" type="number">
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="{span: 24}" :md="{span: 8}">
      <el-form-item prop="database" :label="$t('molecular.a5')">
        <el-select
          v-model="state.search_params.database"
          :placeholder="$t('molecular.a5')"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="(item, index) in dbOptionss"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="{span: 24}" :md="{span: 8}">
      <el-form-item prop="database" :label="$t('molecular.a6')">
        <el-select
          v-model="state.search_params.matching_method"
          :placeholder="$t('molecular.a6')"
          size="large"
          class="w-full"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in mathingOptions"
            :key="index"
            :value="item"
          >
            <span style="display: flex; align-items: center">
              {{ item }}
              <el-tooltip :content="`Tooltip for ${item}`" placement="top" effect="light">
                <el-icon style="margin-left: 8px" :size="12">
                  <InfoFilled />
                  <!-- 使用 Element Plus 的图标 -->
                </el-icon>
              </el-tooltip>
            </span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="{span: 24}" :md="{span: 8}">
      <el-form-item prop="threshold_values" :label="$t('molecular.a7')">
        <el-input v-model="state.search_params.threshold_values" type="number">
        </el-input>
      </el-form-item>
    </el-col>
  </el-row>
</template>
<script setup>
import {getCurrentInstance, ref, onMounted, reactive} from "vue";
let {proxy} = getCurrentInstance();
import {databaseOptions, mathingOptions} from "./options.js";
import {getCustomDbs} from "@/api/tasks.js";

defineProps({
  state: {
    type: Object,
    default: {},
  },
});

const dbOptionss = ref(["default"])

onMounted(() => {
  getCustomDatabses()
})

const getCustomDatabses = async() => {
  const res = await getCustomDbs()
  if(res.success) {
    dbOptionss.value = dbOptionss.value.concat(res.data)
  }else{
    proxy.$elmsg.error("info.a16")
  }

}
</script>
