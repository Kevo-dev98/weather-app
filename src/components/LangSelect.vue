<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{ modelValue: "es" | "en" | "fr" }>();
const emit = defineEmits<{
  (e: "update:modelValue", v: "es" | "en" | "fr"): void;
}>();

const open = ref(false);
function toggle() {
  open.value = !open.value;
}
function choose(v: "es" | "en" | "fr") {
  emit("update:modelValue", v);
  open.value = false;
}

function onDocClick(e: MouseEvent) {
  const el = e.target as HTMLElement;
  if (!el.closest(".lang-root")) open.value = false;
}
onMounted(() => document.addEventListener("click", onDocClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
</script>

<template>
  <div class="lang-root">
    <button
      class="lang-trigger"
      @click="toggle"
      aria-haspopup="listbox"
      :aria-expanded="open"
    >
      <span>{{ props.modelValue.toUpperCase() }}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10l5 5 5-5z" fill="currentColor" />
      </svg>
    </button>

    <div v-if="open" class="lang-menu" role="listbox">
      <button class="lang-item" @click="choose('es')">ES</button>
      <button class="lang-item" @click="choose('en')">EN</button>
      <button class="lang-item" @click="choose('fr')">FR</button>
    </div>
  </div>
</template>

<style scoped>
.lang-root {
  position: relative;
}
.lang-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
}
.lang-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 59.78px;
  background: #fff;
  color: #111;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
  z-index: 2000;
  padding: 6px;
}
.lang-item {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.lang-item:hover {
  background: #e8f0fe;
}
</style>
