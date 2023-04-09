<template>
    <div
        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
    >
        <div v-if="index == 'NDSI'" class="w-4/5">
            <QuadLine
                :id="seriesNameOne + 'DL' + 'AEI' + seriesNameTwo"
                :dataSetData="[
                graphDataOne.anthrophonyL,
                graphDataOne.biophonyL,
                graphDataTwo.anthrophonyL,
                graphDataTwo.biophonyL,
                ]"
                :dataSetLabels="[
                'Series 1 Anthro',
                'Series 1 Bio',
                'Series 2 Anthro',
                'Series 2 Bio',
                ]"
                :xLabel="'Date'"
                :yLabel="'NDSI'"
            />
        </div>

        <div v-if="index == 'AEI'" class="w-4/5">
            <QuadLine
                :id="seriesNameOne + 'DL' + 'AEI' + seriesNameTwo"
                :dataSetData="[
                graphDataOne.aeiL,
                graphDataOne.aeiR,
                graphDataTwo.aeiL,
                graphDataTwo.aeiR,
                ]"
                :dataSetLabels="[
                'Series 1 AEI L',
                'Series 1 AEI R',
                'Series 2 AEI L',
                'Series 2 AEI R',
                ]"
                :xLabel="'Date'"
                :yLabel="'Aei Index Value'"
            />
        </div>

        <div v-if="index == 'ADI'" class="w-4/5">
            <QuadLine
                :id="seriesNameOne + 'DL' + 'ADI' + seriesNameTwo"
                :dataSetData="[
                graphDataOne.adiL,
                graphDataOne.adiR,
                graphDataTwo.adiL,
                graphDataTwo.adiR,
                ]"
                :dataSetLabels="[
                'Series 1 ADI L',
                'Series 1 ADI R',
                'Series 2 ADI L',
                'Series 2 ADI R',
                ]"
                :xLabel="'Date'"
                :yLabel="'Adi Index Value'"
            />
        </div>

        <div v-if="index == 'BI'" class="w-4/5">
            <QuadLine
                :id="seriesNameOne + 'DL' + 'BIO' + seriesNameTwo"
                :dataSetData="[
                graphDataOne.areaL,
                graphDataOne.areaR,
                graphDataTwo.areaL,
                graphDataTwo.areaR,
                ]"
                :dataSetLabels="[
                'Series 1 BI L',
                'Series 1 BI R',
                'Series 2 BI L',
                'Series 2 BI R',
                ]"
                :xLabel="'Date'"
                :yLabel="'Bio Index Value'"
            />
        </div>

        <div v-if="index == 'RMS'" class="w-4/5">
            <QuadLine
                :id="seriesNameOne + 'DL' + 'AEI' + seriesNameTwo"
                :dataSetData="[
                graphDataOne.rmsL,
                graphDataOne.rmsR,
                graphDataTwo.rmsL,
                graphDataTwo.rmsR,
                ]"
                :dataSetLabels="[
                'Series 1 RMS L',
                'Series 1 RMS R',
                'Series 2 RMS L',
                'Series 2 RMS R',
                ]"
                :xLabel="'Date'"
                :yLabel="'rms Index Value'"
            />
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue"

import QuadLine from "@/Pages/ChartVisualizations/QuadLine.vue";

export default defineComponent({
    components: {
        DualLinexy
    },
    props: {
        index: {
            type: String,
            required: true
        },
        seriesNameOne: {
            type: String,
            required: true
        },
        seriesNameTwo: {
            type: String,
            required: true
        },
        graphDataOne: {
            type: Object,
            required: true
        },
        graphDataTwo: {
            type: Object,
            required: true
        }
    }
})
</script>
