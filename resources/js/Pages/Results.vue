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
    </app-layout>
</template>

<script>
    import { defineComponent } from 'vue'
    import AppLayout from '@/Layouts/AppLayout.vue'
    import Welcome from '@/Jetstream/Welcome.vue'
    import WaveSurfer from "wavesurfer.js"
    import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram'
    import JetButton from "@/Jetstream/Button.vue";
    import * as d3 from "d3";

    export default defineComponent({
        components: {
            AppLayout,
            JetButton,
            WaveSurfer
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
        },
        methods: {
            play: function() {
                this.wavesurfer.play();
            },
            pause: function() {
                this.wavesurfer.pause();
            },
            adi: function() {
                d3.csv("sound")
                  .then(plotAci());
            },
            ndi: function() {
                d3.csv("sound")
                  .then(plotNdi());
            },
            plotAci: function(recordings, file) {
                var fields = filterByFile(extractRecordings(recordings), file);
                var aci = fields[9];

            },
            plotNdi: function(recordings) {
                var fields = filterByFile(extractRecordings(recordings), file);
                var ndsi = fields[8];
            },
            extractRecordings: function(recordings) {
                var folder = recordings.map(function(d) {return d.FOLDER});
                var file = recordings.map(function(d) {return d.IN_FILE});
                var channel = recordings.map(function(d) {return d.CHANNEL});
                var offset = recordings.map(function(d) {return d.OFFSET});
                var duration = recordings.map(function(d) {return d.DURATION});
                var date = recordings.map(function(d) {return d.DATE});
                var time = recordings.map(function(d) {return d.TIME});
                var hour = recordings.map(function(d) {return d.HOUR});
                var ndsi = recordings.map(function(d) {return d.NDSI});
                var aci = recordings.map(function(d) {return d.ACI});
                return [folder, file, channel, offset, duration, date, time, hour, ndsi, aci];
            },
            filterByFile: function(recordings, file) {
                return recordings.filter(recording => recording[1].indexOf(file) > -1);
            }
        }
    })
</script>
