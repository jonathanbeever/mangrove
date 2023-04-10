<template>
    <div
        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
        id="root"
    >
        <div v-if="index == 'NDSI'"  class="w-4/5">
            <DualLinexy
                :id="seriesName + 'DL' + 'AEI'"
                :dataSetData="[
                graphData.anthrophonyL,
                graphData.biophonyL,
                ]"
                :dataSetLabels="['Anthrophony', 'biophony']"
                :xLabel="'Date'"
                :yLabel="'Ndsi Index Value'"
            />
        </div>

        <div v-if="index == 'AEI'"  class="w-4/5">
            <DualLinexy
                :id="seriesName + 'DL' + 'AEI'"
                :dataSetData="[graphData.aeiL, graphData.aeiR]"
                :dataSetLabels="['AEI L', 'AEI R']"
                :xLabel="'Date'"
                :yLabel="'Aei Index Value'"
            />
        </div>

        <div v-if="index == 'ADI'"  class="w-4/5">
            <DualLinexy
                :id="seriesName + 'DL' + 'ADI'"
                :dataSetData="[graphData.adiL, graphData.adiR]"
                :dataSetLabels="['ADI L', 'ADI R']"
                :xLabel="'Date'"
                :yLabel="'Adi Index Value'"
            />
        </div>

        <div v-if="index == 'BI'"  class="w-4/5">
            <DualLinexy
                :id="seriesName + 'DL' + 'BIO'"
                :dataSetData="[graphData.areaL, graphData.areaR]"
                :dataSetLabels="['BI L', 'BI R']"
                :xLabel="'Date'"
                :yLabel="'Bio Index Value'"
            />
        </div>

        <div v-if="index == 'RMS'"  class="w-4/5">
            <DualLinexy
                :id="seriesName + 'DL' + 'AEI'"
                :dataSetData="[graphData.rmsL, graphData.rmsR]"
                :dataSetLabels="['RMS L', 'RMS R']"
                :xLabel="'Date'"
                :yLabel="'Rms Index Value'"
            />
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue"

import DualLinexy from "@/Pages/ChartVisualizations/DualLinexy.vue";

export default defineComponent({
    components: {
        DualLinexy
    },
    props: {
        index: {
            type: String,
            required: true
        },
        seriesName: {
            type: String,
            required: true
        },
        graphData: {
            type: Object,
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
