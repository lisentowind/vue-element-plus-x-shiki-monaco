<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import Monaco from "../../components/Monaco/index.vue";

// 重复一千次
const mockCode = `
  function helloWorld() {
    console.log("Hello, World!");
  }

  helloWorld();
  `.repeat(10);

const timer = ref();
const index = ref(0);
function start() {
  timer.value = setInterval(() => {
    index.value += 50;
    if (index.value > mockCode.length) {
      clearInterval(timer.value);
      index.value = mockCode.length;
    }
  }, 100);
}

const content = computed(() => {
  return mockCode.slice(0, index.value);
});

onMounted(() => {
  start();
});
</script>

<template>
  <Monaco v-bind="$attrs" :value="content" />
</template>
