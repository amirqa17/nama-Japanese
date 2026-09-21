<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ variant?: 'default' | 'outline' | 'ghost' | 'lime'; size?: 'default' | 'sm' | 'icon'; class?: string }>(), { variant: 'default', size: 'default' })
const attrs = useAttrs()
const classes = computed(() => cn(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b68ff] disabled:pointer-events-none disabled:opacity-50',
  props.variant === 'default' && 'bg-[#10131a] text-white hover:bg-[#272b34]',
  props.variant === 'outline' && 'border border-[#d9d9d3] bg-white hover:bg-[#f3f3ef]',
  props.variant === 'ghost' && 'hover:bg-black/5',
  props.variant === 'lime' && 'border border-[#9ed331] bg-[#b8f24a] text-[#10131a] hover:bg-[#a9df43]',
  props.size === 'default' && 'h-10 px-4', props.size === 'sm' && 'h-9 px-3', props.size === 'icon' && 'size-10', props.class,
))
</script>
<template><button v-bind="attrs" :class="classes"><slot /></button></template>
