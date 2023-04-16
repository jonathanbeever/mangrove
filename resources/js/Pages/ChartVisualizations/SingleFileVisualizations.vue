<template>
    <div
        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
        id="root"
    >
        <div v-if="index == 'ACI'" class="w-4/5">
            <SingleLine
                v-if="chart == 'Single Line'"
                :id="fileName + 'SL' + 'ACI'"
                :dataSetData="[
                    [1, 2, 3, 4],
                    [2, 4, 5, 6],
                ]"
                :dataSetLabels="['label1']"
                :xBarLabels="[]"
                :xLabel="'Time'"
                :yLabel="'yLabel'"
            />
            <DualLine
                v-if="chart == 'Dual Line'"
                :id="fileName + 'DL' + 'ACI'"
                :dataSetData="[
                    [1, 2, 3, 4],
                    [2, 4, 5, 6],
                ]"
                :dataSetLabels="['label1', 'label2']"
                :xBarLabels="[]"
                :xLabel="'Time'"
                :yLabel="'yLabel'"
            />
            <SingleBar
                v-if="chart == 'Single Bar'"
                :id="fileName + 'SB' + 'ACI'"
                :dataSetData="[fileName, [2, 4, 5, 6]]"
                :dataSetLabels="['label1', 'label2']"
                :xBarLabels="[]"
                :xLabel="'Time'"
                :yLabel="'yLabel'"
            />
            <SingleBar
                v-if="chart == 'Compare Bar'"
                :id="fileName + 'CB' + 'ACI'"
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
            <SingleBar
                :id="fileName + 'CB' + 'NDSI'"
                :dataSetData="[[graphData.biophonyL], [graphData.anthrophonyL]]"
                :dataSetLabels="['', '']"
                :xBarLabels="['Biophony', 'Anthrophony']"
                :xLabel="'Biological VS Human Generated Sound'"
                :yLabel="'Computed Value'"
            />
        </div>

        <div v-if="index == 'AEI'" class="w-4/5">
            <SingleLine
                v-if="chart == 'Single Line'"
                :id="fileName + 'SL' + 'AEI'"
                :dataSetData="[graphData.bandL]"
                :dataSetLabels="['L Band Values']"
                :xBarLabels="graphData.bandRangeL"
                :xLabel="'Frequency Range'"
                :yLabel="'Aei Index Value'"
            />
            <DualLine
                v-if="chart == 'Dual Line'"
                :id="fileName + 'DL' + 'AEI'"
                :dataSetData="[graphData.bandL, graphData.bandR]"
                :dataSetLabels="['L Band Values', 'R Band Values']"
                :xBarLabels="graphData.bandRangeL"
                :xLabel="'Frequency Range'"
                :yLabel="'Aei Index Value'"
            />
            <SingleBar
                v-if="chart == 'Single Bar'"
                :id="fileName + 'SB' + 'AEI'"
                :dataSetData="[graphData.aeiL]"
                :dataSetLabels="[]"
                :xBarLabels="['L Band Aei']"
                :xLabel="'Frequency Band'"
                :yLabel="'Aei Index Computed Value'"
            />
            <SingleBar
                v-if="chart == 'Compare Bar'"
                :id="fileName + 'CB' + 'AEI'"
                :dataSetData="[[graphData.aeiL], [graphData.aeiR_1]]"
                :dataSetLabels="['', '']"
                :xBarLabels="['L Band Aei', 'R Band Aei']"
                :xLabel="'Frequency Band'"
                :yLabel="'Aei Computed Value'"
            />
        </div>

        <div v-if="index == 'ADI'" class="w-4/5">
            <SingleLine
                v-if="chart == 'Single Line'"
                :id="fileName + 'SL' + 'ADI'"
                :dataSetData="[graphData.bandL]"
                :dataSetLabels="['L Band Values']"
                :xBarLabels="graphData.bandRangeL"
                :xLabel="'Frequency Range'"
                :yLabel="'Adi Index Value'"
            />
            <DualLine
                v-if="chart == 'Dual Line'"
                :id="fileName + 'DL' + 'ADI'"
                :dataSetData="[graphData.bandL, graphData.bandR]"
                :dataSetLabels="['L Band Values', 'R Band Values']"
                :xBarLabels="graphData.bandRangeL"
                :xLabel="'Frequency Range'"
                :yLabel="'Adi Index Value'"
            />
            <SingleBar
                v-if="chart == 'Single Bar'"
                :id="fileName + 'SB' + 'ADI'"
                :dataSetData="[graphData.adiL]"
                :dataSetLabels="[]"
                :xBarLabels="['L Band Adi']"
                :xLabel="'Frequency Band'"
                :yLabel="'Adi Index Computed Value'"
            />
            <SingleBar
                v-if="chart == 'Compare Bar'"
                :id="fileName + 'CB' + 'ADI'"
                :dataSetData="[[graphData.adiL], [graphData.adiR]]"
                :dataSetLabels="['', '']"
                :xBarLabels="['L Band Adi', 'R Band Adi']"
                :xLabel="'Frequency Band'"
                :yLabel="'Adi Computed Value'"
            />
        </div>

        <div v-if="index == 'BI'" class="w-4/5">
            <SingleLine
                v-if="chart == 'Single Line'"
                :id="fileName + 'SL' + 'BIO'"
                :dataSetData="[graphData.valsL]"
                :dataSetLabels="['L Band Values']"
                :xBarLabels="graphData.freqVals"
                :xLabel="'Frequency'"
                :yLabel="'Bio Index Value'"
            />
            <DualLine
                v-if="chart == 'Dual Line'"
                :id="fileName + 'DL' + 'BIO'"
                :dataSetData="[graphData.valsL, graphData.valsR]"
                :dataSetLabels="['L Band Values', 'R Band Values']"
                :xBarLabels="graphData.freqVals"
                :xLabel="'Frequency Range'"
                :yLabel="'Bio Index Value'"
            />
            <SingleBar
                v-if="chart == 'Single Bar'"
                :id="fileName + 'SB' + 'BIO'"
                :dataSetData="[graphData.areaL]"
                :dataSetLabels="[]"
                :xBarLabels="['L Band Bio']"
                :xLabel="'Frequency Band'"
                :yLabel="'Bio Index Computed Value'"
            />
            <SingleBar
                v-if="chart == 'Compare Bar'"
                :id="fileName + 'CB' + 'BIO'"
                :dataSetData="[[graphData.areaL], [graphData.areaR]]"
                :dataSetLabels="['', '']"
                :xBarLabels="['L Band Bio', 'R Band Bio']"
                :xLabel="'Frequency Band'"
                :yLabel="'Bio Computed Value'"
            />
            <SingleLine
                v-if="chart == 'Frequency Over Time'"
                :id="fileName + 'SLOT' + 'BIO'"
                :dataSetData="[graphData.freqVals]"
                :dataSetLabels="['Frequency']"
                :xBarLabels="graphData.range"
                :xLabel="'Time (Minutes)'"
                :yLabel="'Frequency (Hz)'"
            />
        </div>

        <div v-if="index == 'RMS'" class="w-4/5">
            <SingleBar
                :id="fileName + 'CB' + 'RMS'"
                :dataSetData="[[graphData.rmsL], [graphData.rmsR]]"
                :dataSetLabels="['', '']"
                :xBarLabels="['Band L RMS', 'Band R RMS']"
                :xLabel="'Root Mean Square L Band and R Band'"
                :yLabel="'Root Mean Square'"
            />
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue"

import DualLine from "@/Pages/ChartVisualizations/DualLine.vue";
import SingleBar from "@/Pages/ChartVisualizations/SingleBar.vue";
import SingleLine from "@/Pages/ChartVisualizations/SingleLine.vue";

export default defineComponent({
    components: {
        DualLine,
        SingleBar,
        SingleLine
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
        fileName: {
            type: String,
            required: true
        },
        graphData: {
            type: Object,
            required: true
        },
        modelValue: { // Active Chart Element
            type: Object,
            required: false
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            observer: null,
        }
    },
    mounted() {
        let root = document.getElementById("root")

        // Set up listener on root element so we can update the chart
        this.observer = new MutationObserver(() => {
            // console.log("MutationObserver triggered.")
            this.$emit('update:modelValue', root.firstElementChild.firstElementChild)
        })
        // this.observer.observe(root, { childList: true })
        this.observer.observe(root, { childList: true , subtree: true})
        // Emit the value of the initial chart
        this.$emit('update:modelValue', root.firstElementChild.firstElementChild)
    },
    beforeDestroy() {
        this.observer.disconnect()
    }
})
</script>
