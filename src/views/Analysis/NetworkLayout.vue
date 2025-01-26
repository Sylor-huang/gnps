<template>
  <el-row :gutter="24">
    <el-col :span="24" class="mb-4">
      <div class="text-xl font-bold text-primary">
        - {{ $t("molecular.a13") }}
      </div>
    </el-col>
    <el-col :xs="{span: 24}" :md="{span: 6}">
      <el-form-item prop="shared_peaks" :label="$t('molecular.a8')">
        <el-input v-model="state.network_params.shared_peaks" type="number">
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="{span: 24}" :md="{span: 6}">
      <el-form-item prop="threshold_values" :label="$t('molecular.a7')">
        <el-input v-model="state.network_params.threshold_values" type="number">
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :xs="{span: 24}" :md="{span: 6}">
      <el-form-item prop="connection_mode" :label="$t('molecular.a12')">
        <el-select
          v-model="state.search_params.connection_mode"
          :placeholder="$t('molecular.a12')"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="(item, index) in connectionModeOptions"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :xs="{span: 24}" :md="{span: 6}">
      <el-form-item prop="matching_method" :label="$t('molecular.a6')">
        <el-select
          v-model="state.network_params.matching_method"
          :placeholder="$t('molecular.a6')"
          size="large"
          class="w-full"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in mathingOptions"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-col>
  </el-row>
</template>
<script setup>
import {getCurrentInstance, ref} from "vue";
let {proxy} = getCurrentInstance();
import {connectionModeOptions, mathingOptions} from "./options.js";
defineProps({
  state: {
    type: Object,
    default: {},
  },
});
</script>
