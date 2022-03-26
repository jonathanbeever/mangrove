<template>
    <app-layout title="Dashboard">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Dashboard
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <test :id="'chartid'" :xBarLabels="[1, 2, 3, 4]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'xLabel'" :yLabel="'yLabel'"/>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
    import { defineComponent } from 'vue'
    import AppLayout from '@/Layouts/AppLayout.vue'
    import Welcome from '@/Jetstream/Welcome.vue'
    import test from '@/Pages/ChartVisualizations/DualLine.vue'

    export default defineComponent({
        components: {
            AppLayout,
            Welcome,
            test
        },
    })
</script>
