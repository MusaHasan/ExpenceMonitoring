<script setup lang="ts">
interface Props {
	value: number; // 0..1
}
const props = defineProps<Props>();
</script>

<template>
	<div class="track">
		<div class="bar" :style="{ width: `${Math.max(0, Math.min(1, props.value)) * 100}%` }" />
	</div>
</template>

<style scoped>
.track {
	width: 100%;
	height: 8px;
	background: #eef0f5;
	border-radius: 999px;
	overflow: hidden;
}
.bar {
	height: 100%;
	background: #0f172a;
}
</style>



