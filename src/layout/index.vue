<template>
    <el-container style="background-color: #F5F5F5;height: 100vh;">
        <el-aside style="width: 220px;">
            <div>
                <SideNaviBar></SideNaviBar>
            </div>
        </el-aside>
        <el-main>
            <router-view />
        </el-main>
    </el-container>
</template>
<script lang="ts" setup>
import SideNaviBar from '@/components/sideNaviBar.vue';
</script>
