<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'reka-ui'
import { X } from '@lucide/vue'
</script>
<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 bg-[#10131a]/60 backdrop-blur-sm data-[state=open]:animate-in" />
    <DialogContent class="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#f4f3ed] p-6 text-[#10131a] shadow-2xl focus:outline-none">
      <slot />
      <DialogClose class="absolute right-4 top-4 grid size-9 place-items-center rounded-full hover:bg-black/5" aria-label="Close settings"><X class="size-4" /></DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
