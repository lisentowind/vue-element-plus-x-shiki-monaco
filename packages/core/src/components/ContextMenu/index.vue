<script lang="ts" setup>
import { computed } from "vue";
import type {
  ContextMenuItem,
  MenuItem,
  ContextMenuPosition,
} from "../../hooks/useContextMenu";

interface Props {
  visible?: boolean;
  position?: ContextMenuPosition;
  items?: ContextMenuItem[];
  variant?: 'classic' | 'glass';
  theme?: string; // 添加主题属性用于判断亮暗色
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  position: () => ({ x: 0, y: 0 }),
  items: () => [],
  variant: 'glass',
  theme: 'light',
});

const emit = defineEmits<{
  itemClick: [item: MenuItem];
  hide: [];
}>();

const menuStyle = computed(() => ({
  left: `${props.position.x}px`,
  top: `${props.position.y}px`,
  display: props.visible ? "block" : "none",
}));

const menuClasses = computed(() => ({
  'context-menu': true,
  'context-menu--classic': props.variant === 'classic',
  'context-menu--glass': props.variant === 'glass',
  'context-menu--direction-up': props.position?.direction === 'up',
  'context-menu--direction-down': props.position?.direction === 'down',
}));

const isDarkTheme = computed(() => {
  return props.theme && props.theme.toLowerCase().includes('dark');
});

const themeClasses = computed(() => ({
  'theme-light': !isDarkTheme.value,
  'theme-dark': isDarkTheme.value,
}));

const handleItemClick = (item: ContextMenuItem) => {
  if (item.type === "item" && !item.disabled) {
    emit("itemClick", item);
  }
};

const handleMenuClick = (event: Event) => {
  event.stopPropagation();
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :class="{ ...menuClasses, ...themeClasses }"
      :style="menuStyle"
      @click="handleMenuClick"
    >
      <div class="context-menu-content">
        <template v-for="(item, index) in items" :key="index">
          <div
            v-if="item.type === 'separator'"
            class="context-menu-separator"
          ></div>
          <div
            v-else
            class="context-menu-item"
            :class="{ disabled: item.disabled }"
            @click="handleItemClick(item)"
          >
            <div class="menu-item-content">
              <div class="menu-item-icon" v-if="item.icon">
                <i :class="item.icon"></i>
              </div>
              <div class="menu-item-label">{{ item.label }}</div>
              <div class="menu-item-shortcut" v-if="item.shortcut">
                {{ item.shortcut }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style src="./index.scss" scoped></style>
