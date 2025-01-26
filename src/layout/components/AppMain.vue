<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in">
      <div class="min-h-screen relative">
        <keep-alive :max="5">
          <component 
            :is="Component" 
            v-if="$route.meta.keepAlive"
            :key="$route.path"
          />
        </keep-alive>
        <component 
          :is="Component" 
          v-if="!$route.meta.keepAlive"
          :key="$route.path"
        />
      </div>
    </transition>
  </router-view>
</template>
<script setup>
</script>

