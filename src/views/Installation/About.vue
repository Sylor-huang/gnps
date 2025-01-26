<template>
  <div>
    <div class="mb-6 font-bold text-xl">
      {{ $t("aboutPage.a1") }}
    </div>
    <img src="@/assets/aboutPage.png" class="w-full my-1.5 mx-auto" />
    
  </div>
</template>
<script setup>
import { getCurrentInstance,ref, onMounted } from 'vue'
let { proxy } = getCurrentInstance()

</script>