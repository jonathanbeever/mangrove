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

                    <select id="selectFileAci">
                        <option>Select File</option>
                    </select>


                </div>

            </div>
        </div>

        <div class="py-12 pt-10">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 box-border h-400 w-600">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg box-content">
                    <div class="pb-4 pl-2 pt-2">NDSI</div>

                    <select id="selectFileNdsi">
                        <option>Select File</option>
                    </select>

                </div>

            </div>
        </div>
    </app-layout>
</template>

<script>
    import { defineComponent } from 'vue'
    import AppLayout from '@/Layouts/AppLayout.vue'
    import Welcome from '@/Jetstream/Welcome.vue'
    import WaveSurfer from "wavesurfer.js"
    import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram'
    import JetButton from "@/Jetstream/Button.vue";
    import TrendChart from "vue-trend-chart";
    import * as d3 from "d3";

    export default defineComponent({
        components: {
            AppLayout,
            JetButton,
            TrendChart,
            WaveSurfer
        },
        methods: {
            play: function() {
                this.wavesurfer.play();
            },
            pause: function() {
                this.wavesurfer.pause();
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
                }
            },
            updateDropdown: function(extractedRecordings, dropdown) {
                var select = document.getElementById(dropdown);
                for (var i = 0; i < extractedRecordings.length; i++) {
                    var file = extractedRecordings[i]["IN_FILE"];
                    var el = document.createElement("option");
                    el.textContent = file;
                    el.value = file;
                    select.appendChild(el);
                }
            },
            getExtractedRecordings: function() {
                return d3.csv("index");
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
