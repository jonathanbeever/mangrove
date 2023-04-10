<template>
    <div
        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
        id="root"
    >
        <div class="w-4/5">
            <AllInSiteChart
                :id="siteName + index + 'AllInSite'"
                :dataSetData="graphData"
                :dataSetLabels="graphLabels"
                :xLabel="'Date'"
                :yLabel="index"
            />
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue"

import AllInSiteChart from "@/Pages/ChartVisualizations/AllInSiteChart.vue";

export default defineComponent({
    components: {
        AllInSiteChart
    },
    props: {
        index: {
            type: String,
            required: true
        },
        siteName: {
            type: String,
            required: true
        },
        graphData: {
            type: Object,
            required: true
        },
        graphLabels: {
            type: Array,
            required: true
        },
        modelValue: { // Active Chart Element
            type: Object,
            required: true
        }
    },
    emits: ['update:modelValue'],
    watch: {
        index() {
            modelValue = document.getElementById("root").firstElementChild.firstElementChild
        }
    }
})
</script>
