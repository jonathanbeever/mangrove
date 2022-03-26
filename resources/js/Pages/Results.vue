<template>
    <app-layout title="Results">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Results
            </h2>
        </template>

        <div class="flex flex-col">
            <div class="py-4 flex flex-row">
                <div class="w-1/3 sm:px-6 lg:px-4">
                    <div class="bg-white shadow-xl sm:rounded-lg">
                        <div class="pb-16 pl-2 pt-2">
                            2D Waveform Spectrogram

                            <div id="wave" class="p-2"></div>

                            <jet-button
                                class="float-left border-tl p-4 m-4 border-gray-200 bg-white"
                                v-on:click="play"
                                >Play</jet-button
                            >
                            <jet-button
                                class="float-right border-tl p-4 m-4 border-gray-200"
                                v-on:click="pause"
                                >Pause</jet-button
                            >
                        </div>
                    </div>
                    <div class="bg-white shadow-xl sm:rounded-lg mt-4">
                        <div class="pt-2 px-4">Range-Based Analysis</div>
                        <div class="space-x-4 pt-4 flex justify-center">
                            <select id="selectStartDate" v-model="startDate">
                                <option v-bind:value="''" disabled>
                                    Start Date
                                </option>
                            </select>
                            <select id="selectEndDate" v-model="endDate">
                                <option v-bind:value="''" disabled>
                                   End Date
                                </option>
                            </select>
                        </div>
                        <div class="p-4">
                            Selected Time Range:
                            {{ startDate + " - " + endDate }}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col grow pr-4">
                    <div class="p-4 h-1/3 flex bg-white shadow-xl sm:rounded-lg flex grow self-center">
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
                                class="flex"
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
                                class="flex"
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
                                class="flex"
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

                        <div class="flex-row pr-4" v-show="singleFile == false">
                            Compare Series:
                            <select
                                class="flex"
                                id="compareSeries"
                                v-model="compareIndex"
                            >
                                <option v-bind:value="ind" v-for="ind in indices">
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
                    <!--debugger box to be removed later. It helps me verify data.-->
                    <div
                        class="flex-col-grow bg-white shadow-xl sm:rounded-lg p-4 mt-4"
                    >
                    <div>
                    Site: {{sFile}}
                    </div>
                    <div>
                    Series: {{currentIndex}}
                    </div>
                    <div>
                    Compared Site: {{cFile}}
                    </div>
                    <div>
                    Compared Series: {{compareIndex}}
                    </div>
                    </div>
                    <div class="flex-col-grow bg-white shadow-xl sm:rounded-lg p-4 mt-4">
                        <div v-if="selectRecordings.length > 0 && ready" class="pt-5">
                            <Chart :data="selectRecordings">
                                <template #layers>
                                    <Bar :dataKeys="['DATE', 'ACI']" :size="{ width: 500, height: 100 }" :barStyle="{ fill: '#93C572' }"/>
                                </template>
                            </Chart>
                        </div>
                        <div v-if="compareRecordings.length > 0 && ready && !singleFile" class="pt-5">
                            <Chart :data="compareRecordings">
                                <template #layers>
                                    <Bar :dataKeys="['DATE', 'ACI']" :size="{ width: 500, height: 100 }" :barStyle="{ fill: '#93C572' }"/>
                                </template>
                            </Chart>
                        </div>
                        <VisualizationsDemo />
                    </div>
                </div>
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
import JetButton from "@/Jetstream/Button.vue";
import * as d3 from "d3";
import { Chart, Grid, Bar, Line, Marker, Tooltip } from "vue3-charts";
import VisualizationsDemo from "@/Pages/ChartVisualizations/VisualizationsDemo.vue";
let singleFile = true;
let currentIndex = "";
let compareIndex = "";
export default defineComponent({
    components: {
        AppLayout,
        JetButton,
        WaveSurfer,
        Chart,
        Line,
        Grid,
        Bar,
        Marker,
        Tooltip,
        VisualizationsDemo,
    },
    data() {
        return {
            sFile: "",
            cFile: "",
            startDate: "",
            endDate: "",
            compareRecordings: [],
            selectRecordings: [],
            singleFile,
            indices: ["ACI", "NDSI", "AEI", "ADI", "BIO", "RMS"],
            currentIndex,
            compareIndex,
            ready: false,
        };
    },
    methods: {
        play: function () {
            this.wavesurfer.play();
        },
        pause: function () {
            this.wavesurfer.pause();
        },
        showGraphs: function () {
            this.plotSeries(this.currentIndex);
        },
        plotSeries: function (index) {
            this.ready = true;
            this.selectRecordings = this.filterRecordingsBySeries(index, 's');
            if (!this.singleFile) {
                this.compareRecordings = this.filterRecordingsBySeries(index, 'c');
            }
        },
        extractRecording: function (recording) {
            var folder = recording.FOLDER;
            var file = recording.IN_FILE;
            var channel = recording.CHANNEL;
            var offset = recording.OFFSET;
            var duration = recording.DURATION;
            var date = recording.DATE;
            var time = recording.TIME;
            var hour = recording.HOUR;
            return [folder, file, channel, offset, duration, date, time, hour];
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
                extractedRecordings.then((d) =>
                    this.updateDropdown(d, "selectStartDate")
                );
                extractedRecordings.then((d) =>
                    this.updateDropdown(d, "selectEndDate")
                );
            }
        },
        updateDropdown: function (extractedRecordings, dropdown) {
            var select = document.getElementById(dropdown);
            var options = new Set();
            for (var i = 0; i < extractedRecordings.length; i++) {
                if (dropdown.indexOf("select") > -1) {
                    this.selectRecordings.push(extractedRecordings[i]);
                } else {
                    this.compareRecordings.push(extractedRecordings[i]);
                }
                // handle both file and date dropdowns
                var field = extractedRecordings[i]["IN_FILE"];
                if (dropdown.indexOf("Date") > -1) {
                    field = extractedRecordings[i]["DATE"];
                }
                var el = document.createElement("option");
                el.textContent = field;
                el.value = field;
                if (options.has(field)) continue;
                select.appendChild(el);
                options.add(field);
            }
        },
        getExtractedRecordings: function () {
            return d3.csv("index");
        },
        filterRecordingsByFile: function (file, siteType) {
            if (siteType === "single") {
                return this.selectRecordings.filter((d) => d["IN_FILE"] == file);
            }
            return this.compareRecordings.filter((d) => d["IN_FILE"] == file);
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
            container: "#wave",
            waveColor: "#D2EDD4",
            progressColor: "#46B54D",
            backend: "MediaElement",
            plugins: [
                SpectrogramPlugin.create({
                    container: "#wave",
                    labels: true,
                    colorMap: this.colorMap,
                }),
            ],
        });
        this.wavesurfer.load("sound");
        this.populateDropdown();
    },
});
</script>
