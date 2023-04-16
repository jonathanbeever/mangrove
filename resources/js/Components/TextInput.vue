<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: [String, Number],
    modelModifiers: { default: () => ({})}
});

const emit = defineEmits(['update:modelValue']);

const input = ref(null);

function emitValue(e) {
    let value = e.target.value
    if (props.modelModifiers.number && !isNaN(parseFloat(value))) {
        value = parseFloat(value)
    }
    emit('update:modelValue', value)
}

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <input
        ref="input"
        class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
        :value="modelValue"
        @input="emitValue"
    >
</template>
