<template>
  <div>
    <div class="text-xl font-bold mb-8">
      {{ $t("tutorial.a1") }}
    </div>
    <div class="p-4 text-success bg-white/5 rounded-2xl mb-8">
      {{ $t("tutorial.a2") }}
    </div>
    <div class="text-xl font-bold mb-8">
      {{ $t("tutorial.a3") }}
    </div>
    <div class="text-xl font-bold mb-8">
      {{ $t("tutorial.a4") }}
    </div>

    <div class="text-xl font-bold mb-8">
      <span>{{ $t("tutorial.a51") }}</span>
      <span class="text-success p-2">-h</span>
      <span>{{ $t("tutorial.a5") }}</span>
    </div>

    <div class="text-xl font-bold mb-8">
      <span class="text-success p-2">main</span>
      <span>{{ $t("tutorial.a6") }}</span>
    </div>
    <div class="text-xl font-bold mb-8">
      <span class="text-success p-2">mn</span>
      <span>{{ $t("tutorial.a7") }}</span>
    </div>
    <div class="text-xl font-bold mb-8">
      {{ $t("tutorial.a8") }}
    </div>
    <div class="p-4 text-success bg-white/5 rounded-2xl mb-8">
      {{ $t("tutorial.a9") }}
    </div>
  </div>
</template>
<script setup>
import {getCurrentInstance, ref} from "vue";
let {proxy} = getCurrentInstance();
</script>
