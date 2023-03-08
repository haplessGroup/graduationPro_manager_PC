<template>
            <el-container style="height: 100vh;">
              <div>
                <SideNaviBar></SideNaviBar>
              </div>
              <el-container>
                <el-header style="padding: 0;">
                  <NavBar />
                </el-header>
                <el-main>
                  <router-view />
                </el-main>
              </el-container>
    </el-container>
</template>
<script lang="ts" setup>
import NavBar from '@/components/NavBar.vue';
import SideNaviBar from '@/components/sideNaviBar.vue';
</script>
