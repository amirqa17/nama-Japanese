<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'
const model = defineModel<boolean>({ default: false })
</script>
<template>
  <SwitchRoot v-model="model" class="inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-[#d5d5d2] transition-colors data-[state=checked]:bg-[#4b68ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b68ff]/50">
    <SwitchThumb class="pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5" />
  </SwitchRoot>
</template>
