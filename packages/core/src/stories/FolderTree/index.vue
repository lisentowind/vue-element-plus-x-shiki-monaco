<template>
  <FolderTree
    v-bind="$attrs"
    :folderItems="folderItems"
    @fileSelect="handleFileSelect"
    @folderToggle="handleFolderToggle"
    @refresh="handleRefresh"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { FolderItem } from "../../components/FolderTree/types";
import FolderTree from "../../components/FolderTree/index.vue";
import { sampleData } from "./data";

const folderItems = ref<FolderItem[]>(sampleData);

const handleFileSelect = (item: FolderItem) => {
  console.log("File selected:", item);
};

const handleFolderToggle = (item: FolderItem, isExpanded: boolean) => {
  console.log("Folder toggled:", item, isExpanded);
};

const handleRefresh = () => {
  console.log("Refresh triggered");
};
</script>
