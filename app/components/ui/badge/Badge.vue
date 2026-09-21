<script setup lang="ts">import { cn } from '@/lib/utils'; const props = defineProps<{ class?: string }>()</script>
<template><span :class="cn('inline-flex items-center rounded-full bg-[#e3e8ff] px-2.5 py-1 text-xs font-bold text-[#3147bd]', props.class)"><slot /></span></template>
