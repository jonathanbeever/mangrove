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
                                >Show Graphs</jet-button
                            >
                        </div>
                    </div>

                    <div
                        class="flex-col flex bg-white shadow-xl sm:rounded-lg p-4 mt-4 w-full items-center"
                        v-if="upGraphs != ''"
                    >

                        <div v-show="upGraphs == 'ACI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'ACI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ACI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'ACI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ACI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-show="upGraphs == 'NDSI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'NDSI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'NDSI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'NDSI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'NDSI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-show="upGraphs == 'AEI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'AEI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1']" :dataSetData="[[graphInput[1].data.aeiL, graphInput[6].data.aeiL, graphInput[11].data.aeiL, graphInput[16].data.aeiL]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'AEI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'AEI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1']" :dataSetData="[graphInput[1].data.aeiL]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'AEI'" :xBarLabels="'noodles'" :dataSetLabels="['label1', 'label2']" :dataSetData="[graphInput[1].data.aeiL, graphInput[1].data.aeiR]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-show="upGraphs == 'ADI'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'ADI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1']" :dataSetData="[sFile, cFile]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'ADI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'ADI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'ADI'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-show="upGraphs == 'BIO'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'BIO'" :xBarLabels="graphInput.range" :dataSetLabels="['label1']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'BIO'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'BIO'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'BIO'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <div v-show="upGraphs == 'RMS'" :key="upGraphs" class="w-4/5">
                            <SingleLine v-show="selectedChart == 'Single Line'" :id="sFile+'SL'+'RMS'" :xBarLabels="graphInput.range" :dataSetLabels="['label1']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <DualLine v-show="selectedChart == 'Dual Line'" :id="sFile+'DL'+'RMS'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <SingleBar v-show="selectedChart == 'Single Bar'" :id="sFile+'SB'+'RMS'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[sFile, [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                            <CompareBar v-show="selectedChart == 'Compare Bar'" :id="sFile+'CB'+'RMS'" :xBarLabels="graphInput.range" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/>
                        </div>

                        <!--DualLine :id="'0'" :xBarLabels="[1, 2, 3, 4]" :dataSetLabels="['label1', 'label2']" :dataSetData="[[1, 2, 3, 4], [2, 4, 5, 6]]" :xLabel="'Time'" :yLabel="'yLabel'"/-->
                    </div>
                </div>
            </div>

            <div class="absolute margin: auto; inset-x-0 bottom-10 text-slate-800" style="text-align: center; position: fixed; bottom: 0; z-index: 99 !important;">
                <audio controls volume="0.1" id="audio-player" class="audio-player" style="width: 40%; display: inline-block;" onplay="play" v-on:click="play">
                    <source src="/sound/pigeons.mp3"> Audio playback is not supported.
                </audio>
            </div>
        </div>
    </app-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import Welcome from "@/Jetstream/Welcome.vue";
import WaveSurfer from "wavesurfer.js";
import SpectrogramPlugin from "wavesurfer.js/src/plugin/spectrogram";
import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";

import JetButton from "@/Jetstream/Button.vue";
import VisualizationsDemo from "@/Pages/ChartVisualizations/VisualizationsDemo.vue";
import CompareBar from '@/Pages/ChartVisualizations/SingleBar.vue';
import DualLine from '@/Pages/ChartVisualizations/DualLine.vue';
import SingleBar from '@/Pages/ChartVisualizations/SingleBar.vue';
import SingleLine from '@/Pages/ChartVisualizations/SingleLine.vue';
import * as Papa from 'papaparse';

let singleFile = true;
let currentIndex = "";
let compareIndex = "";
let upGraphs = "";
let selectedChart = "";
let sFile, cFile, graphInput;

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
            recordings: [],
            singleFile,
            indices: ["ACI", "NDSI", "AEI", "ADI", "BIO", "RMS"],
            chartSelection: ["Single Line", "Single Bar", "Dual Line", "Compare Bar"],
            selectedChart,
            currentIndex,
            compareIndex,
            upGraphs,
            graphInput,
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

        showGraphs: function () {
            let objec = this.filterRecordingsByFile(this.sFile);
            console.log(objec);

            let end = Number(objec[0].duration);
            let range = Array(end - 0 + 1).fill().map((_, idx) => 0 + idx);

            objec = {...objec, range: range};

            this.upGraphs = this.currentIndex;
            this.graphInput = objec;
        },

        plotSeries: function (index) {
            this.recordings = this.filterRecordingsBySeries(index);
        },

        populateDropdown: function () {
            var extractedRecordings = this.getExtractedRecordings();
            if (extractedRecordings) {
                extractedRecordings.then((d) =>
                    this.updateDropdown(d, "selectFile")
                );
                extractedRecordings.then((d) =>
                    this.updateDropdown(d, "compareFile")
                );
            }
        },
        updateDropdown: function (extractedRecordings, dropdown) {
            var select = document.getElementById(dropdown);
            var options = new Set();
            for (var i = 0; i < extractedRecordings.length; i++) {
                this.recordings.push(extractedRecordings[i]);
                // handle both file and date dropdowns
                var field = extractedRecordings[i]["file"];
                var el = document.createElement("option");
                el.textContent = field;
                el.value = field;
                if (options.has(field)) continue;
                select.appendChild(el);
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
            return this.recordings.filter((d) => d["file"] == file);
        },
        filterRecordingsBySeries: function (index) {
            // handle "ACI", "NDSI", "AEI", "ADI", "BIO", "RMS"
            // Build a sort that takes into account selected index from the series
            if (this.startDate === "" && this.endDate === "") {
                return this.recordings;
            }
            if (this.startDate === "") {
                return this.recordings.filter((d) => d["DATE"] <= this.endDate);
            }
            if (this.startDate === "") {
                return this.recordings.filter(
                    (d) => this.startDate <= d["DATE"]
                );
            }
            return this.recordings.filter(
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
