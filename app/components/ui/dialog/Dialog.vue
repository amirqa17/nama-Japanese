<script setup lang="ts">import { DialogRoot } from 'reka-ui'; const open = defineModel<boolean>('open')</script>
<template><DialogRoot v-model:open="open"><slot /></DialogRoot></template>
