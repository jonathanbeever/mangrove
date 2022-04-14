<template>
    <app-layout title="Admin Panel">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Admin Panel
            </h2>
        </template>
    </app-layout>
</template>

<script>
import { defineComponent } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";

export default defineComponent({
    components: {
        AppLayout,
    },
    data() {
        return {};
    },
    mounted() {

    },
    methods: {

    }
});
</script>
