<template>
  <div>
    <div class="relative min-h-screen">
      <div class="relative z-10 text-center my-8">
        <h1 class="text-5xl md:text-7xl font-bold mb-8">
          {{ $t("info.a1") }}
        </h1>
        <p class="text-xl text-gray-300 my-4 max-w-2xl mx-auto">
          {{ $t("info.a2") }}
        </p>
      </div>
      <el-row class="bg-white/5 backdrop-blur-xl rounded-2xl p-8 mb-8">
        <el-col :span="12">
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-400">10K+</div>
            <div class="text-gray-400">{{ $t("info.a11") }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-400">30392</div>
            <div class="text-gray-400">{{ $t("info.a12") }}</div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :xs="{span: 24}" :md="{span: 12}" class="mb-4">
          <router-link to="/m/Molecular">
            <div
              class="bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:bg-white/10 transition h-36"
            >
              <div class="text-3xl font-bold hover:gradient-text mb-2">
                {{ $t("info.a3") }}
              </div>
              <div class="text-gray-400">{{ $t("info.a4") }}</div>
            </div>
          </router-link>
        </el-col>
        <el-col :xs="{span: 24}" :md="{span: 12}" class="mb-4">
          <router-link to="/m/Reanalysis">
            <div
              class="bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:bg-white/10 transition h-36"
            >
              <div class="text-3xl font-bold hover:gradient-text mb-2">
                {{ $t("info.a5") }}
              </div>
              <div class="text-gray-400">{{ $t("info.a6") }}</div>
            </div>
          </router-link>
        </el-col>
        <el-col :xs="{span: 24}" :md="{span: 12}" class="mb-4">
          <router-link to="/m/Spectrum">
            <div
              class="bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:bg-white/10 transition h-36"
            >
              <div class="text-3xl font-bold hover:gradient-text mb-2">
                {{ $t("info.a7") }}
              </div>
              <div class="text-gray-400">{{ $t("info.a8") }}</div>
            </div>
          </router-link>
        </el-col>
        <el-col :xs="{span: 24}" :md="{span: 12}" class="mb-4">
          <router-link to="/m/Customed">
            <div
              class="bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:bg-white/10 transition h-36"
            >
              <div class="text-3xl hover:gradient-text font-bold mb-2">
                {{ $t("info.a9") }}
              </div>
              <div class="text-gray-400">{{ $t("info.a10") }}</div>
            </div>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
</script>
