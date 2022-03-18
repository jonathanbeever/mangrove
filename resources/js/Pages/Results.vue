<template>
    <app-layout title="Results">
        <template #header>
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Results
        </h2>
        </template>
        <script src="script.js"></script>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 box-border h-400 w-600">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg box-content">
                    <div class="pb-4 pl-2 pt-2">2D Waveform Spectrogram</div>
                    <div><div id="wave"></div></div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="play">Play</jet-button>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="pause">Pause</jet-button>
                    </div>
                </div>

            </div>
        </div>

        <div class="py-12 pt-10">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 box-border h-400 w-600">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg box-content">
                    <div class="pb-4 pl-2 pt-2">ACI</div>
                    <div class="pb-4 pl-2 pt-2">Single File Analysis</div>
                    <div class="pl-5">
                        <select id="selectFileAci" v-model="aciFile">
                            <option v-bind:value="aciFile">Select File</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotAci">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected File: {{aciFile}}</div>
                    </div>
                    <div v-if="aciFileRecordings.length > 0" class="pt-5">
                        <Chart :data="aciFileRecordings">
                            <template #layers>
                                <Bar :dataKeys="['DATE', 'ACI']" :size="{ width: 500, height: 100 }" :barStyle="{ fill: '#93C572' }"/>
                            </template>
                        </Chart>
                    </div>
                    <div class="pb-4 pl-2 pt-10">Range-Based Analysis</div>
                    <div class="pl-5">
                        <select id="selectStartDateAci" v-model="aciStartDate">
                            <option v-bind:value="aciStartDate">Start Date</option>
                        </select>
                        <select id="selectEndDateAci" v-model="aciEndDate">
                            <option v-bind:value="aciEndDate">End Date</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotAciSeries">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected Time Range: {{aciStartDate + " - " + aciEndDate}}</div>
                    </div>
                    <div v-if="aciSeriesRecordings.length > 0" class="pt-5">
                        <Chart :data="aciSeriesRecordings" :size="{ width: 1200, height: 320 }">
                            <template #layers>
                                <Bar :dataKeys="['DATE', 'ACI']" :barStyle="{ fill: '#93C572' }"/>
                            </template>
                        </Chart>
                    </div>
                </div>
            </div>
        </div>


        <div class="py-12 pt-10">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 box-border h-400 w-600">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg box-content">
                    <div class="pb-4 pl-2 pt-2">NDSI</div>
                    <div class="pb-4 pl-2 pt-2">Single File Analysis</div>
                    <div class="pl-5">
                        <select id="selectFileNdsi" v-model="ndsiFile">
                            <option v-bind:value="ndsiFile">Select File</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotNdsi">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected File: {{ndsiFile}}</div>
                    </div>
                    <div v-if="ndsiFileRecordings.length > 0" class="pt-5">
                        <Chart :data="ndsiFileRecordings">
                            <template #layers>
                                <Bar :dataKeys="['DATE', 'NDSI']" :size="{ width: 500, height: 100 }" :barStyle="{ fill: '#93C572' }"/>
                            </template>
                        </Chart>
                    </div>
                    <div class="pb-4 pl-2 pt-10">Range-Based Analysis</div>
                    <div class="pl-5">
                        <select id="selectStartDateNdsi" v-model="ndsiStartDate">
                            <option v-bind:value="ndsiStartDate">Start Date</option>
                        </select>
                        <select id="selectEndDateNdsi" v-model="ndsiEndDate">
                            <option v-bind:value="ndsiEndDate">End Date</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotNdsiSeries">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected Time Range: {{ndsiStartDate + " - " + ndsiEndDate}}</div>
                    </div>
                    <div v-if="ndsiSeriesRecordings.length > 0" class="pt-5">
                        <Chart :data="ndsiSeriesRecordings" :size="{ width: 1200, height: 320 }">
                            <template #layers>
                                <Bar :dataKeys="['DATE', 'NDSI']" :barStyle="{ fill: '#93C572' }"/>
                            </template>
                        </Chart>
                    </div>
                </div>
            </div>
        </div>

        <div class="py-12 pt-10">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 box-border h-400 w-600">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg box-content">
                    <div class="pb-4 pl-2 pt-2">ADI</div>
                    <div class="pb-4 pl-2 pt-2">Single File Analysis</div>
                    <div class="pl-5">
                        <select id="selectFileNdsi" v-model="ndsiFile">
                            <option v-bind:value="ndsiFile">Select File</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotNdsi">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected File: {{ndsiFile}}</div>
                    </div>
                    <div class="pb-4 pl-2 pt-10">Range-Based Analysis</div>
                    <div class="pl-5">
                        <select id="selectStartDateNdsi" v-model="ndsiStartDate">
                            <option v-bind:value="ndsiStartDate">Start Date</option>
                        </select>
                        <select id="selectEndDateNdsi" v-model="ndsiEndDate">
                            <option v-bind:value="ndsiEndDate">End Date</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotNdsiSeries">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected Time Range: {{ndsiStartDate + " - " + ndsiEndDate}}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="py-12 pt-10">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 box-border h-400 w-600">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg box-content">
                    <div class="pb-4 pl-2 pt-2">AEI</div>
                    <div class="pb-4 pl-2 pt-2">Single File Analysis</div>
                    <div class="pl-5">
                        <select id="selectFileNdsi" v-model="ndsiFile">
                            <option v-bind:value="ndsiFile">Select File</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotNdsi">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected File: {{ndsiFile}}</div>
                    </div>
                    <div class="pb-4 pl-2 pt-10">Range-Based Analysis</div>
                    <div class="pl-5">
                        <select id="selectStartDateNdsi" v-model="ndsiStartDate">
                            <option v-bind:value="ndsiStartDate">Start Date</option>
                        </select>
                        <select id="selectEndDateNdsi" v-model="ndsiEndDate">
                            <option v-bind:value="ndsiEndDate">End Date</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotNdsiSeries">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected Time Range: {{ndsiStartDate + " - " + ndsiEndDate}}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="py-12 pt-10">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 box-border h-400 w-600">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg box-content">
                    <div class="pb-4 pl-2 pt-2">BI</div>
                    <div class="pb-4 pl-2 pt-2">Single File Analysis</div>
                    <div class="pl-5">
                        <select id="selectFileNdsi" v-model="ndsiFile">
                            <option v-bind:value="ndsiFile">Select File</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotNdsi">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected File: {{ndsiFile}}</div>
                    </div>
                    <div class="pb-4 pl-2 pt-10">Range-Based Analysis</div>
                    <div class="pl-5">
                        <select id="selectStartDateNdsi" v-model="ndsiStartDate">
                            <option v-bind:value="ndsiStartDate">Start Date</option>
                        </select>
                        <select id="selectEndDateNdsi" v-model="ndsiEndDate">
                            <option v-bind:value="ndsiEndDate">End Date</option>
                        </select>
                    </div>
                    <div>
                        <jet-button class="float-left border-tl p-4 m-4 border-gray-200" v-on:click="plotNdsiSeries">Visualize</jet-button>
                        <div class="pl-20 pt-5">Selected Time Range: {{ndsiStartDate + " - " + ndsiEndDate}}</div>
                    </div>
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
    import { defineComponent, ref } from 'vue'
    import AppLayout from '@/Layouts/AppLayout.vue'
    import Welcome from '@/Jetstream/Welcome.vue'
    import WaveSurfer from "wavesurfer.js"
    import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram'
    import JetButton from "@/Jetstream/Button.vue";
    import TrendChart from "vue-trend-chart";
    import * as d3 from "d3";
    import { Chart, Grid, Bar, Line, Marker, Tooltip, linearGradient } from 'vue3-charts';

    export default defineComponent({
        components: {
            AppLayout,
            JetButton,
            TrendChart,
            WaveSurfer,
            Chart,
            Line,
            Grid,
            Bar,
            Marker,
            Tooltip,
            linearGradient
        },
        data() {
            return {
                aciFile: '',
                ndsiFile: '',
                aciStartDate: '',
                ndsiStartDate: '',
                aciEndDate: '',
                ndsiEndDate: '',
                recordings: [],
                aciFileRecordings: [],
                ndsiFileRecordings: [],
                aciSeriesRecordings: [],
                ndsiSeriesRecordings: []
            }
        },

        methods: {
            play: function() {
                this.wavesurfer.play();
            },
            pause: function() {
                this.wavesurfer.pause();
            },
            plotAci: function() {
                this.aciFileRecordings = this.filterRecordingsByFile(this.aciFile);
            },
            plotNdsi: function() {
                this.ndsiFileRecordings = this.filterRecordingsByFile(this.ndsiFile);
            },
            plotAciSeries: function() {
                this.aciSeriesRecordings = this.filterRecordingsBySeries("ACI");
            },
            plotNdsiSeries: function() {
                this.ndsiSeriesRecordings = this.filterRecordingsBySeries("NDSI");
            },
            extractRecording: function(recording) {
                var folder = recording.FOLDER;
                var file = recording.IN_FILE;
                var channel = recording.CHANNEL;
                var offset = recording.OFFSET;
                var duration = recording.DURATION;
                var date = recording.DATE;
                var time = recording.TIME;
                var hour = recording.HOUR;
                var ndsi = recording.NDSI;
                var aci = recording.ACI;
                return [folder, file, channel, offset, duration, date, time, hour, ndsi, aci];
            },
            populateDropdown: function() {
                var extractedRecordings = this.getExtractedRecordings();
                if (extractedRecordings) {
                    extractedRecordings.then((d) => this.updateDropdown(d, "selectFileAci"));
                    extractedRecordings.then((d) => this.updateDropdown(d, "selectFileNdsi"));
                    extractedRecordings.then((d) => this.updateDropdown(d, "selectStartDateAci"));
                    extractedRecordings.then((d) => this.updateDropdown(d, "selectEndDateAci"));
                    extractedRecordings.then((d) => this.updateDropdown(d, "selectStartDateNdsi"));
                    extractedRecordings.then((d) => this.updateDropdown(d, "selectEndDateNdsi"));
                }
            },
            updateDropdown: function(extractedRecordings, dropdown) {
                var select = document.getElementById(dropdown);
                var options = new Set();
                for (var i = 0; i < extractedRecordings.length; i++) {
                    this.recordings.push(extractedRecordings[i]);
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
            getExtractedRecordings: function() {
                return d3.csv("index");
            },
            filterRecordingsByFile: function(file) {
                return this.recordings.filter((d) => d["IN_FILE"] == file);
            },
            filterRecordingsBySeries: function(index) {
                // handle ACI
                if (index == "ACI") {
                    if (this.aciStartDate === "" && this.aciEndDate === "") {
                        return this.recordings;
                    }
                    if (this.aciStartDate === "") {
                        return this.recordings.filter((d) => d["DATE"] <= this.aciEndDate);
                    }
                    if (this.aciEndDate === "") {
                        return this.recordings.filter((d) => this.aciStartDate <= d["DATE"]);
                    }
                    return this.recordings.filter((d) => this.aciStartDate <= d["DATE"] && d["DATE"] <= this.aciEndDate);
                }
                // handle NDSI
                if (this.ndsiStartDate === "" && this.ndsiEndDate === "") {
                    return this.recordings;
                }
                if (this.ndsiStartDate === "") {
                    return this.recordings.filter((d) => d["DATE"] <= this.ndsiEndDate);
                }
                if (this.ndsiEndDate === "") {
                    return this.recordings.filter((d) => this.ndsiStartDate <= d["DATE"]);
                }
                return this.recordings.filter((d) => this.ndsiStartDate <= d["DATE"] && d["DATE"] <= this.ndsiEndDate);
            }
        },

        mounted() {
            this.wavesurfer = WaveSurfer.create({
                container: "#wave",
                waveColor: '#D2EDD4',
                progressColor: '#46B54D',
                backend: 'MediaElement',
                plugins: [
                    SpectrogramPlugin.create({
                        container: '#wave',
                        labels: true,
                        colorMap: this.colorMap,
                    }),
                ]
            });
            this.wavesurfer.load("sound");
            this.populateDropdown();
        },
    })
</script>
