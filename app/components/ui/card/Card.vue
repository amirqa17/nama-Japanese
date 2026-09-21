<script setup lang="ts">import { cn } from '@/lib/utils'; const props = defineProps<{ class?: string }>()</script>
<template><div :class="cn('rounded-3xl border border-[#d9d9d3] bg-white text-[#10131a]', props.class)"><slot /></div></template>
