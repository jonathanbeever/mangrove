<template>
    <app-layout title="Queue">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Queue
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <queue />
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
    import { defineComponent } from 'vue'
    import AppLayout from '@/Layouts/AppLayout.vue'
    import Queue from '@/Jetstream/JobQueue.vue'

    export default defineComponent({
        components: {
            AppLayout,
            Queue,
        },
    })
</script>
