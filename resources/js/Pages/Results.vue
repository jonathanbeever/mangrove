<template>
    <app-layout title="Results">

        <div class="flex flex-col">
            <div class="py-4 flex flex-row">
                <div class="w-1/3 sm:px-6 lg:px-4 h-screen">
                    <div class="bg-white shadow-xl sm:rounded-lg h-full">
                        <div class="pb-2 pl-2 pt-2 h-full">
                            2D Waveform Spectrogram

                            <div class="flex-row px-4">
                                File Path:
                                <input v-model="spFile" placeholder="">
                                <p>Selected: {{ spFile }}</p>
                            </div>

                            <jet-button
                                class="float-left border-tl p-4 m-4 border-gray-200 bg-white"
                                v-on:click="createSpectrogram"
                                >Show Graphs</jet-button
                            >
                            <br>
                            <br>
                            <br>
                            <br>
                            <br>
                            <div id="wave" class="p-2"></div>
                        </div>
                    </div>

                </div>
                <div class="flex flex-col grow pr-4">
                    <div
                        class="p-4 flex bg-white shadow-xl sm:rounded-lg flex grow justify-between self-center max-h-24 w-full"
                    >
                        <div class="pr-2 float-left self-end">
                            <jet-button
                                class="btn btn-success"
                                @click="singleFile = !singleFile"
                                v-show="singleFile == true"
                                >Single File Analysis</jet-button
                            >
                            <jet-button
                                class="btn btn-success"
                                @click="singleFile = !singleFile"
                                v-show="singleFile == false"
                                >Multi File Analysis</jet-button
                            >
                        </div>

                        <div class="flex-row px-4">
                            Site:
                            <select
                                class="flex grow"
                                id="selectFile"
                                v-model="sFile"
                                v-on:change="alterIndices()"
                            >
                                <option v-bind:value="sFile">
                                    {{ sFile }}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row pr-4" v-show="singleFile == false">
                            Compared Site:
                            <select
                                class="flex grow"
                                id="compareFile"
                                v-model="cFile"
                                v-on:change="alterIndices()"
                            >
                                <option v-bind:value="cFile">
                                    {{ cFile }}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row pr-4">
                            Series:
                            <select
                                class="flex grow"
                                id="selectSeries"
                                v-model="currentIndex"
                                v-on:change="showGraphs()"
                            >
                                <option
                                    v-bind:value="ind"
                                    v-for="ind in indices"
                                >
                                    {{ ind }}
                                </option>
                            </select>
                        </div>

                        <div class="flex-row pr-4">
                            Select Chart:
                            <select
                                :disabled="upGraphs == 'NDSI' || upGraphs == 'RMS'"
                                class="flex grow"
                                id="chartSelect"
                                v-model="selectedChart"
                            >
                                <option
                                    v-bind:value="ind"
                                    v-for="ind in chartSelection"
                                >
                                    {{ ind }}
                                </option>
                            </select>
                        </div>
                        <div class="float-right self-end">
                            <jet-button
                                class="btn btn-success"
                                @click="showGraphs"
                                >Show Graphs</jet-button>
                        </div>
                    </div>

                    <div
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                        v-if="upGraphs != '' && selectedChart != '' && singleFile == true"
                    >

                        <div v-show="upGraphs == 'ACI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'ACI'" :xBarLabels="[]" :dataSetLabels="['label1']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ACI'" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'ACI'" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ACI'" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-show="upGraphs == 'NDSI'" :key="upGraphs" class="w-4/5">
                            <SingleBar :id="sFile+'CB'+'NDSI'" :xBarLabels="['Biophony', 'Anthrophony']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.data.biophonyL], [graphInput.data.anthrophonyL]]" :xLabel="'Biological VS Human Generated Sound'" :yLabel="'Computed Value'"/>
                        </div>

                        <div v-show="upGraphs == 'AEI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'AEI'" :xBarLabels="graphInput.data.bandRangeL" :dataSetLabels="['L Band Values']" :dataSetData="[graphInput.data.bandL]" :xLabel="'Frequency Range'" :yLabel="'Aei Index Value'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'AEI'" :xBarLabels="graphInput.data.bandRangeL" :dataSetLabels="['L Band Values', 'R Band Values']" :dataSetData="[graphInput.data.bandL, graphInput.data.bandR]" :xLabel="'Frequency Range'" :yLabel="'Aei Index Value'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'AEI'" :xBarLabels="['L Band Aei']" :dataSetLabels="[]" :dataSetData="[graphInput.data.aeiL]" :xLabel="'Frequency Band'" :yLabel="'Aei Index Computed Value'"/>
                            <SingleBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'AEI'" :xBarLabels="['L Band Aei', 'R Band Aei']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.data.aeiL], [graphInput.data.aeiR]]" :xLabel="'Frequency Band'" :yLabel="'Aei Computed Value'"/>
                        </div>

                        <div v-show="upGraphs == 'ADI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'ADI'" :xBarLabels="graphInput.data.bandRangeL" :dataSetLabels="['L Band Values']" :dataSetData="[graphInput.data.bandL]" :xLabel="'Frequency Range'" :yLabel="'Adi Index Value'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ADI'" :xBarLabels="graphInput.data.bandRangeL" :dataSetLabels="['L Band Values', 'R Band Values']" :dataSetData="[graphInput.data.bandL, graphInput.data.bandR]" :xLabel="'Frequency Range'" :yLabel="'Adi Index Value'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'ADI'" :xBarLabels="['L Band Adi']" :dataSetLabels="[]" :dataSetData="[graphInput.data.adiL]" :xLabel="'Frequency Band'" :yLabel="'Adi Index Computed Value'"/>
                            <SingleBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ADI'" :xBarLabels="['L Band Adi', 'R Band Adi']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.data.adiL], [graphInput.data.adiR]]" :xLabel="'Frequency Band'" :yLabel="'Adi Computed Value'"/>
                        </div>

                        <div v-show="upGraphs == 'BI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'BIO'" :xBarLabels="graphInput.data.freqVals" :dataSetLabels="['L Band Values']" :dataSetData="[graphInput.data.valsL]" :xLabel="'Frequency'" :yLabel="'Bio Index Value'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'BIO'" :xBarLabels="graphInput.data.freqVals" :dataSetLabels="['L Band Values', 'R Band Values']" :dataSetData="[graphInput.data.valsL, graphInput.data.valsR]" :xLabel="'Frequency Range'" :yLabel="'Bio Index Value'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'BIO'" :xBarLabels="['L Band Bio']" :dataSetLabels="[]" :dataSetData="[graphInput.data.areaL]" :xLabel="'Frequency Band'" :yLabel="'Bio Index Computed Value'"/>
                            <SingleBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'BIO'" :xBarLabels="['L Band Bio', 'R Band Bio']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.data.areaL], [graphInput.data.areaR]]" :xLabel="'Frequency Band'" :yLabel="'Bio Computed Value'"/>
                            <SingleLine v-show="selectedChart == 'Frequency Over Time'" :id="sFile+'SLOT'+'BIO'" :xBarLabels="graphInput.range" :dataSetLabels="['Frequency']" :dataSetData="[graphInput.data.freqVals]" :xLabel="'Time (Minutes)'" :yLabel="'Frequency (Hz)'"/>
                        </div>

                        <div v-show="upGraphs == 'RMS'" :key="upGraphs" class="w-4/5">
                            <SingleBar :id="sFile+'CB'+'RMS'" :xBarLabels="['Band L RMS', 'Band R RMS']" :dataSetLabels="['', '']" :dataSetData="[[graphInput.data.rmsL], [graphInput.data.rmsR]]" :xLabel="'Root Mean Square L Band and R Band'" :yLabel="'Root Mean Square'"/>
                        </div>
                    </div>
                    <div
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                        v-if="upGraphs != '' && selectedChart != '' && singleFile == false && cFile != null && cFile != ''"
                    >
                    <div v-show="upGraphs == 'ACI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ACI'+cFile" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ACI'+cFile" :xBarLabels="[]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-show="upGraphs == 'NDSI'" :key="upGraphs" class="w-4/5">
                            <CompareBar :id="sFile+'CB'+'NDSI'+cFile" :xBarLabels="[sFile, cFile]" :dataSetLabels="['Biophony', 'Anthrophony']" :dataSetData="[[graphInput.data.biophonyL, graphInputC.data.biophonyL], [graphInput.data.anthrophonyL, graphInputC.data.anthrophonyL]]" :xLabel="'Biological VS Human Generated Sound'" :yLabel="'Computed Value'"/>
                        </div>

                        <div v-show="upGraphs == 'AEI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'AEI'+cFile" :xBarLabels="graphInput.data.bandRangeL" :dataSetLabels="[sFile, cFile]" :dataSetData="[graphInput.data.bandL, graphInputC.data.bandL]" :xLabel="'Frequency Range'" :yLabel="'Aei Index Value'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'AEI'+cFile" :xBarLabels="[sFile, cFile]" :dataSetLabels="['L Band Aei', 'R Band Aei']" :dataSetData="[[graphInput.data.aeiL, graphInputC.data.aeiL], [graphInput.data.aeiR, graphInputC.data.aeiR]]" :xLabel="'Frequency Band'" :yLabel="'Aei Computed Value'"/>
                        </div>

                        <div v-show="upGraphs == 'ADI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ADI'+cFile" :xBarLabels="graphInput.data.bandRangeL" :dataSetLabels="[sFile, cFile]" :dataSetData="[graphInput.data.bandL, graphInputC.data.bandL]" :xLabel="'Frequency Range'" :yLabel="'Adi Index Value'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ADI'+cFile" :xBarLabels="[sFile, cFile]" :dataSetLabels="['L Band Adi', 'R Band Adi']" :dataSetData="[[graphInput.data.adiL, graphInputC.data.adiL], [graphInputC.data.adiR, graphInputC.data.adiR]]" :xLabel="'Frequency Band'" :yLabel="'Adi Computed Value'"/>
                        </div>

                        <div v-show="upGraphs == 'BI'" :key="upGraphs" class="w-4/5">
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'BIO'+cFile" :xBarLabels="graphInput.data.freqVals" :dataSetLabels="[sFile, cFile]" :dataSetData="[graphInput.data.valsL, graphInputC.data.valsL]" :xLabel="'Frequency Range'" :yLabel="'Bio Index Value'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'BIO'+cFile" :xBarLabels="[sFile, cFile]" :dataSetLabels="['L Band Bio', 'R Band Bio']" :dataSetData="[[graphInput.data.areaL, graphInputC.data.areaL], [graphInput.data.areaR, graphInputC.data.areaR]]" :xLabel="'Frequency Band'" :yLabel="'Bio Computed Value'"/>
                        </div>

                        <div v-show="upGraphs == 'RMS'" :key="upGraphs" class="w-4/5">
                            <CompareBar :id="sFile+'CB'+'RMS'" :xBarLabels="[sFile, cFile]" :dataSetLabels="['L Band Rms', 'R Band Rms']" :dataSetData="[[graphInput.data.rmsL, graphInputC.data.rmsL], [graphInput.data.rmsR, graphInputC.data.rmsR]]" :xLabel="'Root Mean Square L Band and R Band'" :yLabel="'Root Mean Square'"/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="absolute margin: auto; inset-x-0 bottom-10 text-slate-800" style="text-align: center; position: fixed; bottom: 0; z-index: 99 !important;">
                <audio controls volume="0.1" ref="player" id="player" class="player" style="width: 40%; display: inline-block;" @play="play" @pause="pause" @timeupdate="timeUpdate">
                    <source src="/sound/pigeons.mp3"> Audio playback is not supported.
                </audio>
            </div>
        </div>
    </app-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import WaveSurfer from "wavesurfer.js";
import SpectrogramPlugin from "wavesurfer.js/src/plugin/spectrogram";
import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";

import JetButton from "@/Jetstream/Button.vue";
import VisualizationsDemo from "@/Pages/ChartVisualizations/VisualizationsDemo.vue";
import CompareBar from '@/Pages/ChartVisualizations/CompareBar.vue';
import DualLine from '@/Pages/ChartVisualizations/DualLine.vue';
import SingleBar from '@/Pages/ChartVisualizations/SingleBar.vue';
import SingleLine from '@/Pages/ChartVisualizations/SingleLine.vue';
import * as Papa from 'papaparse';

let singleFile = true;
let currentIndex = "";
let compareIndex = "";
let upGraphs = "";
let selectedChart = "";
let sFile, cFile, graphInput, graphInputC;

export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        WaveSurfer,
        VisualizationsDemo,
        CompareBar,
        DualLine,
        SingleBar,
        SingleLine,
    },

    data() {
        return {
            spFile: "",
            sFile: "",
            cFile: "",
            startDate: "",
            endDate: "",
            selectRecordings: [],
            singleFile,
            indices: ["ACI", "NDSI", "AEI", "ADI", "BI", "RMS"],
            chartSelection: ["Single Line", "Single Bar", "Dual Line", "Compare Bar"],
            selectedChart,
            currentIndex,
            compareIndex,
            upGraphs,
            graphInput,
            graphInputC
        };
    },
    methods: {

        createSpectrogram() {
            this.wavesurfer.load("/sound/" + this.spFile);
        },

        play: function () {
            this.wavesurfer.play();
        },
        pause: function () {
            this.wavesurfer.pause();
        },

        timeUpdate: function() {
            this.wavesurfer.setCurrentTime(this.$refs.player.currentTime);
        },

        alterIndices: function () {
            let newIndices = []
            if (singleFile == true) {
                let objec = this.filterRecordingsByFile(this.sFile)
                objec.forEach(x => newIndices.push(x.type.toUpperCase()))
            } else {
                let objec = this.filterRecordingsByFile(this.sFile)
                let objec2 = this.filterRecordingsByFile(this.cFile)

                let newIndices = []
                objec.forEach(x => {
                    objec2.forEach(y => {
                        if ( y.type == x.type)
                            newIndices.push(x.type.toUpperCase())
                    })
                })
            }

            this.selectedChart = ''
            this.upGraphs = ''
            this.indices = newIndices
            this.currentIndex = newIndices[0]
            this.showGraphs()
            this.$forceUpdate()
        },

        showGraphs: function () {
            let objec = this.filterRecordingsByFile(this.sFile);

            this.upGraphs = this.currentIndex;

            this.graphInput = objec.find(x => x.type.toUpperCase() == this.currentIndex );


            if (this.singleFile == false) {
                let objec2 = this.filterRecordingsByFile(this.cFile);
                this.graphInputC = objec2.find(x => x.type.toUpperCase() == this.currentIndex );
                this.chartSelection = ["Dual Line", "Compare Bar"]

                this.selectedChart = 'Dual Line'
            } else {
                this.selectedChart = 'Single Line'

                if (this.upGraphs == 'BI') {
                this.chartSelection = ["Single Line", "Single Bar", "Dual Line", "Compare Bar", "Frequency Over Time"]

                let end = this.graphInput.data.freqVals.length;
                let range = Array(end - 0 + 1).fill().map((_, idx) => 0 + idx);
                this.graphInput = {...this.graphInput, range: range}
                } else {
                    this.chartSelection = ["Single Line", "Single Bar", "Dual Line", "Compare Bar"]
                }
            }
        },
        populateDropdown: function () {
            var extractedRecordings = this.getExtractedRecordings();
            if (extractedRecordings) {
                extractedRecordings.then((d) =>
                    this.updateDropdown(d, "selectFile")
                );
            }
        },
        updateDropdown: function (extractedRecordings, dropdown) {
            var select = document.getElementById(dropdown);
            var selectC = document.getElementById('compareFile')
            var options = new Set();
            for (var i = 0; i < extractedRecordings.length; i++) {
                if (dropdown.indexOf("select") > -1) {
                    this.selectRecordings.push(extractedRecordings[i]);
                }
                // handle both file and date dropdowns
                var field = extractedRecordings[i]["file"];
                var el = document.createElement("option");
                el.textContent = field;
                el.value = field;
                var e2 = document.createElement("option");
                e2.textContent = field;
                e2.value = field;
                if (options.has(field)) continue;
                select.appendChild(el);
                selectC.appendChild(e2);
                options.add(field);
            }
        },
        getExtractedRecordings: function () {
            return new Promise((resolve, reject) => {
                Papa.parse("sound-data", {
                    download: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        let newData = [];
                        results.data.forEach((data) => {
                            newData = [
                            ...newData,
                            {
                                file: data[0],
                                type: data[1],
                                duration: data[2],
                                data: JSON.parse(atob(data[3]))
                            }];
                        });

                        resolve(newData);
                    }
                });
            });
        },
        filterRecordingsByFile: function (file) {
            return this.selectRecordings.filter((d) => d["file"] == file);
        },
        filterRecordingsBySeries: function (index, siteType) {
            var recordings = this.selectRecordings;
            // handle "ACI", "NDSI", "AEI", "ADI", "BIO", "RMS"
            // Build a sort that takes into account selected index from the series
            if (this.startDate === "" && this.endDate === "") {
                return recordings;
            }
            if (this.startDate === "") {
                return recordings.filter((d) => d["DATE"] <= this.endDate);
            }
            if (this.startDate === "") {
                return recordings.filter(
                    (d) => this.startDate <= d["DATE"]
                );
            }
            return recordings.filter(
                (d) => this.startDate <= d["DATE"] && d["DATE"] <= this.endDate
            );
        },
    },
    mounted() {
        this.wavesurfer = WaveSurfer.create({

            height:500,
            container: "#wave",
            waveColor: "#D2EDD4",
            progressColor: "#46B54D",
            backend: "MediaElement",
            plugins: [
                SpectrogramPlugin.create({
                    height:500,
                    container: "#wave",
                    labels: true,
                    colorMap: this.colorMap,
                })
            ],
        });
        this.populateDropdown();
    },
});
</script>
