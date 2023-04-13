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
            required: false
        }
    },
    emits: ['update:modelValue'],
    mounted() {
        let root = document.getElementById("root")

        // Set up listener on root element so we can update the chart
        this.observer = new MutationObserver(() => {
            this.$emit('update:modelValue', root.firstElementChild.firstElementChild)
        })
        this.observer.observe(root, { childList: true })

        // Emit the value of the initial chart
        this.$emit('update:modelValue', root.firstElementChild.firstElementChild)
    },
    beforeDestroy() {
        this.observer.disconnect()
    }
})
</script>
