<template>
    <div
        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
        id="root"
    >
        <div v-if="index == 'ACI'" class="w-4/5">
            <DualLine
                v-if="chart == 'Dual Line'"
                :id="fileNameOne + 'DL' + 'ACI' + fileNameTwo"
                :dataSetData="[
                [1, 2, 3, 4],
                [2, 4, 5, 6],
                ]"
                :dataSetLabels="['label1', 'label2']"
                :xBarLabels="[]"
                :xLabel="'Time'"
                :yLabel="'yLabel'"
            />
            <CompareBar
                v-if="chart == 'Compare Bar'"
                :id="fileNameOne + 'CB' + 'ACI' + fileNameTwo"
                :dataSetData="[
                [1, 2, 3, 4],
                [2, 4, 5, 6],
                ]"
                :dataSetLabels="['label1', 'label2']"
                :xBarLabels="[]"
                :xLabel="'Time'"
                :yLabel="'yLabel'"
            />
        </div>

        <div v-if="index == 'NDSI'" class="w-4/5">
            <CompareBar
                :id="fileNameOne + 'CB' + 'NDSI' + fileNameTwo"
                :dataSetData="[
                [graphDataOne.biophonyL, graphDataTwo.biophonyL],
                [graphDataOne.anthrophonyL, graphDataTwo.anthrophonyL],
                ]"
                :dataSetLabels="['Biophony', 'Anthrophony']"
                :xBarLabels="[fileNameOne, fileNameTwo]"
                :xLabel="'Biological VS Human Generated Sound'"
                :yLabel="'Computed Value'"
            />
        </div>

        <div v-if="index == 'AEI'" class="w-4/5">
            <DualLine
                v-if="chart == 'Dual Line'"
                :id="fileNameOne + 'DL' + 'AEI' + fileNameTwo"
                :dataSetData="[graphDataOne.bandL, graphDataTwo.bandL]"
                :dataSetLabels="[fileNameOne, fileNameTwo]"
                :xBarLabels="graphDataOne.bandRangeL"
                :xLabel="'Frequency Range'"
                :yLabel="'Aei Index Value'"
            />
            <CompareBar
                v-if="chart == 'Compare Bar'"
                :id="fileNameOne + 'CB' + 'AEI' + fileNameTwo"
                :dataSetData="[
                [graphDataOne.aeiL, graphDataTwo.aeiL],
                [graphDataOne.aeiR, graphDataTwo.aeiR],
                ]"
                :dataSetLabels="['L Band Aei', 'R Band Aei']"
                :xBarLabels="[fileNameOne, fileNameTwo]"
                :xLabel="'Frequency Band'"
                :yLabel="'Aei Computed Value'"
            />
        </div>

        <div v-if="index == 'ADI'" class="w-4/5">
            <DualLine
                v-if="chart == 'Dual Line'"
                :id="fileNameOne + 'DL' + 'ADI' + fileNameTwo"
                :dataSetData="[graphDataOne.bandL, graphDataTwo.bandL]"
                :dataSetLabels="[fileNameOne, fileNameTwo]"
                :xBarLabels="graphDataOne.bandRangeL"
                :xLabel="'Frequency Range'"
                :yLabel="'Adi Index Value'"
            />
            <CompareBar
                v-if="chart == 'Compare Bar'"
                :id="fileNameOne + 'CB' + 'ADI' + fileNameTwo"
                :dataSetData="[
                [graphDataOne.adiL, graphDataTwo.adiL],
                [graphDataTwo.adiR, graphDataTwo.adiR],
                ]"
                :dataSetLabels="['L Band Adi', 'R Band Adi']"
                :xBarLabels="[fileNameOne, fileNameTwo]"
                :xLabel="'Frequency Band'"
                :yLabel="'Adi Computed Value'"
            />
        </div>

        <div v-if="index == 'BI'" class="w-4/5">
            <DualLine
                v-if="chart == 'Dual Line'"
                :id="fileNameOne + 'DL' + 'BIO' + fileNameTwo"
                :dataSetData="[graphDataOne.valsL, graphDataTwo.valsL]"
                :dataSetLabels="[fileNameOne, fileNameTwo]"
                :xBarLabels="graphDataOne.freqVals"
                :xLabel="'Frequency Range'"
                :yLabel="'Bio Index Value'"
            />
            <CompareBar
                v-if="chart == 'Compare Bar'"
                :id="fileNameOne + 'CB' + 'BIO' + fileNameTwo"
                :dataSetData="[
                [graphDataOne.areaL, graphDataTwo.areaL],
                [graphDataOne.areaR, graphDataTwo.areaR],
                ]"
                :dataSetLabels="['L Band Bio', 'R Band Bio']"
                :xBarLabels="[fileNameOne, fileNameTwo]"
                :xLabel="'Frequency Band'"
                :yLabel="'Bio Computed Value'"
            />
        </div>

        <div v-if="index == 'RMS'" class="w-4/5">
            <CompareBar
                :id="fileNameOne + 'CB' + 'RMS'"
                :dataSetData="[
                [graphDataOne.rmsL, graphDataTwo.rmsL],
                [graphDataOne.rmsR, graphDataTwo.rmsR],
                ]"
                :dataSetLabels="['L Band Rms', 'R Band Rms']"
                :xBarLabels="[fileNameOne, fileNameTwo]"
                :xLabel="'Root Mean Square L Band and R Band'"
                :yLabel="'Root Mean Square'"
            />
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue"

import CompareBar from "@/Pages/ChartVisualizations/CompareBar.vue";
import DualLine from "@/Pages/ChartVisualizations/DualLine.vue";

export default defineComponent({
    components: {
        CompareBar,
        DualLine,
    },
    props: {
        index: {
            type: String,
            required: true
        },
        chart: {
            type: String,
            required: false
        },
        fileNameOne: {
            type: String,
            required: true
        },
        fileNameTwo: {
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
        },
        modelValue: { // Active Chart Element
            type: Object,
            required: false
        }
    },
    emits: ['update:modelValue'],
    watch: {
        index() {
            this.$emit('update:modelValue', document.getElementById("root").firstElementChild.firstElementChild)
        },
        chart() {
            this.$emit('update:modelValue', document.getElementById("root").firstElementChild.firstElementChild)
        }
    }
})
</script>
